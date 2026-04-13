const symbols = [
    { symbol: '🤖', weight: 5 },
    { symbol: '🧠', weight: 4 },
    { symbol: '💡', weight: 3 },
    { symbol: '🔌', weight: 2 },
    { symbol: '💾', weight: 2 },
    { symbol: '🧐', weight: 1 },
    { symbol: '🤡', weight: 1 }
];
const spinButton = document.getElementById('spin-button');
const resetButton = document.getElementById('reset-button');
const reels = document.querySelectorAll('.reel');
const tokenBalanceSpan = document.getElementById('token-balance');
const winningsMessage = document.getElementById('winnings-message');

let tokenBalance = 100;
const spinCost = 10;

// Create a weighted pool of symbols
const weightedSymbols = [];
for (const item of symbols) {
    for (let i = 0; i < item.weight; i++) {
        weightedSymbols.push(item.symbol);
    }
}

// --- Sound Effects ---
// To add sounds, you would uncomment the following lines and provide the audio files.
// const spinSound = new Audio('spin.wav');
// const winSound = new Audio('win.wav');

function playSpinSound() {
    // spinSound.play();
}

function playWinSound() {
    // winSound.play();
}
// --------------------


spinButton.addEventListener('click', () => {
    if (tokenBalance < spinCost) {
        return;
    }

    playSpinSound();
    tokenBalance -= spinCost;
    updateTokenBalance();
    winningsMessage.textContent = '';
    spinButton.disabled = true;

    let spinResult = [];
    reels.forEach((reel, index) => {
        reel.classList.add('spinning');
        const interval = setInterval(() => {
            reel.textContent = weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            reel.classList.remove('spinning');
            const finalSymbol = weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
            reel.textContent = finalSymbol;
            spinResult[index] = finalSymbol;

            if (index === reels.length - 1) {
                checkWinnings(spinResult);
                spinButton.disabled = false;
                if (tokenBalance < spinCost) {
                    winningsMessage.textContent = "Game Over! Not enough tokens.";
                    spinButton.disabled = true;
                }
            }
        }, 1000 + index * 500);
    });
});

resetButton.addEventListener('click', () => {
    tokenBalance = 100;
    updateTokenBalance();
    winningsMessage.textContent = '';
    spinButton.disabled = false;
    reels.forEach(reel => reel.textContent = '');
});

function updateTokenBalance() {
    tokenBalanceSpan.textContent = tokenBalance;
}

function checkWinnings(result) {
    if (result[0] === result[1] && result[1] === result[2]) {
        // Three matching symbols
        const symbol = result[0];
        const winnings = getWinnings(symbol, 3);
        tokenBalance += winnings;
        updateTokenBalance();
        winningsMessage.textContent = `Jackpot! You won ${winnings} tokens!`;
        playWinSound();
    } else if (result[0] === result[1] || result[1] === result[2]) {
        // Two matching symbols
        const symbol = result[1];
        const winnings = getWinnings(symbol, 2);
        tokenBalance += winnings;
        updateTokenBalance();
        winningsMessage.textContent = `You won ${winnings} tokens!`;
        playWinSound();
    }
}

function getWinnings(symbol, count) {
    const symbolInfo = symbols.find(s => s.symbol === symbol);
    if (count === 3) {
        return 100 / symbolInfo.weight;
    }
    if (count === 2) {
        return 50 / symbolInfo.weight;
    }
    return 0;
}

