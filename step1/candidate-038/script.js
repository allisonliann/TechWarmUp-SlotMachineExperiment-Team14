document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spin-button');
    const tokenBalance = document.getElementById('token-balance');
    const reels = document.querySelectorAll('.reel');

    const symbols = [
        'assets/token.png',
        'assets/brain.png',
        'assets/chip.png',
        'assets/code.png',
        'assets/robot.png',
    ];

    let currentBalance = 100;

    spinButton.addEventListener('click', () => {
        if (currentBalance <= 0) {
            alert("You're out of tokens! Refresh to play again.");
            return;
        }

        currentBalance--;
        tokenBalance.textContent = currentBalance;

        let results = [];
        reels.forEach(reel => {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            const symbol = symbols[randomIndex];
            reel.style.backgroundImage = `url('${symbol}')`;
            results.push(symbol);
        });

        checkWin(results);
    });

    function checkWin(results) {
        if (results[0] === results[1] && results[1] === results[2]) {
            const winAmount = 10;
            currentBalance += winAmount;
            tokenBalance.textContent = currentBalance;
            setTimeout(() => alert(`You won ${winAmount} tokens! The AI overlords are pleased.`), 100);
        }
    }
});
