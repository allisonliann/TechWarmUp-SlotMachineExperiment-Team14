const symbols = ['🤖', '🧠', '💡', '🔥', '論文', '💸', '🎟️'];

const spinButton = document.getElementById('spin-button');
const tokenBalanceElement = document.getElementById('token-balance');
const messageTextElement = document.getElementById('message-text');
const reels = document.querySelectorAll('.reel');
const resetButton = document.getElementById('reset-button');
const themeSwitch = document.getElementById('checkbox');

themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('light-mode');
});

let tokenBalance = 100;
let freeSpins = 0;

spinButton.addEventListener('click', () => {
    if (freeSpins > 0) {
        freeSpins--;
    } else {
        if (tokenBalance <= 0) {
            messageTextElement.textContent = "You're out of tokens!";
            spinButton.disabled = true;
            return;
        }
        tokenBalance--;
    }
    updateTokenBalance();
    messageTextElement.textContent = '';
    spinButton.disabled = true;
    resetButton.disabled = true;

    let spinIntervals = [];
    reels.forEach((reel, index) => {
        spinIntervals[index] = setInterval(() => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        }, 100);
    });

    setTimeout(() => {
        const results = [];
        reels.forEach((reel, index) => {
            clearInterval(spinIntervals[index]);
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            results.push(randomSymbol);
            reel.textContent = randomSymbol;
        });
        checkWin(results);
        spinButton.disabled = false;
        resetButton.disabled = false;
        updateSpinButtonText();
    }, 3000);
});

resetButton.addEventListener('click', () => {
    tokenBalance = 100;
    freeSpins = 0;
    updateTokenBalance();
    updateSpinButtonText();
    messageTextElement.textContent = '';
    spinButton.disabled = false;
    reels.forEach(reel => {
        reel.textContent = '';
        reel.classList.remove('glowing');
    });
});

function updateTokenBalance() {
    tokenBalanceElement.textContent = tokenBalance;
}

function updateSpinButtonText() {
    if (freeSpins > 0) {
        spinButton.textContent = `Spin (${freeSpins} Free)`;
    } else {
        spinButton.textContent = 'Spin (1 Token)';
    }
}

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        let winAmount = 0;
        let message = '';
        switch (results[0]) {
            case '🤖':
                winAmount = 10;
                break;
            case '🧠':
                winAmount = 20;
                break;
            case '💡':
                winAmount = 30;
                break;
            case '🔥':
                winAmount = 50;
                break;
            case '論文':
                winAmount = 100;
                break;
            case '💸':
                winAmount = 500;
                message = "JACKPOT! ";
                break;
            case '🎟️':
                freeSpins += 3;
                message = "You won 3 free spins! ";
                break;
        }
        tokenBalance += winAmount;
        updateTokenBalance();
        messageTextElement.textContent = message + (winAmount > 0 ? `You won ${winAmount} tokens!` : '');
        reels.forEach(reel => reel.classList.add('glowing'));
        setTimeout(() => {
            reels.forEach(reel => reel.classList.remove('glowing'));
        }, 2000);
    }
}
