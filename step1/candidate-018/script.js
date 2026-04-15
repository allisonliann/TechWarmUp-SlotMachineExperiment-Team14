document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🤖', '🧠', '💡', '👨‍💻', '💬', '🪙', '👻', '📊'];
    const reelElements = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const tokenBalanceElement = document.getElementById('token-balance');
    const spinCostElement = document.getElementById('spin-cost');
    const lastWinElement = document.getElementById('last-win');

    let tokenBalance = 100;
    const spinCost = 10;

    function updateBalance(amount) {
        tokenBalance += amount;
        tokenBalanceElement.textContent = tokenBalance;
    }

    function spin() {
        if (tokenBalance < spinCost) {
            alert("You don't have enough tokens to spin!");
            return;
        }

        updateBalance(-spinCost);
        lastWinElement.textContent = 0;

        let results = [];
        reelElements.forEach((reel, index) => {
            const interval = setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                reel.textContent = finalSymbol;
                results[index] = finalSymbol;

                if (index === reelElements.length - 1) {
                    checkWin(results);
                }
            }, 1000 + index * 500);
        });
    }

    function checkWin(results) {
        // For simplicity, we'll only check for three of the same symbol
        if (results[0] === results[1] && results[1] === results[2]) {
            let winAmount = 0;
            switch (results[0]) {
                case '🤖':
                    winAmount = 50;
                    break;
                case '🧠':
                    winAmount = 75;
                    break;
                case '💡':
                    winAmount = 100;
                    break;
                case '👨‍💻':
                    winAmount = 200;
                    break;
                case '💬':
                    winAmount = 20;
                    break;
                case '🪙':
                    winAmount = 150;
                    break;
                case '👻':
                    winAmount = 5; // Hallucinations are cheap
                    break;
                case '📊':
                    winAmount = 30;
                    break;
            }
            updateBalance(winAmount);
            lastWinElement.textContent = winAmount;
        }
    }

    spinButton.addEventListener('click', spin);
});
