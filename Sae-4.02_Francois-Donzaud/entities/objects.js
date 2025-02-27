let data;
let objectsArray = [];
let depositedItems = [];

fetch("./data/data.json")
  .then((response) => response.json())
  .then((jsonData) => {
    data = jsonData;
  });

function clearDepositedItems() {
    depositedItems.length = 0;
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

let DestroySound = new Audio("./assets/sounds/Fire_destroy.mp3");
DestroySound.volume = 0.3;
let grabSound = new Audio("./assets/sounds/Pick_item.mp3");
grabSound.volume = 1;

function MoveTheObjects() {
  const conveyorBox = new THREE.Box3().setFromObject(
    document.querySelector("#conveyor").object3D
  );
  objectsArray.forEach((obj) => {
    if (obj.isGrabbed) return;
    const box = new THREE.Box3().setFromObject(obj.entity.object3D);
    if (!box.intersectsBox(conveyorBox)) return;
    const position = obj.entity.object3D.position;
    position.x -= 0.008;
    obj.entity.object3D.position.copy(position);
    obj.entity.components["dynamic-body"].body.position.copy(position);

    if (position.x <= -9) {
      obj.entity.parentNode.removeChild(obj.entity);
      DestroySound.play(); // Play the destroy sound
      objectsArray = objectsArray.filter((o) => o.id !== obj.id);
      depositedItems = depositedItems.filter((item) => item.id !== obj.id);
    }
  });
  updateDepositedItems();
}

AFRAME.registerComponent('move-objects', {
  tick: function () {
    MoveTheObjects();
  }
});

function createObject(modelPath, scale, id) {
  const scene = document.querySelector("a-scene");
  const entity = document.createElement("a-entity");
  entity.setAttribute("gltf-model", modelPath);
  entity.setAttribute("position", "6 6 -1.25");
  entity.setAttribute("scale", scale);
  entity.setAttribute("dynamic-body", "shape: box; mass: 1;");
  entity.setAttribute("click-grab", "");
  entity.setAttribute("move-objects", "");
  entity.setAttribute("oculus-grab", "");
  entity.setAttribute("id", `${id}-${Date.now()}`);
  entity.setAttribute("class", "collidable");
  scene.appendChild(entity);
  objectsArray.push({
    id: entity.getAttribute("id"),
    entity,
    isGrabbed: false,
  });
}

function RemoveObjects() {
  // Remove all objects and persons from the scene
  objectsArray.forEach((obj) => {
    if (obj.entity && obj.entity.parentNode) {
      obj.entity.parentNode.removeChild(obj.entity);
    }
  });
}

function RandomObject() {
  const randomNumber = Math.floor(Math.random() * data.Items.length) + 1;
  let obj = data.Items.find((item) => item.id === randomNumber);
  if (obj) {
    createObject(
      obj.modelPath,
      `${obj.scale.x} ${obj.scale.y} ${obj.scale.z}`,
      obj.name
    );
  }
}

function MultipleObject() {
  let randomObjectInterval = setInterval(() => {
    let textTime = document.querySelector("#timer");
    if (textTime && parseInt(textTime.getAttribute("value")) > 0) {
      RandomObject();
    } else {
      clearInterval(randomObjectInterval);
    }
  }, 2000);

  objectsArray = [];
}

function filterObjects(depositZone) {
  for (let i = objectsArray.length - 1; i >= 0; i--) {
      const obj = objectsArray[i];
      
      if (!obj.entity || !obj.entity.object3D) continue;
      
      const box = new THREE.Box3().setFromObject(obj.entity.object3D);
      if (box.intersectsBox(depositZone)) {
          obj.entity.parentNode.removeChild(obj.entity);
          objectsArray.splice(i, 1); // Supprime l'objet directement du tableau
      }
  }
}

let poofSound = new Audio("./assets/sounds/Poof.mp3");
poofSound.volume = 0.3;

function timeToDie() {
  const currentTime = Date.now();
  objectsArray.forEach((obj) => {
    if (!obj.creationTime) {
      obj.creationTime = currentTime;
    }
    const elapsedTime = (currentTime - obj.creationTime) / 1000; // Convert to seconds
    const remainingTime = 15 - elapsedTime; // Assuming a lifespan of 10 seconds
    
    if (remainingTime <= 4) {
      let itemData = data.Items.find((item) => item.modelPath === obj.entity.getAttribute("gltf-model"));
      if (itemData) {
      obj.entity.setAttribute("animation", `property: scale; to: ${itemData.scale.x * 0.9} ${itemData.scale.y * 0.9} ${itemData.scale.z * 0.9}; dur: 500; dir: alternate; loop: true`); // Add a pulsing animation
      }
    }

    if (remainingTime <= 0) {
      if (obj.entity && obj.entity.parentNode) {
        obj.entity.setAttribute("animation", "property: scale; to: 0 0 0; dur: 250; dir: alternate; loop: false"); // Add a shrinking animation
        obj.entity.parentNode.removeChild(obj.entity);
        poofSound.play(); // Play the grab sound
      }
      objectsArray = objectsArray.filter((o) => o.id !== obj.id);
    }
  });
}

setInterval(timeToDie, 1000); // Check every second

export { depositedItems, filterObjects, clearDepositedItems, MultipleObject, MoveTheObjects, RemoveObjects, timeToDie, updateDepositedItems, createObject, RandomObject, objectsArray, data};
