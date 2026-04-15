document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const config = {
        // Symbols with their display icon, payout multiplier, and weight for appearing
        SYMBOLS: [
            { name: 'hallucination', icon: '😵', payout: 0, weight: 5 },
            { name: 'token', icon: '🪙', payout: 2, weight: 4 },
            { name: 'prompt', icon: '📝', payout: 5, weight: 3 },
            { name: 'agi', icon: '🤖', payout: 10, weight: 2 },
            { name: 'creativity', icon: '🎨', payout: 50, weight: 1 },
            { name: 'singularity', icon: '🧠', payout: 100, weight: 0.5 }
        ],
        REEL_COUNT: 3,
        SPIN_COST: 2,
        INITIAL_TOKENS: 100,
        SPIN_DURATION: 1000, // in milliseconds
        REEL_REPEAT_COUNT: 10 // How many times to repeat symbols in a reel for smooth animation
    };

    // --- GAME STATE ---
    let state = {
        tokens: config.INITIAL_TOKENS,
        isSpinning: false
    };

    // --- DOM ELEMENTS ---
    const elements = {
        reels: document.querySelectorAll('.reel'),
        spinButton: document.getElementById('spin-button'),
        tokenBalance: document.getElementById('token-balance'),
        lastWin: document.getElementById('last-win'),
        messageBox: document.getElementById('message-box')
    };

    // --- MESSAGES ---
    const messages = {
        insufficient: "Insufficient compute credits! Please add more GPUs.",
        spinStart: "Training model... generating response...",
        win: (amount) => `Emergent capability unlocked! You won ${amount} tokens!`,
        jackpot: (amount) => `SINGULARITY! You've achieved god-like intelligence and ${amount} tokens!`,
        loss: "Model hallucinated. Better luck next time."
    };

    /**
     * Initializes the slot machine, populating reels and setting up listeners.
     */
    function init() {
        // Create a weighted pool of symbols for random selection
        const symbolPool = config.SYMBOLS.flatMap(s => Array(s.weight * 10).fill(s));

        elements.reels.forEach(reel => {
            const reelSymbols = document.createElement('div');
            reelSymbols.className = 'reel-symbols';
            
            // Repeat symbols for a seamless spinning illusion
            for (let i = 0; i < config.REEL_REPEAT_COUNT; i++) {
                // Shuffle the pool for each set to add more variance
                shuffleArray(symbolPool);
                symbolPool.forEach(symbol => {
                    const symbolEl = document.createElement('div');
                    symbolEl.textContent = symbol.icon;
                    reelSymbols.appendChild(symbolEl);
                });
            }
            reel.appendChild(reelSymbols);
        });

        elements.spinButton.addEventListener('click', handleSpin);
        updateUI();
    }

    /**
     * Handles the main spin logic when the button is clicked.
     */
    async function handleSpin() {
        if (state.isSpinning) return;
        if (state.tokens < config.SPIN_COST) {
            showMessage(messages.insufficient, 'lose');
            return;
        }

        startSpin();

        const results = await Promise.all(
            Array.from(elements.reels).map((_, i) => runReelSpin(i))
        );

        const winnings = calculateWinnings(results);
        
        if (winnings > 0) {
            state.tokens += winnings;
            const isJackpot = results.every(s => s.name === 'singularity');
            const winMessage = isJackpot ? messages.jackpot(winnings) : messages.win(winnings);
            showMessage(winMessage, 'win');
        } else {
            showMessage(messages.loss, 'lose');
        }

        state.isSpinning = false;
        updateUI(winnings);
    }

    /**
     * Prepares the UI and state for a new spin.
     */
    function startSpin() {
        state.isSpinning = true;
        state.tokens -= config.SPIN_COST;
        updateUI(0); // Reset last win display
        showMessage(messages.spinStart);
        elements.reels.forEach(reel => {
            reel.classList.add('spinning');
            const symbols = reel.querySelector('.reel-symbols');
            // Reset to a random start position for visual variety
            symbols.style.transform = `translateY(0)`;
        });
    }

    /**
     * Simulates a single reel spinning and stopping on a random symbol.
     * @param {number} reelIndex - The index of the reel to spin.
     * @returns {Promise<object>} A promise that resolves with the chosen symbol object.
     */
    function runReelSpin(reelIndex) {
        return new Promise(resolve => {
            const reel = elements.reels[reelIndex];
            const symbolsContainer = reel.querySelector('.reel-symbols');
            const symbolHeight = symbolsContainer.children[0].clientHeight;
            const symbolCount = symbolsContainer.children.length;

            // Choose a random symbol to land on
            const targetSymbolIndex = Math.floor(Math.random() * config.SYMBOLS.length);
            const targetSymbol = config.SYMBOLS[targetSymbolIndex];
            
            // Calculate the final position
            // We land on a symbol in the second-to-last repetition for a smooth stop
            const targetPosition = (symbolCount - (config.SYMBOLS.length * 2) + targetSymbolIndex) * symbolHeight;

            // Stagger the spin stop time for a classic slot machine effect
            const spinDelay = config.SPIN_DURATION + (reelIndex * 300);

            setTimeout(() => {
                symbolsContainer.style.transform = `translateY(-${targetPosition}px)`;
                reel.classList.remove('spinning');
                resolve(targetSymbol);
            }, spinDelay);
        });
    }

    /**
     * Calculates winnings based on the spin results.
     * @param {object[]} results - An array of symbol objects from the spin.
     * @returns {number} The total amount won.
     */
    function calculateWinnings(results) {
        // Check for three of a kind
        if (results.every(symbol => symbol.name === results[0].name)) {
            return results[0].payout * config.SPIN_COST;
        }
        return 0;
    }

    /**
     * Updates all relevant UI elements with the current state.
     * @param {number} [winAmount=null] - The amount won in the last spin.
     */
    function updateUI(winAmount = null) {
        elements.tokenBalance.textContent = state.tokens;
        elements.spinButton.disabled = state.isSpinning;
        if (winAmount !== null) {
            elements.lastWin.textContent = winAmount;
        }
    }

    /**
     * Displays a message to the user.
     * @param {string} text - The message to display.
     * @param {string} [type=''] - Optional type ('win' or 'lose') for styling.
     */
    function showMessage(text, type = '') {
        elements.messageBox.textContent = text;
        elements.messageBox.className = `message ${type}`;
    }

    /**
     * Shuffles an array in place. (Fisher-Yates shuffle)
     * @param {Array} array - The array to shuffle.
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- START THE APP ---
    init();
});

