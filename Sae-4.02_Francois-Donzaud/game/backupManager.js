import { startGame } from "./menu.js";
import { Timer } from "./timerManager.js";

// Vérifie si une sauvegarde existe et active le bouton backup
function checkBackup() {
    const backup = localStorage.getItem("gameBackup");
    const backupButton = document.querySelector("#loadBackup");

    if (backup) {
        backupButton.setAttribute("color", "yellow");
        backupButton.addEventListener("click", restoreBackup);
    } else {
        backupButton.setAttribute("color", "gray");
        backupButton.removeEventListener("click", restoreBackup);
    }
}

// Sauvegarde l'état du jeu après chaque question
function saveGame(score, timer, nextQuestion, nextCharacter) {
    const gameData = {
        score: score,
        timer: timer,
        nextQuestion: nextQuestion,
        nextCharacter: nextCharacter
    };

    localStorage.setItem("gameBackup", JSON.stringify(gameData));
}

// Restauration de la sauvegarde
function restoreBackup() {
    const backupData = JSON.parse(localStorage.getItem("gameBackup"));

    if (!backupData) return;

    console.log("Restoring backup...", backupData);

    // Met à jour la configuration du jeu
    const restoredConfig = {
        score: backupData.score,
        timer: backupData.timer,
        nextQuestion: backupData.nextQuestion,
        nextCharacter: backupData.nextCharacter
    };

    // Lancer la partie avec les valeurs restaurées (isBackup = true)
    startGame(restoredConfig, true);

    // Attendre un peu et relancer le timer avec la bonne valeur
    setTimeout(() => {
        Timer();
    }, 100);

    localStorage.removeItem("gameBackup");
}

// Supprime la sauvegarde à la fin du jeu
function clearBackup() {
    localStorage.removeItem("gameBackup");
}

document.addEventListener("DOMContentLoaded", checkBackup);

export { saveGame, restoreBackup, clearBackup };
