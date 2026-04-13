const SYMBOLS = ['🚀', '🧠', '🤖', '🪙', '🐛', '📉'];
const WEIGHTS = {
    '🚀': 0.05, // 5% chance
    '🧠': 0.10, // 10%
    '🤖': 0.20, // 20%
    '🪙': 0.25, // 25%
    '🐛': 0.20, // 20%
    '📉': 0.20  // 20%
};

const PAYOUTS = {
    '🚀🚀🚀': 5000,
    '🧠🧠🧠': 1000,
    '🤖🤖🤖': 500,
    '🪙🪙🪙': 100
};

let balance = 4096;
const spinCost = 50;

const balanceDisplay = document.getElementById('token-balance');
const spinButton = document.getElementById('spin-button');
const statusMessage = document.getElementById('status-message');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function getRandomSymbol() {
    const rand = Math.random();
    let cumulative = 0;
    for (const symbol of SYMBOLS) {
        cumulative += WEIGHTS[symbol];
        if (rand < cumulative) return symbol;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

async function spin() {
    if (balance < spinCost) {
        statusMessage.textContent = "Insufficient Compute. Refresh your session.";
        return;
    }

    // Deduct cost
    balance -= spinCost;
    updateBalanceDisplay();
    
    // Disable UI
    spinButton.disabled = true;
    statusMessage.textContent = "Inferencing...";

    // Start spinning animation
    reels.forEach(reel => {
        reel.classList.add('spinning');
    });

    // Simulate network latency (spinning time)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate result
    const result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stop reels one by one
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        reels[i].classList.remove('spinning');
        reels[i].innerHTML = `<div class="symbol">${result[i]}</div>`;
    }

    // Process result
    processResult(result);
    
    spinButton.disabled = false;
}

function processResult(result) {
    const resultString = result.join('');
    let winAmount = 0;
    let message = "";

    // Check for specific penalties/bonuses
    if (result.includes('📉')) {
        message = "Context Limit Reached. -50 Tokens.";
        balance = Math.max(0, balance - 50);
    } else if (result.includes('🐛')) {
        message = "Hallucination Detected. Output discarded.";
    } else if (PAYOUTS[resultString]) {
        winAmount = PAYOUTS[resultString];
        balance += winAmount;
        message = getWinMessage(resultString, winAmount);
    } else {
        message = "Low confidence score. No payout.";
    }

    statusMessage.textContent = message;
    updateBalanceDisplay();

    if (balance <= 0) {
        statusMessage.textContent = "Model Collapse. Context Window Exceeded.";
        spinButton.disabled = true;
    }
}

function getWinMessage(combo, amount) {
    switch(combo) {
        case '🚀🚀🚀': return `AGI ACHIEVED! +${amount} Tokens`;
        case '🧠🧠🧠': return `High-Precision Inference! +${amount} Tokens`;
        case '🤖🤖🤖': return `Model Convergence. +${amount} Tokens`;
        case '🪙🪙🪙': return `Token Mining Successful. +${amount} Tokens`;
        default: return `Nice generation! +${amount} Tokens`;
    }
}

function updateBalanceDisplay() {
    balanceDisplay.textContent = balance;
}

spinButton.addEventListener('click', spin);

// Initial display
updateBalanceDisplay();
