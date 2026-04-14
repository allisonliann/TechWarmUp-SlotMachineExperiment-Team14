document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🤖', '🧠', '💡', '🔌', '🔥', 'AGI', 'GPU', 'LLM'];
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const tokenBalanceSpan = document.getElementById('token-balance');
    const message = document.getElementById('message');

    let tokenBalance = 100;

    spinButton.addEventListener('click', () => {
        if (tokenBalance <= 0) {
            message.textContent = "You're out of tokens! Go train a model.";
            spinButton.disabled = true;
            return;
        }

        tokenBalance--;
        updateTokenBalance();
        message.textContent = '';

        let results = [];
        reels.forEach((reel, index) => {
            const animation = reel.animate([
                { transform: 'translateY(-100%)', opacity: 0 },
                { transform: 'translateY(0)', opacity: 1 }
            ], {
                duration: 500 + index * 200,
                easing: 'ease-in-out'
            });

            animation.onfinish = () => {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                reel.textContent = randomSymbol;
                results[index] = randomSymbol;

                if (index === reels.length - 1) {
                    checkWin(results);
                }
            };
        });
    });

    function updateTokenBalance() {
        tokenBalanceSpan.textContent = tokenBalance;
    }

    function checkWin(results) {
        // For simplicity, we'll check if all three symbols are the same.
        if (results[0] === results[1] && results[1] === results[2]) {
            let winAmount = 10;
            if (results[0] === 'AGI') {
                winAmount = 100;
            }
            message.textContent = `You won ${winAmount} tokens!`;
            tokenBalance += winAmount;
            updateTokenBalance();
        }
    }
});
