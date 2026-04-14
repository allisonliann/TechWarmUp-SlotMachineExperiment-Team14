const symbols = ['🤖', '⚡', '📉', '🧠', '💰', '🔥'];
const SPIN_COST = 10;
let tokens = 100;

const reelStrips = document.querySelectorAll('.reel-strip');
const spinBtn = document.getElementById('spin-button');
const tokenDisplay = document.getElementById('token-count');
const statusMsg = document.getElementById('status-msg');

// Initialize reels with some symbols
function initReels() {
    reelStrips.forEach(strip => {
        // Create a long strip to simulate infinite spinning
        for (let i = 0; i < 30; i++) {
            const symbolDiv = document.createElement('div');
            symbolDiv.classList.add('symbol');
            symbolDiv.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            strip.appendChild(symbolDiv);
        }
    });
}

async function spin() {
    if (tokens < SPIN_COST) {
        statusMsg.textContent = "GPU POOR! Need more tokens.";
        return;
    }

    tokens -= SPIN_COST;
    updateUI();
    spinBtn.disabled = true;
    statusMsg.textContent = "Inference in progress...";

    const results = [];

    // Spin each reel
    const spinPromises = Array.from(reelStrips).map((strip, index) => {
        return new Promise(resolve => {
            const randomOffset = Math.floor(Math.random() * (symbols.length * 3));
            const targetY = randomOffset * 80;
            
            // Apply animation
            strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.1, 0, 0.1, 1)`;
            strip.style.transform = `translateY(-${targetY}px)`;

            setTimeout(() => {
                // Determine which symbol landed
                const symbolIndex = (randomOffset) % symbols.length;
                const actualSymbol = strip.children[randomOffset].textContent;
                results.push(actualSymbol);
                resolve();
            }, 2000 + index * 500);
        });
    });

    await Promise.all(spinPromises);
    checkWin(results);
    spinBtn.disabled = false;
}

function checkWin(results) {
    const [s1, s2, s3] = results;

    if (s1 === s2 && s2 === s3) {
        if (s1 === '🤖') {
            tokens += 100;
            statusMsg.textContent = "JACKPOT: AGI ACHIEVED! +100 Tokens";
        } else if (s1 === '📉') {
            tokens -= 50;
            statusMsg.textContent = "MODEL COLLAPSE! -50 Tokens";
        } else {
            tokens += 50;
            statusMsg.textContent = `Synergy detected! +50 Tokens`;
        }
    } else {
        statusMsg.textContent = "Hallucination detected. Try again.";
    }
    updateUI();
}

function updateUI() {
    tokenDisplay.textContent = tokens;
    if (tokens <= 0) {
        statusMsg.textContent = "Out of Compute. Please buy the Pro Plan.";
        spinBtn.disabled = true;
    }
}

spinBtn.addEventListener('click', spin);
initReels();
