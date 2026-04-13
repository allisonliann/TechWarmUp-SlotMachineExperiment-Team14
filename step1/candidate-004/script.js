// Configuration
const SYMBOLS = [
    { emoji: '🧠', name: 'AGI', value: 50000, probability: 0.05 },
    { emoji: '💾', name: 'H100', value: 10000, probability: 0.15 },
    { emoji: '🦜', name: 'Parrot', value: 5000, probability: 0.25 },
    { emoji: '🗑️', name: 'Hallucination', value: 2000, probability: 0.25 },
    { emoji: '🛑', name: 'Rate Limit', value: 0, probability: 0.30 }
];

const SPIN_COST = 1000;
const INITIAL_TOKENS = 128000;
const REEL_SIZE = 100; // From CSS --reel-size

// State
let balance = INITIAL_TOKENS;
let isSpinning = false;

// DOM Elements
const balanceDisplay = document.getElementById('balance');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const statusDisplay = document.getElementById('status');
const reels = [
    document.getElementById('reel1').querySelector('.reel-strip'),
    document.getElementById('reel2').querySelector('.reel-strip'),
    document.getElementById('reel3').querySelector('.reel-strip')
];

// Initialize Reels
function initReels() {
    reels.forEach(reel => {
        // Create a long strip of symbols for each reel
        for (let i = 0; i < 20; i++) {
            const symbolDiv = document.createElement('div');
            symbolDiv.className = 'symbol';
            symbolDiv.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].emoji;
            reel.appendChild(symbolDiv);
        }
    });
}

function updateBalance(amount) {
    balance += amount;
    balanceDisplay.textContent = balance.toLocaleString();
    
    if (balance < SPIN_COST) {
        spinBtn.disabled = true;
        resetBtn.style.display = 'block';
        statusDisplay.textContent = 'Context Exhausted. Please buy more compute.';
    }
}

function getRandomSymbol() {
    const rand = Math.random();
    let cumulativeProbability = 0;
    for (const symbol of SYMBOLS) {
        cumulativeProbability += symbol.probability;
        if (rand <= cumulativeProbability) return symbol;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    isSpinning = true;
    spinBtn.disabled = true;
    updateBalance(-SPIN_COST);
    statusDisplay.textContent = 'Prompting LLM...';
    statusDisplay.classList.remove('win-flash');

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Animate each reel
    const spinPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            const extraSpins = 5 + (index * 2); // Vary spin length
            const targetSymbolIndex = Math.floor(Math.random() * SYMBOLS.length); 
            // We actually force the result by injecting the winning symbol into the strip
            
            // Clear current reel and add new random symbols + the target
            reel.style.transition = 'none';
            reel.style.transform = 'translateY(0)';
            
            // Force reflow
            reel.offsetHeight;

            reel.innerHTML = '';
            for (let i = 0; i < extraSpins; i++) {
                const s = document.createElement('div');
                s.className = 'symbol';
                s.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].emoji;
                reel.appendChild(s);
            }
            
            // The actual result symbol at the end
            const resultDiv = document.createElement('div');
            resultDiv.className = 'symbol';
            resultDiv.textContent = results[index].emoji;
            reel.appendChild(resultDiv);

            // Trigger animation
            setTimeout(() => {
                reel.style.transition = `transform ${1 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                reel.style.transform = `translateY(-${extraSpins * REEL_SIZE}px)`;
            }, 50);

            setTimeout(resolve, 1000 + index * 500);
        });
    });

    await Promise.all(spinPromises);

    checkWin(results);
    isSpinning = false;
    if (balance >= SPIN_COST) spinBtn.disabled = false;
}

function checkWin(results) {
    if (results[0].emoji === results[1].emoji && results[1].emoji === results[2].emoji) {
        const winAmount = results[0].value;
        if (winAmount > 0) {
            updateBalance(winAmount);
            statusDisplay.textContent = `CRITICAL SUCCESS! +${winAmount.toLocaleString()} Tokens. ${results[0].name} achieved!`;
            statusDisplay.classList.add('win-flash');
            return;
        }
    }
    
    // Near miss or no match
    if (results[0].emoji === results[1].emoji || results[1].emoji === results[2].emoji) {
        statusDisplay.textContent = 'Hallucinating a potential win... Try again.';
    } else {
        statusDisplay.textContent = 'Response generated. No value detected.';
    }
}

function reset() {
    balance = INITIAL_TOKENS;
    balanceDisplay.textContent = balance.toLocaleString();
    spinBtn.disabled = false;
    resetBtn.style.display = 'none';
    statusDisplay.textContent = 'Compute refilled. Don\'t waste it.';
    statusDisplay.classList.remove('win-flash');
}

// Event Listeners
spinBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', reset);

// Start
initReels();
