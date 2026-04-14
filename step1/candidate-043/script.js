const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const spinButton = document.getElementById('spin-button');
const tokenCountSpan = document.getElementById('token-count');
const message = document.getElementById('message');

const symbols = ['🤖', '🧠', '🪙', '🤔', '😂'];
const spinCost = 5;
let tokenCount = 100;

spinButton.addEventListener('click', () => {
    if (tokenCount < spinCost) {
        message.textContent = "Not enough tokens!";
        return;
    }

    tokenCount -= spinCost;
    tokenCountSpan.textContent = tokenCount;
    message.textContent = "";

    spin();
});

function spin() {
    const reels = [reel1, reel2, reel3];
    reels.forEach(reel => reel.classList.add('spinning'));

    setTimeout(() => {
        reels.forEach(reel => reel.classList.remove('spinning'));

        const results = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        reel1.textContent = results[0];
        reel2.textContent = results[1];
        reel3.textContent = results[2];

        checkWin(results);
    }, 1000);
}

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const winAmount = getWinAmount(results[0]);
        tokenCount += winAmount;
        tokenCountSpan.textContent = tokenCount;
        message.textContent = `You won ${winAmount} tokens!`;
    }
}

function getWinAmount(symbol) {
    switch (symbol) {
        case '🤖':
            return 50;
        case '🧠':
            return 40;
        case '🪙':
            return 30;
        case '🤔':
            return 20;
        case '😂':
            return 10;
        default:
            return 0;
    }
}
