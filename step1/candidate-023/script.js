document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const SYMBOLS = [
        { id: 'AGI', emoji: '💎', payout: 100, weight: 1 }, // Jackpot
        { id: 'ROBOT', emoji: '🤖', payout: 20, weight: 3 },
        { id: 'BRAIN', emoji: '🧠', payout: 15, weight: 4 },
        { id: 'PLUG', emoji: '🔌', payout: 10, weight: 5 },
        { id: 'FIRE', emoji: '🔥', payout: 5, weight: 8 },
        { id: 'GHOST', emoji: '👻', payout: 2, weight: 10 }, // Hallucination
    ];
    const SYMBOL_HEIGHT = 120; // Must match CSS .reel .symbol height
    const SPIN_DURATION_MS = 1000; // Base spin time
    const REEL_SPIN_DELAY_MS = 200; // Delay between each reel stopping

    // --- DOM Elements ---
    const tokenBalanceEl = document.getElementById('token-balance');
    const betAmountEl = document.getElementById('bet-amount');
    const messageEl = document.getElementById('message');
    const spinButton = document.getElementById('spin-button');
    const betUpButton = document.getElementById('bet-up');
    const betDownButton = document.getElementById('bet-down');
    const reelElements = document.querySelectorAll('.reel');

    // --- Game State ---
    let tokens = 1000;
    let betAmount = 50;
    let isSpinning = false;

    // Create a weighted pool of symbols for more realistic odds
    const weightedSymbols = SYMBOLS.flatMap(s => Array(s.weight).fill(s));
    const getRandomSymbol = () => weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];

    // --- Initialization ---
    const init = () => {
        updateDisplays();
        reelElements.forEach(reel => {
            const container = document.createElement('div');
            container.classList.add('symbol-container');
            // Pre-populate with random symbols for the initial view
            container.innerHTML = Array.from({ length: 3 }, () => `<div class="symbol">${getRandomSymbol().emoji}</div>`).join('');
            reel.appendChild(container);
        });

        spinButton.addEventListener('click', handleSpin);
        betUpButton.addEventListener('click', () => changeBet(50));
        betDownButton.addEventListener('click', () => changeBet(-50));
    };

    // --- UI Update Functions ---
    const updateDisplays = () => {
        tokenBalanceEl.textContent = tokens;
        betAmountEl.textContent = betAmount;

        const canAffordMinBet = tokens >= 50;
        if (!canAffordMinBet) {
            spinButton.textContent = "GET 500 TOKENS";
        } else {
            spinButton.textContent = "SPIN";
        }
        
        spinButton.disabled = isSpinning;
        betUpButton.disabled = isSpinning || !canAffordMinBet || (betAmount + 50) > tokens;
        betDownButton.disabled = isSpinning || !canAffordMinBet || (betAmount - 50) < 50;
    };

    const showMessage = (text, type = 'info') => {
        messageEl.textContent = text;
        messageEl.className = `message-area ${type}`;
    };

    // --- Game Logic ---
    const changeBet = (amount) => {
        if (isSpinning) return;
        const newBet = betAmount + amount;
        if (newBet >= 50 && newBet <= tokens) {
            betAmount = newBet;
            updateDisplays();
        }
    };

    const handleSpin = () => {
        if (isSpinning) return;

        // If out of tokens, the spin button becomes a "get more" button
        if (tokens < 50) {
            tokens = 500;
            betAmount = 50;
            showMessage("Research grant approved! +500 Tokens.", 'win');
            updateDisplays();
            return;
        }

        if (tokens < betAmount) {
            showMessage("Not enough tokens for that bet!", 'lose');
            return;
        }

        isSpinning = true;
        tokens -= betAmount;
        updateDisplays();
        showMessage("Model is processing your query...", 'info');

        const spinPromises = Array.from(reelElements).map((reel, i) => spinReel(reel, i));

        Promise.all(spinPromises).then(results => {
            checkWin(results);
            isSpinning = false;
            updateDisplays();
        });
    };

    const spinReel = (reel, index) => {
        return new Promise(resolve => {
            const container = reel.querySelector('.symbol-container');
            const finalSymbol = getRandomSymbol();
            
            // Generate a long strip of random symbols for the spin animation
            const strip = Array.from({ length: 30 }, getRandomSymbol);
            // Place the final symbol near the end of the strip
            strip[strip.length - 2] = finalSymbol;
            
            container.innerHTML = strip.map(s => `<div class="symbol">${s.emoji}</div>`).join('');

            // Instantly reset to the top without animation
            container.style.transition = 'none';
            container.style.transform = 'translateY(0)';
            
            // Force a browser reflow to apply the reset
            reel.offsetHeight; 

            // Set up the spin animation
            const spinDuration = SPIN_DURATION_MS + (index * REEL_SPIN_DELAY_MS);
            const finalPosition = (strip.length - 2) * SYMBOL_HEIGHT;

            container.style.transition = `transform ${spinDuration / 1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
            container.style.transform = `translateY(-${finalPosition}px)`;

            setTimeout(() => resolve(finalSymbol), spinDuration);
        });
    };

    const checkWin = (results) => {
        const [s1, s2, s3] = results;

        if (s1.id === s2.id && s2.id === s3.id) {
            const symbol = s1;
            const winnings = symbol.payout * (betAmount / 10);
            tokens += winnings;
            const winMessages = {
                'AGI': 'AGI ACHIEVED! JACKPOT!',
                'ROBOT': 'Perfect Inference! Model is robust!',
                'BRAIN': 'Deep Learning Success!',
                'PLUG': 'Strong Connection to the Source!',
                'FIRE': 'Your model is on fire! (In a good way)',
                'GHOST': 'Successfully identified a hallucination!'
            };
            showMessage(`${winMessages[symbol.id]} +${winnings} Tokens`, 'win');
        } else {
            const loseMessages = [
                "Catastrophic Forgetting. Try again.",
                "Stuck in a Local Minimum.",
                "Encountered a Hallucination.",
                "Your prompt was too vague.",
                "Model failed to converge.",
                "Output is statistically improbable."
            ];
            const randomMsg = loseMessages[Math.floor(Math.random() * loseMessages.length)];
            showMessage(randomMsg, 'lose');
        }
        updateDisplays();
    };

    // Start the application
    init();
});

