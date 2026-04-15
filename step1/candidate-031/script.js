document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🤖', '🧠', '💡', '💰', '💥', '🚀', '📉'];
    const balanceDisplay = document.getElementById('balance-display');
    const messageDisplay = document.getElementById('message-display');
    const spinButton = document.getElementById('spin-button');
    const reels = document.querySelectorAll('.reel');

    let balance = 100;
    const betAmount = 10;

    spinButton.addEventListener('click', spin);

    function spin() {
        if (balance < betAmount) {
            messageDisplay.textContent = "Not enough tokens to spin!";
            return;
        }

        balance -= betAmount;
        balanceDisplay.textContent = balance;
        spinButton.disabled = true;
        messageDisplay.textContent = "Spinning...";

        let results = [];
        reels.forEach((reel, index) => {
            const animationDuration = 1000 + index * 500;
            const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            results.push(finalSymbol);
            animateReel(reel, finalSymbol, animationDuration);
        });
        
        setTimeout(() => {
            checkWin(results);
            spinButton.disabled = false;
        }, 2500);
    }
    
    function animateReel(reel, finalSymbol, duration) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime >= duration) {
                clearInterval(interval);
                reel.textContent = finalSymbol;
                return;
            }
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.textContent = randomSymbol;
        }, 100);
    }

    function checkWin(results) {
        if (results[0] === results[1] && results[1] === results[2]) {
            const winAmount = getWinAmount(results[0]);
            balance += winAmount;
            balanceDisplay.textContent = balance;
            messageDisplay.textContent = `You won ${winAmount} tokens!`;
        } else {
            messageDisplay.textContent = "Try again!";
        }
    }

    function getWinAmount(symbol) {
        switch (symbol) {
            case '💰':
                return 100;
            case '🚀':
                return 80;
            case '🤖':
                return 60;
            case '🧠':
                return 40;
            case '💡':
                return 20;
            case '💥':
                return 50; // A fun bonus for 'hallucination'
            case '📉':
                return -20; // A penalty for 'overfitting'
            default:
                return 0;
        }
    }
});