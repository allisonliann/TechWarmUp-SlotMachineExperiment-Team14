document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const tokenBalanceDisplay = document.getElementById('token-balance');
    const messageArea = document.getElementById('message-area');

    let tokens = 100;
    const spinCost = 5;
    const symbols = ['🤖', '🧠', '💡', '💰', '💥', '🎰'];

    function init() {
        reels.forEach(reel => {
            const symbolContainer = document.createElement('div');
            symbolContainer.classList.add('symbol-container');
            // Populate with initial symbols
            for (let i = 0; i < symbols.length * 3; i++) {
                const symbol = document.createElement('div');
                symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                symbolContainer.appendChild(symbol);
            }
            reel.appendChild(symbolContainer);
        });
        updateTokenDisplay();
        spinButton.addEventListener('click', spin);
    }

    function spin() {
        if (tokens < spinCost) {
            messageArea.textContent = "Not enough tokens to spin!";
            return;
        }

        tokens -= spinCost;
        updateTokenDisplay();
        messageArea.textContent = "Spinning...";
        spinButton.disabled = true;

        const results = [];
        let completedReels = 0;

        reels.forEach((reel, index) => {
            const symbolContainer = reel.querySelector('.symbol-container');
            const targetSymbolIndex = Math.floor(Math.random() * symbols.length);
            results.push(symbols[targetSymbolIndex]);

            // Adjust the final position calculation
            const symbolHeight = 120; // As defined in CSS for .reel height
            const targetPosition = -( (symbols.length * 2) * symbolHeight + (targetSymbolIndex * symbolHeight));


            // Set a different transition duration for each reel for a staggered stop effect
            setTimeout(() => {
                symbolContainer.style.transition = `top ${2 + index * 0.5}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
                symbolContainer.style.top = `${targetPosition}px`;
            }, 0);


            // Listen for transition end on each reel
            symbolContainer.addEventListener('transitionend', () => {
                completedReels++;
                 // Reset the reel position to loop the symbols
                symbolContainer.style.transition = 'none';
                symbolContainer.style.top = `-${targetSymbolIndex * symbolHeight}px`;


                if (completedReels === reels.length) {
                    checkWin(results);
                    spinButton.disabled = false;
                }
            }, { once: true });
        });
    }

    function checkWin(results) {
        // For simplicity, we'll check if all three symbols are the same.
        const allSame = results.every(symbol => symbol === results[0]);
        const firstSymbol = results[0];

        if (allSame) {
            let winnings = 0;
            switch (firstSymbol) {
                case '💰':
                    winnings = 500;
                    messageArea.textContent = "Jackpot! +500 tokens!";
                    break;
                case '🎰':
                    winnings = 250;
                    messageArea.textContent = "Big Win! +250 tokens!";
                    break;
                case '🤖':
                case '🧠':
                case '💡':
                    winnings = 50;
                    messageArea.textContent = `Aligned Model! +50 tokens!`;
                    break;
                case '💥':
                    winnings = -10; // A loss condition
                    messageArea.textContent = "Model Collapse! You lose 10 tokens!";
                    break;
            }
            tokens += winnings;
        } else {
            messageArea.textContent = "Hallucination... Try again.";
        }
        updateTokenDisplay();
    }

    function updateTokenDisplay() {
        tokenBalanceDisplay.textContent = `Tokens: ${tokens}`;
    }

    init();
});
