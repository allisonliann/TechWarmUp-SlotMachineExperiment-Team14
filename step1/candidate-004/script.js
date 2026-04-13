const symbols = ['🤖', '🧠', '🪙', '💻', '📝', '💥'];
const spinButton = document.getElementById('spin-button');
const resetButton = document.getElementById('reset-button');
const reels = document.querySelectorAll('.reel');
const tokenCountElement = document.getElementById('token-count');
const messageElement = document.getElementById('message');

const initialTokens = 100;
const spinCost = 1;
let tokenCount = initialTokens;

const jackpotMessage = document.getElementById('jackpot-message');
const freeSpinMessage = document.getElementById('free-spin-message');
const jackpotSound = document.getElementById('jackpot-sound');
const freeSpinSound = document.getElementById('free-spin-sound');

let freeSpins = 0;

function resetGame() {
    tokenCount = initialTokens;
    freeSpins = 0;
    tokenCountElement.textContent = tokenCount;
    messageElement.textContent = 'Game reset!';
    jackpotMessage.textContent = '';
    freeSpinMessage.textContent = '';
    reels.forEach(reel => reel.textContent = '?');
    spinButton.disabled = false;
}

spinButton.addEventListener('click', () => {
    if (freeSpins > 0) {
        freeSpins--;
        freeSpinMessage.textContent = `Free Spin! ${freeSpins} remaining.`;
    } else if (tokenCount < spinCost) {
        messageElement.textContent = "You're out of tokens!";
        return;
    } else {
        tokenCount -= spinCost;
        tokenCountElement.textContent = tokenCount;
    }

    messageElement.textContent = '';
    jackpotMessage.textContent = '';
    if (freeSpins === 0) {
        freeSpinMessage.textContent = '';
    }
    spinButton.disabled = true;
    spinSound.play();

    const results = [];
    reels.forEach((reel, i) => {
        reel.classList.add('spinning');
        setTimeout(() => {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.textContent = randomSymbol;
            results[i] = randomSymbol;
            reel.classList.remove('spinning');

            if (i === reels.length - 1) {
                checkWin(results);
                spinButton.disabled = false;
            }
        }, (i + 1) * 500);
    });
});

function checkWin(results) {
    if (results.every(symbol => symbol === results[0])) {
        let winAmount = 0;
        switch (results[0]) {
            case '🤖':
                winAmount = 20;
                break;
            case '🧠':
                winAmount = 30;
                break;
            case '🪙':
                winAmount = 100; // Jackpot
                jackpotMessage.textContent = 'Jackpot!';
                jackpotSound.play();
                break;
            case '💻':
                winAmount = 15;
                break;
            case '📝':
                freeSpins++;
                freeSpinMessage.textContent = `Free Spin! ${freeSpins} remaining.`;
                freeSpinSound.play();
                break;
            case '💥':
                winAmount = -10; // Lose tokens
                break;
        }
        tokenCount += winAmount;
        tokenCountElement.textContent = tokenCount;
        if (winAmount > 0) {
            messageElement.textContent = `You won ${winAmount} tokens!`;
            winSound.play();
        } else if (winAmount < 0) {
            messageElement.textContent = `You lost ${-winAmount} tokens!`;
        }
    }
}

// Initialize game
resetGame();
