const SYMBOLS = ['🧠', '💻', '☁️', '🔢', '🤖'];
const SPIN_COST = 20;
const WIN_MULTIPLIER = {
    '🧠': 50,
    '💻': 100,
    '☁️': 30,
    '🔢': 10,
    '🤖': 200
};

const SATIRICAL_MESSAGES = [
    "Hallucinating outcome...",
    "Optimizing parameters...",
    "Querying the AGI...",
    "Context window at 90% capacity...",
    "Applying safety filters...",
    "Vectorizing your soul...",
    "Generating deepfake luck...",
    "Compressing reality...",
    "Bias detection in progress...",
    "RLHF'ing the slot machine..."
];

const WIN_QUIPS = [
    "AGI achieved! Reality expanded.",
    "Parameter match! Scaling up.",
    "Efficient prompt! Reward granted.",
    "Synthesized success! Data points aligned.",
    "Hallucination confirmed as factual!"
];

const LOSE_QUIPS = [
    "Context window collapsed. Try again.",
    "Model collapsed. Tokens lost in noise.",
    "Token limit exceeded! Please purchase more.",
    "Output filtered for safety. No reward.",
    "Alignment failure. Try prompting differently."
];

let tokens = 1000;
let isSpinning = false;

const reelElements = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const tokenDisplay = document.getElementById('token-count');
const statusMsg = document.getElementById('status-msg');
const messageLog = document.getElementById('message-log');
const spinButton = document.getElementById('spin-button');

function addLog(text) {
    const p = document.createElement('p');
    p.textContent = `> ${text}`;
    messageLog.prepend(p);
    if (messageLog.childNodes.length > 20) {
        messageLog.removeChild(messageLog.lastChild);
    }
}

function updateUI() {
    tokenDisplay.textContent = tokens;
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

async function spin() {
    if (isSpinning || tokens < SPIN_COST) {
        if (tokens < SPIN_COST) {
            addLog("Error: Insufficient tokens to generate outcome.");
            statusMsg.textContent = "OUT OF TOKENS";
            statusMsg.style.color = "var(--neon-pink)";
        }
        return;
    }

    isSpinning = true;
    tokens -= SPIN_COST;
    updateUI();
    
    spinButton.disabled = true;
    spinButton.textContent = "GENERATING...";
    
    statusMsg.textContent = SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)];
    statusMsg.style.color = "var(--neon-blue)";
    
    addLog(`Spending ${SPIN_COST} context tokens...`);

    // Animation phase
    reelElements.forEach(reel => reel.classList.add('spinning'));
    
    // Simulate API latency/generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    reelElements.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.textContent = results[i];
    });

    isSpinning = false;
    spinButton.disabled = false;
    spinButton.textContent = "GENERATE OUTCOME";

    checkWin(results);
}

function checkWin(results) {
    const [s1, s2, s3] = results;
    
    if (s1 === s2 && s2 === s3) {
        const reward = WIN_MULTIPLIER[s1];
        tokens += reward;
        updateUI();
        statusMsg.textContent = "JACKPOT! TOKEN RECOVERY COMPLETE.";
        statusMsg.style.color = "var(--neon-green)";
        addLog(`${WIN_QUIPS[Math.floor(Math.random() * WIN_QUIPS.length)]} (+${reward} tokens)`);
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        const reward = 50;
        tokens += reward;
        updateUI();
        statusMsg.textContent = "PARTIAL MATCH. PARTIAL TRUTH.";
        statusMsg.style.color = "var(--neon-blue)";
        addLog(`Minor alignment detected. (+${reward} tokens)`);
    } else {
        statusMsg.textContent = "GENERATION FAILED.";
        statusMsg.style.color = "var(--neon-pink)";
        addLog(LOSE_QUIPS[Math.floor(Math.random() * LOSE_QUIPS.length)]);
    }
}

spinButton.addEventListener('click', spin);

// Initial UI sync
updateUI();
