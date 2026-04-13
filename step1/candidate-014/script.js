document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🤖', '🧠', '💡', '🔌', '🔥', '💰', '🦄', '🐱'];
    const reelElements = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const tokenBalanceElement = document.getElementById('token-balance');
    const spinCostElement = document.getElementById('spin-cost');
    const lastWinElement = document.getElementById('last-win');
    const messageTextElement = document.getElementById('message-text');

    let tokenBalance = 100;
    const spinCost = 10;

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function spin() {
        if (tokenBalance < spinCost) {
            messageTextElement.textContent = "Not enough tokens!";
            return;
        }

        tokenBalance -= spinCost;
        updateBalance();
        messageTextElement.textContent = "Spinning...";
        lastWinElement.textContent = 0;

        let spinIntervals = [];
        reelElements.forEach((reel, index) => {
            spinIntervals[index] = setInterval(() => {
                reel.textContent = getRandomSymbol();
            }, 100);
        });

        setTimeout(() => {
            const finalSymbols = [];
            reelElements.forEach((reel, index) => {
                clearInterval(spinIntervals[index]);
                const finalSymbol = getRandomSymbol();
                reel.textContent = finalSymbol;
                finalSymbols.push(finalSymbol);
            });
            checkForWin(finalSymbols);
        }, 3000);
    }

    function checkForWin(symbols) {
        const [s1, s2, s3] = symbols;
        let winAmount = 0;

        if (s1 === s2 && s2 === s3) {
            // All three are the same
            winAmount = getPayout(s1) * 5;
            messageTextElement.textContent = `Jackpot! Three ${s1}s!`;
        } else if (s1 === s2 || s2 === s3) {
            // Two are the same
            winAmount = getPayout(s2);
            messageTextElement.textContent = `Nice! Two ${s2}s!`;
        } else {
            messageTextElement.textContent = "No luck this time. Spin again!";
        }

        if (winAmount > 0) {
            tokenBalance += winAmount;
            lastWinElement.textContent = winAmount;
            updateBalance();
        }
    }

    function getPayout(symbol) {
        switch (symbol) {
            case '💰':
                return 100;
            case '🦄':
                return 75;
            case '🔥':
                return 50;
            case '🤖':
                return 40;
            case '🧠':
                return 30;
            case '💡':
                return 20;
            case '🔌':
                return 15;
            case '🐱':
                return 10; // The cat is a low-value symbol, of course.
            default:
                return 0;
        }
    }

    function updateBalance() {
        tokenBalanceElement.textContent = tokenBalance;
    }

    spinButton.addEventListener('click', spin);
    spinCostElement.textContent = spinCost;
    updateBalance();
});
