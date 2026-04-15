document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🤖', '🧠', '⚡️', '💡', '🔥', '🧑‍💻'];
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spinButton');
    const tokenCountSpan = document.getElementById('tokenCount');
    const winAmountSpan = document.getElementById('winAmount');
    const messageLog = document.getElementById('message-log');

    let tokens = 1000;
    const spinCost = 10;
    const winMultipliers = {
        '🤖🤖🤖': 100,
        '🧠🧠🧠': 50,
        '⚡️⚡️⚡️': 30,
        '💡💡💡': 20,
        '🔥🔥🔥': 15,
        '🧑‍💻🧑‍💻🧑‍💻': 10,
    };

    function updateTokenCount(amount) {
        tokens = amount;
        tokenCountSpan.textContent = tokens;
    }

    function logMessage(message) {
        messageLog.textContent = message;
    }

    function spin() {
        if (tokens < spinCost) {
            logMessage("Not enough tokens to spin!");
            return;
        }

        updateTokenCount(tokens - spinCost);
        winAmountSpan.textContent = 0;
        logMessage('');
        spinButton.disabled = true;
        reels.forEach(reel => reel.classList.add('spinning'));

        let spinResult = [];
        reels.forEach((reel, index) => {
            setTimeout(() => {
                reel.classList.remove('spinning');
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                reel.textContent = randomSymbol;
                spinResult[index] = randomSymbol;

                if (index === reels.length - 1) {
                    checkWin(spinResult);
                    spinButton.disabled = false;
                }
            }, (index + 1) * 1000);
        });
    }

    function checkWin(result) {
        const resultString = result.join('');
        let win = 0;

        if (winMultipliers[resultString]) {
            win = spinCost * winMultipliers[resultString];
            logMessage(`Jackpot! You won ${win} tokens!`);
        } else if (result[0] === result[1] || result[1] === result[2]) {
            win = spinCost * 2;
            logMessage(`You won ${win} tokens!`);
        } else {
            logMessage('Try again!');
        }

        if (win > 0) {
            updateTokenCount(tokens + win);
            winAmountSpan.textContent = win;
        }
    }

    spinButton.addEventListener('click', spin);
    updateTokenCount(tokens);
});
