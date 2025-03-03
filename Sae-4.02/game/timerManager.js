import { StopMenu } from "./endManager.js";

let time = 120; // Default value

// Update the timer value
function setTimer() {
    const add = document.querySelector("#increaseTimer");
    const dlt = document.querySelector("#reduceTimer");
    const timer = document.querySelector("#gameTimer");

    add.addEventListener("click", (event) => {
        if (time >= 300) return;
        time += 10;
        console.log("Time increased:", time);
        timer.setAttribute("value", time);
        event.stopPropagation(); // Prevent propagation of the event
    });

    dlt.addEventListener("click", (event) => {
        if (time <= 30) return;
        time -= 10;
        console.log("Time decreased:", time);
        timer.setAttribute("value", time);
        event.stopPropagation(); // Prevent propagation of the event
    });
}

// Launch the timer
function Timer() {
    let textTime = document.querySelector("#timer");

    // Use the default value if the value is not set
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
