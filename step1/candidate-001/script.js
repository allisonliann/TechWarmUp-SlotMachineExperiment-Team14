document.addEventListener("DOMContentLoaded", () => {
  const spinButton = document.getElementById("spin-button");
  const tokenBalanceSpan = document.getElementById("token-balance");
  const message = document.getElementById("message");
  const reels = document.querySelectorAll(".reel");

  let tokenBalance = 100;

  const symbols = ["🤖", "🧠", "⚡️", "🔥", "💯"];

  spinButton.addEventListener("click", () => {
    if (tokenBalance >= 10) {
      tokenBalance -= 10;
      updateTokenBalance();
      spinReels();
    } else {
      message.textContent = "You're out of tokens! Refresh to play again.";
    }
  });

  function spinReels() {
    const results = [];
    for (let i = 0; i < reels.length; i++) {
      const randomIndex = Math.floor(Math.random() * symbols.length);
      reels[i].textContent = symbols[randomIndex];
      results.push(symbols[randomIndex]);
    }
    checkWin(results);
  }

  function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
      const winAmount = 50;
      tokenBalance += winAmount;
      updateTokenBalance();
      message.textContent = `You won ${winAmount} tokens!`;
    } else {
      message.textContent = "Spin again!";
    }
  }

  function updateTokenBalance() {
    tokenBalanceSpan.textContent = tokenBalance;
  }
});
