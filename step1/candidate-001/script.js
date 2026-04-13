const symbols = ["🤖", "🧠", "💎", "⚡️", "🔥"];
const spinButton = document.getElementById("spin-button");
const balanceAmount = document.getElementById("balance-amount");
const messageText = document.getElementById("message-text");
const reels = document.querySelectorAll(".reel");

let balance = 100;

spinButton.addEventListener("click", () => {
    if (balance <= 0) {
        messageText.textContent = "You're out of tokens! Refresh to play again.";
        return;
    }

    balance -= 10;
    balanceAmount.textContent = balance;
    messageText.textContent = "Optimizing hyperparameters...";

    let result = [];
    for (let i = 0; i < reels.length; i++) {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        reels[i].textContent = randomSymbol;
        result.push(randomSymbol);
    }

    const [first, second, third] = result;
    if (first === second && second === third) {
        const winnings = 50;
        balance += winnings;
        balanceAmount.textContent = balance;
        messageText.textContent = `You've achieved AGI! +${winnings} tokens`;
    } else if (first === second || second === third || first === third) {
        const winnings = 20;
        balance += winnings;
        balanceAmount.textContent = balance;
        messageText.textContent = `You've disrupted the industry! +${winnings} tokens`;
    } else {
        messageText.textContent = "Your model has over-fit.";
    }
});