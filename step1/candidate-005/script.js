const symbols = ['🧠', '🤖', '📉', '🗑️', '💸'];
const COST_PER_SPIN = 10;
let tokens = 500;

const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const spinBtn = document.getElementById('spin-btn');
const tokenDisplay = document.getElementById('tokens');
const messageBox = document.getElementById('message');

const jokes = {
    win: [
        "AGI achieved! But you still can't center a div.",
        "Your model is 100% accurate. (Testing on training data only)",
        "GPU clusters are humming. You've been promoted to Senior Prompt Engineer.",
        "A VC just handed you $100M for this result."
    ],
    loss: [
        "As an AI language model, I cannot provide a winning combination.",
        "Hallucinated a profit. Unfortunately, your bank didn't.",
        "Out of Memory (OOM). Your compute was wasted on cat pictures.",
        "Safety alignment triggered: Winning is considered too competitive.",
        "The model is currently 'thinking'... try again in 5 minutes."
    ],
    bankrupt: [
        "Rate Limit Exceeded. Time to raise another Series A.",
        "Your tokens have been depleted by 'Research Costs'.",
        "The H100s have been repossessed. Game over."
    ]
};

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateTokens(amount) {
    tokens += amount;
    tokenDisplay.innerText = tokens;
    if (tokens < COST_PER_SPIN) {
        spinBtn.disabled = true;
        messageBox.innerText = jokes.bankrupt[Math.floor(Math.random() * jokes.bankrupt.length)];
    }
}

function spin() {
    if (tokens < COST_PER_SPIN) return;

    updateTokens(-COST_PER_SPIN);
    spinBtn.disabled = true;
    messageBox.innerText = "Processing prompt...";
    messageBox.className = "message-box";

    const results = [];
    
    reels.forEach((reel, index) => {
        reel.classList.add('spinning');
        
        // Stagger the stopping of each reel
        setTimeout(() => {
            const finalSymbol = getRandomSymbol();
            reel.innerText = finalSymbol;
            reel.classList.remove('spinning');
            results[index] = finalSymbol;

            if (index === reels.length - 1) {
                evaluateResult(results);
            }
        }, 800 + (index * 600)); // 0.8s, 1.4s, 2.0s
    });
}

function evaluateResult(results) {
    const [s1, s2, s3] = results;
    spinBtn.disabled = false;

    if (s1 === s2 && s2 === s3) {
        // Big Win (3 of a kind)
        const payout = 200;
        updateTokens(payout);
        messageBox.innerHTML = `<span class="win">+${payout} Tokens!</span> ${jokes.win[Math.floor(Math.random() * jokes.win.length)]}`;
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Small Win (2 of a kind)
        const payout = 30;
        updateTokens(payout);
        messageBox.innerHTML = `<span class="win">+${payout} Tokens!</span> Not bad, for a human.`;
    } else {
        // Loss
        messageBox.innerHTML = `<span class="lose">0 Tokens.</span> ${jokes.loss[Math.floor(Math.random() * jokes.loss.length)]}`;
    }
}

spinBtn.addEventListener('click', spin);
