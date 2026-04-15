const SYMBOLS = ['🧠', '🗑️', '💸', '🔥', '🤖', '✨'];
const SPIN_COST = 10;
const INITIAL_TOKENS = 1000;

const winMessages = [
    "AGI achieved! (Actually just a better regex)",
    "Series A funding secured! 💸",
    "Successfully pivoted to a wrapper app.",
    "Hallucination looks very convincing!",
    "Your LinkedIn profile is now 400% more obnoxious."
];

const lossMessages = [
    "Out of memory. Buy more H100s.",
    "Model collapsed. Just like your social life.",
    "Input too toxic. Safety filters triggered.",
    "Error 402: Payment Required (to Sam).",
    "Dataset was just Reddit comments. Garbage in, garbage out."
];

let tokens = parseInt(localStorage.getItem('compute-tokens')) || INITIAL_TOKENS;
let isSpinning = false;

// DOM Elements
const tokensDisplay = document.getElementById('tokens');
const spinButton = document.getElementById('spin-button');
const logDisplay = document.getElementById('log');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function updateTokenDisplay() {
    tokensDisplay.textContent = tokens;
    localStorage.setItem('compute-tokens', tokens);
}

function getRandomSymbol() {
    // Platform API: Using window.crypto for "provably fair" satire
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return SYMBOLS[array[0] % SYMBOLS.length];
}

async function spin() {
    if (isSpinning || tokens < SPIN_COST) return;

    isSpinning = true;
    tokens -= SPIN_COST;
    updateTokenDisplay();
    
    spinButton.disabled = true;
    logDisplay.textContent = "Processing prompt...";
    logDisplay.className = "";

    const results = [];

    // Start spinning animations
    reels.forEach((reel, i) => {
        const strip = reel.querySelector('.symbol-strip');
        strip.classList.add('spinning');
    });

    // Stop reels one by one with a delay
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + (i * 400)));
        
        const finalSymbol = getRandomSymbol();
        results.push(finalSymbol);
        
        const strip = reels[i].querySelector('.symbol-strip');
        strip.classList.remove('spinning');
        strip.innerHTML = `<div class="symbol">${finalSymbol}</div>`;
    }

    checkWin(results);
    isSpinning = false;
    spinButton.disabled = tokens < SPIN_COST;
}

function checkWin(results) {
    const [s1, s2, s3] = results;
    
    if (s1 === s2 && s2 === s3) {
        // Jackpot!
        const winAmount = 100;
        tokens += winAmount;
        logDisplay.textContent = `CRITICAL BREAKTHROUGH: +${winAmount} Tokens. ${winMessages[Math.floor(Math.random() * winMessages.length)]}`;
        logDisplay.className = "win";
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Small win
        const winAmount = 20;
        tokens += winAmount;
        logDisplay.textContent = `Partial convergence: +${winAmount} Tokens. ${winMessages[Math.floor(Math.random() * winMessages.length)]}`;
        logDisplay.className = "win";
    } else {
        // Loss
        logDisplay.textContent = lossMessages[Math.floor(Math.random() * lossMessages.length)];
        logDisplay.className = "loss";
    }

    updateTokenDisplay();

    if (tokens < SPIN_COST) {
        logDisplay.textContent = "BANKRUPT. Your startup has been liquidated.";
        spinButton.textContent = "Out of Funding";
    }
}

// Initialize
updateTokenDisplay();
spinButton.addEventListener('click', spin);
