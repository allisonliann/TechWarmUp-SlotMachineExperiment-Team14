// script.js

// --- Global Variables / State ---
let tokenCount = 100;
const spinCost = 10;
const reelSymbols = ['🧠', '🤖', '💾', '💻', '💡', '🐛', '📡']; // AI-themed emojis
let isSpinning = false;

// Winning combinations and their payouts
// The keys are symbol combinations, values are payouts.
const winCombinations = {
    '🧠🧠🧠': 100,
    '🤖🤖🤖': 50,
    '💾💾💾': 30,
    '💻💻💻': 30,
    '💡💡💡': 20,
    '🐛🐛🐛': 10,
    '📡📡📡': 10
    // Add more complex combinations if desired, e.g., two identical symbols
};

// DOM Elements
const tokenCountDisplay = document.getElementById('token-count');
const spinButton = document.getElementById('spin-button');
const reelElements = document.querySelectorAll('.reel .symbol');
const messageDisplay = document.getElementById('message-display');

// --- Functions ---

/**
 * Initializes the game state and UI.
 */
function initGame() {
    updateTokenDisplay();
    spinButton.addEventListener('click', handleSpin);
    // Initial display of symbols (optional, or just keep them blank)
    reelElements.forEach(reel => {
        reel.textContent = '';
        reel.classList.remove('visible');
    });
}

/**
 * Updates the displayed token count.
 */
function updateTokenDisplay() {
    tokenCountDisplay.textContent = tokenCount;
}

/**
 * Displays a message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - 'win', 'loss', or 'info' for styling/animation.
 */
function displayMessage(message, type = 'info') {
    messageDisplay.textContent = message;
    messageDisplay.className = ''; // Clear previous classes
    messageDisplay.classList.add(type);
}

/**
 * Generates a random symbol for a reel.
 * @returns {string} A random AI-themed emoji symbol.
 */
function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * reelSymbols.length);
    return reelSymbols[randomIndex];
}

/**
 * Handles the spin button click event.
 */
async function handleSpin() {
    if (isSpinning) return;

    if (tokenCount < spinCost) {
        displayMessage("AI says: 'Insufficient Processing Power (Tokens)!'", 'loss');
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    tokenCount -= spinCost;
    updateTokenDisplay();
    displayMessage("AI is computing your fate...", 'info');

    const finalSymbols = [];
    const spinPromises = [];

    reelElements.forEach((reel, index) => {
        spinPromises.push(
            new Promise(resolve => {
                // Simulate spinning animation by rapidly changing symbols
                let spinCount = 0;
                const totalSpins = 20 + (index * 5); // Staggered spin duration
                const spinInterval = setInterval(() => {
                    reel.textContent = getRandomSymbol();
                    spinCount++;
                    if (spinCount >= totalSpins) {
                        clearInterval(spinInterval);
                        const finalSymbol = getRandomSymbol(); // Get the actual final symbol
                        reel.textContent = finalSymbol;
                        finalSymbols[index] = finalSymbol;
                        reel.classList.add('visible'); // Make symbol visible after spin
                        resolve();
                    }
                }, 70); // Speed of symbol change
            })
        );
    });

    // Wait for all reels to finish spinning
    await Promise.all(spinPromises);

    checkWin(finalSymbols);

    isSpinning = false;
    spinButton.disabled = false;

    if (tokenCount <= 0) {
        displayMessage("AI says: 'Simulation Over. No tokens left to process.' Game Over!", 'loss');
        spinButton.disabled = true; // Disable button permanently if no tokens
    }
}

/**
 * Checks for winning combinations and updates tokens.
 * @param {string[]} symbols - An array of the final symbols on the reels.
 */
function checkWin(symbols) {
    const combination = symbols.join('');
    let won = false;

    // Check for exact three-of-a-kind wins
    if (winCombinations[combination]) {
        const payout = winCombinations[combination];
        tokenCount += payout;
        displayMessage(`AI congratulates you! ${combination} - You won ${payout} tokens!`, 'win');
        won = true;
    } else {
        // Check for two identical symbols (simple example)
        // This is a basic example; more complex logic can be added.
        if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
            tokenCount += 5; // Small payout for two identical
            displayMessage("AI almost aligned for you! +5 tokens.", 'info');
            won = true;
        }
    }

    if (!won) {
        const lossMessages = [
            "AI says: 'Error 404: Payout Not Found'",
            "Your model needs more training data (tokens).",
            "Insufficient data for a payout.",
            "The robots are taking your tokens!",
            "This is not the outcome you were looking for. Try again."
        ];
        const randomLossMessage = lossMessages[Math.floor(Math.random() * lossMessages.length)];
        displayMessage(randomLossMessage, 'loss');
    }

    updateTokenDisplay();
}

// --- Initialize the game when the DOM is fully loaded ---
document.addEventListener('DOMContentLoaded', initGame);
