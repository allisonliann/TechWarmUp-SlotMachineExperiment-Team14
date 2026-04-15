document.addEventListener('DOMContentLoaded', () => {
    const tokensDisplay = document.getElementById('tokens');
    const messageDisplay = document.getElementById('message');
    const spinButton = document.getElementById('spinButton');
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    // AI-themed symbols
    const symbols = ['🧠', '💻', '💾', '💬', '🐛', '👻']; // Model, GPU, Data, Prompt, Bug, Hallucination

    // Game state
    let tokens = 100;
    const spinCost = 5;

    // Win conditions and payouts
    const winConditions = {
        '🧠': { payout: 50, message: "AI Model trained! Massive compute units earned!" },
        '💻': { payout: 20, message: "GPU cluster online! You're accelerating!" },
        '💾': { payout: 15, message: "Data pipeline optimized! Good data, good life!" },
        '💬': { payout: 10, message: "Prompt engineered perfectly! AI understood!" },
        '🐛': { payout: 5, message: "Bug fixed! AI appreciates your debugging skills!" },
        '👻': { payout: -10, message: "Hallucination detected! AI is confused, you lose units!" } // Special loss condition
    };

    // Initialize game
    function initGame() {
        updateTokensDisplay();
        updateMessage("Welcome, human! Try your luck.");
        spinButton.disabled = false;
    }

    // Update tokens display
    function updateTokensDisplay() {
        tokensDisplay.textContent = tokens;
        if (tokens <= 0) {
            spinButton.disabled = true;
            updateMessage("Out of compute units! AI has shut down. Refresh to restart.", 'lose');
        } else {
            spinButton.disabled = false;
        }
    }

    // Update message display with optional class for styling
    function updateMessage(msg, type = 'info') {
        messageDisplay.textContent = msg;
        messageDisplay.className = `message ${type}`; // Apply class for styling (win, lose, info)
    }

    // Spin the reels
    function spinReels() {
        if (tokens < spinCost) {
            updateMessage("Insufficient compute units! AI refuses to process.", 'lose');
            spinButton.disabled = true;
            return;
        }

        tokens -= spinCost;
        updateTokensDisplay();
        updateMessage("AI is processing your request...", 'info');
        spinButton.disabled = true; // Disable button during spin

        const results = [];
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            // Simulate spinning by rapidly changing symbols
            reels.forEach((reel, index) => {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                reel.textContent = randomSymbol;
                reel.classList.add('spinning'); // Add spinning animation class
            });

            spinCount++;
            if (spinCount > 15) { // Spin for a bit before settling
                clearInterval(spinInterval);
                settleReels(results);
            }
        }, 100); // Faster interval for visual spin effect
    }

    // Settle reels and determine outcome
    function settleReels(results) {
        reels.forEach((reel, index) => {
            reel.classList.remove('spinning'); // Remove spinning animation class
            const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.textContent = finalSymbol;
            results.push(finalSymbol);
        });

        setTimeout(() => { // Give a slight delay for the last reel to settle visually
            checkWin(results);
            updateTokensDisplay();
            spinButton.disabled = false; // Re-enable button after outcome
        }, 500);
    }

    // Check for winning combinations
    function checkWin(results) {
        const [s1, s2, s3] = results;

        if (s1 === s2 && s2 === s3) {
            // All three symbols match
            const winInfo = winConditions[s1];
            if (winInfo) {
                tokens += winInfo.payout;
                updateMessage(`${winInfo.message} You won ${winInfo.payout} units!`, winInfo.payout > 0 ? 'win' : 'lose');
            } else {
                // Fallback for unknown symbol (shouldn't happen with current setup)
                updateMessage("AI is confused. Unknown win condition.", 'info');
            }
        } else {
            // No match
            updateMessage("AI couldn't find a pattern. No win this time.", 'lose');
        }
    }

    // Event listener for the spin button
    spinButton.addEventListener('click', spinReels);

    // Initialize the game when the script loads
    initGame();
});

