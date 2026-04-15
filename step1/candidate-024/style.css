:root {
    --bg-color: #1a1a2e;
    --primary-color: #16213e;
    --accent-color: #0f3460;
    --highlight-color: #e94560;
    --font-color: #dcdcdc;
    --font-family: 'Press Start 2P', cursive;
}

body {
    background-color: var(--bg-color);
    color: var(--font-color);
    font-family: var(--font-family);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    overflow: hidden;
}

.machine {
    background-color: var(--primary-color);
    border: 5px solid var(--accent-color);
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 0 20px var(--highlight-color);
    width: 90%;
    max-width: 500px;
    text-align: center;
}

header h1 {
    color: var(--highlight-color);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px #000;
}

.token-display {
    background: var(--accent-color);
    padding: 0.5rem;
    border-radius: 5px;
    margin-bottom: 1.5rem;
    font-size: 1rem;
}

.reels {
    display: flex;
    justify-content: center;
    gap: 1rem;
    background: #000;
    border: 3px inset var(--accent-color);
    padding: 1rem;
    border-radius: 10px;
    overflow: hidden; /* This is key to the slot machine effect */
}

.reel {
    background-color: #222;
    width: 100px;
    height: 100px;
    font-size: 60px;
    line-height: 100px;
    text-align: center;
    overflow: hidden;
    border-radius: 5px;
    box-shadow: inset 0 0 10px #000;
    /* The symbols will be positioned and transitioned inside this */
    transition: transform 0.3s ease-in-out;
}

.reel .symbol-container {
    transition: transform 1s ease-in-out;
}

.message {
    margin-top: 1.5rem;
    height: 2.5rem;
    line-height: 1.25rem;
    font-size: 0.9rem;
    color: #fff;
}

.message.win {
    color: #4caf50;
    animation: blink 0.5s infinite;
}

.message.error {
    color: #f44336;
}

.spin-button {
    background-color: var(--highlight-color);
    color: #fff;
    font-family: var(--font-family);
    font-size: 1rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
    box-shadow: 0 4px #ab3346;
}

.spin-button:hover {
    background-color: #ff5c77;
}

.spin-button:active {
    transform: translateY(2px);
    box-shadow: 0 2px #ab3346;
}

.spin-button:disabled {
    background-color: #555;
    color: #999;
    cursor: not-allowed;
    box-shadow: 0 4px #333;
}

/* Animation for the win message */
@keyframes blink {
    50% { opacity: 0.5; }
}

