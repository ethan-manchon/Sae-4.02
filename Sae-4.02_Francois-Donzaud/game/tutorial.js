import { RandomObject } from "../entities/objects.js";
import { startGame } from "./menu.js";
import { darkModeOff, darkModeOn } from "./darkMode.js";

let tutoMenu = document.createElement("a-entity");
const buttonStartTuto = document.getElementById("startTutorial");

function createTuto() {
    document.querySelector("#StartMenu").remove();

    // Create tutorial menu
    tutoMenu.setAttribute("id", "tutoMenu");
    tutoMenu.setAttribute("position", "0 3 -2.10633");

    // Title
    let title = document.createElement("a-text");
    title.setAttribute("value", "Tutorial");
    title.setAttribute("font", "kelsonsans");
    title.setAttribute("color", "white");
    title.setAttribute("align", "center");
    title.setAttribute("position", "0 2 0");
    title.setAttribute("text", "width: 11");
    tutoMenu.appendChild(title);

    // Tutorial content
    let content = document.createElement("a-text");
    content.setAttribute("value", "Welcome to to this tutorial, have a look around to see how the game works and play with the mecanics.Once you feel ready click the button below to play the game. Have fun :)");
    content.setAttribute("font", "kelsonsans");
    content.setAttribute("color", "yellow");
    content.setAttribute("position", "0 1 0");
    content.setAttribute("align", "center");
    content.setAttribute("width", "4");
    tutoMenu.appendChild(content);

    // Play the game button
    let startButton = document.createElement("a-box");
    startButton.setAttribute("id", "startButton");
    startButton.setAttribute("color", "black");
    startButton.setAttribute("opacity", "0.5");
    startButton.setAttribute("position", "");
    startButton.setAttribute("scale", "1 0.5 0.5");
    startButton.setAttribute("class", "collidable");
    startButton.setAttribute("geometry", "depth: 0.3; height: 0.92");
    startButton.setAttribute("rotation", "-29.999999999999996 0 0");
    startButton.setAttribute("event-listener", "");
    startButton.addEventListener("click", () => {
        startGame();
    });

    let startButtonText = document.createElement("a-text");
    startButtonText.setAttribute("font", "kelsonsans");
    startButtonText.setAttribute("value", "Start");
    startButtonText.setAttribute("color", "yellow");
    startButtonText.setAttribute("align", "center");
    startButtonText.setAttribute("position", "0 0 0.3");
    startButtonText.setAttribute("text", "width: 7");

    startButton.appendChild(startButtonText);
    tutoMenu.appendChild(startButton);

    // Back button
    let backButton = document.createElement("a-box");
    backButton.setAttribute("id", "backButton");
    backButton.setAttribute("color", "black");
    backButton.setAttribute("opacity", "0.5");
    backButton.setAttribute("position", "-1.8 0 0");
    backButton.setAttribute("scale", "1 0.5 0.5");
    backButton.setAttribute("class", "collidable");
    backButton.setAttribute("geometry", "depth: 0.3; height: 0.92");
    backButton.setAttribute("rotation", "-30 0 0");
    backButton.addEventListener("click", () => {
        window.location.reload();
    });

    let backButtonText = document.createElement("a-text");
    backButtonText.setAttribute("font", "kelsonsans");
    backButtonText.setAttribute("value", "Return\nto Menu");
    backButtonText.setAttribute("color", "yellow");
    backButtonText.setAttribute("align", "center");
    backButtonText.setAttribute("position", "0 0 0.3");
    backButtonText.setAttribute("text", "color: red");

    backButton.appendChild(backButtonText);
    tutoMenu.appendChild(backButton);

    // Deposit Text
    let depositText = document.createElement("a-text");
    depositText.setAttribute("value", "This here, is the Deposit Zone, It's here that you will deposit the items asked by the peoples that will come here, if the item is ok it will disapear and you will gain score, if not you will know it ;)");
    depositText.setAttribute("font", "kelsonsans");
    depositText.setAttribute("color", "white");
    depositText.setAttribute("position", "-3.03653 0.45682 5.14353");
    depositText.setAttribute("align", "center");
    depositText.setAttribute("width", "4");
    depositText.setAttribute("rotation", "0 110 0");
    tutoMenu.appendChild(depositText);

    // Object text
    let objectText = document.createElement("a-text");
    objectText.setAttribute("value", "Up here is where the object will come from, they will automaticly slide on the conveyor belt, and you will have to grab them and deposit them in the deposit zone before they are destroyed");
    objectText.setAttribute("font", "kelsonsans");
    objectText.setAttribute("color", "white");
    objectText.setAttribute("position", "3.99021 0.668 1.333");
    objectText.setAttribute("align", "center");
    objectText.setAttribute("width", "4");
    objectText.setAttribute("rotation", "0 -70 0");
    objectText.setAttribute("text", "width: 2.25; wrapCount: 20");
    tutoMenu.appendChild(objectText);

    // HUD text
    let hudText = document.createElement("a-text");
    hudText.setAttribute("value", "There is your basic HUD with the score and the timer, your score will go up if you complete a task and the highest score will be saved, the timer will go down and if it reach 0 the game will end");
    hudText.setAttribute("font", "kelsonsans");
    hudText.setAttribute("color", "white");
    hudText.setAttribute("position", "3.16717 -0.7684 5.00576");
    hudText.setAttribute("align", "center");
    hudText.setAttribute("width", "4");
    hudText.setAttribute("text", "width: 3; wrapCount: 30");
    hudText.setAttribute("rotation", "-15 -100 0");
    tutoMenu.appendChild(hudText);

    // person and text
    let person = document.createElement("a-entity");
    person.setAttribute("id", "person1");
    person.setAttribute("gltf-model", "./assets/models/characters/Male1.glb");
    person.setAttribute("position", "0 -3 8.5");
    person.setAttribute("scale", "2 2 2");
    person.setAttribute("static-body", "shape: box; sphereRadius: NaN");
    person.setAttribute("animation-mixer", "clip: Armature|Idle");
    person.setAttribute("class", "collidable");
    person.setAttribute("rotation", "0 180 0");
    tutoMenu.appendChild(person);

    let personText = document.createElement("a-text");
    personText.setAttribute("value", "Here is one off your client, they will arrive here and ask you items with certain attributes (color, shape, size), you will have to find the right item and deposit it in the deposit zone");
    personText.setAttribute("font", "kelsonsans");
    personText.setAttribute("color", "white");
    personText.setAttribute("position", "0 1.82709 7.62968");
    personText.setAttribute("align", "center");
    personText.setAttribute("width", "4");
    personText.setAttribute("rotation", "20 180 0");
    personText.setAttribute("text", "width: 4.2; wrapCount: 35");
    tutoMenu.appendChild(personText);

    // Control text
    let controlText = document.createElement("a-text");
    controlText.setAttribute("value", "On the conveyor you can grab item using left click (on the mouse) or trigger (on the VR controller), you can also move the camera using the mouse or your head (if you have one of course)");
    controlText.setAttribute("font", "kelsonsans");
    controlText.setAttribute("color", "white");
    controlText.setAttribute("position", "-0.15369 -0.7383 0.8701");
    controlText.setAttribute("align", "center");
    controlText.setAttribute("width", "4");
    controlText.setAttribute("rotation", "-90 0 0");
    controlText.setAttribute("text", "width: 5.5; wrapCount: 60");
    tutoMenu.appendChild(controlText);

    // Dark mode 
    let darkModeButton = document.createElement("a-box");
    darkModeButton.setAttribute("id", "darkModeButton");
    darkModeButton.setAttribute("class", "collidable");
    darkModeButton.setAttribute("color", "black");
    darkModeButton.setAttribute("opacity", "0.5");
    darkModeButton.setAttribute("geometry", "depth: 0.2; height: 0.53; width: 1.2");
    darkModeButton.setAttribute("position", "-2 2 -0.2");
    darkModeButton.setAttribute("rotation", "0 0 0");
    darkModeButton.setAttribute("darkmode-checkbox", "");

    let darkModeText = document.createElement("a-text");
    darkModeText.setAttribute("font", "kelsonsans");
    darkModeText.setAttribute("value", "Dark Mode");
    darkModeText.setAttribute("color", "red");
    darkModeText.setAttribute("position", "-0.55 0.01 0.1");

    darkModeButton.appendChild(darkModeText);
    tutoMenu.appendChild(darkModeButton);

    RandomObject();
    setInterval(() => {
            RandomObject();
    }, 10000);

    document.querySelector("a-scene").appendChild(tutoMenu);
}

buttonStartTuto.addEventListener("click", createTuto);