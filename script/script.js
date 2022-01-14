// TODO: Add Responsive design for modal (text and button issues)

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
let currentScore = 0;
let levelsComplete = 0;
let pelletsLeft = 0;
let consecutiveGhostsEaten = 0;
let validKeysPressed = [];
// TIMER IDs
let pacmanTimerID = NaN;
let powerPelletTimerID = NaN;
let resetInputTimerID = NaN;
// Audio Variables
let ghostSirenSFX = undefined; // Set when ghosts are created

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

  let startButton = document.createElement("button");
  startButton.innerHTML = "Play";
  startButton.className = "start-btn";
  startButton.onclick = transitionToGame;
  startContainer.appendChild(startButton);
};

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
    body.appendChild(header);

    let topContainer = document.createElement("div");
    topContainer.className = "game-top-container";
    body.appendChild(topContainer);

    let scoreTag = document.createElement("p");
    scoreTag.innerHTML = `Score: <span class="score">${currentScore}</span>`;
    topContainer.appendChild(scoreTag);

    let livesTag = document.createElement("p");
    livesTag.innerHTML = `Lives: <span class="lives">${currentLives}</span>`;
    topContainer.appendChild(livesTag);

    let grid = document.createElement("div");
    grid.className = "grid";
    body.appendChild(grid);

    createBoard();
    startGame();
  }, 1250);
};

const displayInstructionalModal = () => {
  let body = document.querySelector("body");

  let modalWrapper = document.createElement("div");
  modalWrapper.className = "modal-wrapper";

  let modal = document.createElement("div");
  modal.className = "instructional-modal";
  modalWrapper.appendChild(modal);

  let modalTopContainer = document.createElement("div");
  modalTopContainer.className = "modal-top-container";
  modal.appendChild(modalTopContainer);

  let header = document.createElement("h2");
  header.innerText = "How To Play";
  modalTopContainer.appendChild(header);

  let exitBtn = document.createElement("button");
  exitBtn.innerHTML = "✕";
  modalTopContainer.appendChild(exitBtn);
  exitBtn.onclick = () => {
    modalWrapper.remove();
  };

  let instructionalContent = document.createElement("div");
  instructionalContent.className = "instructional-content";

  let controlLabel = document.createElement("h3");
  controlLabel.innerHTML = "Controls";
  instructionalContent.appendChild(controlLabel);

  let controlText = document.createElement("div");
  controlText.innerHTML =
    "<p>To play, use the arrow (or WASD) keys in order to move Pacman. On mobile devices, you can also swipe in the direction you want Pacman to move.</p>";
  instructionalContent.appendChild(controlText);

  let objectiveLabel = document.createElement("h3");
  objectiveLabel.innerHTML = "Objective";
  instructionalContent.appendChild(objectiveLabel);

  let objectiveText = document.createElement("div");
  objectiveText.innerHTML =
    "<p>To win, Pacman must eat all dots on the map.</p><p>The special orange dots, called Power Pellets, power-up Pacman. They are also worth more points. When pacman eats a Power Pellet, he temporarily gains the ability to eat ghosts. The more ghosts eaten consecutively, the more points you will earn.</p><p>Also, ghosts move faster after each level completed!</p><p>The game is over when Pacman is eaten by the ghosts and runs out of lives. How high of a score can you get?</p>";
  instructionalContent.appendChild(objectiveText);

  modal.appendChild(instructionalContent);
  body.appendChild(modalWrapper);
};

const createCharacter = (className) => {
  let character = document.createElement("div");
  character.className = className;
  character.style.width = "50px";
  character.style.height = "50px";

  if (className !== "pacman") {
    character.classList.add("ghost");
  }
  character.classList.add("display");

  if (className.includes("pacman")) {
    let mouth = document.createElement("div");
    mouth.className = "pacman-mouth";
    character.appendChild(mouth);
  }

  character.addEventListener("mouseenter", (e) => {
    let characterLabel = document.querySelector(".character-label");
    characterLabel.innerHTML = className;
    switch (className) {
      case "pacman":
        characterLabel.style.color = "yellow";
        let pacmanMouth = document.querySelector(".pacman-mouth");
        pacmanMouth.style.animationName = "eat-right";
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

  character.addEventListener("mouseleave", (e) => {
    let characterLabel = document.querySelector(".character-label");
    characterLabel.innerHTML = "The Characters";
    characterLabel.style.color = "white";

    if (className === "pacman") {
      let pacmanMouth = document.querySelector(".pacman-mouth");
      pacmanMouth.style.animationName = "none";
    }
  });
  return character;
};

// ******************************************************************************************************
// Game Logic
// ******************************************************************************************************

const createBoard = () => {
  let grid = document.querySelector(".grid");
  grid.style.gridTemplateColumns = `repeat(${WIDTH}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${HEIGHT}, 1fr)`;

  for (let i = 0; i < currentLevelData.length; i++) {
    let item = document.createElement("div");
    item.className = `item${currentLevelData[i]}`;

    if (currentLevelData[i] === 0 || currentLevelData[i] === 3) {
      pelletsLeft++;
    }

    grid.appendChild(item);
    currentLevelArray.push(item);
  }
};

const incrementScore = (point) => {
  let scoreLabel = document.querySelector(".score");
  currentScore += point;
  scoreLabel.innerHTML = currentScore;
};

const updateLives = (lifeAmt) => {
  currentLives = lifeAmt;

  let livesLabel = document.querySelector(".lives");
  livesLabel.innerHTML = currentLives;

  if (currentLives < 0) {
    currentLives = 0;
  }

};

const startGame = () => {
  playAudio("sfx/pacman_beginning.mp3");
  let timerID = NaN;
  let delayInSeconds = Math.floor(GAME_START_DELAY);
  let remainderDelay = GAME_START_DELAY % delayInSeconds;

  // Create timer label and add to grid container
  let grid = document.querySelector(".grid");
  let startTimerLabel = document.createElement("div");
  startTimerLabel.className = "start-timer";
  grid.appendChild(startTimerLabel);

  setTimeout(() => {
    timerID = setInterval(() => {

      if (delayInSeconds < 1000) {
        clearInterval(timerID);
        startTimerLabel.remove();

        currentLevelArray[pacmanIndex].classList.add("pacman");
        movePacman();

        createGhosts(ghosts);
      }
      startTimerLabel.innerHTML = Math.floor(delayInSeconds / 1000);
      delayInSeconds -= 1000;
    }, 1000);
  }, remainderDelay);
};

const stopGame = (timeBeforeReset) => {
  clearInterval(pacmanTimerID);
  ghostSirenSFX.pause();

  // Stop Ghost timer
  ghosts.forEach((ghost) => {
    clearInterval(ghost.timerID);
    clearTimeout(ghost.startMoveTimerID);
  });

  // Reset game after timer
  setTimeout(() => {
    resetGame();
  }, timeBeforeReset);
};

const resetCharacters = () => {
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
  ghosts.forEach((ghost) => {
    currentLevelArray[ghost.currentIndex].classList.remove(...ghost.classList);
    delete ghost;
  });
  // Recreate ghosts
  let blinkySpeed = Math.max(200, 250 - (levelsComplete * 10));
  let pinkySpeed = Math.max(350, 400 - (levelsComplete * 10));
  let inkySpeed = Math.max(350, 300 - (levelsComplete * 10));
  let clydeSpeed = Math.max(450, 500 - (levelsComplete * 10));
  ghosts = [
    new Ghost("blinky", 348, blinkySpeed, 0),
    new Ghost("pinky", 376, pinkySpeed, 1100),
    new Ghost("inky", 351, inkySpeed, 2200),
    new Ghost("clyde", 379, clydeSpeed, 3300),
  ];
};

const clearGame = () => {
  // Reset lives and score count if lives is 0
  if (currentLives <= 0) {
    updateLives(STARTING_LIVES);
    currentScore = 0;
    levelsComplete = 0;
    let scoreLabel = document.querySelector(".score");
    scoreLabel.innerHTML = 0;
  }


  // Reset level data
  currentLevelData = [...levelOne];
  pelletsLeft = 0;

  // Reset the game board if all pellets collected

  for (let i = 0; i < currentLevelData.length; i++) {
    let item = currentLevelArray[i];
    item.className = `item${currentLevelData[i]}`;

    if (currentLevelData[i] === 0 || currentLevelData[i] === 3) {
      pelletsLeft++;
    }
  }
};

const gameOver = () => {
  pelletsLeft = 0;

  displayGameOver();
  setTimeout(() => {
    removeGameOverDisplay();
    clearGame();
    startGame();
  }, 2500);
}

const displayGameOver = () => {
  // Create game over label and add to grid container
  let grid = document.querySelector(".grid");
  let gameOverLabel = document.createElement("div");
  gameOverLabel.className = "game-over-label";
  gameOverLabel.innerHTML = "Game Over!";
  grid.appendChild(gameOverLabel);
}

const removeGameOverDisplay = () => {
  let gameOverLabel = document.querySelector(".game-over-label");
  gameOverLabel.remove();
}

const resetGame = () => {
  resetCharacters();
  if (currentLives > 0) {
    if (pelletsLeft <= 0) {
      clearGame();
    }
    startGame();
  } else {
    gameOver();
  }
};

const updateHighScores = () => {
  let currentHighScore = {
  }
  if (typeof(Storage) !== "undefined") {
    // window.localStorage.setItem()

    // REFERENCE JSON.stringify(object)
  }
}

const playAudio = (path, shouldLoop=false) => {
  updateHighScores();
  let audio = new Audio(path);
  audio.loop = shouldLoop;
  audio.play();

  return audio;
}

const clearItemFromGrid = (itemName, index) => {
  currentLevelData[index] = 4;
  currentLevelArray[index].classList.remove(itemName);
  currentLevelArray[index].classList.add("item4");
};

// ******************************************************************************************************
// Pacman logic
// ******************************************************************************************************

const moveIsValid = (direction) => {
  if (currentLevelData[direction] !== 1 && currentLevelData[direction] !== 2) {
    return true;
  } else {
    return false;
  }
};

const pacmanDestroyed = () => {
  pacmanIsAlive = false;
  updateLives(--currentLives);
  playAudio("sfx/pacman_death_sound.mp3")
  stopGame(PACMAN_DEATH_ANIMATION_TIME);
};

const movePacman = () => {
  pacmanTimerID = setInterval(() => {
    currentLevelArray[pacmanIndex].classList.remove("pacman");

    if (moveIsValid(pacmanIndex + moveQueued) && moveQueued !== 0) {
      pacmanIndex += moveQueued;
      pacmanNextDir = moveQueued;
      moveQueued = 0;
    } else if (moveIsValid(pacmanIndex + pacmanNextDir)) {
      pacmanIndex += pacmanNextDir;
    }
    // Add pacman class to next location; check for collision
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
    // Pacman touched a ghost--check if scared; if so, pacman is no longer alive
    if (!currentLevelArray[pacmanIndex].classList.contains("scared")) {
      pacmanDestroyed();
    } else {
      ghosts.forEach((ghost) => {
        if (currentLevelArray[pacmanIndex].classList.contains(ghost.name)) {
          ghost.retreat();
        }
      });
    }
  }
};

const updatePacmanDir = (e) => {
  if (!pacmanIsAlive) return;
  let validKeys = [
    "ArrowUp",
    "w",
    "ArrowRight",
    "d",
    "ArrowDown",
    "s",
    "ArrowLeft",
    "a",
  ];
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
    levelsComplete++;
    playAudio("sfx/victory.mp3");
    stopGame(VICTORY_PAUSE_TIME);
  }
};

const eatNormalPellet = () => {
  updatePelletsRemaining();
  playAudio("sfx/pacman_munch.mp3");
  incrementScore(NORMAL_PELLET_SCORE_VALUE);
  clearItemFromGrid("item0", pacmanIndex);
};

const activatePowerPellet = () => {
  // Update Pellets remaining
  updatePelletsRemaining();
  // Update Score
  incrementScore(POWER_PELLET_SCORE_VALUE);
  pacmanPoweredUp = true;
  clearItemFromGrid("item3", pacmanIndex);

  // Check if Power Pellet Timer exists; if so, reset effect (timer and audio)
  if (powerPelletTimerID) {
    clearTimeout(powerPelletTimerID);
    ghostSirenSFX.currentTime = 0;
    // Else, activate Power Pellet
  } else {
    ghostSirenSFX.pause();
    ghostSirenSFX = playAudio("sfx/power_pellet.mp3", true);

    ghosts.forEach((ghost) => {
      ghost.toggleIsScared(true);
    });
  }

  // Stop Power Pellet Effects
  powerPelletTimerID = setTimeout(() => {
    powerPelletTimerID = NaN;
    consecutiveGhostsEaten = 0;
    pacmanPoweredUp = false;
    ghostSirenSFX.pause();
    ghostSirenSFX = playAudio("sfx/ghost_siren.mp3", true);
    ghosts.forEach((ghost) => {
      ghost.toggleIsScared(false);
    });
  }, POWER_PELLET_TIME);
};

// ******************************************************************************************************
// GHOST LOGIC
// ******************************************************************************************************
class Ghost {
  constructor(name = "ghost", startIndex = 348, speed = 500, startDelayTime = 0) {
    this.name = name;
    this.startIndex = startIndex;
    this.speed = speed;
    this.startDelayTime = startDelayTime;
    this.classList = [this.name, "ghost"];
    this.currentIndex = startIndex;
    this.isScared = false;
    this.timerID = NaN;
    this.startMoveTimerID = NaN;
    this.isRetreating = false;
  }

  toggleIsScared(isScared) {
    if (isScared && !this.classList.includes("scared")) {
      this.classList.push("scared");
    } else {
      currentLevelArray[this.currentIndex].classList.remove("scared");
      this.classList.pop();
    }
    this.isScared = isScared;
  }

  exitGhostZone = () => {
    this.startMoveTimerID = setTimeout(() => {
      this.timerID = setInterval(() => {
        if (currentLevelData[this.currentIndex] === 2) {
          if (currentLevelData[this.currentIndex + DIRECTIONS.up] !== 1) {
            this.move(this.currentIndex + DIRECTIONS.up);
          } else if (
            currentLevelData[this.currentIndex + DIRECTIONS.left * 2] !== 1
          ) {
            this.move(this.currentIndex + DIRECTIONS.left);
          } else if (
            currentLevelData[this.currentIndex + DIRECTIONS.right * 2] !== 1
          ) {
            this.move(this.currentIndex + DIRECTIONS.right);
          }
        } else {
          clearInterval(this.timerID);
          this.prepareNextMove();
        }
      }, this.speed);
    }, this.startDelayTime);
  };

  prepareNextMove = () => {
    let possibleDirections = getPossibleDirections(this.currentIndex);
    let nextDirection =
      possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    let preferredHeading = nextDirection - this.currentIndex;

    this.timerID = setInterval(() => {
      // Move ghost
      // If Ghost touched Left Portal
      if (currentLevelData[this.currentIndex] === 5) {
        // this.currentIndex += WIDTH - 1;
        nextDirection = this.currentIndex + (WIDTH - 1);
        // If Ghost touched Right Portal
      } else if (currentLevelData[this.currentIndex] === 6) {
        // ghost.currentIndex -= WIDTH - 1;
        nextDirection = this.currentIndex - (WIDTH - 1);
        // If Ghost touched Pacman
      } else {
        possibleDirections = getPossibleDirections(
          this.currentIndex,
          preferredHeading
        );

        if (possibleDirections.length === 1) {
          nextDirection = possibleDirections[0];
        } else {
          nextDirection =
            possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
          preferredHeading = nextDirection - this.currentIndex;
        }
      }
      this.move(nextDirection);
    }, this.speed);
  };

  move(direction) {
    // Remove ghost current position; if touching ghost but not pacman, only remove name
    if (currentLevelArray[this.currentIndex].classList.length > this.classList.length+1 &&
        !currentLevelArray[this.currentIndex].classList.contains("pacman")) {
      currentLevelArray[this.currentIndex].classList.remove(this.name);
    } else {
      currentLevelArray[this.currentIndex].classList.remove(...this.classList);
    }
      //.remove(...this.classList);
    this.currentIndex = direction;
    currentLevelArray[this.currentIndex].classList.add(...this.classList);
    this.handleCollision();
  }

  handleCollision() {
    if (
      currentLevelArray[this.currentIndex].classList.contains("pacman") ||
      this.currentIndex === pacmanIndex
    ) {
      if (this.isScared) {
        this.retreat();
      } else {
        pacmanDestroyed();
      }
    }
  }

  retreat() {
    if (this.isRetreating) return;
    consecutiveGhostsEaten++;
    incrementScore(GHOST_EATEN_SCORE_VALUE * consecutiveGhostsEaten);
    playAudio("sfx/eat_ghost.mp3");
    this.isRetreating = true;
    currentLevelArray[this.currentIndex].classList.remove(...this.classList);
    clearInterval(this.timerID);
    setTimeout(() => {
      this.currentIndex = this.startIndex;
      this.isRetreating = false;
      this.exitGhostZone();
    }, 1500);
  }
}

let ghosts = [
  new Ghost("blinky", 348, 250, 0),
  new Ghost("pinky", 376, 400, 1100),
  new Ghost("inky", 351, 300, 2200),
  new Ghost("clyde", 379, 500, 3300),
];

const createGhosts = (ghosts) => {
  ghostSirenSFX = playAudio("sfx/ghost_siren.mp3", true);
  ghosts.map((ghost) => {
    currentLevelArray[ghost.currentIndex].classList.add(...ghost.classList);
    ghost.exitGhostZone();
    return ghost;
  });
};

const getPossibleDirections = (index, heading = 0) => {
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
      return currentLevelData[dir] !== 1 && currentLevelData[dir] !== 2;
    });
    return dirOptions;
  }
};

// ******************************************************************************************************
// EVENT LISTENERS
// ******************************************************************************************************

document.addEventListener("keydown", updatePacmanDir);
document.addEventListener("keyup", (e) => {
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
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(e) {
  return (
    e.touches || // browser API
    e.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(e) {
  const firstTouch = getTouches(e)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(e) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = e.touches[0].clientX;
  var yUp = e.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      /* left swipe */
      moveQueued = DIRECTIONS.left;
      pacm;
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
}

loadMainMenu();
