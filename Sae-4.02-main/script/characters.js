import { filterObjects, depositedItems, clearDepositedItems } from './objects.js';

let data;

fetch("./data/data.json")
    .then((response) => response.json())
    .then((jsonData) => {
        data = jsonData;
        generateRandomNumbers(); // Call generateRandomNumbers after data is fetched
    });

let randomNumberPerson;
let randomNumberQuestion;

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

function AskQuestion() {
    let questions = data.Tasks;
    let question = questions.find((item) => item.id === randomNumberQuestion);
    // console.log("Question :", question);
    let texte = question.text;
    let person = document.querySelector(`.person${randomNumberPerson}`);

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

const sounds = [
    './models/sounds/Mumbling-1.mp3',
    './models/sounds/Mumbling-2.mp3',
    './models/sounds/Mumbling-3.mp3'
];

let randomSoundIndex = Math.floor(Math.random() * sounds.length);
let AskSound = new Audio(sounds[randomSoundIndex]);
AskSound.volume = 0.25; // volume de la question

function PersonArrival() {
    const scene = document.querySelector("a-scene");
    const entity = document.createElement("a-entity");
    entity.setAttribute("class", `person${randomNumberPerson}`);
    entity.setAttribute("id", `person${randomNumberPerson}`);
    entity.setAttribute("gltf-model", `#person${randomNumberPerson}`);
    entity.setAttribute("position", "0 0 10");
    entity.setAttribute("rotation", "0 180 0");
    entity.setAttribute("scale", "1.5 1.7 1.5");
    scene.appendChild(entity);

    entity.setAttribute(
        "animation-mixer",
        "clip: Armature|Walk; loop: repeat; timeScale: 1"
    );

    entity.setAttribute(
        "animation",
        "property: position; to: 0 0 5; dur: 3000; easing: linear"
    );

    entity.addEventListener("animationcomplete", function () {
        let entity = document.querySelector(`.person${randomNumberPerson}`);
        if (entity) {
            entity.setAttribute(
                "animation-mixer",
                "clip: Armature|Idle; loop: repeat; timeScale: 1",
            );

            AskSound.play(); // Play the sound after the animation is complete
        } else {
            // console.error(`Person entity with class person${randomNumberPerson} not found.`);
        }

        AskQuestion();
    });
}

function PersonDeparture() {
    let question = data.Tasks.find((item) => item.id === randomNumberQuestion);
    let needed = question.needed || question.Needed; // Check both 'needed' and 'Needed' keys

    // Check if all needed items are deposited
    let backgroundMusic = new Audio('./models/sounds/Score_Up_sound.mp3');
    backgroundMusic.volume = 0.3; // volume du score
    let allItemsPresent = Object.entries(needed).every(([key, value]) => {
        let depositedItem = depositedItems.find(
            (item) =>
                (item.key === "color" && item.value === key) ||
                (item.key === "shape" && item.value === key) ||
                (item.key === "material" && item.value === key) ||
                (item.key === "use" && item.value === key)
        );

        if (depositedItem) {
            if (depositedItem.count >= value) {
                // console.log(`Objet avec ${depositedItem.key} ${depositedItem.value} trouvé en quantité suffisante`);
                backgroundMusic.play();
                return true;
            } else {
                // console.log(`Objet avec ${depositedItem.key} ${depositedItem.value} trouvé mais pas en quantité suffisante`);
                return false;
            }
        } else {
            // console.log(`Objet avec ${key} non trouvé`);
            return false;
        }
    });

    // console.log("Needed Items:", needed);
    // console.log("Deposited Items:", depositedItems);

    let Score = question.points || question.Points;
    // console.log("Score :", Score);

    let ScoreBoard = document.getElementById("ScoreBoard");

    if (allItemsPresent) {
        let entity = document.querySelector(`.person${randomNumberPerson}`);

        clearDepositedItems() // Reset deposited items after person departure

        let currentScore = parseInt(ScoreBoard.getAttribute("value")) || 0;
        ScoreBoard.setAttribute("value", currentScore + Score);
        console.log("ScoreBoard :", ScoreBoard.getAttribute("value"));

        // Supprime les objets qui sont en contact avec la table (DepositZone)
        const depositZoneEntity = document.querySelector("#DepositZone");
        if (depositZoneEntity) {
            const depositZone = new THREE.Box3().setFromObject(depositZoneEntity.object3D);
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

            entity.addEventListener("animationcomplete", function () {
                if (entity.parentNode) {
                    entity.parentNode.removeChild(entity);
                    // console.log("Person departed !");

                    generateRandomNumbers();
                    PersonArrival(); // Ensure PersonArrival is called after the departing entity is removed
                } else {
                    // console.error("Parent node not found for entity.");
                }
            });
        }
    } else {
        setTimeout(() => {
            PersonDeparture();
        }, 1500);
    }
}

export { PersonArrival, RemoveCharacters, InitTask, PersonDeparture };