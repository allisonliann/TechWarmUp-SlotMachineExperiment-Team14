document.addEventListener('DOMContentLoaded', () => {
    const tokenCountElement = document.getElementById('token-count');
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const spinButton = document.getElementById('spin-button');
    const messageElement = document.getElementById('message');

    let tokens = 100;

    const symbols = ['🤖', '🧠', '🔥', '📎', '🖼️', '🔑'];
    const winnings = {
        '🤖': 50,
        '🧠': 40,
        '🔥': 30,
        '📎': 20,
        '🖼️': 10,
        '🔑': 5,
    };

    function updateUI() {
        tokenCountElement.textContent = tokens;
    }

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function spin() {
        if (tokens < 10) {
            messageElement.textContent = "Not enough tokens!";
            return;
        }

        tokens -= 10;
        updateUI();
        messageElement.textContent = "";
        spinButton.disabled = true;

        const reels = [reel1, reel2, reel3];
        reels.forEach(reel => reel.classList.add('spinning'));

        setTimeout(() => {
            const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

            reels.forEach((reel, index) => {
                reel.classList.remove('spinning');
                reel.textContent = results[index];
            });

            calculateWinnings(results);
            spinButton.disabled = false;
        }, 1000); // Spin for 1 second
    }

    function calculateWinnings(results) {
        if (results[0] === results[1] && results[1] === results[2]) {
            const symbol = results[0];
            const winAmount = winnings[symbol];
            tokens += winAmount;
            messageElement.textContent = `You won ${winAmount} tokens!`;
            updateUI();
        } else {
            messageElement.textContent = "Try again!";
        }
    }

    spinButton.addEventListener('click', spin);
    updateUI();
});
