document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const tokenBalanceDisplay = document.getElementById('token-balance');
    const messageDisplay = document.getElementById('message');

    let tokenBalance = 100;

    const symbols = [
        '🤖', '🧠', '⚡️', '🔥', 'TOKEN', 'AGI', 'LLM', 'HAL', 'GPT'
    ];

    const payouts = {
        'TOKEN': { '3': 50, '2': 10 },
        'AGI': { '3': 100, '2': 20 },
        'LLM': { '3': 20, '2': 5 },
        'HAL': { '3': 75, '2': 15 },
        'GPT': { '3': 15, '2': 3 },
        '🤖': { '3': 10, '2': 2 },
        '🧠': { '3': 10, '2': 2 },
        '⚡️': { '3': 5, '2': 1 },
        '🔥': { '3': 5, '2': 1 }
    };

    reels.forEach(reel => {
        const symbolContainer = document.createElement('div');
        symbolContainer.classList.add('symbol-container');
        reel.appendChild(symbolContainer);
        // Pre-fill with random symbols
        for (let i = 0; i < 20; i++) {
            const symbol = document.createElement('div');
            symbol.classList.add('symbol');
            symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            symbolContainer.appendChild(symbol);
        }
    });

    spinButton.addEventListener('click', spin);

    function spin() {
        if (tokenBalance < 1) {
            messageDisplay.textContent = "You're out of tokens!";
            spinButton.disabled = true;
            return;
        }

        tokenBalance -= 1;
        updateTokenBalance();
        messageDisplay.textContent = 'Spinning...';
        spinButton.disabled = true;

        let finalSymbols = [];

        reels.forEach((reel, index) => {
            const symbolContainer = reel.querySelector('.symbol-container');
            const symbolHeight = symbolContainer.querySelector('.symbol').clientHeight;
            const randomSymbolIndex = Math.floor(Math.random() * symbols.length);
            const targetPosition = - (randomSymbolIndex * symbolHeight);
            
            // Add more symbols to spin through
            for (let i = 0; i < 10; i++) {
                const symbol = document.createElement('div');
                symbol.classList.add('symbol');
                symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                symbolContainer.appendChild(symbol);
            }

            const finalSymbol = symbols[randomSymbolIndex];
            finalSymbols.push(finalSymbol);
            
            const animationDuration = 2000 + index * 500; // Stagger the stop

            symbolContainer.style.transition = `top ${animationDuration / 1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
            symbolContainer.style.top = `${targetPosition}px`;

            // Reset to a new random position after spin for next animation
            setTimeout(() => {
                symbolContainer.style.transition = 'none';
                const newSymbols = Array.from(symbolContainer.querySelectorAll('.symbol'));
                newSymbols.forEach(s => s.remove()); // Clear old symbols
                
                // Add the final symbol at the correct position
                const finalSymbolElement = document.createElement('div');
                finalSymbolElement.classList.add('symbol');
                finalSymbolElement.textContent = finalSymbol;
                symbolContainer.appendChild(finalSymbolElement);

                // Add more random symbols for visual variety
                for (let i = 0; i < 19; i++) {
                    const symbol = document.createElement('div');
                    symbol.classList.add('symbol');
                    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    symbolContainer.appendChild(symbol);
                }
                symbolContainer.style.top = '0px';

            }, animationDuration + 100);
        });

        setTimeout(() => {
            checkWin(finalSymbols);
            spinButton.disabled = false;
        }, 2000 + (reels.length - 1) * 500);
    }

    function checkWin(finalSymbols) {
        const counts = {};
        finalSymbols.forEach(symbol => {
            counts[symbol] = (counts[symbol] || 0) + 1;
        });

        let winnings = 0;
        let winMessage = "Try again!";

        for (const symbol in counts) {
            const count = counts[symbol];
            if (payouts[symbol] && payouts[symbol][count]) {
                winnings += payouts[symbol][count];
                winMessage = `You won ${payouts[symbol][count]} tokens!`;
            }
        }

        if (winnings > 0) {
            tokenBalance += winnings;
            updateTokenBalance();
            messageDisplay.textContent = winMessage;
        } else {
            messageDisplay.textContent = "No win this time. Spin again!";
        }
    }

    function updateTokenBalance() {
        tokenBalanceDisplay.textContent = tokenBalance;
    }
});
