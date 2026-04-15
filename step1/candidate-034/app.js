document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const tokenBalanceDisplay = document.getElementById('token-balance');
    const lastWinDisplay = document.getElementById('last-win');
    const messageDisplay = document.getElementById('message-display');

    const symbols = ['🤖', '🧠', '💡', '🔥', '💻', '🤔', '🚀', '💥', '💸'];
    const payouts = {
        '🤖': 50,
        '🧠': 40,
        '💡': 30,
        '🔥': 20,
        '💻': 10,
        '🚀': 100, // AGI achieved!
        '💸': 75, // VC funding secured
        '💥': -25, // Hallucination
    };
    const spinCost = 10;
    let tokenBalance = 100;
    let isSpinning = false;

    function init() {
        updateUI();
        spinButton.addEventListener('click', spin);
        // Set initial symbols
        reels.forEach(reel => {
            reel.textContent = getRandomSymbol();
        });
    }

    function spin() {
        if (isSpinning) return;
        if (tokenBalance < spinCost) {
            displayMessage("Not enough tokens to spin!", 'error');
            return;
        }

        isSpinning = true;
        tokenBalance -= spinCost;
        let lastWin = 0;
        lastWinDisplay.textContent = lastWin;
        updateUI();
        displayMessage(''); // Clear previous messages

        spinButton.disabled = true;
        reels.forEach(reel => reel.classList.add('spinning'));

        const spinDuration = 1000; // 1 second of spinning
        const symbolSwaps = 10;
        let currentSwap = 0;

        const spinInterval = setInterval(() => {
            reels.forEach(reel => {
                reel.textContent = getRandomSymbol();
            });
            currentSwap++;
            if (currentSwap >= symbolSwaps) {
                clearInterval(spinInterval);
                finishSpin();
            }
        }, spinDuration / symbolSwaps);
    }

    function finishSpin() {
        const finalSymbols = Array.from(reels).map(() => getRandomSymbol());
        reels.forEach((reel, index) => {
            reel.textContent = finalSymbols[index];
            reel.classList.remove('spinning');
        });

        const winnings = calculateWinnings(finalSymbols);
        if (winnings > 0) {
            displayMessage(`You won ${winnings} tokens!`, 'win');
            tokenBalance += winnings;
        } else if (winnings < 0) {
             displayMessage(`Hallucination! You lose ${-winnings} tokens.`, 'loss');
             tokenBalance += winnings; // Winnings is negative
        } else {
            displayMessage('Try again!', 'info');
        }
        
        lastWinDisplay.textContent = winnings > 0 ? winnings : 0;
        updateUI();

        isSpinning = false;
        spinButton.disabled = false;
    }


    function calculateWinnings(symbols) {
        // Simple win condition: three of the same symbol
        if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
            const symbol = symbols[0];
            return payouts[symbol] || 0;
        }
        // Check for special negative payout
        if (symbols.includes('💥')) {
             return payouts['💥'];
        }

        return 0;
    }

    function updateUI() {
        tokenBalanceDisplay.textContent = tokenBalance;
    }

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function displayMessage(message, type = 'info') {
        messageDisplay.textContent = message;
        messageDisplay.style.color = {
            'win': '#28a745',
            'loss': '#dc3545',
            'error': '#dc3545',
            'info': '#333'
        }[type];
    }

    init();
});
