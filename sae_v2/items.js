let data;
let objectsArray = [];
let gameStarted = false;
let depositedItems = []; //Les objets sur la table sont stockés ici

fetch("./data.json")
  .then((response) => response.json())
  .then((jsonData) => {
    data = jsonData;
    RandomObject();
    AskQuestion();
  });
let randomNumberPerson;
let randomNumberQuestion;

function generateRandomNumbers() {
  randomNumberPerson = Math.floor(Math.random() * 6) + 1;
  randomNumberQuestion = Math.floor(Math.random() * 5) + 1;
}

generateRandomNumbers();

function AskQuestion() {
  let questions = data.Task;
  let question = questions.find((item) => item.id === randomNumberQuestion);
  let needed = question.needed || question.Needed;
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
    console.error(
      `Person entity with class person${randomNumberPerson} not found.`
    );
  }

  PersonDeparture();
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
  entity.setAttribute(
    "animation-mixer",
    "clip: Armature|Walk; loop: repeat; timeScale: 1"
  );
  scene.appendChild(entity);
  entity.setAttribute(
    "animation",
    "property: position; to: 0 0 5; dur: 3000; easing: linear"
  );
  entity.addEventListener("animationcomplete", function () {
    let entity = document.querySelector(`.person${randomNumberPerson}`);
    if (entity) {
      entity.setAttribute(
        "animation-mixer",
        "clip: Armature|Idle; loop: repeat; timeScale: 1"
      );

    } else {
      console.error(
        `Person entity with class person${randomNumberPerson} not found.`
      );
    }

    AskQuestion();
  });
}

function updateDepositedItems() {
  // Create a bounding box for the deposit zone
  const depositZoneEntity = document.querySelector("#DepositZone");
  if (!depositZoneEntity) {
    depositedItems = [];
    return;
  }
  const depositZone = new THREE.Box3().setFromObject(
    depositZoneEntity.object3D
  );
  // Filter objects that are inside the deposit zone
  depositedItems = objectsArray
    .filter((obj) => {
      if (!obj.entity || !obj.entity.object3D) {
        return false;
      }
      const box = new THREE.Box3().setFromObject(obj.entity.object3D);
      return box.intersectsBox(depositZone);
    })
    .map((obj) => {
      let itemData = data.Items.find(
        (item) => item.modelPath === obj.entity.getAttribute("gltf-model")
      );
      return itemData ? itemData.attributes : null;
    })
    .filter((item) => item !== null);
  // Create an attribute counter
  let attributeCounter = {};
  depositedItems.forEach((attributes) => {
    Object.entries(attributes).forEach(([key, value]) => {
      let attributeKey = `${key}:${value}`;
      attributeCounter[attributeKey] =
        (attributeCounter[attributeKey] || 0) + 1;
    });
  });
  // Convert attributeCounter to an array format and store in depositedItems
  depositedItems = Object.entries(attributeCounter).map(
    ([attribute, count]) => {
      let [key, value] = attribute.split(":");
      return { key, value, count };
    }
  );
}

function MoveTheObjects() {
  const conveyorBox = new THREE.Box3().setFromObject(
    document.querySelector("#conveyor").object3D
  );
  objectsArray.forEach((obj) => {
    if (obj.isGrabbed) return;
    const box = new THREE.Box3().setFromObject(obj.entity.object3D);
    if (!box.intersectsBox(conveyorBox)) return;
    const position = obj.entity.object3D.position;
    position.x -= 0.02;
    obj.entity.object3D.position.copy(position);
    obj.entity.body.position.copy(position); // Synchroniser la position du corps physique

    if (position.x <= -9) {
      obj.entity.parentNode.removeChild(obj.entity);
      objectsArray = objectsArray.filter((o) => o.id !== obj.id);
      depositedItems = depositedItems.filter((item) => item.id !== obj.id);
    }
  });
  updateDepositedItems();
  requestAnimationFrame(MoveTheObjects);
}


function PersonDeparture() {
  let question = data.Task.find((item) => item.id === randomNumberQuestion);
  let needed = question.needed || question.Needed; // Check both 'needed' and 'Needed' keys

  // Check if all needed items are deposited
  let allItemsPresent = Object.entries(needed).every(([key, value]) => {
    let depositedItem = depositedItems.find(
      (item) =>
        (item.key === "color" && item.value === key) ||
        (item.key === "shape" && item.value === key) // Check both 'color' and 'shape' keys
    );

    if (depositedItem) {
      if (depositedItem.count >= value) {
        console.log(
          `Objet avec ${depositedItem.key} ${depositedItem.value} trouvé en quantité suffisante`
        );
        return true;
      } else {
        console.log(
          `Objet avec ${depositedItem.key} ${depositedItem.value} trouvé mais pas en quantité suffisante`
        );
        return false;
      }
    } else {
      console.log(`Objet avec ${key} non trouvé`);
      return false;
    }
  });

  console.log("Needed Items:", needed);
  console.log("Deposited Items:", depositedItems);

  if (allItemsPresent) {
    let entity = document.querySelector(`.person${randomNumberPerson}`);

    depositedItems = []; // Reset deposited items after person departure
    
    // Supprime les objets qui sont en contact avec la table (DepositZone)
    const depositZoneEntity = document.querySelector("#DepositZone");
    if (depositZoneEntity) {
      const depositZone = new THREE.Box3().setFromObject(depositZoneEntity.object3D);
      objectsArray = objectsArray.filter((obj) => {
      if (!obj.entity || !obj.entity.object3D) {
        return true;
      }
      const box = new THREE.Box3().setFromObject(obj.entity.object3D);
      if (box.intersectsBox(depositZone)) {
        obj.entity.parentNode.removeChild(obj.entity);
        return false;
      }
      return true;
      });
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
          console.log("Person departed !");

          generateRandomNumbers();
          PersonArrival(); // Ensure PersonArrival is called after the departing entity is removed
        } else {
          console.error("Parent node not found for entity.");
        }
      });
    }
  } else {
    setTimeout(() => {
      PersonDeparture();
    }, 1500);
  }
}

function createObject(modelPath, scale, id) {
  const scene = document.querySelector("a-scene");
  const entity = document.createElement("a-entity");
  entity.setAttribute("gltf-model", modelPath);
  entity.setAttribute("position", "6 6 -1.25");
  entity.setAttribute("scale", scale);
  entity.setAttribute("dynamic-body", "shape: box; mass: 1;");
  entity.setAttribute("click-grab", "");
  entity.setAttribute("oculus-grab", "");
  entity.setAttribute("kinematic-body", "");
  entity.setAttribute("id", `${id}-${Date.now()}`);
  entity.setAttribute("class", "collidable");
  scene.appendChild(entity);
  objectsArray.push({
    id: entity.getAttribute("id"),
    entity,
    isGrabbed: false,
  });
}

function RandomObject() {
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  let obj = data.Items.find((item) => item.id === randomNumber);
  if (obj) {
    createObject(
      obj.modelPath,
      `${obj.scale.x} ${obj.scale.y} ${obj.scale.z}`,
      obj.name
    );
  }
}

// Function to create multiple objects at intervals
function MultipleObject() {
  // Set an interval to call the RandomObject function every 2 seconds
  setInterval(RandomObject, 2000);
}

function init() {
  if (gameStarted) return;
  gameStarted = true;
  MultipleObject();
  PersonArrival();
  requestAnimationFrame(MoveTheObjects); // Ensure MoveTheObjects is called continuously
  setTimeout(() => {
    if (document.querySelector(`.person${randomNumberPerson}`)) {
      PersonDeparture();
    } else {
      console.error(
        `Person entity with class person${randomNumberPerson} not found.`
      );
      setTimeout(PersonArrival, 0); // Ensure PersonArrival is called if the person entity is not found
    }
  }, 3000); // Ensure PersonDeparture is called after PersonArrival
  console.log("Game started !");
}

function handleStartButtonClick(element) {
  if (element.getAttribute("id") === "startButton") {
    document.querySelector("#StartMenu")?.remove();
    init();
  }
}


function startGame() {
  AFRAME.registerComponent("event-listener", {
    init: function () {
      this.el.addEventListener("hit", () => handleStartButtonClick(this.el));
      this.el.addEventListener("click", () => handleStartButtonClick(this.el));
    },
  });
}

startGame();
