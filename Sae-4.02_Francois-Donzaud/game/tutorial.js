import { createObject } from "../entities/objects.js";

let tutoMenu = document.createElement("a-entity");
const buttonStartTuto = document.getElementById("startTutorial");

function createTuto() {
    document.querySelector("#StartMenu").remove();

    // Create tutorial menu
    tutoMenu.setAttribute("id", "tutoMenu");
    tutoMenu.setAttribute("position", "0 3 -3");

    // Title
    let title = document.createElement("a-text");
    title.setAttribute("value", "Tutorial");
    title.setAttribute("font", "kelsonsans");
    title.setAttribute("color", "white");
    title.setAttribute("align", "center");
    title.setAttribute("position", "0 2 0");
    tutoMenu.appendChild(title);

    // Tutorial content
    let content = document.createElement("a-text");
    content.setAttribute("value", "Welcome to Conveyor the game ! In this tutorial, we'll cover the basics of the game, and let you play around with the physics engine. You can now turn your head or use your mouse to see the surroundings. Have fun discovering the game !");
    content.setAttribute("color", "white");
    content.setAttribute("position", "0 1 0");
    content.setAttribute("align", "center");
    content.setAttribute("width", "4");
    tutoMenu.appendChild(content);

    createObject("./assets/models/item/Apple.glb", "0.5 0.5 0.5", "box");

    document.querySelector("a-scene").appendChild(tutoMenu);
}

buttonStartTuto.addEventListener("click", createTuto);