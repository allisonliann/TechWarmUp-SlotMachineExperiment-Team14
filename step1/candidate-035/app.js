document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🤖', '🧠', '💡', '🔌', '🔥', '📉', '🚀', '🦄'];
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const spinButton = document.getElementById('spin-button');
    const balanceDisplay = document.getElementById('balance');
    const messageDisplay = document.getElementById('message');

    let balance = 100;
    const spinCost = 5;

    function createSymbolElement(symbol) {
        const div = document.createElement('div');
        div.classList.add('symbol');
        div.textContent = symbol;
        return div;
    }

    async function spinReel(reel, duration) {
        const symbolContainer = document.createElement('div');
        symbolContainer.classList.add('symbol-container');
        
        // Add a bunch of symbols to make it look like it's spinning
        for (let i = 0; i < 20; i++) {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            symbolContainer.appendChild(createSymbolElement(symbols[randomIndex]));
        }

        reel.innerHTML = '';
        reel.appendChild(symbolContainer);

        return new Promise(resolve => {
            const finalPosition = -1 * (symbolContainer.offsetHeight - reel.offsetHeight);
            symbolContainer.style.top = `${finalPosition}px`;
            setTimeout(() => {
                const finalSymbol = symbolContainer.lastChild.textContent;
                resolve(finalSymbol);
            }, duration);
        });
    }

    function checkWin(results) {
        if (results[0] === results[1] && results[1] === results[2]) {
            const winAmount = 50;
            balance += winAmount;
            messageDisplay.textContent = `You won ${winAmount} tokens!`;
        } else {
            messageDisplay.textContent = 'Try again!';
        }
    }

    function updateBalance() {
        balanceDisplay.textContent = balance;
    }

    spinButton.addEventListener('click', async () => {
        if (balance < spinCost) {
            messageDisplay.textContent = 'Not enough tokens!';
            return;
        }

        balance -= spinCost;
        updateBalance();
        messageDisplay.textContent = '';
        spinButton.disabled = true;

        const results = await Promise.all([
            spinReel(reel1, 1000),
            spinReel(reel2, 1500),
            spinReel(reel3, 2000)
        ]);

        checkWin(results);
        updateBalance();
        spinButton.disabled = false;
    });

    // Initial setup
    reel1.appendChild(createSymbolElement('🤖'));
    reel2.appendChild(createSymbolElement('🧠'));
    reel3.appendChild(createSymbolElement('💡'));
    updateBalance();
});