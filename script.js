document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const tokensDisplay = document.getElementById('tokens');
    const reelElements = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
    const spinButton = document.getElementById('spinButton');
    const messageDisplay = document.getElementById('message');

    // --- Game State ---
    let tokens = 100;
    const betAmount = 10;
    let isSpinning = false;

    // AI-themed symbols (using emojis for simplicity)
    const reelSymbols = ['🧠', '🤖', '💬', '💻', '🐛', '🚀', '💡', '📡'];

    // --- Helper Functions ---

    /**
     * Updates the tokens display on the page.
     */
    function updateTokensDisplay() {
        tokensDisplay.textContent = tokens;
    }

    /**
     * Displays a message to the user.
     * @param {string} msg The message to display.
     * @param {boolean} isWinning True if it's a winning message, false otherwise.
     */
    function displayMessage(msg, isWinning = false) {
        messageDisplay.textContent = msg;
        if (!isWinning) {
            messageDisplay.style.color = '#ff6b6b'; // Red for losses/errors
        } else {
            messageDisplay.style.color = '#70e000'; // Green for wins
        }
    }

    /**
     * Initializes the game state and UI.
     */
    function initializeGame() {
        updateTokensDisplay();
        // Set initial random symbols
        reelElements.forEach(reel => {
            reel.textContent = getRandomSymbol();
        });
        displayMessage("Press 'Spin' to begin your AI adventure!");
    }

    /**
     * Gets a random symbol from the reelSymbols array.
     * @returns {string} A random AI-themed symbol.
     */
    function getRandomSymbol() {
        return reelSymbols[Math.floor(Math.random() * reelSymbols.length)];
    }

    /**
     * Simulates the spinning of a single reel and settles on a final symbol.
     * @param {HTMLElement} reel The DOM element for the reel.
     * @returns {Promise<string>} A promise that resolves with the final symbol after spinning.
     */
    function spinSingleReel(reel) {
        return new Promise(resolve => {
            reel.classList.add('spinning');
            const duration = 2000 + Math.random() * 1000; // 2-3 seconds spin
            const intervalTime = 50; // Update symbol every 50ms

            let spinInterval = setInterval(() => {
                reel.textContent = getRandomSymbol();
            }, intervalTime);

            setTimeout(() => {
                clearInterval(spinInterval);
                reel.classList.remove('spinning');
                const finalSymbol = getRandomSymbol(); // Get the actual final symbol
                reel.textContent = finalSymbol;
                resolve(finalSymbol);
            }, duration);
        });
    }

    /**
     * Checks if the current reel results constitute a win and calculates payout.
     * @param {string[]} results An array of the final symbols on each reel.
     * @returns {number} The amount of tokens won, or 0 if no win.
     */
    function checkWin(results) {
        const [s1, s2, s3] = results;

        if (s1 === s2 && s2 === s3) {
            // Three identical symbols: Big win!
            return 50;
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            // Two identical symbols: Small win
            return 20;
        }
        return 0; // No win
    }

    /**
     * Handles the main spin action when the button is clicked.
     */
    async function spinHandler() {
        if (isSpinning) return; // Prevent multiple spins

        if (tokens < betAmount) {
            displayMessage("Insufficient compute resources. Need more tokens!", false);
            return;
        }

        isSpinning = true;
        spinButton.disabled = true;
        tokens -= betAmount;
        updateTokensDisplay();
        displayMessage("AI is thinking... processing data...", false);

        // Spin all reels concurrently
        const reelPromises = reelElements.map(reel => spinSingleReel(reel));
        const finalSymbols = await Promise.all(reelPromises); // Wait for all reels to stop

        const winnings = checkWin(finalSymbols);

        if (winnings > 0) {
            tokens += winnings;
            displayMessage(`Alignment achieved! You won ${winnings} tokens! Total: ${tokens}`, true);
        } else {
            displayMessage(`Hallucination detected. Your model needs more training. Total: ${tokens}`, false);
        }

        updateTokensDisplay();
        isSpinning = false;
        spinButton.disabled = false;
    }

    // --- Event Listeners ---
    spinButton.addEventListener('click', spinHandler);

    // --- Initial Setup ---
    initializeGame();
});
