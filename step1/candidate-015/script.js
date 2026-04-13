const symbols = ['🤖', '🧠', '💡', '🚀', '💰', '🔥', '💻'];
const spinButton = document.getElementById('spin-button');
const tokenBalance = document.getElementById('token-balance');
const reels = document.querySelectorAll('.reel');

let tokens = 100;

spinButton.addEventListener('click', () => {
    if (tokens <= 0) {
        alert("You're out of tokens! Refresh to play again.");
        return;
    }

    tokens--;
    tokenBalance.textContent = tokens;
    spinButton.disabled = true;

    let results = [];

    reels.forEach((reel, index) => {
        const interval = setInterval(() => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const result = symbols[Math.floor(Math.random() * symbols.length)];
            reel.textContent = result;
            results.push(result);

            if (index === reels.length - 1) {
                checkWin(results);
                spinButton.disabled = false;
            }
        }, 1000 + index * 500);
    });
});

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const winnings = 50;
        tokens += winnings;
        tokenBalance.textContent = tokens;
        alert(`You won ${winnings} tokens!`);
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        const winnings = 5;
        tokens += winnings;
        tokenBalance.textContent = tokens;
        alert(`You won ${winnings} tokens!`);
    }
}
