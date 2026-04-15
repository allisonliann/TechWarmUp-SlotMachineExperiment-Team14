document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🤖', '🧠', '🔥', '論文', 'CLIP', 'RNN', 'GAN'];
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spinButton');
    const tokenBalanceSpan = document.getElementById('token-balance');
    const messageDisplay = document.getElementById('message');

    let tokenBalance = 100;
    const spinCost = 5;

    spinButton.addEventListener('click', spin);

    function spin() {
        if (tokenBalance < spinCost) {
            messageDisplay.textContent = "Not enough tokens to consult the AI oracle!";
            return;
        }

        tokenBalance -= spinCost;
        updateTokenBalance();
        spinButton.disabled = true;
        messageDisplay.textContent = "The model is thinking...";

        let spinIntervals = [];
        reels.forEach((reel, index) => {
            let i = 0;
            spinIntervals[index] = setInterval(() => {
                reel.textContent = symbols[i % symbols.length];
                i++;
            }, 100);
        });

        setTimeout(() => {
            clearIntervalsAndDetermineOutcome(spinIntervals);
        }, 3000);
    }

    function clearIntervalsAndDetermineOutcome(intervals) {
        intervals.forEach(interval => clearInterval(interval));

        const finalSymbols = Array.from(reels).map(() => 
            symbols[Math.floor(Math.random() * symbols.length)]
        );

        reels.forEach((reel, index) => {
            reel.textContent = finalSymbols[index];
        });

        calculateWinnings(finalSymbols);
        spinButton.disabled = false;
    }

    function calculateWinnings(finalSymbols) {
        const [s1, s2, s3] = finalSymbols;

        if (s1 === s2 && s2 === s3) {
            let winnings = 0;
            let message = "";
            switch (s1) {
                case '🤖':
                    winnings = 100;
                    message = "AGI Achieved! You're rich in tokens!";
                    break;
                case '🧠':
                    winnings = 75;
                    message = "Sentience! A breakthrough!";
                    break;
                case '🔥':
                    winnings = 50;
                    message = "You discovered fire... again! Well done!";
                    break;
                default:
                    winnings = 25;
                    message = `Three ${s1}s! A solid paper published!`;
            }
            tokenBalance += winnings;
            messageDisplay.textContent = `${message} You won ${winnings} tokens!`;
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            const winnings = 10;
            tokenBalance += winnings;
            messageDisplay.textContent = `A pair! You've secured your next round of funding. +${winnings} tokens.`;
        } else {
            messageDisplay.textContent = "Hallucination! The model returned nonsense. Try again.";
        }
        updateTokenBalance();
    }

    function updateTokenBalance() {
        tokenBalanceSpan.textContent = tokenBalance;
    }
});
