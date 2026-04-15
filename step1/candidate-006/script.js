document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spin-button');
    const tokenBalanceSpan = document.getElementById('token-balance');
    const messageArea = document.getElementById('message-area');
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    const symbols = ['🤖', '🧠', '😂', '🔥', '🤔', '🤡', '404'];
    let tokenBalance = 100;
    const spinCost = 10;

    spinButton.addEventListener('click', () => {
        if (tokenBalance < spinCost) {
            messageArea.textContent = "Not enough tokens to generate new thoughts!";
            return;
        }

        tokenBalance -= spinCost;
        updateTokenBalance();
        messageArea.textContent = "Thinking...";
        spinButton.disabled = true;

        let spinIntervals = reels.map((reel, index) => {
            return setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }, 100);
        });

        setTimeout(() => {
            spinIntervals.forEach(interval => clearInterval(interval));
            const finalResults = reels.map(reel => {
                const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                reel.textContent = finalSymbol;
                return finalSymbol;
            });
            checkWin(finalResults);
            spinButton.disabled = false;
        }, 1000 + Math.random() * 1000); // Spin for 1-2 seconds
    });

    function checkWin(results) {
        if (results[0] === results[1] && results[1] === results[2]) {
            let winAmount = 0;
            if (results[0] === '404') {
                winAmount = 100;
                messageArea.textContent = "Jackpot! You found a '404 Not Found' error!";
            } else if (results[0] === '🤡') {
                winAmount = 75;
                messageArea.textContent = "You've assembled the AI committee! Major win!";
            } else {
                winAmount = 50;
                messageArea.textContent = "Coherent thought achieved! You win!";
            }
            tokenBalance += winAmount;
        } else if (results[0] === results[1] || results[1] === results[2]) {
            const winAmount = 20;
            tokenBalance += winAmount;
            messageArea.textContent = "Partial hallucination! You win a few tokens!";
        } else {
            messageArea.textContent = "Incoherent nonsense. Try again.";
        }
        updateTokenBalance();
    }

    function updateTokenBalance() {
        tokenBalanceSpan.textContent = tokenBalance;
    }
});