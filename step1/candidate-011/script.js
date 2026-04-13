document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const tokenBalanceSpan = document.getElementById('token-balance');
    const message = document.getElementById('message');

    let tokenBalance = 100;
    const spinCost = 10;

    const symbols = ['🤖', '🧠', '⚡️', '🔥', ' overfitting', 'bias', 'hallucination'];
    const payouts = {
        '🤖': 50,
        '🧠': 40,
        '⚡️': 30,
        '🔥': 20,
    };

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function spin() {
        if (tokenBalance < spinCost) {
            message.textContent = "Not enough tokens to spin!";
            return;
        }

        tokenBalance -= spinCost;
        updateTokenBalance();
        spinButton.disabled = true;
        message.textContent = 'Spinning...';

        let spinResults = [];
        reels.forEach((reel, index) => {
            const animation = reel.animate([
                { transform: 'translateY(-100%)' },
                { transform: 'translateY(100%)' },
                { transform: 'translateY(0)' }
            ], {
                duration: 1000 + index * 500,
                easing: 'ease-in-out'
            });

            animation.onfinish = () => {
                const symbol = getRandomSymbol();
                reel.textContent = symbol;
                spinResults[index] = symbol;

                if (index === reels.length - 1) {
                    checkWin(spinResults);
                    spinButton.disabled = false;
                }
            };
        });
    }

    function checkWin(results) {
        const allSame = results.every(symbol => symbol === results[0]);
        if (allSame) {
            const symbol = results[0];
            const payout = payouts[symbol];
            if (payout) {
                tokenBalance += payout;
                message.textContent = `You won ${payout} tokens!`;
            } else {
                message.textContent = `You got three ${symbol}s... but it's a feature, not a bug. No tokens.`;
            }
        } else {
            message.textContent = 'Try again!';
        }
        updateTokenBalance();
    }

    function updateTokenBalance() {
        tokenBalanceSpan.textContent = tokenBalance;
    }

    spinButton.addEventListener('click', spin);
});
