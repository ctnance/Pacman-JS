const width = 28;
const height = 30;
const directions = { left: -1, right: +1, up: -width, down: +width };
const grid = document.querySelector(".grid");
const scoreText = document.querySelector(".score");

let currentLevelArray = [];
let pacmanIndex = 462;
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

const createBoard = () => {
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr`;
    grid.style.gridTemplateRows = `repeat(${height}, 1fr`;
    for (let i = 0; i < levelOne.length; i++) {
        let item = document.createElement("div");
        let anotheritem
        item.className = `item${levelOne[i]}`;

        item.style.aspectRatio = 1;
        grid.appendChild(item);

        currentLevelArray.push(item);
    }
};

const incrementScore = point => {
    score += point;
    scoreText.innerHTML = score;
}

const movePacman = (e) => {
    currentLevelArray[pacmanIndex].classList.remove("pacman");
    switch (e.key) {
        case "ArrowUp":
        case "w":
            if (pacmanIndex - width >= 0) {
                if (levelOne[pacmanIndex - width] !== 1 &&
                    levelOne[pacmanIndex - width] !== 2) pacmanIndex -= width;
            }
            break;
        case "ArrowRight":
        case "d":
            if (pacmanIndex % width < width - 1) {
                if (levelOne[pacmanIndex + 1] !== 1 &&
                    levelOne[pacmanIndex + 1] !== 2) pacmanIndex += 1;
            }
            break;
        case "ArrowDown":
        case "s":
            if (pacmanIndex + width < width * height) {
                if (levelOne[pacmanIndex + width] !== 1 &&
                    levelOne[pacmanIndex + width] !== 2) pacmanIndex += width;
            }
            break;
        case "ArrowLeft":
        case "a":
            if (pacmanIndex % width !== 0) {
                if (levelOne[pacmanIndex - 1] !== 1 &&
                    levelOne[pacmanIndex - 1] !== 2) pacmanIndex -= 1;
            }
            break;
    }

    if (levelOne[pacmanIndex] === 0) {
        // Pac-dot eaten
        incrementScore(1)
        levelOne[pacmanIndex] = 4;
    } else if (levelOne[pacmanIndex] === 3) {
        // Power Pellet Activated
    } else if (levelOne[pacmanIndex] === 5) {
        pacmanIndex += width - 1;
    } else if (levelOne[pacmanIndex] === 6) {
        pacmanIndex -= width - 1;
    }
    currentLevelArray[pacmanIndex].className = "pacman";
    // currentLevelArray[pacmanIndex].classList.add("pacman");
};

// CLASSES

class Ghost {
    constructor(className, startIndex, speed) {
        this.className = className;
        this.startIndex = startIndex;
        this.speed = speed;
        this.currentIndex = startIndex;
        this.isScared = false;
        this.timerID = NaN;
    }
    div = document.createElement("div");
}

let ghosts = [
    new Ghost("blinky", 348, 250),
    new Ghost("pinky", 376, 400),
    new Ghost("inky", 351, 300),
    new Ghost("clyde", 379, 500)
]

const createGhosts = (ghosts) => {
    ghosts.map(ghost => {
        currentLevelArray[ghost.currentIndex].className = `${ghost.className} ghost`;
        return ghost;
    })
}

const moveGhost = (ghost) => {

    let possibleDirections = getPossibleDirections(ghost.currentIndex);
    let nextDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    let preferredHeading = nextDirection - ghost.currentIndex;
    let moveCount = 0;

    ghost.timerID = setInterval(() => {
        // Remove ghost current position
        // currentLevelArray[ghost.currentIndex].classList.remove(ghost.className);
        possibleDirections = getPossibleDirections(ghost.currentIndex, preferredHeading);

        if (possibleDirections.length === 1 && moveCount < 1) {
            nextDirection = possibleDirections[0];
        } else {
            nextDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            preferredHeading = nextDirection - ghost.currentIndex;
            moveCount = 0;
        }

        // if (levelOne[nextDirection] === 1) {
        // let newDirections = getPossibleDirections(ghost.currentIndex, preferredHeading);
        // nextDirection = newDirections[Math.floor(Math.random() * newDirections.length)];
        // }
        console.log("NEXTDIR2: " + nextDirection);

        currentLevelArray[ghost.currentIndex].className = `${ghost.className} ghost`;

        currentLevelArray[ghost.currentIndex].classList.remove(ghost.className);
        ghost.currentIndex = nextDirection;
        currentLevelArray[ghost.currentIndex].className = `${ghost.className} ghost`;
        moveCount++;

    }, ghost.speed);

}

const getPossibleDirections = (index, heading = 0) => {
    console.log(heading);
    let deltaUp = index + directions.up;
    let deltaDown = index + directions.down;
    let deltaLeft = index + directions.left;
    let deltaRight = index + directions.right;

    let deltaPos = index + heading;
    let validMove = levelOne[deltaPos] !== 1;

    console.log("DELTA POS: " + heading)

    if (heading !== 0 && validMove) {
        return [deltaPos];
    } else {
        let dirOptions = [deltaUp, deltaDown, deltaLeft, deltaRight].filter(dir => {
            return levelOne[dir] !== 1;
        });
        return dirOptions;
    }

}

createBoard();
createGhosts(ghosts);

ghosts.forEach(ghost => moveGhost(ghost));

currentLevelArray[pacmanIndex].className = "pacman";
// currentLevelArray[pacmanIndex].classList.add("pacman");

document.addEventListener("keyup", movePacman);
document.addEventListener("swiped-up", movePacman);
document.addEventListener("swiped-right", movePacman);
document.addEventListener("swiped-down", movePacman);
document.addEventListener("swiped-left", movePacman);