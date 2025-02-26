import { MultipleObject, MoveTheObjects, RemoveObjects, data } from "../entities/objects.js";
import { PersonArrival, InitTask, RemoveCharacters, PersonDeparture, setQuestionNumber, setPersonNumber } from "../entities/characters.js";
import { Timer, setTimer } from "./timerManager.js";
import { clearBackup } from "./backupManager.js";

// Configuration par défaut du jeu
let gameConfig = {
    score: 0,
    timer: 0,
    nextQuestion: null,
    nextCharacter: null,
};

// make a loading screen that disappears when all assets are loaded
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const scene = document.getElementById('scene');
    const assets = document.querySelector('a-assets');

    function checkIfLoaded() {
        if (assets.hasLoaded) {
            loadingScreen.style.display = 'none';
            scene.style.display = 'block';
        } else {
            setTimeout(checkIfLoaded, 100);
        }
    }

    checkIfLoaded();
});

// Fonction pour démarrer le jeu (par défaut ou depuis un backup)
function startGame(config = gameConfig, isBackup = false) {

    const startMenu = document.querySelector("#StartMenu");
    const tutorialMenu = document.querySelector("#tutoMenu");

    if (startMenu) {
        startMenu.remove();
    } else if (tutorialMenu) {
        tutorialMenu.remove();
    }

    // Appliquer les valeurs de config
    const scoreBoard = document.querySelector("#ScoreBoard");
    scoreBoard.setAttribute("value", config.score);

    const timerElement = document.querySelector("#timer");
    timerElement.setAttribute("value", config.timer);

    RemoveObjects();
    RemoveCharacters();
    // Met à jour directement `randomNumberQuestion` dans characters.js
    const NbrPerson = data.Characteres.length;
    const NbrQuestion = data.Tasks.length;
    setQuestionNumber(config.nextQuestion || Math.floor(Math.random() * NbrQuestion) + 1);
    setPersonNumber(config.nextCharacter || Math.floor(Math.random() * NbrPerson) + 1);

    window.randomNumberPerson = config.nextCharacter || Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
        InitTask();
        if (!isBackup) {
            Timer();
        }
        PersonArrival();
        PersonDeparture();
        MultipleObject();
        requestAnimationFrame(MoveTheObjects);
    }, 500);

    console.log("Game started with config:", config, "isBackup:", isBackup);
}

// Fonction pour détecter le clic sur le bouton Start
function handleStartButtonClick() {
    startGame();
}

// Ajouter un écouteur de clic sur le bouton Start après chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    const startButtons = document.querySelectorAll("#startButton, #tutoMenu #startButton");
    if (startButtons.length > 0) {
        startButtons.forEach(button => {
            button.addEventListener("click", handleStartButtonClick);
        });
    } else {
        console.error("startButton not found in the DOM.");
    }
});

function StopGame() {
    clearBackup();
    RemoveObjects();
    RemoveCharacters();
    console.log("Game Over !");
}

setTimer();

export { startGame, StopGame };
