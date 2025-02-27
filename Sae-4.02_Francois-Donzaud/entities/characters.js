import {
  filterObjects,
  depositedItems,
  clearDepositedItems,
} from "./objects.js";
import { saveGame } from "../game/backupManager.js";

let data;

fetch("./data/data.json")
  .then((response) => response.json())
  .then((jsonData) => {
    data = jsonData;
    generateRandomNumbers(); // Call generateRandomNumbers after data is fetched
  });

let randomNumberPerson;
let randomNumberQuestion;

function setQuestionNumber(value) {
  randomNumberQuestion = value;
  console.log("Updated randomNumberQuestion:", randomNumberQuestion);
}

function setPersonNumber(value) {
  randomNumberPerson = value;
  console.log("Updated randomNumberPerson:", randomNumberPerson);
}

function generateRandomNumbers() {
  const NbrPerson = data.Characteres.length;
  const NbrQuestion = data.Tasks.length;
  randomNumberPerson = Math.floor(Math.random() * NbrPerson) + 1;
  randomNumberQuestion = Math.floor(Math.random() * NbrQuestion) + 1;
}

function InitTask() {
  setTimeout(() => {
    if (document.querySelector(`.person${randomNumberPerson}`)) {
      PersonDeparture();
    } else {
      // console.error(`Person entity with class person${randomNumberPerson} not found.`);
      setTimeout(PersonArrival, 0); // Ensure PersonArrival is called if the person entity is not found
    }
  }, 3000); // Ensure PersonDeparture is called after PersonArrival
}

let AskSound; // Define AskSound globally

function AskQuestion() {
  let questions = data.Tasks;
  let question = questions.find((item) => item.id === randomNumberQuestion);
  let texte = question.text;
  let person = document.querySelector(`.person${randomNumberPerson}`);

  AskSound = new Audio(question.sound);
  AskSound.volume = 0.30; // volume de la question

  AskSound.play();

  if (person) {
    let text = document.createElement("a-text");
    text.setAttribute("value", texte);
    text.setAttribute("align", "center");
    text.setAttribute("color", "white");
    text.setAttribute("position", "1.5 2 1");
    text.setAttribute("rotation", "0 -30 0");
    text.setAttribute("text", "width: 2; wrapCount: 25");
    person.appendChild(text);
  } else {
    // console.error(`Person entity with class person${randomNumberPerson} not found.`);
  }

  PersonDeparture();
}

function RemoveCharacters() {
  const persons = document.querySelectorAll("[class^='person']");
  persons.forEach((person) => {
    if (person.parentNode) {
      person.parentNode.removeChild(person);
    }
  });
}

function PersonArrival() {
  const scene = document.querySelector("a-scene");
  const entity = document.createElement("a-entity");
  entity.setAttribute("class", `person${randomNumberPerson}`);
  entity.setAttribute("id", `person${randomNumberPerson}`);
  entity.setAttribute("gltf-model", `#person${randomNumberPerson}`);
  entity.setAttribute("position", "0 0 10");
  entity.setAttribute("rotation", "0 180 0");
  entity.setAttribute("scale", "1.5 1.7 1.5");
  entity.setAttribute("play-sound-on-animation-complete", ""); // Attachez le composant ici
  scene.appendChild(entity);

  entity.setAttribute(
    "animation-mixer",
    "clip: Armature|Walk; loop: repeat; timeScale: 1"
  );

  // Définir l'animation de marche avec un nom spécifique
  entity.setAttribute(
    "animation__walk",
    "property: position; to: 0 0 5; dur: 3000; easing: linear"
  );

  // Écouter l'événement animationcomplete pour l'animation spécifique
  entity.addEventListener("animationcomplete", function (event) {
    // Vérifiez si l'animation terminée est 'animation__walk'
    if (event.detail.name === "animation__walk") {
      let entity = document.querySelector(`.person${randomNumberPerson}`);
      if (entity) {
        entity.setAttribute(
          "animation-mixer",
          "clip: Armature|Idle; loop: repeat; timeScale: 1"
        );

        AskQuestion();

        // Sauvegarde immédiate après l'apparition du personnage et la nouvelle question
        let currentScore = document
          .getElementById("ScoreBoard")
          .getAttribute("value");
        let currentTimer = document
          .getElementById("timer")
          .getAttribute("value");

        saveGame(
          parseInt(currentScore),
          parseInt(currentTimer),
          randomNumberQuestion, // Sauvegarde la question qui vient d'apparaître
          randomNumberPerson // Sauvegarde le personnage actuel
        );
      }
    }
  });
}

// Enregistrement du composant en dehors de la fonction
AFRAME.registerComponent("play-sound-on-animation-complete", {
  init: function () {
    this.el.addEventListener("animationcomplete", (event) => {
      // Vérifiez si l'animation terminée est 'animation__walk'
      if (event.detail.name === "animation__walk") {
        // Resume the AudioContext after a user gesture
        if (AskSound.paused) {
          AskSound.play().catch((error) => {
            console.error("Error attempting to play", error);
          });
        }
      }
    });
  },
});

let taskCompleted = false;
let soundPlayed = false;

function depositedItemsChanged() {
    // Logic to check if deposited items have changed
    // This function should return true if items have changed, otherwise false
    // Implement the logic based on your application's requirements
    // For example, you can compare the current deposited items with the previous state
    let previousItems = JSON.parse(localStorage.getItem('previousDepositedItems')) || [];
    let currentItems = depositedItems;

    let hasChanged = previousItems.length !== currentItems.length || previousItems.some((item, index) => {
        return item.key !== currentItems[index].key || item.value !== currentItems[index].value;
    });

    if (hasChanged) {
        localStorage.setItem('previousDepositedItems', JSON.stringify(currentItems));
    }

    return hasChanged;
}

function PlayWrongItemSound() {
    let NoMusic = new Audio("./assets/sounds/Buzzer.mp3");
    NoMusic.volume = 0.2; // volume for the buzzer sound

    if (!soundPlayed || (soundPlayed && depositedItemsChanged())) {
        NoMusic.play();
        soundPlayed = true;
    } else {
        console.log("Le son a déjà été joué.");
    }
}

function checkAllItemsPresent(needed) {
  if (taskCompleted) return false; // Skip checking if the task is already completed

  return Object.entries(needed).every(([key, value]) => {

    let depositedItem = depositedItems.find(
      (item) =>
        (item.key === "color" && item.value === key) ||
        (item.key === "shape" && item.value === key) ||
        (item.key === "material" && item.value === key) ||
        (item.key === "use" && item.value === key)
    );

    let WrongItem = depositedItems.find(
      (item) =>
        (item.key === "color" && item.value !== key) ||
        (item.key === "shape" && item.value !== key) ||
        (item.key === "material" && item.value !== key) ||
        (item.key === "use" && item.value !== key)
    );

    let YesMusic = new Audio("./assets/sounds/Score_Up_sound.mp3");
    YesMusic.volume = 0.3; // volume for the score sound

    if (depositedItem && depositedItem.value === key) {
      console.log("Correct Item Detected");
      YesMusic.play();
      return true;
    } 
    
    if (WrongItem) {
        console.log("Wrong Item Detected");
        PlayWrongItemSound();
        return false;
    }
  });
}

function PersonDeparture() {
  let question = data.Tasks.find((item) => item.id === randomNumberQuestion);
  let needed = question.needed || question.Needed; // Check both 'needed' and 'Needed' keys

  if (checkAllItemsPresent(needed)) {
    taskCompleted = true; // Mark the task as completed

    let entity = document.querySelector(`.person${randomNumberPerson}`);

    AskSound.pause(); // Pause the question sound when the person departs

    clearDepositedItems(); // Reset deposited items after person departure

    let Score = question.points || question.Points;
    let ScoreBoard = document.getElementById("ScoreBoard");
    let currentScore = parseInt(ScoreBoard.getAttribute("value")) || 0;
    ScoreBoard.setAttribute("value", currentScore + Score);
    console.log("ScoreBoard :", ScoreBoard.getAttribute("value"));

    // Supprime les objets qui sont en contact avec la table (DepositZone)
    const depositZoneEntity = document.querySelector("#DepositZone");
    if (depositZoneEntity) {
      const depositZone = new THREE.Box3().setFromObject(
        depositZoneEntity.object3D
      );
      filterObjects(depositZone);
    }

    if (entity) {
      // Remove the question text
      let text = entity.querySelector("a-text");
      if (text) {
        entity.removeChild(text);
      }

      entity.setAttribute(
        "animation",
        "property: position; to: 0 0 10; dur: 3000; easing: linear"
      );
      entity.setAttribute(
        "animation-mixer",
        "clip: Armature|Walk; loop: repeat; timeScale: 1"
      );
      entity.setAttribute("rotation", "0 0 0");

      // Disable further checks during the departure animation
      entity.setAttribute("data-departing", "true");

      entity.addEventListener("animationcomplete", function () {
        if (entity.parentNode) {
          entity.parentNode.removeChild(entity);
          taskCompleted = false; // Reset task completion status for the next person
          generateRandomNumbers();
          PersonArrival(); // Ensure PersonArrival is called after the departing entity is removed
        }
      });
    }
  } else {
    // Play a sound when the wrong item is deposited
    // let NoMusic = new Audio('./assets/sounds/Wrong_Item.mp3');
    // NoMusic.volume = 0.3;
    // NoMusic.play();

    setTimeout(() => {
      PersonDeparture();
    }, 1500);
  }
}

export {
  PersonArrival,
  RemoveCharacters,
  InitTask,
  PersonDeparture,
  setQuestionNumber,
  setPersonNumber,
};
