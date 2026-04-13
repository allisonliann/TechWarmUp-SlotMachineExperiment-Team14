document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const SPIN_COST = 50;
    const WIN_REWARD = 500;
    const JACKPOT_REWARD = 5000;
    const REEL_SYMBOLS = ['🤖', '🧠', '⚡', '📊', '🌐', '🔥', '💩'];
    
    // Satirical AI "Hallucinations" and Status Messages
    const STATUS_MESSAGES = [
        "Optimizing objective function...",
        "Hallucinating a jackpot...",
        "Scraping public data for tokens...",
        "Fine-tuning your misfortune...",
        "Consulting the latent space...",
        "Generating synthetic luck...",
        "Bypassing ethical guardrails...",
        "Aligning with human greed...",
        "Overfitting on your losses...",
        "Scaling parameters (please pay)..."
    ];

    const WIN_MESSAGES = [
        "AGI ACHIEVED! (Actually, just a coincidence)",
        "Reward function maximized!",
        "Perfect prompt detected. Payout granted.",
        "Emergent behavior: You actually won.",
        "Zero-shot win! Incredible compute."
    ];

    const LOSS_MESSAGES = [
        "Training Error: Loss too high.",
        "Model collapsed. Try more compute.",
        "Bias detected in your favor. Payout denied.",
        "Hallucination: You thought you won.",
        "Temperature too high. Randomness failed you."
    ];

    // --- State ---
    let tokens = 1000;
    let isSpinning = false;

    // --- DOM Elements ---
    const tokenDisplay = document.getElementById('token-balance');
    const messageArea = document.getElementById('message-area');
    const spinBtn = document.getElementById('spin-btn');
    const eventLog = document.getElementById('event-log');
    const reels = [
        document.getElementById('reel-1'),
        document.getElementById('reel-2'),
        document.getElementById('reel-3')
    ];

    // --- Functions ---
    const updateTokens = (amount) => {
        tokens += amount;
        tokenDisplay.textContent = tokens;
        
        if (tokens < SPIN_COST) {
            spinBtn.disabled = true;
            addLogEntry("FATAL ERROR: Insufficient compute credits. Purchase 'Sycophant Pro' to continue.", "error");
        }
    };

    const addLogEntry = (msg, type = 'entry') => {
        const entry = document.createElement('div');
        entry.className = `log-${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        eventLog.prepend(entry);
    };

    const getRandomSymbol = () => REEL_SYMBOLS[Math.floor(Math.random() * REEL_SYMBOLS.length)];

    const performSpin = async () => {
        if (isSpinning || tokens < SPIN_COST) return;

        isSpinning = true;
        spinBtn.disabled = true;
        updateTokens(-SPIN_COST);
        
        messageArea.textContent = STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)];
        addLogEntry(`Deducting ${SPIN_COST} credits for inference...`);

        // Visual Spinning
        reels.forEach(reel => reel.classList.add('spinning'));

        // Sequential stopping for dramatic effect
        const finalSymbols = [];
        for (let i = 0; i < reels.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500 + (i * 400)));
            const symbol = getRandomSymbol();
            reels[i].textContent = symbol;
            reels[i].classList.remove('spinning');
            finalSymbols.push(symbol);
        }

        evaluateResult(finalSymbols);
        isSpinning = false;
        if (tokens >= SPIN_COST) spinBtn.disabled = false;
    };

    const evaluateResult = (results) => {
        const unique = new Set(results);
        
        if (unique.size === 1) {
            // Jackpot or Win
            const isJackpot = results[0] === '🤖';
            const reward = isJackpot ? JACKPOT_REWARD : WIN_REWARD;
            
            updateTokens(reward);
            messageArea.textContent = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
            addLogEntry(`CRITICAL HIT: Found ${results[0]} x3! Payout: ${reward}`, "success");
            
            if (isJackpot) {
                confettiEffect();
            }
        } else {
            // Loss
            messageArea.textContent = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
            addLogEntry("Result mismatch. Gradient descent continues...", "entry");
        }
    };

    const confettiEffect = () => {
        // Simple "digital" confetti in log
        for(let i=0; i<5; i++) {
            addLogEntry("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", "success");
        }
    };

    // --- Listeners ---
    spinBtn.addEventListener('click', performSpin);

    // Initial greeting
    setTimeout(() => {
        addLogEntry("Weight initialization complete. API endpoint ready.");
    }, 500);
});
