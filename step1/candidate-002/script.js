document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🧠', '🤖', '☁️', '💾', '📉', '⚡', '🔍'];
    let balance = 1000;
    const costPerSpin = 100;

    const balanceDisplay = document.getElementById('balance');
    const reelElements = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
    const statusMessage = document.getElementById('status-message');
    const spinButton = document.getElementById('spin-button');

    const updateBalance = (amount) => {
        balance += amount;
        balanceDisplay.textContent = balance;
        if (balance < costPerSpin) {
            spinButton.disabled = true;
            statusMessage.textContent = 'CRITICAL ERROR: Insufficient tokens for next prompt. Context window exceeded.';
            statusMessage.classList.add('loss-animation');
        }
    };

    const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

    const spin = async () => {
        if (balance < costPerSpin) return;

        // Reset state
        updateBalance(-costPerSpin);
        spinButton.disabled = true;
        statusMessage.textContent = 'Requesting inference from cluster...';
        statusMessage.classList.remove('win-animation', 'loss-animation');

        // Animation
        const spinDuration = 1500;
        const intervalTime = 100;
        const iterations = spinDuration / intervalTime;

        reelElements.forEach(reel => reel.classList.add('spinning'));

        for (let i = 0; i < iterations; i++) {
            reelElements.forEach(reel => {
                reel.textContent = getRandomSymbol();
            });
            await new Promise(resolve => setTimeout(resolve, intervalTime));
        }

        reelElements.forEach(reel => reel.classList.remove('spinning'));

        // Final results
        const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        reelElements.forEach((reel, index) => {
            reel.textContent = results[index];
        });

        checkWin(results);
    };

    const checkWin = (results) => {
        const uniqueSymbols = new Set(results).size;

        if (uniqueSymbols === 1) {
            // 3 matching
            const winAmount = 1000;
            updateBalance(winAmount);
            statusMessage.textContent = `SUCCESS: Model Alignment Achieved! Jackpot: +${winAmount} tokens.`;
            statusMessage.classList.add('win-animation');
        } else if (uniqueSymbols === 2) {
            // 2 matching
            const winAmount = 200;
            updateBalance(winAmount);
            statusMessage.textContent = `NOTICE: Partial match detected. Synthetic data generated: +${winAmount} tokens.`;
            statusMessage.classList.add('win-animation');
        } else {
            // 0 matching
            statusMessage.textContent = 'FAILURE: Hallucination detected. Prompt rejected by safety filters. 0 tokens returned.';
            statusMessage.classList.add('loss-animation');
        }

        if (balance >= costPerSpin) {
            spinButton.disabled = false;
        }
    };

    spinButton.addEventListener('click', spin);
});
