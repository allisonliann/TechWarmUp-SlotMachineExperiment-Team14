document.addEventListener('DOMContentLoaded', () => {
    const tokenBalanceElement = document.getElementById('token-balance');
    const spinButton = document.getElementById('spin-button');
    const messageElement = document.getElementById('message');
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    const symbols = [
        { symbol: '💎', value: 'AGI', payout: 100 },
        { symbol: '🚀', value: 'Singularity', payout: 50 },
        { symbol: '🧠', value: 'Model', payout: 20 },
        { symbol: '💡', value: 'Prompt', payout: 10 },
        { symbol: '📉', value: 'Deprecation', payout: 0 }
    ];

    const spinCost = 5;
    let tokenBalance = 100;
    let isSpinning = false;

    // Initialize reels
    reels.forEach(reel => {
        reel.innerHTML = `<div class="symbol">${symbols[3].symbol}</div>`;
    });

    function updateTokenBalance(amount) {
        tokenBalance = amount;
        tokenBalanceElement.textContent = tokenBalance;
    }

    function showMessage(text, isWin = false) {
        messageElement.textContent = text;
        messageElement.style.color = isWin ? 'var(--win-color)' : 'var(--lose-color)';
    }

    function spin() {
        if (isSpinning) return;
        if (tokenBalance < spinCost) {
            showMessage("Not enough tokens to spin!");
            return;
        }

        isSpinning = true;
        spinButton.disabled = true;
        showMessage('Spinning...');
        updateTokenBalance(tokenBalance - spinCost);

        let finalResults = [];

        reels.forEach((reel, index) => {
            // Clone symbols to create a long strip for animation
            const symbolStrip = [...symbols, ...symbols, ...symbols];
            reel.innerHTML = ''; // Clear previous symbols
            symbolStrip.forEach(s => {
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = s.symbol;
                reel.appendChild(div);
            });
            
            // Reset transform
            reel.style.transition = 'none';
            reel.style.transform = 'translateY(0)';

            const randomSymbolIndex = Math.floor(Math.random() * symbols.length);
            finalResults.push(symbols[randomSymbolIndex]);
            
            // Calculate the final position
            const targetPosition = -((symbols.length * 2) + randomSymbolIndex) * 150; // 150 is symbol height

            setTimeout(() => {
                reel.style.transition = `transform ${2.5 + index * 0.5}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
                reel.style.transform = `translateY(${targetPosition}px)`;
            }, 100);
        });
        
        // Wait for the last reel to stop
        setTimeout(() => {
            checkWin(finalResults);
            isSpinning = false;
            spinButton.disabled = false;
        }, 3500);
    }

    function checkWin(results) {
        const [r1, r2, r3] = results;

        if (r1.symbol === r2.symbol && r2.symbol === r3.symbol) {
            const payout = r1.payout;
            if (payout > 0) {
                showMessage(`Jackpot! You won ${payout} tokens!`, true);
                updateTokenBalance(tokenBalance + payout);
            } else {
                showMessage('Three of a kind, but it's worthless!', false);
            }
        } else if (r1.symbol === r2.symbol || r2.symbol === r3.symbol) {
            const pairSymbol = r1.symbol === r2.symbol ? r1 : r2;
            const payout = Math.ceil(pairSymbol.payout / 4);
            if (payout > 0) {
                showMessage(`Pair! You won ${payout} tokens.`, true);
                updateTokenBalance(tokenBalance + payout);
            } else {
                showMessage('A pair of nothing is still nothing.', false);
            }
        } 
        else {
            showMessage('Try again!', false);
        }

        if (tokenBalance < spinCost) {
            spinButton.disabled = true;
            showMessage("You're out of tokens! Refresh to restart.", false);
        }
    }

    spinButton.addEventListener('click', spin);
});
