import { startGame } from "./menu.js";
import { Timer } from "./timerManager.js";

// Check if a backup is available and update the button accordingly
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

// Save the game state
function saveGame(score, timer, nextQuestion, nextCharacter) {
    const gameData = {
        score: score,
        timer: timer,
        nextQuestion: nextQuestion,
        nextCharacter: nextCharacter
    };

    localStorage.setItem("gameBackup", JSON.stringify(gameData));
}

// Load the game state
function restoreBackup() {
    const backupData = JSON.parse(localStorage.getItem("gameBackup"));

    if (!backupData) return;

    console.log("Restoring backup...", backupData);

    // Save the backup data in a new object
    const restoredConfig = {
        score: backupData.score,
        timer: backupData.timer,
        nextQuestion: backupData.nextQuestion,
        nextCharacter: backupData.nextCharacter
    };

    // Launch the game with the restored data
    startGame(restoredConfig, true);

    // Wait for the game to start before restoring
    setTimeout(() => {
        Timer();
    }, 100);

    localStorage.removeItem("gameBackup");
}

// Delete the backup
function clearBackup() {
    localStorage.removeItem("gameBackup");
}

document.addEventListener("DOMContentLoaded", checkBackup);

export { saveGame, restoreBackup, clearBackup };
