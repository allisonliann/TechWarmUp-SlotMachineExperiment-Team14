const symbols = ['🤖', '🍄', '📟', '💸', '🧠', '🌌'];
const winMessages = [
    "AGI achieved! (Actually just a better lookup table)",
    "Hallucination successful! Here are some fake facts.",
    "VC funding secured. Burn those tokens!",
    "Scaling laws hold true. More GPUs needed."
];
const failMessages = [
    "Model collapsed. Try a longer prompt.",
    "Token limit reached. Buy more credits.",
    "The AI is tired. Ask something easier.",
    "404: Logic not found in training data."
];

let tokens = 500;
const spinCost = 10;

const spinBtn = document.getElementById('spin-button');
const tokenDisplay = document.getElementById('token-count');
const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
const message = document.getElementById('message');
const logText = document.getElementById('log-text');

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

async function spin() {
    if (tokens < spinCost) {
        message.innerText = "Insufficient tokens. Please insert more GPU hours.";
        return;
    }

    // Spend tokens
    tokens -= spinCost;
    updateUI();
    
    spinBtn.disabled = true;
    message.innerText = "Inferencing...";
    logText.innerText = "Calculating weights...";

    // Visual Spin Effect
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulation of network latency/compute time
    await new Promise(resolve => setTimeout(resolve, 1200));

    const results = reels.map(reel => {
        const symbol = getRandomSymbol();
        reel.innerText = symbol;
        reel.classList.remove('spinning');
        return symbol;
    });

    resolveGame(results);
}

function resolveGame(results) {
    const isWin = results[0] === results[1] && results[1] === results[2];
    
    if (isWin) {
        const reward = 200;
        tokens += reward;
        message.innerText = winMessages[Math.floor(Math.random() * winMessages.length)];
        logText.innerText = `Reward: +${reward} tokens. High confidence interval.`;
    } else {
        message.innerText = failMessages[Math.floor(Math.random() * failMessages.length)];
        logText.innerText = "Stochastic parity check failed.";
    }

    updateUI();
    spinBtn.disabled = false;
}

function updateUI() {
    tokenDisplay.innerText = tokens;
}

spinBtn.addEventListener('click', spin);
