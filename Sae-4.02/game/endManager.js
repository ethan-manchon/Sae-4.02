import { RemoveObjects } from "../entities/objects.js";
import { RemoveCharacters } from "../entities/characters.js";
import { clearBackup } from "./backupManager.js";

let Game_end = new Audio('./assets/sounds/Game_end.mp3');
Game_end.volume = 0.3; // Volume of the sound

function StopMenu() {
    const scene = document.querySelector("a-scene");

    // Clean the environement 
    clearBackup();
    RemoveObjects();
    RemoveCharacters();
    Game_end.play();

    // Creation of the End Menu
    const endMenu = document.createElement("a-entity");
    endMenu.setAttribute("id", "EndMenu");
    endMenu.setAttribute("position", "0 3.667 -2.3");
    endMenu.setAttribute("rotation", "30 0 0");
    endMenu.setAttribute("scale", "2 2 2");

    // Replay Button
    const restartButton = document.createElement("a-box");
    restartButton.setAttribute("id", "restartButton");
    restartButton.setAttribute("class", "collidable");
    restartButton.setAttribute("opacity", "0.5");
    restartButton.setAttribute("color", "green");
    restartButton.setAttribute("geometry", "depth: 0.1; height: 0.4; width: 1.27");
    restartButton.setAttribute("position", "0 -0.68117 -0.01704");
    restartButton.setAttribute("rotation", "-45 0 0");
    restartButton.setAttribute("material", "color: black");

    const restartText = document.createElement("a-text");
    restartText.setAttribute("value", "Main Menu");
    restartText.setAttribute("align", "center");
    restartText.setAttribute("color", "white");
    restartText.setAttribute("position", "0 0.03256 0.06651");
    restartText.setAttribute("text", "color: yellow");

    restartButton.appendChild(restartText);
    restartButton.addEventListener("click", () => {
        window.location.reload(); // Complete reload of the page
    });

    // Text Game Over
    const gameOverText = document.createElement("a-text");
    gameOverText.setAttribute("value", "Time's Up ! Your Score :");
    gameOverText.setAttribute("align", "center");
    gameOverText.setAttribute("color", "red");
    gameOverText.setAttribute("text", "color: yellow; font: kelsonsans; side: double; width: 1; wrapCount: 12");
    gameOverText.setAttribute("position", "0 0.83546 -0.48235");

    // Score
    const gameOverScore = document.createElement("a-text");
    let score = document.getElementById("ScoreBoard").getAttribute("value");
    gameOverScore.setAttribute("value", score);
    gameOverScore.setAttribute("id", "gameOverScore");
    gameOverScore.setAttribute("align", "center");
    gameOverScore.setAttribute("color", "red");
    gameOverScore.setAttribute("text", "color: #ffffff; side: double; width: 1.5; wrapCount: 10");
    gameOverScore.setAttribute("position", "0 -0.35 -0.0053");
    gameOverText.appendChild(gameOverScore);

    // Best score
    const highScoreText = document.createElement("a-text");
    highScoreText.setAttribute("value", "High score :");
    highScoreText.setAttribute("align", "center");
    highScoreText.setAttribute("color", "red");
    highScoreText.setAttribute("text", "color: yellow; font: kelsonsans; side: double; width: 1; wrapCount: 12");
    highScoreText.setAttribute("position", "0 0.11576 -0.39069");
    highScoreText.setAttribute("rotation", "-25 0 0");

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

    endMenu.appendChild(restartButton);
    endMenu.appendChild(gameOverText);
    endMenu.appendChild(highScoreText);
    scene.appendChild(endMenu);
}

export { StopMenu };
