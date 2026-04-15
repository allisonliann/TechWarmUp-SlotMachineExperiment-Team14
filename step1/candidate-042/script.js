document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const tokenCountSpan = document.getElementById('token-count');
    const messageP = document.getElementById('message');

    let tokens = 100;
    const spinCost = 10;
    let isSpinning = false;
    let reelPositions = [0, 0, 0];

    const symbols = ['Synergy', 'Blockchain', 'LLM', 'AGI', 'Cloud', 'Big Data', 'De-risk'];
    const payouts = {
        'AGI': 100,
        'LLM': 50,
        'Blockchain': 30,
        'Synergy': 20,
        'Cloud': 20,
        'Big Data': 20,
        'De-risk': 20
    };

    function createSymbolElement(symbol) {
        const div = document.createElement('div');
        div.classList.add('symbol');
        div.textContent = symbol;
        return div;
    }
    
    function setupReels() {
        reels.forEach(reel => {
            reel.innerHTML = ''; // Clear existing symbols
            const symbolContainer = document.createElement('div');
            symbolContainer.classList.add('symbol-container');
            
            // Create a long strip of symbols for animation
            const symbolPool = [...symbols];
            for (let i = 0; i < 30; i++) {
                symbolPool.push(...symbols.sort(() => Math.random() - 0.5));
            }

            symbolPool.forEach(symbol => {
                symbolContainer.appendChild(createSymbolElement(symbol));
            });
            reel.appendChild(symbolContainer);
        });
    }

    async function spin() {
        if (isSpinning) return;
        if (tokens < spinCost) {
            messageP.textContent = 'Insufficient Tokens!';
            return;
        }

        isSpinning = true;
        tokens -= spinCost;
        updateTokenCount();
        messageP.textContent = '';
        spinButton.disabled = true;

        const results = [];
        const spinAnimations = [];

        reels.forEach((reel, index) => {
            const symbolContainer = reel.querySelector('.symbol-container');
            const symbolHeight = symbolContainer.querySelector('.symbol').clientHeight;
            const symbolCount = symbolContainer.childElementCount;

            const oldPosition = reelPositions[index];
            // Spin at least 3 full revolutions, then find a random stop
            const fullRevolutions = 3 * symbolCount * symbolHeight;
            const randomOffset = Math.floor(Math.random() * (symbolCount - 5)) + 2;
            const newPosition = oldPosition - fullRevolutions - (randomOffset * symbolHeight);
            
            // The actual symbol is based on the final position modulo the strip length
            const actualPosition = Math.abs(newPosition / symbolHeight);
            const resultIndex = Math.floor(actualPosition) % symbolCount;
            results.push(symbolContainer.children[resultIndex].textContent);
            
            reelPositions[index] = newPosition;

            const animation = symbolContainer.animate([
                { transform: `translateY(${oldPosition}px)` },
                { transform: `translateY(${newPosition}px)` }
            ], {
                duration: 2500 + (index * 600), // Stagger reel stops
                easing: 'cubic-bezier(0.33, 1, 0.68, 1)', // Ease-out
                fill: 'forwards'
            });
            spinAnimations.push(animation.finished);
        });

        await Promise.all(spinAnimations);

        checkWin(results);
        isSpinning = false;
        spinButton.disabled = false;
    }

    function checkWin(results) {
        const [r1, r2, r3] = results;
        if (r1 === r2 && r2 === r3) {
            const payout = payouts[r1];
            tokens += payout;
            updateTokenCount();
            messageP.textContent = `Paradigm Shift! +${payout} Tokens for three ${r1}s!`;
        } else {
            messageP.textContent = 'Disruptively Unsuccessful. Try Again.';
        }
    }

    function updateTokenCount() {
        tokenCountSpan.textContent = tokens;
    }

    spinButton.addEventListener('click', spin);

    // Initial setup
    setupReels();
    updateTokenCount();
});