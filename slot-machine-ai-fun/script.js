document.addEventListener('DOMContentLoaded', () => {
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
    const spinButton = document.getElementById('spinButton');
    const tokensDisplay = document.getElementById('tokens');
    const messageDisplay = document.getElementById('message');
    const resetButton = document.getElementById('resetButton');

    let tokens = 100;
    const SPIN_COST = 10;

    // AI-themed symbols with their weights for probability and potential payouts
    const symbols = [
        { name: '🐛 Bug', weight: 4, payout: -20, message: "A wild bug appeared! You lose tokens." },
        { name: '🤖 Robot', weight: 3, payout: 10, message: "Robot Uprising! You gain some tokens." },
        { name: '💻 Code', weight: 3, payout: 10, message: "Clean code, clean win!" },
        { name: '☁️ Cloud', weight: 2, payout: 20, message: "Cloud computing payout!" },
        { name: '💾 Data', weight: 2, payout: 20, message: "Big Data, Big Win!" },
        { name: '🧠 Algo', weight: 1, payout: 50, message: "Algorithm Optimized! Huge payout!" },
        { name: '♊ Gemini', weight: 1, payout: 100, message: "Gemini's insight grants you a jackpot!" }
    ];

    function updateDisplay() {
        tokensDisplay.textContent = tokens;
        spinButton.disabled = tokens < SPIN_COST;
        if (tokens < SPIN_COST) {
            messageDisplay.textContent = "Out of AI Tokens! Game Over.";
            resetButton.style.display = 'block';
        } else {
            resetButton.style.display = 'none';
        }
    }

    function getRandomSymbol() {
        let totalWeight = symbols.reduce((sum, symbol) => sum + symbol.weight, 0);
        let randomNum = Math.random() * totalWeight;

        for (const symbol of symbols) {
            if (randomNum < symbol.weight) {
                return symbol;
            }
            randomNum -= symbol.weight;
        }
        return symbols[0]; // Fallback
    }

    async function spinReel(reelElement) {
        return new Promise(resolve => {
            reelElement.classList.add('spinning');
            // Temporarily fill with random symbols to make it look like spinning
            const spinInterval = setInterval(() => {
                reelElement.textContent = getRandomSymbol().name;
            }, 50); // Faster update for visual spin

            setTimeout(() => {
                clearInterval(spinInterval);
                reelElement.classList.remove('spinning');
                resolve();
            }, 1500 + Math.random() * 500); // Randomize spin duration slightly
        });
    }

    async function spin() {
        if (tokens < SPIN_COST) {
            messageDisplay.textContent = "Not enough tokens to spin!";
            return;
        }

        tokens -= SPIN_COST;
        updateDisplay();
        messageDisplay.textContent = "AI Algorithm is thinking...";
        spinButton.disabled = true;

        const results = [];
        const spinPromises = reels.map(reel => {
            return spinReel(reel).then(() => {
                const finalSymbol = getRandomSymbol();
                reel.textContent = finalSymbol.name;
                results.push(finalSymbol);
            });
        });

        await Promise.all(spinPromises);

        spinButton.disabled = false;
        checkResult(results);
    }

    function checkResult(results) {
        const [s1, s2, s3] = results;
        let outcomeMessage = "No significant insight this spin. Try again!";
        let payout = 0;

        // Winning conditions
        if (s1.name === s2.name && s2.name === s3.name) {
            // Three of a kind
            payout = s1.payout * 3; // Triple payout for three of a kind
            outcomeMessage = s1.message + ` (+${payout} tokens)`;
        } else if (s1.name === s2.name || s2.name === s3.name || s1.name === s3.name) {
            // Two of a kind (any two)
            const commonSymbol = s1.name === s2.name ? s1 : (s2.name === s3.name ? s2 : s3);
            payout = commonSymbol.payout;
            outcomeMessage = commonSymbol.message + ` (+${payout} tokens)`;
        } else {
            // No match, apply a small negative payout from a 'bug' or 'minor algorithm failure'
            payout = symbols.find(s => s.name === '🐛 Bug').payout / 2; // Half bug penalty for no match
            outcomeMessage = "The AI encountered an unforeseen edge case. No win, slight token loss.";
        }

        tokens += payout;
        messageDisplay.textContent = outcomeMessage;
        updateDisplay();
    }

    function resetGame() {
        tokens = 100;
        messageDisplay.textContent = "Game reset! Start spinning.";
        updateDisplay();
    }

    // Initial setup
    updateDisplay();
    spinButton.addEventListener('click', spin);
    resetButton.addEventListener('click', resetGame);
});
