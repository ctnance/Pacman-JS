const WIDTH = 28;
const HEIGHT = 30;
const DIRECTIONS = { left: -1, right: +1, up: -WIDTH, down: +WIDTH };
const GAME_START_DELAY = 5200; // 5200 should be value when music set
const GHOST_PAUSE = 5500;
const INPUT_DELAY = 500; // delay when input resets--in case player inputs move a little early
const STARTING_LIVES = 3;
const PACMAN_SPEED = 214;
const POWER_PELLET_TIME = 10000;
const PACMAN_START_INDEX = 630;
const PACMAN_START_DIR = DIRECTIONS.left;
const NORMAL_PELLET_SCORE_VALUE = 1;
const POWER_PELLET_SCORE_VALUE = 10;
const GHOST_EATEN_SCORE_VALUE = 100;
const GRID = document.querySelector(".grid");
const SCORE_TEXT = document.querySelector(".score");

let currentLevelArray = [];
let pacmanIndex = PACMAN_START_INDEX;
let pacmanNextDir = PACMAN_START_DIR;
let currentLives = STARTING_LIVES;
let moveQueued = 0;
let pacmanIsAlive = true;
let pacmanPoweredUp = false;
let pacmanTimerID = 0;
let powerPelletTimerID = 0;
let resetInputTimerID = 0;
let validKeysPressed = [];
let score = 0;

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
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 4, 4, 4, 4, 4,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 0, 0, 1,
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
// Game Logic

const createBoard = () => {
    GRID.style.gridTemplateColumns = `repeat(${WIDTH}, 1fr`;
    GRID.style.gridTemplateRows = `repeat(${HEIGHT}, 1fr`;
    for (let i = 0; i < currentLevelData.length; i++) {
        let item = document.createElement("div");
        item.className = `item${currentLevelData[i]}`;

        item.style.aspectRatio = 1;
        GRID.appendChild(item);

        currentLevelArray.push(item);
    }
};

const incrementScore = (point) => {
    score += point;
    SCORE_TEXT.innerHTML = score;
};

const startGame = () => {
    //   var audio = new Audio('pacman_beginning.mp3');
    //   audio.play();
    setTimeout(() => {
        currentLevelArray[pacmanIndex].classList.add("pacman");
        movePacman();

        createGhosts(ghosts);

        setTimeout(() => {
            ghosts.forEach((ghost) => prepareGhostMove(ghost));
        }, GHOST_PAUSE);
    }, GAME_START_DELAY);
};

const clearGame = () => {
    currentLevelData = [...levelOne];
    pacmanIndex = PACMAN_START_INDEX;
    pacmanNextDir = PACMAN_START_DIR;
    moveQueued = 0;
    pacmanIsAlive = true;
    pacmanPoweredUp = false;
    pacmanTimerID = 0;
    validKeysPressed = [];
    score = 0;

    // Stop Ghost timer and delete ghosts
    ghosts.forEach(ghost => {
        clearInterval(ghost.timerID);
        delete ghost;
    });

    // Recreate ghosts
    ghosts = [
        new Ghost("blinky", 348, 250),
        new Ghost("pinky", 376, 400),
        new Ghost("inky", 351, 300),
        new Ghost("clyde", 379, 500),
    ];

    // Reset the game board
    for (let i = 0; i < currentLevelData.length; i++) {
        let item = currentLevelArray[i];
        item.className = `item${currentLevelData[i]}`;
    }

}

const resetGame = () => {
    clearGame();
    startGame();
}

const clearItemFromGrid = itemName => {
    currentLevelArray[pacmanIndex].classList.remove(itemName);
    currentLevelArray[pacmanIndex].classList.add("item4");
}

// ******************************************************************************************************
// Pacman logic

const movePacman = () => {
    pacmanTimerID = setInterval(() => {
        // If pacman isn't alive, stop pacman movement
        if (!pacmanIsAlive) {
            // TODO Create a function to handle pacman death
            clearInterval(pacmanTimerID);
            currentLevelArray[pacmanIndex].classList.remove("pacman");
            resetGame();
            return;
        };

        // TODO: Fix the deletion of gameobjects (update logic)
        currentLevelArray[pacmanIndex].classList.remove("pacman");


        if (currentLevelData[pacmanIndex + moveQueued] !== 1 && moveQueued !== 0) {
            pacmanIndex += moveQueued;
            pacmanNextDir = moveQueued;
            moveQueued = 0;
        }
        else if (currentLevelData[pacmanIndex + pacmanNextDir] !== 1) {
            pacmanIndex += pacmanNextDir;
        }

        currentLevelArray[pacmanIndex].classList.add("pacman");

        handlePacmanCollision();
    }, PACMAN_SPEED);
};

const handlePacmanCollision = () => {
    // Pac-dot eaten
    if (currentLevelData[pacmanIndex] === 0) {
        //   var audio = new Audio('collect.mp3');
        //   audio.play();
        incrementScore(NORMAL_PELLET_SCORE_VALUE);
        clearItemFromGrid("item0");
        currentLevelData[pacmanIndex] = 4;
        // Power pellet eaten
    } else if (currentLevelData[pacmanIndex] === 3) {
        clearItemFromGrid("item3");
        activatePowerPellet();
        // Left portal touched
    } else if (currentLevelData[pacmanIndex] === 5) {
        pacmanIndex += WIDTH - 1;
        // Right portal touched
    } else if (currentLevelData[pacmanIndex] === 6) {
        pacmanIndex -= WIDTH - 1;
    } else if (currentLevelArray[pacmanIndex].classList.contains("ghost") && !currentLevelArray[pacmanIndex].classList.contains("scared")) {
        pacmanIsAlive = false;
    }
}

const updatePacmanDir = (e) => {
    if (!pacmanIsAlive) return;
    let validKeys = ["ArrowUp", "w", "ArrowRight", "d", "ArrowDown", "s", "ArrowLeft", "a"]
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

const activatePowerPellet = () => {
    console.log("Power Pellet Activate!")
    if (powerPelletTimerID !== 0) clearTimeout(powerPelletTimerID);
    // Update Score
    incrementScore(POWER_PELLET_SCORE_VALUE);
    pacmanPoweredUp = true;
    ghosts.forEach((ghost) => {
        ghost.toggleIsScared(true);
    });

    powerPelletTimerID = setTimeout(() => {
        pacmanPoweredUp = false;
        ghosts.forEach((ghost) => {
            console.log("TIME TO UNSCARE YO!")
            ghost.toggleIsScared(false);
            console.log(ghost.classList);
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
    }
    div = document.createElement("div");

    toggleIsScared(isScared) {
        if (isScared && !this.classList.contains("scared")) this.classList.push("scared");
        else this.classList.pop;

        console.log("UPDATED SCARED TO = " + isScared)
        console.log(this.classList);

        this.isScared = isScared;
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

const moveGhost = (ghost) => {
    if (ghost.isScared) {
        // If ghost comes in contact with pacman
        if (currentLevelArray[ghost.currentIndex].classList.contains("pacman")) {
            console.log(ghost.name + " touched Pacman!");
            currentLevelArray[ghost.currentIndex].classList.remove(...ghost.classList);
            ghost.currentIndex = ghost.startIndex;
            incrementScore(GHOST_EATEN_SCORE_VALUE);
        }
        currentLevelArray[ghost.currentIndex].classList.add(...ghost.classList);
    } else {
        currentLevelArray[ghost.currentIndex].classList.add(...ghost.classList);
    }
}

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
        } else if (currentLevelArray[ghost.currentIndex].classList.contains("pacman")) {
            if (ghost.isScared) {
                currentLevelArray[ghost.currentIndex].classList.remove(...ghost.classList);
                ghost.currentIndex = ghost.startIndex;
                incrementScore(GHOST_EATEN_SCORE_VALUE);
            } else {
                pacmanIsAlive = false;
            }
        } else {
            // Remove ghost current position
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

            currentLevelArray[ghost.currentIndex].classList.remove(...ghost.classList);
            ghost.currentIndex = nextDirection;
        }
        // Remove ghost from current index
        moveGhost(ghost);
    }, ghost.speed);
};

const handleGhostCollision = ghost => {

}

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

createBoard();
startGame();

document.addEventListener("keydown", updatePacmanDir);
document.addEventListener("keyup", e => {
    // TODO: Logic here needs fixed to avoid buggy movement
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

// TODO: Add touch screen support
// document.addEventListener("swiped-up", updatePacmanDir);
// document.addEventListener("swiped-right", updatePacmanDir);
// document.addEventListener("swiped-down", updatePacmanDir);
// document.addEventListener("swiped-left", updatePacmanDir);
