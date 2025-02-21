import { MultipleObject, MoveTheObjects, RemoveObjects } from "./objects.js";
import { PersonArrival, InitTask, RemoveCharacters, PersonDeparture } from "./characters.js";

let gameStarted = false;

function handleStartButtonClick(element) {
    if (element.getAttribute("id") === "startButton") {
        document.querySelector("#StartMenu")?.remove();
        init();
    }
}

function startGame() {
    AFRAME.registerComponent("event-listener", {
        init: function () {
            this.el.addEventListener("hit", () => handleStartButtonClick(this.el));
            this.el.addEventListener("click", () => handleStartButtonClick(this.el));
        },
    });
}

function init() {
    MultipleObject();
    PersonArrival();
    InitTask();
    Timer();
    requestAnimationFrame(MoveTheObjects); // Ensure MoveTheObjects is called continuously
    console.log("Game started !");
}

let Game_end = new Audio('./models/sounds/Game_end.mp3');
Game_end.volume = 0.3; // volume de la fin de jeu

function Timer() {
    let textTime = document.querySelector("#timer");
    let countdown = 10; // changer la valeur de countdown pour changer la durée du jeu
    let timer = setInterval(function () {
        if (countdown > 0) {
            countdown--;
            textTime.setAttribute("value", countdown);
        } else {
            clearInterval(timer);
            StopGame();
        }
    }, 1000);
}

function StartMenu() {
    const scene = document.querySelector("a-scene");

    const startMenu = document.createElement("a-entity");
    startMenu.setAttribute("id", "StartMenu");

    // Title of the game
    const title = document.createElement("a-text");
    title.setAttribute("id", "title");
    title.setAttribute("value", "Convoyor the game");
    title.setAttribute("font", "kelsonsans");
    title.setAttribute("color", "white");
    title.setAttribute("align", "center");
    title.setAttribute("position", "-0.5 5.5 -2");
    title.setAttribute("rotation", "45 0 0");
    title.setAttribute("scale", "2 2 2");

    // Rules text of the game
    const rules = document.createElement("a-text");
    rules.setAttribute("id", "rules");
    rules.setAttribute("font", "kelsonsans");
    rules.setAttribute("value", "Welcome to Conveyor the game ! Your goal here is simple: people will come here to ask you to give them objects with specific attributes, like color or shape. You will need to take the object from the conveyor and deposit them in the deposit box to your left. Once you give them what they wanted, they will leave and a new person will come and your score will go up. Got it? Then let's play!");
    rules.setAttribute("color", "white");
    rules.setAttribute("position", "-0.5 4.37778 -2");
    rules.setAttribute("rotation", "10 0 0");
    rules.setAttribute("text", "align: center; width: 3");

    // Start button
    const startButton = document.createElement("a-box");
    startButton.setAttribute("id", "startButton");
    startButton.setAttribute("color", "black");
    startButton.setAttribute("opacity", "0.5");
    startButton.setAttribute("position", "-0.5 3 -2");
    startButton.setAttribute("scale", "1 0.5 0.5");
    startButton.setAttribute("geometry", "primitive: box; depth: 0.3; height: 0.92; width: 1");
    startButton.setAttribute("rotation", "-30 0 0");
    startButton.setAttribute("event-listener", "");

    // Start button text
    const startButtonText = document.createElement("a-text");
    startButtonText.setAttribute("font", "kelsonsans");
    startButtonText.setAttribute("value", "Start");
    startButtonText.setAttribute("color", "yellow");
    startButtonText.setAttribute("align", "center");
    startButtonText.setAttribute("position", "0 0 0.3");
    startButtonText.setAttribute("text", "width: 7; antialias: true");

    // DarkMode button
    const darkModeButton = document.createElement("a-box");
    darkModeButton.setAttribute("id", "darkModeButton");
    darkModeButton.setAttribute("color", "black");
    darkModeButton.setAttribute("opacity", "0.5");
    darkModeButton.setAttribute("geometry", "depth: 0.2; height: 0.53; width: 1.2");
    darkModeButton.setAttribute("position", "-2.91279 3.00677 -2.3911");
    darkModeButton.setAttribute("rotation", "-25 25 0");

    // DarkMode button text
    const darkModeButtonText = document.createElement("a-text");
    darkModeButtonText.setAttribute("font", "kelsonsans");
    darkModeButtonText.setAttribute("value", "Dark Mode");
    darkModeButtonText.setAttribute("text", "color: red");
    darkModeButtonText.setAttribute("position", "-0.55 0.01 0.1");

    darkModeButton.appendChild(darkModeButtonText);
    startButton.appendChild(startButtonText);

    startMenu.appendChild(darkModeButton);
    startMenu.appendChild(title);
    startMenu.appendChild(rules);
    startMenu.appendChild(startButton);
    scene.appendChild(startMenu);
}

function StopGame() {
    gameStarted = false;
    const scene = document.querySelector("a-scene");

    RemoveObjects();
    RemoveCharacters();
    Game_end.play();

    // Display game over text
    const endMenu = document.createElement("a-entity");
    endMenu.setAttribute("id", "EndMenu");
    endMenu.setAttribute("position", "0 3.66735 -2.3");
    endMenu.setAttribute("rotation", "29.999999999999996 0 0");
    endMenu.setAttribute("scale", "2 2 2");

    // Texte de fin de jeu
    const gameOverText = document.createElement("a-text");
    gameOverText.setAttribute("value", "Time's Up ! Your Score :");
    gameOverText.setAttribute("align", "center");
    gameOverText.setAttribute("color", "red");
    gameOverText.setAttribute("text", "color: yellow; font: kelsonsans; side: double; width: 1; wrapCount: 12");
    gameOverText.setAttribute("position", "0 0.83546 -0.48235");

    // valeur du score actuel
    const gameOverScore = document.createElement("a-text");
    let score = document.getElementById("ScoreBoard").getAttribute("value");
    gameOverScore.setAttribute("value", score);
    gameOverScore.setAttribute("id", "gameOverScore");
    gameOverScore.setAttribute("align", "center");
    gameOverScore.setAttribute("color", "red");
    gameOverScore.setAttribute("text", "color: #ffffff; side: double; width: 1.5; wrapCount: 10");
    gameOverScore.setAttribute("position", "0 -0.35 -0.0053");

    gameOverText.appendChild(gameOverScore);

    // Texte du plus haut score
    const highScoreText = document.createElement("a-text");
    highScoreText.setAttribute("value", "High score :");
    highScoreText.setAttribute("align", "center");
    highScoreText.setAttribute("color", "red");
    highScoreText.setAttribute("text", "color: yellow; font: kelsonsans; side: double; width: 1; wrapCount: 12");
    highScoreText.setAttribute("position", "0 0.20721 -0.11963");

    // Valeur du plus haut score
    const highScoreValue = document.createElement("a-text");
    highScoreValue.setAttribute("id", "highScoreValue");

    let currentHighScore = localStorage.getItem("highScore");

    if (currentHighScore === null || parseInt(score) > parseInt(currentHighScore)) {
        currentHighScore = score;
        localStorage.setItem("highScore", score);
    }

    highScoreValue.setAttribute("value", currentHighScore);

    highScoreValue.setAttribute("align", "center");
    highScoreValue.setAttribute("color", "red");
    highScoreValue.setAttribute("text", "color: #ffffff; side: double; width: 1.5; wrapCount: 10");
    highScoreValue.setAttribute("position", "0 -0.3 -0.02313");

    highScoreText.appendChild(highScoreValue);

    // Bouton de redémarrage
    const restartButton = document.createElement("a-box");
    restartButton.setAttribute("id", "restartButton");
    restartButton.setAttribute("color", "black");
    restartButton.setAttribute("opacity", "0.5");
    restartButton.setAttribute("position", "0 -0.75536 -0.14555");
    restartButton.setAttribute("scale", "1 0.5 0.5");
    restartButton.setAttribute("geometry", "depth: 0.3; height: 0.7; width: 0.94");
    restartButton.setAttribute("rotation", "-45 0 0");
    restartButton.setAttribute("event-listener", "");

    // Texte du bouton de redémarrage
    const restartText = document.createElement("a-text");
    restartText.setAttribute("font", "kelsonsans");
    restartText.setAttribute("value", "Replay");
    restartText.setAttribute("color", "yellow");
    restartText.setAttribute("align", "center");
    restartText.setAttribute("position", "0 0.00512 0.16891");
    restartText.setAttribute("text", "width: 7");
    restartText.setAttribute("scale", "0.8 1 1");

    restartButton.appendChild(restartText);
    restartButton.addEventListener("click", () => {
        document.querySelector("#EndMenu")?.remove();
        StartMenu();
    });

    endMenu.appendChild(restartButton);

    endMenu.appendChild(gameOverText);
    endMenu.appendChild(highScoreText);
    scene.appendChild(endMenu);
}

StartMenu();
startGame();

export {StartMenu, StopGame, gameStarted};