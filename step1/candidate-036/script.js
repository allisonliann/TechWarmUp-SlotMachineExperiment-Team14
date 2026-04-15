document.addEventListener('DOMContentLoaded', () => {
    const tokensDisplay = document.getElementById('tokens');
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const spinButton = document.getElementById('spinButton');
    const messageDisplay = document.getElementById('message');

    let tokens = 1000;
    const spinCost = 10;
    const symbols = ['🤖', '🧠', '🔥', '💸', '📉', '💩'];
    let isSpinning = false;

    // Payouts for winning combinations
    const payouts = {
        '💩💩💩': 50,
        '📉📉📉': 75,
        '💸💸💸': 100,
        '🔥🔥🔥': 150,
        '🧠🧠🧠': 200,
        '🤖🤖🤖': 500 // Jackpot
    };

    function updateUI() {
        tokensDisplay.textContent = tokens;
        spinButton.disabled = isSpinning || tokens < spinCost;
    }

    function displayMessage(msg, type = '') {
        messageDisplay.textContent = msg;
        messageDisplay.className = `message ${type}`;
    }

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function spinReel(reelElement) {
        // Temporarily add a series of symbols to simulate spinning
        reelElement.innerHTML = ''; // Clear current symbol
        for (let i = 0; i < 15; i++) { // Show multiple symbols quickly
            const span = document.createElement('span');
            span.textContent = getRandomSymbol();
            reelElement.appendChild(span);
        }
        reelElement.classList.add('spinning');
    }

    function stopReel(reelElement, finalSymbol) {
        reelElement.classList.remove('spinning');
        reelElement.innerHTML = `<span>${finalSymbol}</span>`; // Display final symbol
    }

    spinButton.addEventListener('click', () => {
        if (isSpinning || tokens < spinCost) {
            displayMessage("Insufficient compute credits or already spinning.", 'lose');
            return;
        }

        isSpinning = true;
        tokens -= spinCost;
        updateUI();
        displayMessage("Model compiling...", '');

        const finalSymbols = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

        spinReel(reel1);
        spinReel(reel2);
        spinReel(reel3);

        setTimeout(() => stopReel(reel1, finalSymbols[0]), 1000); // Stop after 1 second
        setTimeout(() => stopReel(reel2, finalSymbols[1]), 1500); // Stop after 1.5 seconds
        setTimeout(() => stopReel(reel3, finalSymbols[2]), 2000); // Stop after 2 seconds

        setTimeout(() => {
            isSpinning = false;
            checkWin(finalSymbols);
            updateUI();
        }, 2200); // Allow a slight delay after last reel stops before checking win
    });

    function checkWin(finalSymbols) {
        const result = finalSymbols.join('');
        let winAmount = 0;
        let message = "";
        let messageType = 'lose';

        if (finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2]) {
            // Three of a kind
            winAmount = payouts[result];
            if (winAmount) {
                tokens += winAmount;
                message = `Synergistic alignment achieved! You won ${winAmount} compute credits!`;
                messageType = 'win';
            } else {
                // This case should ideally not happen if all combinations are in payouts
                message = "A rare anomaly detected! No specific payout.";
            }
        } else {
            message = "Model failed to converge. Try again!";
            messageType = 'lose';
        }
        displayMessage(message, messageType);
    }

    // Initial setup
    updateUI();
    displayMessage("Ready to tokenize? Spin the AGI Slots!", '');
    reel1.innerHTML = `<span>${getRandomSymbol()}</span>`;
    reel2.innerHTML = `<span>${getRandomSymbol()}</span>`;
    reel3.innerHTML = `<span>${getRandomSymbol()}</span>`;
});
