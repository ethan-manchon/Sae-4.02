import { StopMenu } from "./endManager.js";

let time = 120; // Valeur par défaut

// Fonction pour ajuster le temps avant le démarrage
function setTimer() {
    const add = document.getElementById("increaseTimer");
    const dlt = document.getElementById("reduceTimer");
    const timer = document.getElementById("gameTimer");

    add.addEventListener("click", () => {
        if (time >= 300) return;
        time += 10;
        console.log("Time increased:", time);
        timer.setAttribute("value", time);
    });

    dlt.addEventListener("click", () => {
        if (time <= 30) return;
        time -= 10;
        console.log("Time decreased:", time);
        timer.setAttribute("value", time);
    });
}

// Fonction pour démarrer le timer
function Timer() {
    let textTime = document.querySelector("#timer");

    // Utiliser la valeur affichée dans l'élément HTML
    let countdown = parseInt(textTime.getAttribute("value")) || time;

    let timer = setInterval(function () {
        if (countdown > 0) {
            countdown--;
            textTime.setAttribute("value", countdown);
        } else {
            clearInterval(timer);
            StopMenu();
        }
    }, 1000);
}

export { setTimer, Timer };
