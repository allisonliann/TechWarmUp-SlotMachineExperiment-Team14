const SYMBOLS = ['🧠', '🔋', '🤖', '🍝', '♻️', '📉'];
const PAYOUTS = {
    '🧠': 50000,
    '🔋': 10000,
    '🤖': 5000,
    '🍝': 2000,
    '♻️': 1000,
    '📉': 0
};

const SPIN_COST = 1000;
let balance = 100000;

const balanceDisplay = document.getElementById('balance');
const lastWinDisplay = document.getElementById('last-win');
const messageDisplay = document.getElementById('message');
const spinButton = document.getElementById('spin-button');
const reels = [
    document.getElementById('reel1').querySelector('.reel-strip'),
    document.getElementById('reel2').querySelector('.reel-strip'),
    document.getElementById('reel3').querySelector('.reel-strip')
];

// Initialize reels with some symbols
function initReels() {
    reels.forEach(reel => {
        for (let i = 0; i < 20; i++) {
            const symbolDiv = document.createElement('div');
            symbolDiv.className = 'symbol';
            symbolDiv.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            reel.appendChild(symbolDiv);
        }
    });
}

async function spin() {
    if (balance < SPIN_COST) {
        messageDisplay.textContent = "Error: Out of Context. Resetting session...";
        setTimeout(() => {
            balance = 100000;
            updateUI(0);
            messageDisplay.textContent = "Context window reset. Ready to prompt.";
        }, 2000);
        return;
    }

    // Deduct cost
    balance -= SPIN_COST;
    updateUI(0);
    
    spinButton.disabled = true;
    messageDisplay.textContent = "Generating high-quality response...";
    messageDisplay.classList.remove('win-animation');

    const results = [];
    const spinDurations = [2000, 2500, 3000];

    reels.forEach((reel, index) => {
        const symbolHeight = 120;
        const totalSymbols = reel.children.length;
        const randomTarget = Math.floor(Math.random() * SYMBOLS.length);
        results.push(SYMBOLS[randomTarget]);

        // To make it look like it's spinning, we prepend new symbols
        // and transition the translateY.
        // For simplicity in this vanilla version, we'll just jump back and slide.
        
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        
        // Force reflow
        reel.offsetHeight;

        reel.style.transition = `transform ${spinDurations[index]}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        
        // We want the target symbol to be at the center. 
        // Our reel-strip is a long column. Let's ensure the last few symbols 
        // include our target for the final stop.
        const targetOffset = (totalSymbols - 1) * symbolHeight;
        reel.children[totalSymbols - 1].textContent = SYMBOLS[randomTarget];
        
        reel.style.transform = `translateY(-${targetOffset}px)`;
    });

    // Wait for the longest spin to finish
    await new Promise(resolve => setTimeout(resolve, 3000));

    evaluateResults(results);
    spinButton.disabled = false;
}

function evaluateResults(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;
    let message = "";

    if (results.includes('📉')) {
        message = "Hallucination detected. Output discarded.";
        winAmount = 0;
    } else if (r1 === r2 && r2 === r3) {
        winAmount = PAYOUTS[r1];
        message = getWinMessage(r1);
        messageDisplay.classList.add('win-animation');
    } else {
        message = "Token limit reached. No significant patterns found.";
        winAmount = 0;
    }

    balance += winAmount;
    updateUI(winAmount);
    messageDisplay.textContent = message;
}

function getWinMessage(symbol) {
    switch(symbol) {
        case '🧠': return "AGI ACHIEVED! The singularity is here.";
        case '🔋': return "GPU cluster secured. Training speed +1000%.";
        case '🤖': return "Fine-tuning successful. Better than GPT-4.";
        case '🍝': return "Code generation works (somehow).";
        case '♻️': return "Re-prompting successful. Minor alignment.";
        default: return "Reward received.";
    }
}

function updateUI(winAmount) {
    balanceDisplay.textContent = balance.toLocaleString();
    lastWinDisplay.textContent = winAmount.toLocaleString();
}

spinButton.addEventListener('click', spin);

initReels();
updateUI(0);
