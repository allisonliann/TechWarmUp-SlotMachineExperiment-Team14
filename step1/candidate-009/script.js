const symbols = ['🤖', '🧠', '⚡️', '💡', '🔥', '💻', '📈'];
const spinButton = document.getElementById('spin-button');
const tokenCountSpan = document.getElementById('token-count');
const reels = document.querySelectorAll('.reel');

let tokenCount = 100;

function spin() {
    if (tokenCount <= 0) {
        alert("You're out of tokens! Refresh to play again.");
        return;
    }

    tokenCount--;
    updateTokenCount();
    spinButton.disabled = true;

    let spins = 0;
    const maxSpins = 30;
    const spinInterval = setInterval(() => {
        spins++;
        reels.forEach(reel => {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            reel.textContent = symbols[randomIndex];
        });

        if (spins >= maxSpins) {
            clearInterval(spinInterval);
            checkWin();
            spinButton.disabled = false;
        }
    }, 100);
}

function checkWin() {
    const reel1Symbol = reels[0].textContent;
    const reel2Symbol = reels[1].textContent;
    const reel3Symbol = reels[2].textContent;

    if (reel1Symbol === reel2Symbol && reel2Symbol === reel3Symbol) {
        tokenCount += 50;
        alert("You won 50 tokens!");
    } else if (reel1Symbol === reel2Symbol || reel2Symbol === reel3Symbol) {
        tokenCount += 5;
        alert("You won 5 tokens!");
    }
    updateTokenCount();
}

function updateTokenCount() {
    tokenCountSpan.textContent = tokenCount;
}

spinButton.addEventListener('click', spin);
