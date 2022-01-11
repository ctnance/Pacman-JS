// GAME BOARD DIMENSIONS
const WIDTH = 28;
const HEIGHT = 30;
// DIRECTIONAL VALUES
const DIRECTIONS = { left: -1, right: +1, up: -WIDTH, down: +WIDTH };
// GAME CONFIGURATION VARIABLES
const GAME_START_DELAY = 5200; // 5200 should be value when music set
const GHOST_START_DELAY = 200;
const PACMAN_DEATH_ANIMATION_TIME = 2000;
const VICTORY_PAUSE_TIME = 2500;
const INPUT_DELAY = 300; // delay when input resets--in case player inputs a move a little early
const STARTING_LIVES = 3;
const PACMAN_SPEED = 265; // 214
const POWER_PELLET_TIME = 10000;
const PACMAN_START_INDEX = 630;
const PACMAN_START_DIR = DIRECTIONS.left;
const NORMAL_PELLET_SCORE_VALUE = 1;
const POWER_PELLET_SCORE_VALUE = 10;
const GHOST_EATEN_SCORE_VALUE = 200;

// Dynamic Game Variables
let currentLevelArray = [];
let pacmanIndex = PACMAN_START_INDEX;
let pacmanNextDir = PACMAN_START_DIR;
let currentLives = STARTING_LIVES;
let moveQueued = 0;
let pacmanIsAlive = true;
let pacmanPoweredUp = false;
let score = 0;
let pelletsLeft = 0;
let consecutiveGhostsEaten = 0;
let validKeysPressed = [];
// TIMER IDs
let pacmanTimerID = NaN;
let powerPelletTimerID = NaN;
let resetInputTimerID = NaN;
// Audio Variables
let ghostSirenSFX = new Audio('sfx/ghost_siren.mp3');

/*
0 - pac-dots
1 - wall
2 - ghost-lair
3 - power-pellet
4 - empty space
5 - portalLeft
6 - portalRight
*/

const levelOne = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    5, 4, 4, 4, 4, 4, 0, 4, 4, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 4, 4, 0, 4, 4, 4, 4, 4, 6,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 0, 0, 1,
    1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
let currentLevelData = [...levelOne];

// ******************************************************************************************************
// Menu Logic
// ******************************************************************************************************

const loadMainMenu = () => {
    let body = document.querySelector("body");
    let startContainer = document.createElement("div");
    startContainer.className = "start-container";
    body.appendChild(startContainer);

    // Create Header
    let header = document.createElement("h1");
    header.className = "menu-header";
    header.innerHTML = "Pac-Man";
    startContainer.appendChild(header);

    let characterLabel = document.createElement("h2");
    characterLabel.className = "character-label";
    characterLabel.innerHTML = "The Characters";
    startContainer.appendChild(characterLabel);

    let characterRow = document.createElement("div");
    characterRow.className = "character-row";
    startContainer.appendChild(characterRow);

    // Create pacman
    let pacmanDisplay = createCharacter("pacman");
    characterRow.appendChild(pacmanDisplay);

    // Create Blinky
    let blinkyDisplay = createCharacter("blinky");
    characterRow.appendChild(blinkyDisplay);

    // Create Pinky
    let pinkyDisplay = createCharacter("pinky");
    characterRow.appendChild(pinkyDisplay);

    // Create Inky
    let inkyDisplay = createCharacter("inky");
    characterRow.appendChild(inkyDisplay);

    // Create Clyde
    let clydeDisplay = createCharacter("clyde");
    characterRow.appendChild(clydeDisplay);

    let instructionBtn = document.createElement("button");
    instructionBtn.className = "instruction-btn";
    instructionBtn.innerHTML = "How To Play";
    instructionBtn.onclick = displayInstructionalModal;
    startContainer.appendChild(instructionBtn);

    let startButton = document.createElement("button")
    startButton.innerHTML = "Play";
    startButton.className = "start-btn";
    startButton.onclick = transitionToGame;
    startContainer.appendChild(startButton);
}

const transitionToGame = () => {
    let body = document.querySelector("body");
    let btn = document.querySelector(".start-btn");
    btn.disabled = true;
    
    let startContainer = document.querySelector(".start-container");
    startContainer.style.opacity = "0";

    setTimeout(() => {
        startContainer.remove();

        let header = document.createElement("h1");
        header.innerHTML = "Pac-Man";
        body.appendChild(header)

        let scoreTag = document.createElement("p");
        scoreTag.innerHTML = `Score: <span class='score'>${score}</span>`;
        body.appendChild(scoreTag);

        let livesTag = document.createElement("p");
        livesTag.innerHTML = `Lives: <span class='lives'>${currentLives}</span>`;
        body.appendChild(livesTag);

        let grid = document.createElement("div");
        grid.className = "grid";
        body.appendChild(grid);

        createBoard();
        startGame();
    }, 1250);
}

const displayInstructionalModal = () => {
    let body = document.querySelector("body");

    let modal = document.createElement("div");
    modal.className = "instructional-modal";

    let header = document.createElement("h2");
    header.innerText = "How To Play";
    modal.appendChild(header);

    let controlLabel = document.createElement("h3");
    controlLabel.innerHTML = "Controls";
    modal.appendChild(controlLabel);

    let controlText = document.createElement("p");
    controlText.innerHTML = "To play, use the arrow (or WASD) keys in order to move Pacman. On mobile devices, you can also swipe in the direction you want Pacman to move.";
    modal.appendChild(controlText);

    let objectiveLabel = document.createElement("h3");
    objectiveLabel.innerHTML = "Objective";
    modal.appendChild(objectiveLabel);

    let objectiveText = document.createElement("p");
    objectiveText.innerHTML = "To win, Pacman must eat all dots on the map. The special orange dots, called Power Pellets power-up Pacman. They are also worth more points. When pacman eats a Power Pellet, he temporarily gains the ability to eat ghosts. The more ghosts eaten consecutively, the more points you will earn. The game is over when Pacman is eaten by the ghosts and runs out of lives. How high of a score can you get?"
    modal.appendChild(objectiveText);

    let exitBtn = document.createElement("button");
    exitBtn.innerHTML = "✕";
    exitBtn.onclick = () => {
        modal.remove();
    }

    modal.appendChild(exitBtn);
    body.appendChild(modal);
}

const createCharacter = (className) => {
    let character = document.createElement("div");
    character.className = className;
    character.style.width = '50px';
    character.style.height = '50px';

    if (className !== "pacman") {
        character.classList.add("ghost");
    }
    character.classList.add("display");

    if (className.includes("pacman")) {
        let mouth = document.createElement("div");
        mouth.className = "pacman-mouth";
        character.appendChild(mouth);
    }

    character.addEventListener("mouseenter", e => {
        let characterLabel = document.querySelector(".character-label");
        characterLabel.innerHTML = className;
        switch (className) {
            case "pacman":
                characterLabel.style.color = "yellow";
                break;
            case "blinky":
                characterLabel.style.color = "red";
                break;
            case "pinky":
                characterLabel.style.color = "hotpink";
                break;
            case "inky":
                characterLabel.style.color = "cyan";
                break;
            case "clyde":
                characterLabel.style.color = "orange";
                break;
            default:
                characterLabel.style.color = "white";
        }
    });

    character.addEventListener("mouseleave", e => {
        let characterLabel = document.querySelector(".character-label");
        characterLabel.innerHTML = "The Characters";
        characterLabel.style.color = "white";
    });
    return character;
}

// ******************************************************************************************************
// Game Logic
// ******************************************************************************************************

const createBoard = () => {
    let grid = document.querySelector(".grid");
    grid.style.gridTemplateColumns = `repeat(${WIDTH}, 1fr`;
    grid.style.gridTemplateRows = `repeat(${HEIGHT}, 1fr`;
    for (let i = 0; i < currentLevelData.length; i++) {
        let item = document.createElement("div");
        item.className = `item${currentLevelData[i]}`;

        if (currentLevelData[i] === 0 || currentLevelData[i] === 3) {
            pelletsLeft++;
        }

        item.style.aspectRatio = 1;
        grid.appendChild(item);

        currentLevelArray.push(item);
    }
};

const incrementScore = (point) => {
    let scoreLabel = document.querySelector(".score");
    score += point;
    scoreLabel.innerHTML = score;
};

const updateLives = lifeAmt => {
    currentLives = lifeAmt;
    if (currentLives < 0) {
        currentLives = 0;
        clearGame();
    }

    let livesLabel = document.querySelector(".lives");
    livesLabel.innerHTML = currentLives;
}

const startGame = () => {
    let levelStartSFX = new Audio('sfx/pacman_beginning.mp3');
    levelStartSFX.play();
    setTimeout(() => {
        currentLevelArray[pacmanIndex].classList.add("pacman");
        movePacman();

        createGhosts(ghosts);

        setTimeout(() => {
            ghosts.forEach((ghost) => prepareGhostMove(ghost));
            ghostSirenSFX.loop = true;
            ghostSirenSFX.play();
        }, GHOST_START_DELAY);
    }, GAME_START_DELAY);
};

const stopGame = timeBeforeReset => {
    clearInterval(pacmanTimerID);

    // Stop Ghost timer
    ghosts.forEach(ghost => {
        clearInterval(ghost.timerID);
        ghostSirenSFX.pause();
    });

    // Reset game after timer
    setTimeout(() => {
        resetGame();
    }, timeBeforeReset);
}

const resetBoard = () => {
    // Remove Pacman from game board
    currentLevelArray[pacmanIndex].classList.remove("pacman");

    // Reset Character Variables
    pacmanIndex = PACMAN_START_INDEX;
    pacmanNextDir = PACMAN_START_DIR;
    moveQueued = 0;
    pacmanIsAlive = true;
    pacmanPoweredUp = false;
    validKeysPressed = [];

    // Stop active timers
    if (pacmanTimerID) clearInterval(pacmanTimerID);
    if (powerPelletTimerID) clearTimeout(powerPelletTimerID);


    // Delete ghosts
    ghosts.forEach(ghost => {
        currentLevelArray[ghost.currentIndex].classList.remove(...ghost.classList);
        delete ghost;
    });

    // Recreate ghosts
    ghosts = [
        new Ghost("blinky", 348, 250),
        new Ghost("pinky", 376, 400),
        new Ghost("inky", 351, 300),
        new Ghost("clyde", 379, 500),
    ];
}

const clearGame = () => {
    resetBoard();

    if (currentLives <= 0) {
        // Reset Lives
        updateLives(STARTING_LIVES);
        
        score = 0;
        
        let scoreLabel = document.querySelector(".score");
        scoreLabel.innerHTML = 0;
    }
    
    // Reset level data
    currentLevelData = [...levelOne];
    pelletsLeft = 0;

    // Reset the game board
    for (let i = 0; i < currentLevelData.length; i++) {
        let item = currentLevelArray[i];
        item.className = `item${currentLevelData[i]}`;

        if (currentLevelData[i] === 0 || currentLevelData[i] === 3) {
            pelletsLeft++;
        }
    }
}

const resetGame = () => {
    console.log(currentLives);
    if (currentLives > 0 && pelletsLeft > 0) {
        console.log("Resetting board!");
        resetBoard();
    } else {
        console.log("Clearing game!")
        clearGame();
    }
    startGame();
}

const clearItemFromGrid = (itemName, index) => {
    currentLevelData[index] = 4;
    currentLevelArray[index].classList.remove(itemName);
    currentLevelArray[index].classList.add("item4");
}

// ******************************************************************************************************
// Pacman logic

const moveIsValid = direction => {
    if (currentLevelData[direction] !== 1 && currentLevelData[direction] !== 2) {
        return true;
    }
    else {
        return false;
    }
}

const pacmanDestroyed = () => {
    pacmanIsAlive = false;
    updateLives(--currentLives);
    let deathSFX = new Audio('sfx/pacman_death_sound.mp3');
    deathSFX.play();
    stopGame(PACMAN_DEATH_ANIMATION_TIME);
}

const movePacman = () => {
    pacmanTimerID = setInterval(() => {
        // If pacman isn't alive, stop pacman movement

        currentLevelArray[pacmanIndex].classList.remove("pacman");

        if (moveIsValid(pacmanIndex + moveQueued) && moveQueued !== 0) {
            pacmanIndex += moveQueued;
            pacmanNextDir = moveQueued;
            moveQueued = 0;
        }
        else if (moveIsValid(pacmanIndex + pacmanNextDir)) {
            pacmanIndex += pacmanNextDir;
        }

        currentLevelArray[pacmanIndex].classList.add("pacman");

        handlePacmanCollision();
    }, PACMAN_SPEED);
};

const handlePacmanCollision = () => {
    if (currentLevelData[pacmanIndex] === 0) {
        // Dot eaten
        eatNormalPellet();
    } else if (currentLevelData[pacmanIndex] === 3) {
        // Power Pellet eaten
        activatePowerPellet();
    } else if (currentLevelData[pacmanIndex] === 5) {
        // Left portal touched
        currentLevelArray[pacmanIndex].classList.remove("pacman");
        pacmanIndex += WIDTH - 1;
    } else if (currentLevelData[pacmanIndex] === 6) {
        // Right portal touched
        currentLevelArray[pacmanIndex].classList.remove("pacman");
        pacmanIndex -= WIDTH - 1;
    } else if (currentLevelArray[pacmanIndex].classList.contains("ghost")) {
        console.log(this.name + " touched pacman!");
        // Pacman touched a ghost--check if scared; if so, pacman is no longer alive
        if (!currentLevelArray[pacmanIndex].classList.contains("scared")) {
            pacmanDestroyed();
        } else {
            ghosts.forEach(ghost => {
                if (currentLevelArray[pacmanIndex].classList.contains(ghost.name)) {
                    ghost.retreat();
                }
            })
        }
    }
}

const updatePacmanDir = (e) => {
    if (!pacmanIsAlive) return;
    let validKeys = ["ArrowUp", "w", "ArrowRight", "d", "ArrowDown", "s", "ArrowLeft", "a"];
    let key = e.key;

    if (validKeys.includes(key) && !validKeysPressed.includes(key)) {
        validKeysPressed.push(key);
        if (resetInputTimerID !== 0) clearTimeout(resetInputTimerID);
    }

    switch (key) {
        case "ArrowUp":
        case "w":
            moveQueued = DIRECTIONS.up;
            break;
        case "ArrowRight":
        case "d":
            moveQueued = DIRECTIONS.right;
            break;
        case "ArrowDown":
        case "s":
            moveQueued = DIRECTIONS.down;
            break;
        case "ArrowLeft":
        case "a":
            moveQueued = DIRECTIONS.left;
            break;
    }
};

const updatePelletsRemaining = () => {
    pelletsLeft--;

    if (pelletsLeft === 0) {
        let victorySFX = new Audio('sfx/victory.mp3');
        victorySFX.play();
        stopGame(VICTORY_PAUSE_TIME);
    }
}

const eatNormalPellet = () => {
    updatePelletsRemaining();

    let munchSound = new Audio('sfx/pacman_munch.mp3');
    munchSound.play();
    incrementScore(NORMAL_PELLET_SCORE_VALUE);
    clearItemFromGrid("item0", pacmanIndex);
}

const activatePowerPellet = () => {
    updatePelletsRemaining();
    clearItemFromGrid("item3", pacmanIndex);

    if (powerPelletTimerID !== 0) clearTimeout(powerPelletTimerID);
    // Update Score
    incrementScore(POWER_PELLET_SCORE_VALUE);
    pacmanPoweredUp = true;
    ghostSirenSFX.pause();
    ghostSirenSFX = new Audio('sfx/power_pellet.mp3');
    ghostSirenSFX.loop = true;
    ghostSirenSFX.play();
    ghosts.forEach((ghost) => {
        ghost.toggleIsScared(true);
    });

    powerPelletTimerID = setTimeout(() => {
        consecutiveGhostsEaten = 0;
        pacmanPoweredUp = false;
        ghostSirenSFX.pause();
        ghostSirenSFX = new Audio('sfx/ghost_siren.mp3');
        ghostSirenSFX.loop = true;
        ghostSirenSFX.play();
        ghosts.forEach((ghost) => {
            ghost.toggleIsScared(false);
        });
    }, POWER_PELLET_TIME);
};

// ******************************************************************************************************
// GHOST LOGIC

class Ghost {
    constructor(name, startIndex, speed) {
        this.name = name;
        this.classList = [this.name, "ghost"];
        this.speed = speed;
        this.startIndex = startIndex;
        this.currentIndex = startIndex;
        this.isScared = false;
        this.timerID = NaN;
        this.isRetreating = false;
    }
    div = document.createElement("div");

    toggleIsScared(isScared) {
        if (isScared && !this.classList.includes("scared")) this.classList.push("scared");
        else this.classList.pop();
        currentLevelArray[this.currentIndex].classList.remove("scared");
        this.isScared = isScared;
    }

    move() {
        currentLevelArray[this.currentIndex].classList.add(...this.classList);
        this.handleCollision();
    }

    handleCollision() {
        if (currentLevelArray[this.currentIndex].classList.contains("pacman")) {
            console.log(this.name + " touched pacman!");
            if (this.isScared) {
                this.retreat();
            } else {
                pacmanDestroyed();
            }
        }
    }

    retreat() {
        consecutiveGhostsEaten++;
        incrementScore(GHOST_EATEN_SCORE_VALUE * consecutiveGhostsEaten);
        if (this.isRetreating) return;
        let audio = new Audio('sfx/eat_ghost.mp3');
        audio.play();
        this.isRetreating = true;
        currentLevelArray[this.currentIndex].classList.remove(...this.classList);
        this.currentIndex = this.startIndex;
        clearInterval(this.timerID);
        setTimeout(() => {
            this.isRetreating = false;
            prepareGhostMove(this);
        }, 1000);
    }
}

let ghosts = [
    new Ghost("blinky", 348, 250),
    new Ghost("pinky", 376, 400),
    new Ghost("inky", 351, 300),
    new Ghost("clyde", 379, 500),
];

const createGhosts = ghosts => {
    ghosts.map((ghost) => {
        currentLevelArray[ghost.currentIndex].classList.add(...ghost.classList);
        return ghost;
    });
};

const prepareGhostMove = ghost => {
    let possibleDIRECTIONS = getPossibleDIRECTIONS(ghost.currentIndex);
    let nextDirection =
        possibleDIRECTIONS[Math.floor(Math.random() * possibleDIRECTIONS.length)];
    let preferredHeading = nextDirection - ghost.currentIndex;

    ghost.timerID = setInterval(() => {
        // Move ghost
        // If Ghost touched Left Portal
        if (currentLevelData[ghost.currentIndex] === 5) {
            ghost.currentIndex += WIDTH - 1;
            // If Ghost touched Right Portal
        } else if (currentLevelData[ghost.currentIndex] === 6) {
            ghost.currentIndex -= WIDTH - 1;
            // If Ghost touched Pacman
        } else {
            possibleDIRECTIONS = getPossibleDIRECTIONS(
                ghost.currentIndex,
                preferredHeading
            );

            if (possibleDIRECTIONS.length === 1) {
                nextDirection = possibleDIRECTIONS[0];
            } else {
                nextDirection =
                    possibleDIRECTIONS[Math.floor(Math.random() * possibleDIRECTIONS.length)];
                preferredHeading = nextDirection - ghost.currentIndex;
            }

            // Remove ghost current position
            currentLevelArray[ghost.currentIndex].classList.remove(...ghost.classList);
            ghost.currentIndex = nextDirection;
        }
        ghost.move();
    }, ghost.speed);
};

const getPossibleDIRECTIONS = (index, heading = 0) => {
    if (currentLevelData[index] === 2) heading = DIRECTIONS.up;
    let deltaUp = index + DIRECTIONS.up;
    let deltaDown = index + DIRECTIONS.down;
    let deltaLeft = index + DIRECTIONS.left;
    let deltaRight = index + DIRECTIONS.right;

    let deltaPos = index + heading;
    let validMove = currentLevelData[deltaPos] !== 1;

    if (heading !== 0 && validMove) {
        return [deltaPos];
    } else {
        let dirOptions = [deltaUp, deltaDown, deltaLeft, deltaRight].filter((dir) => {
            return currentLevelData[dir] !== 1;
        });
        return dirOptions;
    }
};

// ******************************************************************************************************

loadMainMenu();

document.addEventListener("keydown", updatePacmanDir);
document.addEventListener("keyup", e => {
    let key = e.key;

    let index = validKeysPressed.indexOf(key);
    if (validKeysPressed.includes(key)) {
        validKeysPressed.splice(validKeysPressed[index], 1);
    }
    if (validKeysPressed.length === 0) {
        resetInputTimerID = setTimeout(() => {
            moveQueued = 0;
        }, INPUT_DELAY);
    }
});

// Touch support for mobile
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(e) {
    return e.touches ||             // browser API
        e.originalEvent.touches; // jQuery
}

function handleTouchStart(e) {
    const firstTouch = getTouches(e)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(e) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = e.touches[0].clientX;
    var yUp = e.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            /* left swipe */
            moveQueued = DIRECTIONS.left;
            pacm
        } else {
            /* right swipe */
            moveQueued = DIRECTIONS.right;
        }
    } else {
        if (yDiff > 0) {
            /* up swipe */
            moveQueued = DIRECTIONS.up;
        } else {
            /* down swipe */
            moveQueued = DIRECTIONS.down;
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};