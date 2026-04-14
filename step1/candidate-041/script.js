const symbols = ["🤖", "🧠", "💡", "💻", "🚀", "💰"];
const tokenCountElement = document.getElementById("token-count");
const reels = document.querySelectorAll(".reel");
const spinButton = document.getElementById("spin-button");
const messageElement = document.getElementById("message");

let tokens = 100;

spinButton.addEventListener("click", spin);

function spin() {
    if (tokens <= 0) {
        messageElement.textContent = "You're out of tokens! Refresh to play again.";
        spinButton.disabled = true;
        return;
    }

    tokens--;
    tokenCountElement.textContent = tokens;
    messageElement.textContent = "";

    spinButton.disabled = true;

    let spinIntervals = [];
    reels.forEach((reel, i) => {
        spinIntervals[i] = setInterval(() => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        }, 100);
    });

    setTimeout(() => {
        spinIntervals.forEach(interval => clearInterval(interval));
        const finalSymbols = [];
        reels.forEach(reel => {
            const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.textContent = finalSymbol;
            finalSymbols.push(finalSymbol);
        });
        checkWin(finalSymbols);
        spinButton.disabled = false;
    }, 2000);
}

function checkWin(finalSymbols) {
    const [s1, s2, s3] = finalSymbols;

    if (s1 === s2 && s2 === s3) {
        let winAmount = 0;
        switch (s1) {
            case "💰":
                winAmount = 50;
                messageElement.textContent = "Jackpot! +50 tokens!";
                break;
            case "🚀":
                winAmount = 25;
                messageElement.textContent = "To the moon! +25 tokens!";
                break;
            default:
                winAmount = 10;
                messageElement.textContent = `Model Converged! +10 tokens for ${s1}${s1}${s1}!`;
        }
        tokens += winAmount;
    } else {
        messageElement.textContent = "Catastrophic Forgetting! Try again.";
    }

    tokenCountElement.textContent = tokens;
}
