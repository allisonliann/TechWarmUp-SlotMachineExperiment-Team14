document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const SYMBOLS = [
        '🤖', // Robot - Common
        '🧠', // Brain - Common
        '📈', // Uptrend - Uncommon
        '💡', // Idea - Uncommon
        '💥', // Hallucination - Rare
        '💎', // Singularity - Jackpot
    ];

    const PAYOUTS = {
        '🤖': 10,
        '🧠': 15,
        '📈': 25,
        '💡': 50,
        '💥': 100,
        '💎': 500, // Jackpot
    };

    const SPIN_COST = 5;
    const INITIAL_TOKENS = 100;
    const REEL_COUNT = 3;

    // --- DOM Elements ---
    const reelsContainer = document.querySelector('.reels-container');
    const spinButton = document.getElementById('spin-button');
    const tokenBalanceEl = document.getElementById('token-balance');
    const messageTextEl = document.getElementById('message-text');

    // --- Game State ---
    let tokens = INITIAL_TOKENS;
    let isSpinning = false;
    const reels = [];

    // --- Satirical Messages ---
    const WIN_MESSAGES = [
        "Success! You've successfully overfit the model!",
        "Nice win! You're generating synthetic data like a pro.",
        "You've achieved singularity! (in your token balance)",
        "Excellent! The neural network is pleased with this outcome.",
        "Your parameters are perfectly tuned for success!"
    ];
    const LOSS_MESSAGES = [
        "Spin again. The model requires more training data (your tokens).",
        "Result: 404 - Win Not Found. Please adjust your parameters.",
        "That was a statistical anomaly. The AI predicts you'll spin again.",
        "You've encountered a catastrophic forgetting event.",
        "The AI is learning from your losses. Thank you for your contribution."
    ];

    /**
     * Initializes the slot machine reels
     */
    function init() {
        for (let i = 0; i < REEL_COUNT; i++) {
            const reel = reelsContainer.children[i];
            const symbolContainer = document.createElement('div');
            symbolContainer.classList.add('reel-symbols');
            reel.appendChild(symbolContainer);
            reels.push(symbolContainer);
        }
        updateDisplay();
        spinButton.addEventListener('click', handleSpin);
    }

    /**
     * Handles the spin button click event
     */
    async function handleSpin() {
        if (isSpinning) return;

        if (tokens < SPIN_COST) {
            updateMessage("Insufficient tokens. Please insert more data for processing.");
            return;
        }

        isSpinning = true;
        tokens -= SPIN_COST;
        updateDisplay();
        updateMessage("Training in progress...");
        spinButton.disabled = true;

        const results = await spinReels();
        checkWin(results);

        isSpinning = false;
        spinButton.disabled = false;
    }

    /**
     * Animates the reels and returns the final results
     * @returns {Promise<string[]>} A promise that resolves with the final symbols
     */
    function spinReels() {
        const results = [];
        const spinPromises = reels.map((reel, i) => {
            // Create a long strip of random symbols for the animation
            const symbolStrip = createSymbolStrip();
            reel.innerHTML = '';
            reel.appendChild(symbolStrip);
            
            // Set the final symbol
            const finalSymbol = getRandomSymbol();
            results.push(finalSymbol);

            // Force a reflow to apply the initial state before transitioning
            reel.style.transition = 'none';
            reel.style.top = '0';
            reel.offsetHeight; // Trigger reflow

            // Set the final position and transition
            const finalPosition = (symbolStrip.children.length - 2) * 100; // Position of the second to last symbol
            reel.style.transition = `top ${2 + i * 0.5}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
            reel.style.top = `-${finalPosition}px`;
            
            // Add the final symbol at the end of the strip for a clean stop
            const finalSymbolEl = document.createElement('div');
            finalSymbolEl.textContent = finalSymbol;
            symbolStrip.appendChild(finalSymbolEl);


            return new Promise(resolve => setTimeout(resolve, 2500 + i * 500));
        });

        return Promise.all(spinPromises).then(() => results);
    }
    
    /**
     * Creates a vertical strip of random symbols for a reel
     * @returns {HTMLDivElement} The symbol strip element
     */
    function createSymbolStrip() {
        const strip = document.createElement('div');
        for (let i = 0; i < 20; i++) { // Create 20 random symbols
            const el = document.createElement('div');
            el.textContent = getRandomSymbol();
            strip.appendChild(el);
        }
        return strip;
    }


    /**
     * Checks the results for a winning combination
     * @param {string[]} results - The symbols from the spin
     */
    function checkWin(results) {
        // Simple win condition: all three symbols are the same
        const isWin = results.every(symbol => symbol === results[0]);

        if (isWin) {
            const symbol = results[0];
            const payout = PAYOUTS[symbol];
            tokens += payout;
            updateDisplay();
            updateMessage(`${getRandomMessage(WIN_MESSAGES)} You won ${payout} tokens!`);
        } else {
            updateMessage(getRandomMessage(LOSS_MESSAGES));
        }
    }

    /**
     * Updates the token balance and message on the screen
     */
    function updateDisplay() {
        tokenBalanceEl.textContent = tokens;
    }

    /**
     * Updates the message text
     * @param {string} text - The message to display
     */
    function updateMessage(text) {
        messageTextEl.textContent = text;
    }

    /**
     * Gets a random symbol from the SYMBOLS array with weighted probability
     * @returns {string} A random symbol
     */
    function getRandomSymbol() {
        // This creates a weighted distribution
        const rand = Math.random();
        if (rand < 0.02) return '💎'; // 2% chance for Jackpot
        if (rand < 0.10) return '💥'; // 8% chance
        if (rand < 0.25) return '💡'; // 15% chance
        if (rand < 0.45) return '📈'; // 20% chance
        if (rand < 0.70) return '🧠'; // 25% chance
        return '🤖'; // 30% chance
    }

    /**
     * Gets a random message from a message array
     * @param {string[]} messages - The array of messages
     * @returns {string} A random message
     */
    function getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // --- Start the Game ---
    init();
});

