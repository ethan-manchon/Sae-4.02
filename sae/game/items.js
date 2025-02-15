let data;
let objectsArray = [];
let gameStarted = false;
let depositedItems = []; //Les objets sur la table sont stockés ici

fetch('./item.json')
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData;
    RandomObject();
    AskQuestion();
  });

const randomNumberPerson = Math.floor(Math.random() * 6) + 1;
const randomNumberQuestion = Math.floor(Math.random() * 9) + 1;

function AskQuestion() {
  let questions = data.Task;
  let question = questions.find(item => item.id === randomNumberQuestion);
  let needed = question.needed || question.Needed;
  let texte = question.text;
  let person = document.querySelector(`.person${randomNumberPerson}`);
  let text = document.createElement('a-text');
  text.setAttribute('value', texte);
  text.setAttribute('align', 'center');
  text.setAttribute('width', 3);
  text.setAttribute('color', 'white');
  text.setAttribute('position', '0 2.25 0');
  text.setAttribute('text', 'width: 2.5; wrapCount: 30');
  person.appendChild(text);
  console.log(needed);
}

function PersonArrival() {
  const scene = document.querySelector('a-scene');
  const entity = document.createElement('a-entity');
  entity.setAttribute('class', `person${randomNumberPerson}`);
  entity.setAttribute('id', `person${randomNumberPerson}`);
  entity.setAttribute('gltf-model', `#person${randomNumberPerson}`);
  entity.setAttribute('position', "0 0 10");
  entity.setAttribute('rotation', "0 180 0");
  entity.setAttribute('scale', "1.5 1.7 1.5");
  entity.setAttribute('animation-mixer', "clip: Armature|Walk; loop: repeat; timeScale: 1");
  scene.appendChild(entity);
  entity.setAttribute('animation', "property: position; to: 0 0 5; dur: 3000; easing: linear");
  entity.addEventListener('animationcomplete', function() {
    entity.setAttribute('animation-mixer', "clip: Armature|Idle; loop: repeat; timeScale: 1");
    AskQuestion();
  });
}

  // CONTINUER LA FONCTION ICI !!!
  function PersonDeparture() {
    let question = data.Task.find(item => item.id === randomNumberQuestion);
    let needed = question.needed || question.Needed;
    let DepositZone = document.getElementById("DepositZone");
    let objects = document.querySelectorAll('[dynamic-body]');
    let objectDeposited = [];
  }
  
function updateDepositedItems() {
  // Create a bounding box for the deposit zone
  const depositZoneEntity = document.querySelector('#DepositZone');
  if (!depositZoneEntity) {
      depositedItems = [];
      return;
  }
  const depositZone = new THREE.Box3().setFromObject(depositZoneEntity.object3D);
  // Filter objects that are inside the deposit zone
  depositedItems = objectsArray.filter(obj => {
      if (!obj.entity || !obj.entity.object3D) {
          return false;
      }
      const box = new THREE.Box3().setFromObject(obj.entity.object3D);
      return box.intersectsBox(depositZone);
  }).map(obj => {
      let itemData = data.Items.find(item => item.modelPath === obj.entity.getAttribute('gltf-model'));
      return itemData ? itemData.attributes : null;
  }).filter(item => item !== null);
  // Create an attribute counter
  let attributeCounter = {};
  depositedItems.forEach(attributes => {
      Object.entries(attributes).forEach(([key, value]) => {
          let attributeKey = `${key}:${value}`;
          attributeCounter[attributeKey] = (attributeCounter[attributeKey] || 0) + 1;
      });
  });
  // Convert attributeCounter to an array format and store in depositedItems
  depositedItems = Object.entries(attributeCounter).map(([attribute, count]) => {
      let [key, value] = attribute.split(':');
      return { key, value, count };
  });
  console.log(depositedItems);
}
function MoveTheObjects() {
  const conveyorBox = new THREE.Box3().setFromObject(document.querySelector('#conveyor').object3D);
  objectsArray.forEach(obj => {
    if (obj.isGrabbed) return;
    const box = new THREE.Box3().setFromObject(obj.entity.object3D);
    if (!box.intersectsBox(conveyorBox)) return;
    const position = obj.entity.object3D.position;
    position.x -= 0.02;
    obj.entity.object3D.position.copy(position);
    obj.entity.components['dynamic-body'].body.position.copy(position);

    if (position.x <= -9) {  
      obj.entity.parentNode.removeChild(obj.entity);
      objectsArray = objectsArray.filter(o => o.id !== obj.id);
      depositedItems = depositedItems.filter(item => item.id !== obj.id);
    }
  });
  updateDepositedItems();
  requestAnimationFrame(MoveTheObjects);
}

function RandomObject() {
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  let obj = data.Items.find(item => item.id === randomNumber);
  if (obj) {
    createObject(obj.modelPath, `${obj.scale.x} ${obj.scale.y} ${obj.scale.z}`, obj.name);
  }
}

function createObject(modelPath, scale, id) {
  const scene = document.querySelector('a-scene');
  const entity = document.createElement('a-entity');
  entity.setAttribute('gltf-model', modelPath);
  entity.setAttribute('position', "6 6 -1.25");
  entity.setAttribute('scale', scale);
  entity.setAttribute('dynamic-body', "shape: box; mass: 1;");
  entity.setAttribute('click-grab', "");
  entity.setAttribute('oculus-grab', "");
  entity.setAttribute('id', `${id}-${Date.now()}`);
  entity.setAttribute('class', "collidable");
  scene.appendChild(entity);
  objectsArray.push({ id: entity.getAttribute('id'), entity, isGrabbed: false });
}

function MultipleObject() {
  setInterval(RandomObject, 2000);
}

function init() {
  if (gameStarted) return;
  gameStarted = true;
  MultipleObject();
  PersonArrival();
  MoveTheObjects();
  PersonDeparture();
}

function handleStartButtonClick(element) {
  if (element.getAttribute('id') === 'startButton') {
    document.querySelector('#StartMenu')?.remove();
    init();
  }
}

AFRAME.registerComponent('event-listener', {
  init: function () {
    this.el.addEventListener('click', () => handleStartButtonClick(this.el));
  }
});
