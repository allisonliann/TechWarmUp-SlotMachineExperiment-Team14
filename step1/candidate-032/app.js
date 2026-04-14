document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spinButton');
    const tokenCountDisplay = document.getElementById('tokenCount');
    const winningsDisplay = document.getElementById('winnings');

    const symbols = ['🤖', '🧠', '🔥', '🔑', '💡', '🚀'];
    const spinCost = 5;
    const payouts = {
        '🤖': 50,
        '🧠': 40,
        '🔥': 30,
        '🔑': 20,
        '💡': 15,
        '🚀': 10,
    };

    let playerTokens = 100;
    let isSpinning = false;

    function init() {
        updateUI();
        spinButton.addEventListener('click', spin);
        // Set initial symbols
        reels.forEach(reel => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        });
    }

    function spin() {
        if (isSpinning || playerTokens < spinCost) {
            return;
        }

        isSpinning = true;
        playerTokens -= spinCost;
        updateUI();
        winningsDisplay.textContent = '';
        spinButton.disabled = true;

        let spinDuration = 1000; // Total spin time in ms
        const spinInterval = 100; // Interval for changing symbols

        reels.forEach((reel, index) => {
            const startTime = Date.now();
            const reelSpin = setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }, spinInterval);

            setTimeout(() => {
                clearInterval(reelSpin);
                // Set final symbol
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];

                // If it's the last reel, calculate winnings
                if (index === reels.length - 1) {
                    calculateWinnings();
                    isSpinning = false;
                    spinButton.disabled = false;
                }
            }, spinDuration + (index * 500)); // Stagger the stop time
        });
    }

    function calculateWinnings() {
        const finalSymbols = Array.from(reels).map(reel => reel.textContent);
        const [s1, s2, s3] = finalSymbols;

        let winAmount = 0;
        let winMessage = '';

        if (s1 === s2 && s2 === s3) {
            winAmount = payouts[s1];
            winMessage = `You won ${winAmount} tokens!`;
        } else if (s1 === s2 || s2 === s3) {
            const matchingSymbol = s1 === s2 ? s1 : s2;
            winAmount = Math.floor(payouts[matchingSymbol] / 5);
            winMessage = `You won ${winAmount} tokens!`;
        }


        if (winAmount > 0) {
            playerTokens += winAmount;
            winningsDisplay.textContent = winMessage;
            updateUI();
        }
    }

    function updateUI() {
        tokenCountDisplay.textContent = playerTokens;
        if (playerTokens < spinCost) {
            spinButton.disabled = true;
        }
    }

    init();
});
