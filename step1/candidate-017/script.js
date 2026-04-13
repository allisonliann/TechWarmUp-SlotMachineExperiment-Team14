document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const decreaseBetButton = document.getElementById('decrease-bet');
    const increaseBetButton = document.getElementById('increase-bet');
    const betAmountSpan = document.getElementById('bet-amount');
    const tokenBalanceSpan = document.getElementById('token-balance');
    const message = document.getElementById('message');

    const symbols = ['🤖', '🧠', '⚡️', '🔥', '👑', '👽', '👾'];
    const payouts = {
        '🤖': 10,
        '🧠': 20,
        '⚡️': 30,
        '🔥': 40,
        '👑': 50,
        '👽': 100,
        '👾': 200,
    };

    let tokenBalance = 1000;
    let betAmount = 10;

    function updateBetAmount(amount) {
        betAmount = Math.max(10, Math.min(100, betAmount + amount));
        betAmountSpan.textContent = betAmount;
    }

    function spin() {
        if (tokenBalance < betAmount) {
            message.textContent = "Not enough tokens!";
            return;
        }

        tokenBalance -= betAmount;
        tokenBalanceSpan.textContent = tokenBalance;
        message.textContent = "Spinning...";

        let spinIntervals = [];
        reels.forEach((reel, index) => {
            reel.classList.add('spinning');
            spinIntervals[index] = setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }, 100);
        });

        setTimeout(() => {
            spinIntervals.forEach(interval => clearInterval(interval));
            reels.forEach(reel => {
                reel.classList.remove('spinning');
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            });
            checkWin();
        }, 2000);
    }

    function checkWin() {
        const reelSymbols = Array.from(reels).map(reel => reel.textContent);
        const firstSymbol = reelSymbols[0];
        const isWin = reelSymbols.every(symbol => symbol === firstSymbol);

        if (isWin) {
            const payout = payouts[firstSymbol] * (betAmount / 10);
            tokenBalance += payout;
            tokenBalanceSpan.textContent = tokenBalance;
            message.textContent = `You won ${payout} tokens!`;
        } else {
            message.textContent = "Try again!";
        }
    }

    spinButton.addEventListener('click', spin);
    decreaseBetButton.addEventListener('click', () => updateBetAmount(-10));
    increaseBetButton.addEventListener('click', () => updateBetAmount(10));
});
