const width = 28;
const height = 30;
const pacmanSpeed = 275;
const powerPelletTime = 10000;
const ghostPause = 5000;
const powerPelletScoreValue = 10;
const directions = { left: -1, right: +1, up: -width, down: +width };
const grid = document.querySelector(".grid");
const scoreText = document.querySelector(".score");

let currentLevelArray = [];
let pacmanIndex = 630;
let pacmanStartDir = directions.left;
let pacmanCurrentDir = pacmanStartDir;
let pacmanNextDir = pacmanCurrentDir;
let pacmanPoweredUp = false;
let pacmanTimerID = 0;
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
    let anotheritem;
    item.className = `item${levelOne[i]}`;

    item.style.aspectRatio = 1;
    grid.appendChild(item);

    currentLevelArray.push(item);
  }
};

const incrementScore = (point) => {
  score += point;
  scoreText.innerHTML = score;
};

const startGame = () => {
  setTimeout(() => {
    currentLevelArray[pacmanIndex].className = "pacman";
    movePacman();

    createGhosts(ghosts);

    setTimeout(() => {
      ghosts.forEach((ghost) => moveGhost(ghost));
    }, ghostPause);
  }, 1000);
};

const movePacman = () => {
  pacmanTimerID = setInterval(() => {
    // TODO: Fix the deletion of gameobjects (update logic)
    currentLevelArray[pacmanIndex].className = "";

    if (levelOne[pacmanIndex + pacmanNextDir] !== 1) {
      pacmanIndex += pacmanNextDir;

      if (levelOne[pacmanIndex] === 0) {
        // Pac-dot eaten
        incrementScore(1);
        levelOne[pacmanIndex] = 4;
      } else if (levelOne[pacmanIndex] === 3) {
        activatePowerPellet();
      } else if (levelOne[pacmanIndex] === 5) {
        pacmanIndex += width - 1;
      } else if (levelOne[pacmanIndex] === 6) {
        pacmanIndex -= width - 1;
      }
    }

    currentLevelArray[pacmanIndex].className = "pacman";
    console.log(pacmanIndex);
  }, pacmanSpeed);
};

const updatePacmanDir = (e) => {
  console.log("HERE!!");
  switch (e.key) {
    case "ArrowUp":
    case "w":
      if (pacmanIndex - width >= 0) {
        if (
          levelOne[pacmanIndex - width] !== 1 &&
          levelOne[pacmanIndex - width] !== 2
        )
          pacmanNextDir = directions.up;
      }
      break;
    case "ArrowRight":
    case "d":
      if (pacmanIndex % width < width - 1) {
        if (levelOne[pacmanIndex + 1] !== 1 && levelOne[pacmanIndex + 1] !== 2)
          pacmanNextDir = directions.right;
      }
      break;
    case "ArrowDown":
    case "s":
      if (pacmanIndex + width < width * height) {
        if (
          levelOne[pacmanIndex + width] !== 1 &&
          levelOne[pacmanIndex + width] !== 2
        )
          pacmanNextDir = directions.down;
      }
      break;
    case "ArrowLeft":
    case "a":
      if (pacmanIndex % width !== 0) {
        if (levelOne[pacmanIndex - 1] !== 1 && levelOne[pacmanIndex - 1] !== 2)
          pacmanNextDir = directions.left;
      }
      break;
  }
  // currentLevelArray[pacmanIndex].classList.add("pacman");
};

const activatePowerPellet = () => {
  // Update Score
  incrementScore(powerPelletScoreValue);
  pacmanPoweredUp = true;
  ghosts.forEach((ghost) => {
    ghost.isScared = true;
    currentLevelArray[ghost.currentIndex].classList.add("scared");
  });

  setTimeout(() => {
    pacmanPoweredUp = false;
    ghosts.forEach((ghost) => {
      ghost.isScared = false;
      currentLevelArray[ghost.currentIndex].classList.remove("scared");
    });
  }, powerPelletTime);
};

// GHOST LOGIC

class Ghost {
  constructor(className, startIndex, speed) {
    // this.className = `${className} ghost`;
    this.className = className;
    this.startIndex = startIndex;
    this.speed = speed;
    this.currentIndex = startIndex;
    this.isScared = false;
    this.timerID = NaN;
  }
  div = document.createElement("div");
}

const ghosts = [
  new Ghost("blinky", 348, 250),
  new Ghost("pinky", 376, 400),
  new Ghost("inky", 351, 300),
  new Ghost("clyde", 379, 500),
];

const createGhosts = (ghosts) => {
  ghosts.map((ghost) => {
    currentLevelArray[ghost.currentIndex].className = `${ghost.className} ghost`;
    return ghost;
  });
};

const resetGhostState = () => {
  ghosts.forEach((ghost) => {
    ghost.isScared = false;
  });
};

const moveGhost = (ghost) => {
  let possibleDirections = getPossibleDirections(ghost.currentIndex);
  let nextDirection =
    possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  let preferredHeading = nextDirection - ghost.currentIndex;

  ghost.timerID = setInterval(() => {
    // Move ghost
    if (levelOne[ghost.currentIndex] === 5) {
      ghost.currentIndex += width - 1;
    } else if (levelOne[ghost.currentIndex] === 6) {
      ghost.currentIndex -= width - 1;
    } else {
      // Remove ghost current position
      possibleDirections = getPossibleDirections(
        ghost.currentIndex,
        preferredHeading
      );

      if (possibleDirections.length === 1) {
        nextDirection = possibleDirections[0];
      } else {
        nextDirection =
          possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        preferredHeading = nextDirection - ghost.currentIndex;
      }

      currentLevelArray[ghost.currentIndex].className = "";
      ghost.currentIndex = nextDirection;
    }
    // Remove ghost from current index
    // TODO: Fix ghost clearing class name
    // Add ghost to new index
    if (ghost.isScared)
      currentLevelArray[
        ghost.currentIndex
      ].className = `${ghost.className} ghost scared`;
    else currentLevelArray[ghost.currentIndex].className = `${ghost.className} ghost`;
  }, ghost.speed);
};

const getPossibleDirections = (index, heading = 0) => {
  if (levelOne[index] === 2) heading = directions.up;
  let deltaUp = index + directions.up;
  let deltaDown = index + directions.down;
  let deltaLeft = index + directions.left;
  let deltaRight = index + directions.right;

  let deltaPos = index + heading;
  let validMove = levelOne[deltaPos] !== 1;

  if (heading !== 0 && validMove) {
    return [deltaPos];
  } else {
    let dirOptions = [deltaUp, deltaDown, deltaLeft, deltaRight].filter((dir) => {
      return levelOne[dir] !== 1;
    });
    return dirOptions;
  }
};

createBoard();
startGame();
// currentLevelArray[pacmanIndex].classList.add("pacman");

document.addEventListener("keydown", updatePacmanDir);
document.addEventListener("swiped-up", updatePacmanDir);
document.addEventListener("swiped-right", updatePacmanDir);
document.addEventListener("swiped-down", updatePacmanDir);
document.addEventListener("swiped-left", updatePacmanDir);
