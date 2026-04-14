const symbols = ["🤖", "🧠", "⚡️", "👍", "👎"];
const spinButton = document.getElementById("spinButton");
const tokenCount = document.getElementById("tokenCount");
const reels = document.querySelectorAll(".reel");

spinButton.addEventListener("click", () => {
    let tokens = parseInt(tokenCount.textContent);
    if (tokens > 0) {
        tokens--;
        tokenCount.textContent = tokens;
        spin();
    }
});

function spin() {
    reels.forEach(reel => {
        const interval = setInterval(() => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        }, 1000);
    });

    setTimeout(calculateWinnings, 1100);
}

function calculateWinnings() {
    const reelSymbols = Array.from(reels).map(reel => reel.textContent);
    let winnings = 0;
    if (reelSymbols[0] === reelSymbols[1] && reelSymbols[1] === reelSymbols[2]) {
        winnings = 10;
    } else if (reelSymbols[0] === reelSymbols[1] || reelSymbols[1] === reelSymbols[2]) {
        winnings = 2;
    }

    if (winnings > 0) {
        let tokens = parseInt(tokenCount.textContent);
        tokens += winnings;
        tokenCount.textContent = tokens;
        alert(`You won ${winnings} tokens!`);
    }
}
