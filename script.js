document.addEventListener('DOMContentLoaded', () => {
    const tokensDisplay = document.getElementById('tokens');
    const betAmountDisplay = document.getElementById('bet-amount');
    const spinButton = document.getElementById('spin-button');
    const betDecreaseButton = document.getElementById('bet-decrease');
    const betIncreaseButton = document.getElementById('bet-increase');
    const gameMessage = document.getElementById('game-message');
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    let tokens = 100;
    let betAmount = 10;
    const minBet = 5;
    const maxBet = 50;
    const symbols = [
        { char: '🤖', name: 'Robot', value: 10 },
        { char: '🧠', name: 'Brain', value: 10 },
        { char: '💾', name: 'Disk', value: 10 },
        { char: '💻', name: 'Computer', value: 10 },
        { char: '💡', name: 'Idea', value: 15 },
        { char: '⚡', name: 'Power', value: 15 },
        { char: '📊', name: 'Data', value: 20 },
        { char: '⚙️', name: 'Gear', value: 20 },
        { char: '✨', name: 'Innovation', value: 25 }
    ]; // AI-themed symbols

    // Initialize display
    updateDisplay();
    initializeReels();

    function updateDisplay() {
        tokensDisplay.textContent = tokens;
        betAmountDisplay.textContent = betAmount;
    }

    function getSymbolChar(symbol) {
        return symbol.char;
    }

    function initializeReels() {
        reels.forEach(reel => {
            reel.textContent = getSymbolChar(symbols[Math.floor(Math.random() * symbols.length)]);
        });
    }

    function showMessage(message, isError = false) {
        gameMessage.textContent = message;
        gameMessage.style.color = isError ? '#dc3545' : '#28a745';
    }

    async function spin() {
        if (tokens < betAmount) {
            showMessage("Insufficient AI Tokens for this bet!", true);
            return;
        }

        tokens -= betAmount;
        updateDisplay();
        spinButton.disabled = true;
        betDecreaseButton.disabled = true;
        betIncreaseButton.disabled = true;
        showMessage("AI is thinking... processing your request!");

        const finalSymbols = [];
        const spinDuration = 2000; // Total spin duration in ms for all reels
        const reelStopDelay = 500; // Delay between each reel stopping

        const spinPromises = reels.map((reel, index) => {
            return new Promise(async resolve => {
                // Add spinning class and dynamic content for CSS animation
                reel.classList.add('spinning');
                let spinContent = '';
                for (let i = 0; i < 30; i++) { // Generate enough random symbols for the animation
                    spinContent += getSymbolChar(symbols[Math.floor(Math.random() * symbols.length)]);
                }
                reel.setAttribute('data-spin-content', spinContent);
                reel.innerHTML = ''; // Clear current symbol to show animation

                // Stagger reel stops
                await new Promise(r => setTimeout(r, index * reelStopDelay));

                // Stop reel and set final symbol
                setTimeout(() => {
                    reel.classList.remove('spinning');
                    const chosenSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                    reel.textContent = getSymbolChar(chosenSymbol); // Set the final symbol
                    finalSymbols[index] = chosenSymbol;
                    resolve();
                }, spinDuration);
            });
        });

        await Promise.all(spinPromises);

        // Ensure all final symbols are set before determining win/loss
        // This loop helps if Promise.all resolves faster than individual reel timeouts
        await new Promise(r => setTimeout(r, spinDuration + reels.length * reelStopDelay + 100)); // Ensure all reels have truly settled

        // Determine win/loss after all reels have stopped and finalSymbols are set
        let winAmount = 0;
        const s1 = finalSymbols[0];
        const s2 = finalSymbols[1];
        const s3 = finalSymbols[2];

        if (s1.char === s2.char && s2.char === s3.char) {
            // Triple match
            if (s1.char === '✨') { // Special jackpot for Innovation
                winAmount = betAmount * 50;
                showMessage(`🌟✨🌟 AGI Jackpot! Triple Innovation! You won ${winAmount} AI Tokens!`);
            } else {
                winAmount = betAmount * (s1.value / 5); // General triple match, base on symbol value
                showMessage(`🎉 Triple ${s1.name}! You won ${winAmount} AI Tokens!`);
            }
        } else if (s1.char === s2.char || s2.char === s3.char || s1.char === s3.char) {
            // Double match
            let matchedSymbol;
            if (s1.char === s2.char) matchedSymbol = s1;
            else if (s2.char === s3.char) matchedSymbol = s2;
            else matchedSymbol = s3;

            winAmount = betAmount * (matchedSymbol.value / 10); // Double match, base on symbol value
            showMessage(`🥳 Double ${matchedSymbol.name}! You won ${winAmount} AI Tokens!`);
        } else {
            showMessage("AI needs more data... no win this time.");
        }

        tokens += winAmount;
        updateDisplay();

        spinButton.disabled = false;
        betDecreaseButton.disabled = false;
        betIncreaseButton.disabled = false;
    }

    function adjustBet(change) {
        const newBet = betAmount + change;
        if (newBet >= minBet && newBet <= maxBet) {
            betAmount = newBet;
            updateDisplay();
            showMessage(`Bet adjusted to ${betAmount} AI Tokens.`);
        } else if (newBet < minBet) {
            showMessage(`Minimum bet is ${minBet} AI Tokens.`, true);
        } else {
            showMessage(`Maximum bet is ${maxBet} AI Tokens.`, true);
        }
    }

    // Event Listeners
    spinButton.addEventListener('click', spin);
    betDecreaseButton.addEventListener('click', () => adjustBet(-5));
    betIncreaseButton.addEventListener('click', () => adjustBet(5));
});
