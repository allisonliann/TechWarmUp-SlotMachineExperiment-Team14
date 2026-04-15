document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const decreaseBetButton = document.getElementById('decrease-bet');
    const increaseBetButton = document.getElementById('increase-bet');
    const betAmountSpan = document.getElementById('bet-amount');
    const tokenBalanceSpan = document.getElementById('token-balance');
    const message = document.getElementById('message');
    const muteButton = document.getElementById('mute-button');

    const symbols = ['🤖', '🧠', '💡', '🔌', '🔥', '🧊', '論文', '🐱'];
    let tokenBalance = 1000;
    let betAmount = 10;
    let isMuted = false;

    // Web Audio API setup
    let audioCtx;
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playSound(type) {
        if (isMuted || !audioCtx) return;

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'spin') {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        } else if (type === 'win') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            oscillator.frequency.setValueAtTime(698.46, audioCtx.currentTime + 0.1); // F5
            oscillator.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.2); // A5
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.4);
        } else if (type === 'bet') {
             oscillator.type = 'square';
             oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
             gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
             gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
             oscillator.start();
             oscillator.stop(audioCtx.currentTime + 0.1);
        }
    }


    function updateBetAmount(amount) {
        const newBet = betAmount + amount;
        if (newBet >= 10 && newBet <= 100) {
            betAmount = newBet;
            betAmountSpan.textContent = betAmount;
            playSound('bet');
        }
    }

    decreaseBetButton.addEventListener('click', () => updateBetAmount(-10));
    increaseBetButton.addEventListener('click', () => updateBetAmount(10));
    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
    });


    spinButton.addEventListener('click', () => {
        initAudio(); // Initialize audio on user interaction
        if (tokenBalance < betAmount) {
            message.textContent = "Not enough tokens!";
            return;
        }

        tokenBalance -= betAmount;
        tokenBalanceSpan.textContent = tokenBalance;
        message.textContent = "Spinning...";
        spinButton.disabled = true;
        reels.forEach(reel => reel.classList.remove('winning'));
        playSound('spin');


        const spinDuration = 2000; // 2 seconds total spin
        const reelIntervals = [];
        let finalResults = [];

        reels.forEach((reel, index) => {
            reel.classList.add('spinning');
            const interval = setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }, 100);
            reelIntervals.push(interval);

            setTimeout(() => {
                clearInterval(interval);
                reel.classList.remove('spinning');
                const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                reel.textContent = finalSymbol;
                finalResults[index] = finalSymbol;

                if (index === reels.length - 1) {
                    checkWin(finalResults);
                    spinButton.disabled = false;
                }
            }, spinDuration + index * 500); // Stagger the stop
        });
    });

    function checkWin(results) {
        const [r1, r2, r3] = results;
        if (r1 === r2 && r2 === r3) {
            const winnings = betAmount * 10;
            tokenBalance += winnings;
            saveTokenBalance();
            tokenBalanceSpan.textContent = tokenBalance;
            message.textContent = `Jackpot! You won ${winnings} tokens!`;
            reels.forEach(reel => reel.classList.add('winning'));
            playSound('win');
        } else if (r1 === r2 || r2 === r3) {
             const winnings = betAmount * 2;
             tokenBalance += winnings;
             saveTokenBalance();
             tokenBalanceSpan.textContent = tokenBalance;
             message.textContent = `You won ${winnings} tokens!`;
             playSound('win');
             if (r1 === r2) {
                reels[0].classList.add('winning');
                reels[1].classList.add('winning');
             } else {
                reels[1].classList.add('winning');
                reels[2].classList.add('winning');
             }
        } else {
            message.textContent = "Try again!";
        }
    }
});