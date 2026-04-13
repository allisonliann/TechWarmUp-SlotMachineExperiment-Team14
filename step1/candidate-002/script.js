document.addEventListener('DOMContentLoaded', () => {
    const symbols = ["🤖", "🧠", "🔗", "🔥", "📉", "🚀", "📜", "⭐"];
    const reels = [
        document.querySelector('#slot1 .reel'),
        document.querySelector('#slot2 .reel'),
        document.querySelector('#slot3 .reel')
    ];

    let balance = 1000;
    let betAmount = 10;
    let spinning = false;

    const balanceDisplay = document.getElementById('balance');
    const betAmountDisplay = document.getElementById('bet-amount');
    const messageDisplay = document.getElementById('message');
    const spinButton = document.getElementById('spin-button');
    const increaseBetButton = document.getElementById('increase-bet');
    const decreaseBetButton = document.getElementById('decrease-bet');

    function updateDisplays() {
        balanceDisplay.textContent = balance;
        betAmountDisplay.textContent = betAmount;
    }

    function populateReels() {
        reels.forEach(reel => {
            reel.innerHTML = '';
            const fragment = document.createDocumentFragment();
            // Shuffle symbols for each reel to make it look more random
            const shuffledSymbols = [...symbols].sort(() => Math.random() - 0.5);
            for (let i = 0; i < symbols.length * 3; i++) { // Repeat symbols for seamless looping
                const symbolDiv = document.createElement('div');
                symbolDiv.textContent = shuffledSymbols[i % shuffledSymbols.length];
                fragment.appendChild(symbolDiv);
            }
            reel.appendChild(fragment);
        });
    }

    function spin() {
        if (spinning || balance < betAmount) {
            return;
        }

        spinning = true;
        spinButton.disabled = true;
        messageDisplay.textContent = "Spinning...";

        balance -= betAmount;
        updateDisplays();

        let results = [];
        let spinCount = 0;

        reels.forEach((reel, index) => {
            const spinDuration = 2000 + index * 500; // Staggered stop
            const targetSymbolIndex = Math.floor(Math.random() * symbols.length);
            const targetPosition = -(targetSymbolIndex * 100 + symbols.length * 100); // Loop at least once

            reel.style.transition = `top ${spinDuration / 1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
            reel.style.top = `${targetPosition}px`;

            results[index] = symbols[targetSymbolIndex];

            setTimeout(() => {
                reel.style.transition = 'none';
                reel.style.top = `-${targetSymbolIndex * 100}px`;

                spinCount++;
                if (spinCount === reels.length) {
                    checkWin(results);
                }
            }, spinDuration);
        });
    }

    function checkWin(results) {
        const [s1, s2, s3] = results;
        let winAmount = 0;
        let winMessage = "Try again!";

        if (s1 === s2 && s2 === s3) {
            winAmount = getWinnings(s1) * betAmount;
            winMessage = `Triple ${s1}! You win ${winAmount} tokens!`;
        } else if (s1 === s2 || s2 === s3) {
            const doubleSymbol = s1 === s2 ? s1 : s2;
            winAmount = getWinnings(doubleSymbol) * Math.floor(betAmount / 2);
            winMessage = `Double ${doubleSymbol}! You win ${winAmount} tokens!`;
        }

        if (winAmount > 0) {
            balance += winAmount;
            messageDisplay.textContent = winMessage;
        } else {
            messageDisplay.textContent = "No luck this time. More tokens for the AI!";
        }

        updateDisplays();
        spinning = false;
        spinButton.disabled = balance < betAmount;
        
        if (balance < betAmount && balance > 0) {
            betAmount = balance;
            updateDisplays();
        } else if (balance === 0) {
            messageDisplay.textContent = "You're out of tokens! The AI overlords win.";
        }
    }

    function getWinnings(symbol) {
        switch (symbol) {
            case "🔥": return 50; // AGI
            case "⭐": return 40; // Alignment
            case "🚀": return 30; // To the moon
            case "🤖": return 20; // Robot
            case "🧠": return 15; // Brain
            case "🔗": return 10; // Chain
            case "📜": return 5;  // Paper
            case "📉": return 2;  // Not near
            default: return 0;
        }
    }

    increaseBetButton.addEventListener('click', () => {
        if (betAmount + 10 <= balance) {
            betAmount += 10;
            updateDisplays();
        }
    });

    decreaseBetButton.addEventListener('click', () => {
        if (betAmount - 10 > 0) {
            betAmount -= 10;
            updateDisplays();
        }
    });

    spinButton.addEventListener('click', spin);

    // Initial Setup
    populateReels();
    updateDisplays();
});
