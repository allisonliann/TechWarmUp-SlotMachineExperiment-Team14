// Game configuration
const SPIN_COST = 50;
const INITIAL_BALANCE = 1000;

const SYMBOLS = [
    { icon: '🤖', name: 'AGI', weight: 1, payout: 2000 },
    { icon: '🪙', name: 'Funding', weight: 3, payout: 500 },
    { icon: '🧠', name: 'Parameters', weight: 5, payout: 200 },
    { icon: '🔋', name: 'Compute', weight: 7, payout: 100 },
    { icon: '🗑️', name: 'Hallucination', weight: 10, payout: -150 }
];

// Flat array for random selection based on weights
const REEL_POOL = [];
SYMBOLS.forEach(symbol => {
    for (let i = 0; i < symbol.weight; i++) {
        REEL_POOL.push(symbol);
    }
});

// Game State
let balance = INITIAL_BALANCE;
let isSpinning = false;

// DOM Elements
const balanceEl = document.getElementById('balance');
const spinButton = document.getElementById('spin-button');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const statusMessageEl = document.getElementById('status-message');

// Initialize
function init() {
    updateUI();
    spinButton.addEventListener('click', spin);
}

function updateUI() {
    balanceEl.textContent = balance;
    if (balance < SPIN_COST) {
        spinButton.disabled = true;
        statusMessageEl.textContent = "Out of tokens. Your seed funding has run dry.";
    }
}

function getRandomSymbol() {
    return REEL_POOL[Math.floor(Math.random() * REEL_POOL.length)];
}

async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    // Start spin
    isSpinning = true;
    balance -= SPIN_COST;
    updateUI();
    
    spinButton.disabled = true;
    statusMessageEl.textContent = "Synthesizing output...";

    // Start CSS animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulated delay for "spinning"
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get results
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stop animation and show results
    reels.forEach((reel, index) => {
        reel.classList.remove('spinning');
        reel.textContent = results[index].icon;
    });

    calculateResult(results);
    isSpinning = false;
    spinButton.disabled = balance < SPIN_COST;
}

function calculateResult(results) {
    const counts = {};
    results.forEach(res => {
        counts[res.name] = (counts[res.name] || 0) + 1;
    });

    let winAmount = 0;
    let message = "";

    // Check for 3 of a kind
    const match3 = Object.keys(counts).find(key => counts[key] === 3);
    
    if (match3) {
        const symbol = SYMBOLS.find(s => s.name === match3);
        winAmount = symbol.payout;
        
        if (match3 === 'Hallucination') {
            message = "CRITICAL FAILURE: Complete Hallucination. Systems drained.";
        } else if (match3 === 'AGI') {
            message = "JACKPOT! AGI ACHIEVED! THE SINGULARITY IS HERE!";
        } else {
            message = `Triple ${symbol.name}! The hype cycle is real! +${winAmount} tokens.`;
        }
    } 
    // Check for 2 of a kind (small bonus, except hallucination)
    else {
        const match2 = Object.keys(counts).find(key => counts[key] === 2);
        if (match2) {
            const symbol = SYMBOLS.find(s => s.name === match2);
            if (match2 === 'Hallucination') {
                winAmount = -50;
                message = "Minor Hallucination detected. Context window shrinking.";
            } else {
                winAmount = Math.floor(symbol.payout / 4);
                message = `Partial match: ${symbol.name}. Iterative improvement! +${winAmount} tokens.`;
            }
        } else {
            message = "No convergence. Try a better prompt.";
        }
    }

    balance += winAmount;
    
    // Safety check for negative balance
    if (balance < 0) balance = 0;
    
    balanceEl.textContent = balance;
    statusMessageEl.textContent = message;
    
    if (winAmount > 0) {
        statusMessageEl.style.color = 'var(--primary-color)';
    } else if (winAmount < 0) {
        statusMessageEl.style.color = 'var(--accent-color)';
    } else {
        statusMessageEl.style.color = '#ccc';
    }
}

init();
