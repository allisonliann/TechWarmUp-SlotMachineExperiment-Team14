// --- Constants and State ---
const SYMBOLS = ['🤖', '🧠', '💡', '💥', '💰', '🔥'];
const PAYOUTS = {
    '🤖': 100,
    '🧠': 75,
    '💡': 50,
    '💰': 25,
    '🔥': 15,
    '💥': 5
};
const SPIN_COST = 5;
const INITIAL_TOKENS = 100;
const REEL_SYMBOLS_COUNT = 30; // Number of symbols in each reel for animation

let playerTokens = INITIAL_TOKENS;
let isSpinning = false;
let finalSymbols = [];
let audioCtx; // To be initialized on first user interaction

// --- DOM Elements ---
const tokenBalanceDisplay = document.getElementById('token-balance');
const messageDisplay = document.getElementById('message-display');
const spinButton = document.getElementById('spin-button');
const reels = document.querySelectorAll('.reel');

// --- Functions ---

/**
 * Initializes the slot machine.
 */
function init() {
    finalSymbols = [];
    reels.forEach(reel => {
        reel.innerHTML = '';
        const fragment = document.createDocumentFragment();
        // Populate with enough symbols for the initial view
        for (let j = 0; j < REEL_SYMBOLS_COUNT; j++) {
            fragment.appendChild(createSymbolElement(getRandomSymbol()));
        }
        reel.appendChild(fragment);
        // Start reels at a position showing a symbol
        reel.style.transform = `translateY(-${(REEL_SYMBOLS_COUNT - 2) * 80}px)`;
    });

    updateDisplays();
    spinButton.addEventListener('click', spin);
}

/**
 * Main spin function.
 */
async function spin() {
    if (isSpinning) return;
    if (playerTokens < SPIN_COST) return;

    // Initialize AudioContext on first spin
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    playSound('spin');

    isSpinning = true;
    spinButton.disabled = true;
    messageDisplay.textContent = "Spinning...";
    playerTokens -= SPIN_COST;
    updateDisplays();

    reels.forEach(reel => reel.classList.remove('winner'));

    finalSymbols = [];
    const spinPromises = Array.from(reels).map((reel, i) => {
        const resultSymbol = getRandomSymbol();
        const fragment = document.createDocumentFragment();
        for (let j = 0; j < REEL_SYMBOLS_COUNT; j++) {
            fragment.appendChild(createSymbolElement(j === REEL_SYMBOLS_COUNT - 2 ? resultSymbol : getRandomSymbol()));
        }

        reel.innerHTML = '';
        reel.appendChild(fragment);
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        finalSymbols.push(resultSymbol);
        
        // Force reflow
        void reel.offsetWidth;

        const targetTransform = `translateY(-${(REEL_SYMBOLS_COUNT - 2) * 80}px)`;
        reel.style.transition = `transform ${2 + i * 0.5}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        reel.style.transform = targetTransform;
        
        return new Promise(resolve => setTimeout(resolve, 2500 + i * 500));
    });

    await Promise.all(spinPromises);

    checkWin();
    isSpinning = false;
    updateDisplays();
}

/**
 * Checks for a win and updates state accordingly.
 */
function checkWin() {
    const [s1, s2, s3] = finalSymbols;
    
    if (s1 === s2 && s2 === s3) {
        const winnings = PAYOUTS[s1];
        playerTokens += winnings;
        messageDisplay.textContent = `You won ${winnings} tokens!`;
        reels.forEach(reel => reel.classList.add('winner'));
        playSound('win');
    } else {
        messageDisplay.textContent = "Try again!";
    }
}

/**
 * Updates the token and message displays, and button state.
 */
function updateDisplays() {
    tokenBalanceDisplay.textContent = playerTokens;
    spinButton.disabled = isSpinning || playerTokens < SPIN_COST;
    if (playerTokens < SPIN_COST && !isSpinning) {
        messageDisplay.textContent = "Not enough tokens!";
    }
}

/**
 * Creates a symbol element for the reel.
 */
function createSymbolElement(symbol) {
    const div = document.createElement('div');
    div.classList.add('symbol');
    div.textContent = symbol;
    return div;
}

/**
 * Returns a random symbol from the SYMBOLS array.
 */
function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

/**
 * Plays a sound effect using the Web Audio API.
 * @param {'spin'|'win'} type - The type of sound to play.
 */
function playSound(type) {
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    if (type === 'spin') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 1.0);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1.5);
    } else if (type === 'win') {
        oscillator.type = 'sine';
        const now = audioCtx.currentTime;
        oscillator.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(0.2, now);
        oscillator.start(now);
        oscillator.frequency.setValueAtTime(800, now + 0.1);
        oscillator.frequency.setValueAtTime(1000, now + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        oscillator.stop(now + 0.5);
    }
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', init);
