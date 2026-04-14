document.addEventListener('DOMContentLoaded', () => {
    const tokenCountElement = document.getElementById('token-count');
    const spinButton = document.getElementById('spin-button');
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
    const messageElement = document.getElementById('message');

    const symbols = ['🤖', '🧠', '💡', '🔥', '論文', 'CLIP'];
    const spinCost = 5;
    const winnings = {
        '🤖🤖🤖': 100,
        '🧠🧠🧠': 50,
        '💡💡💡': 25,
        '🔥🔥🔥': 15,
        '論文論文論文': 10,
        'CLIPCLIPCLIP': 5,
    };

    let tokenCount = 100;

    spinButton.addEventListener('click', () => {
        if (tokenCount < spinCost) {
            messageElement.textContent = 'Not enough tokens!';
            return;
        }

        tokenCount -= spinCost;
        updateTokenCount();
        messageElement.textContent = '';
        spinButton.disabled = true;

        let spinIntervals = [];
        reels.forEach((reel, index) => {
            spinIntervals[index] = setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }, 100);
        });

        setTimeout(() => {
            spinIntervals.forEach(interval => clearInterval(interval));
            const finalSymbols = reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
            reels.forEach((reel, index) => reel.textContent = finalSymbols[index]);
            checkWinnings(finalSymbols);
            spinButton.disabled = false;
        }, 3000);
    });

    function updateTokenCount() {
        tokenCountElement.textContent = tokenCount;
    }

    function checkWinnings(finalSymbols) {
        const key = finalSymbols.join('');
        if (winnings[key]) {
            tokenCount += winnings[key];
            updateTokenCount();
            messageElement.textContent = `You won ${winnings[key]} tokens!`;
            messageElement.style.color = 'green';
        } else if (finalSymbols[0] === finalSymbols[1] || finalSymbols[1] === finalSymbols[2]) {
            const twoOfAKindWin = 2;
            tokenCount += twoOfAKindWin;
            updateTokenCount();
            messageElement.textContent = `Two of a kind! You won ${twoOfAKindWin} tokens.`;
            messageElement.style.color = 'orange';
        }
        else {
            messageElement.textContent = 'Try again!';
            messageElement.style.color = '#d93025';
        }
    }
});
