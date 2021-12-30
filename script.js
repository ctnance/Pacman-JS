const WIDTH = 28;
const HEIGHT = 30;
const DIRECTIONS = { left: -1, right: +1, up: -WIDTH, down: +WIDTH };
const GAME_START_DELAY = 5200;
const INPUT_DELAY = 500; // delay when input resets--in case player inputs move a little early
const PACMAN_SPEED = 214;
const POWER_PELLET_TIME = 10000;
const PACMAN_START_INDEX = 630;
const PACMAN_START_DIR = DIRECTIONS.left;
const GHOST_PAUSE = 5000;
const NORMAL_PELLET_SCORE_VALUE = 1;
const POWER_PELLET_SCORE_VALUE = 10;
const GHOST_EATEN_SCORE_VALUE = 100;
const GRID = document.querySelector(".grid");
const SCORE_TEXT = document.querySelector(".score");
const INPUT_IND = document.querySelector(".input-ind"); // DELETE AFTER TESTING

let currentLevelArray = [];
let pacmanIndex = PACMAN_START_INDEX;
let pacmanNextDir = PACMAN_START_DIR;
let moveQueued = 0;
let pacmanIsAlive = true;
let pacmanPoweredUp = false;
let pacmanTimerID = 0;
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

const createBoard = () => {
  GRID.style.gridTemplateColumns = `repeat(${WIDTH}, 1fr`;
  GRID.style.gridTemplateRows = `repeat(${HEIGHT}, 1fr`;
  for (let i = 0; i < levelOne.length; i++) {
    let item = document.createElement("div");
    item.className = `item${levelOne[i]}`;

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
  var audio = new Audio('pacman_beginning.mp3');
  audio.play();
  setTimeout(() => {
    currentLevelArray[pacmanIndex].className = "pacman";
    movePacman();

    createGhosts(ghosts);

    setTimeout(() => {
      ghosts.forEach((ghost) => moveGhost(ghost));
    }, GHOST_PAUSE);
  }, GAME_START_DELAY);
};

const clearGame = () => {
  currentLevelArray = [];
  pacmanIndex = PACMAN_START_INDEX;
  pacmanNextDir = PACMAN_START_DIR;
  moveQueued = 0;
  pacmanIsAlive = true;
  pacmanPoweredUp = false;
  pacmanTimerID = 0;
  validKeysPressed = [];
  score = 0;
}

const resetGame = () => {
  clearGame();
  startGame();
}

const movePacman = () => {
  pacmanTimerID = setInterval(() => {
    // If pacman isn't alive, stop pacman movement
    if (!pacmanIsAlive) {
      clearInterval(pacmanTimerID);
      currentLevelArray[pacmanIndex].classList.remove("pacman");
      return;
    };
    // TODO: Fix the deletion of gameobjects (update logic)
    currentLevelArray[pacmanIndex].className = "";

    if (levelOne[pacmanIndex + moveQueued] !== 1 && moveQueued !== 0) {
      pacmanIndex += moveQueued;
      pacmanNextDir = moveQueued;
      moveQueued = 0;
    }
    else if (levelOne[pacmanIndex + pacmanNextDir] !== 1) {
      pacmanIndex += pacmanNextDir;
    }

    if (levelOne[pacmanIndex] === 0) {
      // Pac-dot eaten
      incrementScore(NORMAL_PELLET_SCORE_VALUE);
      levelOne[pacmanIndex] = 4;
    } else if (levelOne[pacmanIndex] === 3) {
      activatePowerPellet();
    } else if (levelOne[pacmanIndex] === 5) {
      pacmanIndex += WIDTH - 1;
    } else if (levelOne[pacmanIndex] === 6) {
      pacmanIndex -= WIDTH - 1;
    }

    currentLevelArray[pacmanIndex].className = "pacman";
  }, PACMAN_SPEED);
};

const updatePacmanDir = (e) => {
  if (!pacmanIsAlive) return;
  let validKeys = ["ArrowUp", "w", "ArrowRight", "d", "ArrowDown", "s", "ArrowLeft", "a"]
  let key = e.key;

  if (validKeys.includes(key)) {
    validKeysPressed.push(key);
  }

  switch (key) {
    case "ArrowUp":
    case "w":
      moveQueued = DIRECTIONS.up;
      INPUT_IND.innerHTML = "Up";
      break;
    case "ArrowRight":
    case "d":
      moveQueued = DIRECTIONS.right;
      INPUT_IND.innerHTML = "Right";
      break;
    case "ArrowDown":
    case "s":
      moveQueued = DIRECTIONS.down;
      INPUT_IND.innerHTML = "Down";
      break;
    case "ArrowLeft":
    case "a":
      moveQueued = DIRECTIONS.left;
      INPUT_IND.innerHTML = "Left";
      break;
  }
};

const activatePowerPellet = () => {
  // Update Score
  incrementScore(POWER_PELLET_SCORE_VALUE);
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
  }, POWER_PELLET_TIME);
};

// GHOST LOGIC

class Ghost {
  constructor(name, startIndex, speed) {
    // this.className = `${className} ghost`;
    this.name = name;
    this.className = name + " ghost";
    this.speed = speed;
    this.startIndex = startIndex;
    this.currentIndex = startIndex;
    this.isScared = false;
    this.timerID = NaN;
  }
  div = document.createElement("div");

  set isScared(isScared) {
    if (isScared) this.className = this.name + " ghost " + "scared";
    else this.className = this.name + " ghost";

    return isScared;
  }
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
  let possibleDIRECTIONS = getPossibleDIRECTIONS(ghost.currentIndex);
  let nextDirection =
    possibleDIRECTIONS[Math.floor(Math.random() * possibleDIRECTIONS.length)];
  let preferredHeading = nextDirection - ghost.currentIndex;

  ghost.timerID = setInterval(() => {
    console.log("IS PACMAN ALIVE? = " + pacmanIsAlive);
    // Move ghost
    // If Ghost touched Left Portal
    if (levelOne[ghost.currentIndex] === 5) {
      ghost.currentIndex += WIDTH - 1;
      // If Ghost touched Right Portal
    } else if (levelOne[ghost.currentIndex] === 6) {
      ghost.currentIndex -= WIDTH - 1;
      // If Ghost touched Pacman
    } else if (currentLevelArray[ghost.currentIndex].classList.contains("pacman")) {
      console.log(ghost.className + " touched pacman!")
      console.log("GHOST CLASS NAME THAT TOUCHED = " + ghost.className);
      if (ghost.isScared) {
        currentLevelArray[ghost.currentIndex].classList.remove(...ghost.className.trim().split(" "));
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

      currentLevelArray[ghost.currentIndex].className = "";
      ghost.currentIndex = nextDirection;
    }
    // Remove ghost from current index
    // TODO: Fix ghost clearing class name
    // Add ghost to new index
    if (ghost.isScared) {

      if (currentLevelArray[ghost.currentIndex].classList.contains("pacman")) {
        console.log(ghost.className + " touched pacman!")
        currentLevelArray[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared");
        ghost.currentIndex = ghost.startIndex;
        incrementScore(GHOST_EATEN_SCORE_VALUE);
      }
      currentLevelArray[ghost.currentIndex].className = `${ghost.className} ghost scared`;
    } else {
      currentLevelArray[ghost.currentIndex].className = `${ghost.className} ghost`;
    }
  }, ghost.speed);
};

const getPossibleDIRECTIONS = (index, heading = 0) => {
  if (levelOne[index] === 2) heading = DIRECTIONS.up;
  let deltaUp = index + DIRECTIONS.up;
  let deltaDown = index + DIRECTIONS.down;
  let deltaLeft = index + DIRECTIONS.left;
  let deltaRight = index + DIRECTIONS.right;

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
document.addEventListener("keyup", e => {
  let index = validKeysPressed.indexOf(e.key);
  if (validKeysPressed.includes(e.key)) {
    validKeysPressed.splice(validKeysPressed[index], 1);
  }
  if (validKeysPressed.length === 0) {
    setTimeout(() => {
      moveQueued = 0;
      INPUT_IND.innerHTML = "Null";
    }, INPUT_DELAY);
  }
});

// TODO: Add touch screen support
// document.addEventListener("swiped-up", updatePacmanDir);
// document.addEventListener("swiped-right", updatePacmanDir);
// document.addEventListener("swiped-down", updatePacmanDir);
// document.addEventListener("swiped-left", updatePacmanDir);
