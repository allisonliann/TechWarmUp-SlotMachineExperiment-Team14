const symbols = ["🤖", "🧠", "⚡️", "🔥", "💯"];

const spinButton = document.getElementById("spin-button");
const betInput = document.getElementById("bet-input");
const tokenBalance = document.getElementById("token-balance");
const reels = document.querySelectorAll(".reel");

let tokens = 1000;

spinButton.addEventListener("click", () => {
    const bet = parseInt(betInput.value);
    if (tokens >= bet) {
        tokens -= bet;
        updateTokenBalance();
        spinReels(bet);
    } else {
        alert("Not enough tokens!");
    }
});

function updateTokenBalance() {
    tokenBalance.textContent = tokens;
}

function spinReels(bet) {
    const results = [];
    for (let i = 0; i < reels.length; i++) {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        results.push(symbols[randomIndex]);
        reels[i].textContent = symbols[randomIndex];
    }
    calculateWinnings(results, bet);
}

function calculateWinnings(results, bet) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const winAmount = bet * 10;
        tokens += winAmount;
        updateTokenBalance();
        alert(`You won ${winAmount} tokens!`);
    }
}
