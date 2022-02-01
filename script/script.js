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
const INPUT_DELAY = 500; // delay when input resets--in case player inputs a move a little early
const STARTING_LIVES = 3;
const PACMAN_SPEED = 265; // 214
const POWER_PELLET_TIME = 8000;
const GHOST_WARNING_TIME = 2500;
const PACMAN_START_INDEX = 630;
const PACMAN_START_DIR = DIRECTIONS.left;
const NORMAL_PELLET_SCORE_VALUE = 10;
const POWER_PELLET_SCORE_VALUE = 50;
const GHOST_EATEN_SCORE_VALUE = 200;
const EXTRA_LIFE_SCORE_REQUIREMENT = 10000;
const HIGH_SCORES_DISPLAYABLE = 10;

// Dynamic Game Variables
let currentLevelArray = [];
let pacmanIndex = PACMAN_START_INDEX;
let pacmanNextDir = PACMAN_START_DIR;
let currentLives = STARTING_LIVES;
let moveQueued = 0;
let pacmanIsAlive = true;
let pacmanPoweredUp = false;
let currentScore = 0;
let pointsToExtraLife = 0;
let levelsComplete = 0;
let ghostsEaten = 0;
let pelletsLeft = 0;
let consecutiveGhostsEaten = 0;
let validKeysPressed = [];
let gameIsActive = false;
let newHighScore = false;
let shouldResetGame = false;
let highScoreIndex = -1;
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
// HELPER FUNCTIONS
// ******************************************************************************************************
const createElement = (elementTag, parent, className = "", innerHTML = "") => {
  let element = document.createElement(elementTag);
  element.className = className;
  element.innerHTML = innerHTML;
  parent.appendChild(element);
  return element;
};

const createModal = (className, headerText, onClose = undefined) => {
  let body = document.querySelector("body");
  let modalWrapper = createElement("div", body, "modal-wrapper");
  let modal = createElement("div", modalWrapper, `modal ${className}`);
  let modalTopContainer = createElement("div", modal, "modal-header");
  createElement("h2", modalTopContainer, "", headerText);
  let exitBtn = createElement("button", modalTopContainer, "", "✕");
  let closeModal = (e) => {
    // Close modal if node is button or the modal wrapper
    if (
      e.target.classList.contains("modal-wrapper") ||
      e.target.nodeName === "BUTTON"
    ) {
      modalWrapper.remove();
      if (onClose) onClose();
      if (shouldResetGame) {
        shouldResetGame = false;
        addLifeIndicator();
        startGame();
      }
    }
  };
  exitBtn.onclick = closeModal;
  modalWrapper.onclick = closeModal;
  return modal;
};

const playAudio = (path, shouldLoop = false) => {
  let audio = new Audio(path);
  audio.loop = shouldLoop;
  audio.addEventListener("canplaythrough", () => {
    audio.play();
  });
  return audio;
};

// ******************************************************************************************************
// Menu Logic
// ******************************************************************************************************

const loadMainMenu = () => {
  let body = document.querySelector("body");
  let startContainer = createElement("section", body, "start-container");

  // Create Header
  createElement("h1", startContainer, "menu-header", "Pac-Man");
  createElement("h2", startContainer, "character-label", "The Characters");

  let characterRow = createElement("div", startContainer, "character-row");

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

  let instructionBtn = createElement(
    "button",
    startContainer,
    "instruction-btn",
    "How To Play"
  );
  instructionBtn.onclick = displayInstructionalModal;

  let highScoreBtn = createElement(
    "button",
    startContainer,
    "highscore-btn",
    "High Scores"
  );
  highScoreBtn.onclick = displayHighScores;

  let startButton = createElement("button", startContainer, "start-btn", "Play");
  startButton.onclick = transitionToGame;
};

const transitionToGame = () => {
  let body = document.querySelector("body");
  let btns = document.querySelectorAll("button");
  btns.forEach((btn) => (btn.disabled = true));

  let startContainer = document.querySelector(".start-container");
  startContainer.style.opacity = "0";

  setTimeout(() => {
    startContainer.remove();

    let gameContainer = createElement("section", body, "game-container");

    createElement("h1", gameContainer, "", "Pac-Man");

    let topContainer = createElement("div", gameContainer, "game-header");
    // Create Label for Score and Lives
    createElement(
      "p",
      topContainer,
      "",
      `Score: <span class="score">${currentScore}</span>`
    );
    createElement(
      "p",
      topContainer,
      "",
      `Lives: <span class="lives">${currentLives}</span>`
    );

    createElement("div", gameContainer, "grid");

    createBoard();
    addLifeIndicator();
    startGame();
  }, 1250);
};

const displayInstructionalModal = () => {
  let modal = createModal("instructional-modal", "How To Play");

  let instructionalContent = createElement("div", modal, "modal-content");

  // Create Control Label
  createElement("h3", instructionalContent, "", "Controls");
  // Set Controls text and content
  let controlText =
    "<p>To play, use the arrow (or WASD) keys in order to move Pacman. On mobile devices, you can also swipe in the direction you want Pacman to move.</p>";
  createElement("div", instructionalContent, "", controlText);
  // Set Objective Label
  createElement("h3", instructionalContent, "", "Objective");
  // Set Objective text and content
  let objectiveText =
    "<p>To win, Pacman must eat all dots on the map.</p><p>The special orange dots, called Power Pellets, power-up Pacman. They are also worth more points. When pacman eats a Power Pellet, he temporarily gains the ability to eat ghosts. The more ghosts eaten consecutively, the more points you will earn.</p><p>Also, ghosts move faster after each level completed!</p><p>The game is over when Pacman is eaten by the ghosts and runs out of lives. How high of a score can you get?</p>";
  createElement("div", instructionalContent, "", objectiveText);
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
    createElement("div", character, "pacman-mouth");
  }

  let activateCharacterLabel = () => {
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
  };

  character.addEventListener("mouseenter", activateCharacterLabel);

  character.addEventListener(
    "touchstart",
    () => {
      activateCharacterLabel();
      setTimeout(() => {
        let characterLabel = document.querySelector(".character-label");
        characterLabel.innerHTML = "The Characters";
        characterLabel.style.color = "white";

        if (className === "pacman") {
          let pacmanMouth = document.querySelector(".pacman-mouth");
          pacmanMouth.style.animationName = "none";
        }
      }, 2000);
    },
    false
  );

  character.addEventListener("mouseleave", () => {
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
    let item = createElement("div", grid, `item${currentLevelData[i]}`);
    currentLevelArray.push(item);
    if (currentLevelData[i] === 0 || currentLevelData[i] === 3) {
      pelletsLeft++;
    } else if (currentLevelData[i] === 1) {
      styleWall(currentLevelArray[i], i);
    } else if (currentLevelData[i] === 2) {
      if (
        (currentLevelData[i + DIRECTIONS.left] === 1 &&
          currentLevelData[i + DIRECTIONS.right * 2] === 1) ||
        (currentLevelData[i + DIRECTIONS.right] === 1 &&
          currentLevelData[i + DIRECTIONS.left * 2] === 1)
      ) {
        currentLevelArray[i].classList.add("ghost-zone-wall");
      }
    }
  }
};

const styleWall = (gridItem, indexLocation) => {
  // gridItem.classList.add("wall");
  // Top Left Wall
  if (indexLocation === 0) {
    gridItem.classList.add("upper-left-wall", "horizontal-wall");

    // Top Right Wall
  } else if (indexLocation === 27) {
    gridItem.classList.add("upper-right-wall", "horizontal-wall");

    // Bottom Left Wall
  } else if (indexLocation === 812) {
    gridItem.classList.add("lower-left-wall", "horizontal-wall");

    // Bottom Right Wall
  } else if (indexLocation === 839) {
    gridItem.classList.add("lower-right-wall", "horizontal-wall");

    // Top Walls
  } else if (indexLocation < 28) {
    // If another wall is below this wall
    if (currentLevelData[indexLocation + 28] === 1) {
      if (currentLevelData[indexLocation + 27] !== 1) {
        gridItem.classList.add("upper-right-wall", "horizontal-wall");
      } else if (currentLevelData[indexLocation + 29] !== 1) {
        gridItem.classList.add("upper-left-wall", "horizontal-wall");
      }
    } else {
      gridItem.classList.add("upper-wall", "horizontal-wall");
    }

    // Bottom Walls
  } else if (indexLocation > 811) {
    gridItem.classList.add("lower-wall", "horizontal-wall");

    // Left Walls
  } else if (indexLocation % 28 === 0) {
    // If another wall is next to this wall
    // Form a top wall if above a portal
    if (currentLevelData[indexLocation + 28] === 5) {
      gridItem.classList.add("upper-wall", "horizontal-wall");
      // Form a bottom wall if below a portal
    } else if (currentLevelData[indexLocation - 28] === 5) {
      gridItem.classList.add("lower-wall", "horizontal-wall");
      // Connect to any adjacent walls
    } else if (currentLevelData[indexLocation + 1] === 1) {
      if (currentLevelData[indexLocation - 27] === 4) {
        gridItem.classList.add("upper-left-wall", "vertical-wall");
      } else if (currentLevelData[indexLocation + 29] === 4) {
        gridItem.classList.add("lower-left-wall", "vertical-wall");
      } else if (currentLevelData[indexLocation - 27] !== 1) {
        gridItem.classList.add("lower-left-wall", "vertical-wall");
      } else if (currentLevelData[indexLocation + 29] !== 1) {
        gridItem.classList.add("upper-left-wall", "vertical-wall");
      }
    } else {
      gridItem.classList.add("left-wall", "vertical-wall");
    }

    // Right Walls
  } else if ((indexLocation + 1) % 28 === 0) {
    // If another wall is next to this wall
    if (currentLevelData[indexLocation + 28] === 6) {
      gridItem.classList.add("upper-wall", "horizontal-wall");
    } else if (currentLevelData[indexLocation - 28] === 6) {
      gridItem.classList.add("lower-wall", "horizontal-wall");
    } else if (currentLevelData[indexLocation - 1] === 1) {
      if (currentLevelData[indexLocation - 29] === 4) {
        gridItem.classList.add("upper-right-wall", "vertical-wall");
      } else if (currentLevelData[indexLocation + 27] === 4) {
        gridItem.classList.add("lower-right-wall", "vertical-wall");
      } else if (currentLevelData[indexLocation - 29] !== 1) {
        gridItem.classList.add("lower-right-wall", "vertical-wall");
      } else if (currentLevelData[indexLocation + 27] !== 1) {
        gridItem.classList.add("upper-right-wall", "vertical-wall");
      }
    } else {
      gridItem.classList.add("right-wall", "vertical-wall");
    }
    // Walls inside bordering walls
  } else {
    // Check for vertically adjacent walls
    if (
      (currentLevelData[indexLocation - 1] !== 1 &&
        (currentLevelData[indexLocation + 1] === 1 ||
          currentLevelData[indexLocation + 1] === 2)) ||
      (currentLevelData[indexLocation + 1] === 4 &&
        currentLevelData[indexLocation - 1] === 0)
    ) {
      gridItem.classList.add("right-wall", "wall");
    } else if (
      ((currentLevelData[indexLocation - 1] === 1 ||
        currentLevelData[indexLocation - 1] === 2) &&
        currentLevelData[indexLocation + 1] !== 1) ||
      (currentLevelData[indexLocation - 1] === 4 &&
        currentLevelData[indexLocation + 1] === 0)
    ) {
      gridItem.classList.add("left-wall", "wall");
    }
    // Check for indented corners and horizontally adjacent walls
    if (
      (currentLevelData[indexLocation + DIRECTIONS.up] !== 1 &&
        (currentLevelData[indexLocation + DIRECTIONS.down] === 1 ||
          currentLevelData[indexLocation + DIRECTIONS.down] === 2)) ||
      (currentLevelData[indexLocation + DIRECTIONS.down] === 4 &&
        currentLevelData[indexLocation + DIRECTIONS.up] === 0) ||
      (currentLevelArray[indexLocation + DIRECTIONS.left].classList.contains(
        "lower-wall"
      ) &&
        currentLevelData[indexLocation + DIRECTIONS.right] === 1) ||
      (currentLevelArray[indexLocation + DIRECTIONS.left].classList.contains(
        "upper-left-corner"
      ) &&
        currentLevelData[indexLocation + DIRECTIONS.left] === 1)
    ) {
      if (gridItem.classList.contains("right-wall")) {
        gridItem.classList.remove("right-wall");
        if (currentLevelData[indexLocation + DIRECTIONS.down] !== 2) {
          gridItem.classList.add("upper-left-corner");
        } else {
          gridItem.classList.add("lower-wall");
        }
      } else if (gridItem.classList.contains("left-wall")) {
        gridItem.classList.remove("left-wall");
        if (currentLevelData[indexLocation + DIRECTIONS.down] !== 2) {
          gridItem.classList.add("upper-right-corner");
        } else {
          gridItem.classList.add("lower-wall");
        }
      } else if (
        currentLevelData[indexLocation + (DIRECTIONS.up + DIRECTIONS.right)] === 1 &&
        currentLevelData[indexLocation + (DIRECTIONS.up + DIRECTIONS.left)] === 1
      ) {
        if (currentLevelData[indexLocation + DIRECTIONS.down] === 1) {
          if (
            currentLevelData[indexLocation + (DIRECTIONS.down + DIRECTIONS.left)] !==
            1
          ) {
            gridItem.classList.add("upper-right-wall", "wall");
          } else if (
            currentLevelData[indexLocation + (DIRECTIONS.down + DIRECTIONS.right)] !==
            1
          ) {
            gridItem.classList.add("upper-left-wall", "wall");
          }
        } else {
          gridItem.classList.add("upper-wall", "wall");
        }
      } else if (
        currentLevelData[indexLocation + (DIRECTIONS.up + DIRECTIONS.right)] === 1 &&
        currentLevelData[indexLocation + (DIRECTIONS.down + DIRECTIONS.right)] === 1
      ) {
        if (currentLevelData[indexLocation + DIRECTIONS.up] === 1) {
          if (
            currentLevelData[indexLocation + (DIRECTIONS.up + DIRECTIONS.left)] !== 1
          ) {
            gridItem.classList.add("lower-right-wall", "wall");
          }
        } else {
          gridItem.classList.add("lower-wall", "wall");
        }
      } else {
        gridItem.classList.add("lower-wall", "wall");
      }
    } else if (
      (currentLevelData[indexLocation + DIRECTIONS.down] !== 1 &&
        (currentLevelData[indexLocation + DIRECTIONS.up] === 1 ||
          currentLevelData[indexLocation - 28] === 2)) ||
      (currentLevelData[indexLocation - 28] === 4 &&
        currentLevelData[indexLocation + 28] === 0) ||
      (currentLevelArray[indexLocation - 1].classList.contains("upper-wall") &&
        currentLevelData[indexLocation + 1] === 1) ||
      (currentLevelArray[indexLocation - 1].classList.contains("lower-left-corner") &&
        currentLevelData[indexLocation + 1] === 1)
    ) {
      if (gridItem.classList.contains("right-wall")) {
        gridItem.classList.remove("right-wall");
        gridItem.classList.add("lower-left-corner");
      } else if (gridItem.classList.contains("left-wall")) {
        gridItem.classList.remove("left-wall");
        gridItem.classList.add("lower-right-corner");
      } else if (
        currentLevelData[indexLocation + (DIRECTIONS.up + DIRECTIONS.right)] === 1 &&
        currentLevelData[indexLocation + (DIRECTIONS.up + DIRECTIONS.left)] === 1
      ) {
        if (currentLevelData[indexLocation + DIRECTIONS.down] === 1) {
          if (
            currentLevelData[indexLocation + (DIRECTIONS.down + DIRECTIONS.left)] !==
            1
          ) {
            gridItem.classList.add("upper-right-wall", "wall");
          }
        } else {
          gridItem.classList.add("upper-wall", "wall");
        }
      } else {
        gridItem.classList.add("upper-wall", "wall");
      }
    } else {
      if (
        currentLevelData[indexLocation + (DIRECTIONS.up + DIRECTIONS.right)] === 1 &&
        currentLevelData[indexLocation + (DIRECTIONS.up + DIRECTIONS.left)] === 1
      ) {
        if (
          currentLevelData[indexLocation + DIRECTIONS.down] === 1 &&
          currentLevelData[indexLocation + (DIRECTIONS.down + DIRECTIONS.right)] !== 1
        ) {
          gridItem.classList.add("upper-left-wall", "wall");
        }
      } else {
        if (
          currentLevelData[indexLocation + DIRECTIONS.up] === 1 &&
          currentLevelData[indexLocation + (DIRECTIONS.up + DIRECTIONS.right)] !== 1
        ) {
          gridItem.classList.add("lower-left-wall", "wall");
        }
      }
    }
  }
};

const addLifeIndicator = () => {
  let grid = document.querySelector(".grid");
  let lifeIndicator = createElement("div", grid, "life-indicator");

  for (let i = 0; i < currentLives; i++) {
    createElement("div", lifeIndicator, "life-icon");
  }
};

const incrementScore = (point) => {
  let scoreLabel = document.querySelector(".score");
  currentScore += point;
  pointsToExtraLife += point;
  scoreLabel.innerHTML = currentScore;
  if (pointsToExtraLife > EXTRA_LIFE_SCORE_REQUIREMENT) {
    pointsToExtraLife -= EXTRA_LIFE_SCORE_REQUIREMENT;
    playAudio("sfx/extra_life.mp3");
    updateLives(++currentLives);
  }
};

const updateLives = (lifeAmt) => {
  currentLives = lifeAmt;

  if (currentLives < 0) {
    currentLives = 0;
  } else {
    let lifeIcons = document.querySelectorAll(".life-icon");
    if (lifeIcons.length > currentLives) {
      for (let i = 0; i < lifeIcons.length - currentLives; i++) {
        let index = lifeIcons.length - (1 + i);
        lifeIcons[index].style.animationName = "shrink";
        setTimeout(() => {
          lifeIcons[index].remove();
        }, 500);
      }
    } else if (lifeIcons.length < currentLives) {
      let lifeIndicator = document.querySelector(".life-indicator");
      for (let i = 0; i < currentLives - lifeIcons.length; i++) {
        let lifeIcon = createElement("div", lifeIndicator, "life-icon");
        lifeIcon.style.animation = "appear 0.5s 1";
      }
    }
  }

  let livesLabel = document.querySelector(".lives");
  livesLabel.innerHTML = currentLives;
};

const startGame = () => {
  if (gameIsActive) return;
  gameIsActive = true;
  playAudio("sfx/level_start.mp3");
  let timerID = NaN;
  let delayInSeconds = Math.floor(GAME_START_DELAY);
  let remainderDelay = GAME_START_DELAY % delayInSeconds;

  // Create timer label and add to grid container
  let grid = document.querySelector(".grid");
  let startTimerLabel = createElement("div", grid, "start-timer", "");
  updateLives(currentLives);

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

const stopGame = (timeBeforeReset = 0) => {
  gameIsActive = false;
  clearInterval(pacmanTimerID);
  if (ghostSirenSFX) ghostSirenSFX.pause();

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
  let blinkySpeed = Math.max(200, 250 - levelsComplete * 10);
  let pinkySpeed = Math.max(350, 400 - levelsComplete * 10);
  let inkySpeed = Math.max(350, 300 - levelsComplete * 10);
  let clydeSpeed = Math.max(450, 500 - levelsComplete * 10);
  ghosts = [
    new Ghost("blinky", 294, blinkySpeed, 0),
    new Ghost("pinky", 376, pinkySpeed, 1100),
    new Ghost("inky", 377, inkySpeed, 2200),
    new Ghost("clyde", 378, clydeSpeed, 3300),
  ];
};

const clearGame = () => {
  // Reset lives and score count if lives is 0
  if (currentLives <= 0) {
    updateLives(STARTING_LIVES);
    currentScore = 0;
    levelsComplete = 0;
    ghostsEaten = 0;
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
    } else if (currentLevelData[i] === 1) {
      styleWall(currentLevelArray[i], i);
      currentLevelArray[i].classList.add(i);
    }
  }
};

const gameOver = () => {
  pelletsLeft = 0;
  updateHighScores();
  // If new high score acheived, display text and then reset high score value indicator
  displayGameText(newHighScore ? "New Highscore!" : "Game Over!", 2500, () => {
    shouldResetGame = true;
    displayHighScores();
    newHighScore = false;
    highScoreIndex = -1;
    clearGame();
  });
};

const displayGameText = (text, displayTime, actionAfterDisplay) => {
  // Create game text label and add to grid container
  let grid = document.querySelector(".grid");
  createElement("div", grid, "game-text-label", text);
  // After given display time, remove text and complete action after display
  setTimeout(() => {
    removeGameTextDisplay();
    actionAfterDisplay();
  }, displayTime);
};

const removeGameTextDisplay = () => {
  // Find game text label and remove it
  let gameTextLabel = document.querySelector(".game-text-label");
  gameTextLabel.remove();
};

const resetGame = () => {
  resetCharacters();
  if (currentLives > 0) {
    if (pelletsLeft <= 0) {
      clearGame();
    }
    startGame();
  } else {
    let lifeIndicator = document.querySelector(".life-indicator");
    lifeIndicator.remove();
    gameOver();
  }
};

const displayHighScores = () => {
  let modal = createModal("highscore-modal", "Top High Scores");

  let highScoreContent = createElement("div", modal, "modal-content");

  let table = createElement("table", highScoreContent, "highscore-table");
  let headerRow = createElement("tr", table, "header-row");

  createElement("th", headerRow, "rank-label", "Rank");
  createElement("th", headerRow, "date-label", "Date");
  createElement("th", headerRow, "score-label", "Score");
  createElement("th", headerRow, "ghosts-eaten-label", "Ghosts Eaten");
  createElement("th", headerRow, "date-label", "Levels Complete");

  // Get list of high scores from local storage in parsed format
  let highScoreList = JSON.parse(localStorage.getItem("highscores"));
  highScoreList = highScoreList ? highScoreList : [];

  // Iterate through high scores
  for (let i = 0; i < HIGH_SCORES_DISPLAYABLE; i++) {
    let highScore = highScoreList[i];
    if (highScore === undefined) {
      highScore = {
        date: "-",
        score: "-",
        ghosts: "-",
        levels: "-",
      };
    }
    let scoreRow = createElement("tr", table, "score-row");
    // If row matches player's score, change font to yellow
    if (i === highScoreIndex) scoreRow.style.color = "yellow";

    createElement("td", scoreRow, "rank", i + 1);
    createElement("td", scoreRow, "date", highScore.date);
    createElement("td", scoreRow, "score", highScore.score);
    createElement("td", scoreRow, "ghosts-eaten", highScore.ghosts);
    createElement("td", scoreRow, "levels-complete", highScore.levels);
  }
};

const sortHighScores = (highScoreList, currentStats) => {
  let sortedHighScores = [...highScoreList, currentStats];

  // sort high scores by ascending values starting with score, then levels complete, then ghosts eaten (else don't sort)
  sortedHighScores = [currentStats, ...highScoreList].sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    } else if (a.levelsComplete !== b.levelsComplete) {
      return b.levelsComplete - a.levelsComplete;
    } else if (a.ghostsEaten !== b.ghostsEaten) {
      return b.ghostsEaten - a.ghostsEaten;
    } else {
      // return true so current stats aren't accidentally counted as high score when matching another existing score
      return true;
    }
  });

  highScoreIndex = sortedHighScores.indexOf(currentStats);

  if (highScoreIndex === 0) {
    newHighScore = true;
  }

  return sortedHighScores;
};

const updateHighScores = () => {
  if (typeof Storage !== "undefined") {
    let currentDate = new Date().toLocaleString();

    let currentStats = {
      date: currentDate,
      score: currentScore,
      ghosts: ghostsEaten,
      levels: levelsComplete,
    };

    let savedHighScores = JSON.parse(localStorage.getItem("highscores"));
    // Verify not null (if not, keep value; otherwise, value is empty array)
    savedHighScores = savedHighScores ? savedHighScores : [];

    let updatedHighScores = sortHighScores(savedHighScores, currentStats);

    window.localStorage.setItem("highscores", JSON.stringify(updatedHighScores));
  }
};

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
  playAudio("sfx/pacman_death.mp3");
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
      // Flash warning when preparing to unscare
      setTimeout(() => {
        this.classList.push("flash");
      }, POWER_PELLET_TIME - GHOST_WARNING_TIME);
    } else {
      currentLevelArray[this.currentIndex].classList.remove("scared");
      currentLevelArray[this.currentIndex].classList.remove("flash");
      this.classList = this.classList.filter(
        (elem) => elem !== "scared" && elem !== "flash"
      );
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
    if (
      currentLevelArray[this.currentIndex].classList.length >
        this.classList.length + 1 &&
      !currentLevelArray[this.currentIndex].classList.contains("pacman")
    ) {
      currentLevelArray[this.currentIndex].classList.remove(this.name);
    } else {
      currentLevelArray[this.currentIndex].classList.remove(...this.classList);
    }
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
    ghostsEaten++;
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
  new Ghost("blinky", 294, 250, 0),
  new Ghost("pinky", 376, 400, 1100),
  new Ghost("inky", 377, 300, 2200),
  new Ghost("clyde", 378, 500, 3300),
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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((registration) => {
      console.log("SW Registered!");
      console.log(registration);
    })
    .catch((error) => {
      console.log("SW Registration Failed.");
      console.log(error);
    });
} else {
  console.log("PWA not supported.");
}
