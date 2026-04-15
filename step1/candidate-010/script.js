document.addEventListener('DOMContentLoaded', () => {
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const spinButton = document.getElementById('spin-button');
    const tokensSpan = document.getElementById('tokens');
    const message = document.getElementById('message');

    let tokens = 100;

    const symbols = ['🤖', '🧠', '💡', '🔌', '📉', '🧐', '🚀', '🔥'];

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function spin() {
        if (tokens <= 0) {
            message.textContent = "You're out of tokens! Refresh to play again.";
            spinButton.disabled = true;
            return;
        }

        tokens--;
        tokensSpan.textContent = tokens;
        message.textContent = "Spinning...";

        let spins = 0;
        const maxSpins = 10;
        const spinInterval = setInterval(() => {
            reel1.textContent = getRandomSymbol();
            reel2.textContent = getRandomSymbol();
            reel3.textContent = getRandomSymbol();
            spins++;

            if (spins >= maxSpins) {
                clearInterval(spinInterval);
                checkWin();
            }
        }, 100);
    }

    function checkWin() {
        const r1 = reel1.textContent;
        const r2 = reel2.textContent;
        const r3 = reel3.textContent;

        if (r1 === r2 && r2 === r3) {
            let winAmount = 0;
            switch (r1) {
                case '🚀':
                    winAmount = 50;
                    message.textContent = "AGI Achieved! +50 Tokens!";
                    break;
                case '🔥':
                    winAmount = 25;
                    message.textContent = "High Burn Rate! +25 Tokens!";
                    break;
                case '🤖':
                    winAmount = 10;
                    message.textContent = "Robot Army! +10 Tokens!";
                    break;
                default:
                    winAmount = 5;
                    message.textContent = `You got three ${r1}! +5 Tokens!`;
            }
            tokens += winAmount;
            tokensSpan.textContent = tokens;
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            tokens += 2;
            tokensSpan.textContent = tokens;
            message.textContent = "Partial alignment! +2 Tokens.";
        } 
        else {
            message.textContent = "Hallucination! Try again.";
        }
    }

    spinButton.addEventListener('click', spin);
});
