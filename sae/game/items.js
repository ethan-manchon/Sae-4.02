    let data;

    fetch('./item.json')
      .then(response => response.json())
      .then(jsonData => {
        data = jsonData;
        console.log(data);
        RandomObject();
        AskQuestion();
      })

    function AskQuestion(){
      let questions = data.Task;

      const randomNumber = Math.floor(Math.random() * 9) + 1;
      let question = questions.find(item => item.id === randomNumber);
      let texte = question.text;

      console.log("une seul question random : ", texte);

      // faire apparaitre la question dans la scene au dessus du personnage
      let person = document.querySelector('.person1');

      let entity = document.createElement('a-text');
      entity.setAttribute('value', question.text);
      entity.setAttribute('align', 'center');
      entity.setAttribute('width', 3);
      entity.setAttribute('color', 'white');
      entity.setAttribute('position', '0 2.25 0');
      entity.setAttribute('text', 'width: 2.5; wrapCount: 30');
      person.appendChild(entity);
    }

    function PersonQuestion() {
      let entity = document.querySelector('.person1');
      entity.setAttribute('animation-mixer', "clip: Armature|Idle; loop: repeat; timeScale: 1");
      AskQuestion();
    }

    function PersonArrival() {
      // Crée un élément a-entity pour le personnage
      const scene = document.querySelector('a-scene');
      const entity = document.createElement('a-entity');
      entity.setAttribute('class', 'person1');
      entity.setAttribute('id', 'person1');
      entity.setAttribute('gltf-model', '#person1');
      entity.setAttribute('position', "0 0 10");
      entity.setAttribute('rotation', "0 180 0");
      entity.setAttribute('scale', "1.5 1.7 1.5");
      entity.setAttribute('animation-mixer', "clip: Armature|Walk; loop: repeat; timeScale: 1");
      scene.appendChild(entity);
      console.log('Person created !');

      // Ajouter une animation de transition pour que le personnage arrive
      entity.setAttribute('animation', "property: position; to: 0 0 5; dur: 3000; easing: linear");
      entity.addEventListener('animationcomplete', function() {
        PersonQuestion();
      });
    }

    function createObject(modelPath, scale, id) {
      const scene = document.querySelector('a-scene');
      const entity = document.createElement('a-entity');
      entity.setAttribute('gltf-model', modelPath);
      entity.setAttribute('position', "0 3 -4");
      entity.setAttribute('scale', scale);                                                          
      entity.setAttribute('dynamic-body', "shape: box; mass: 1;");
      entity.setAttribute('click-grab', "");
      entity.setAttribute('oculus-grab', "");
      entity.setAttribute('id', id);
      entity.setAttribute('class', "collidable");
      scene.appendChild(entity);
      console.log('Object created !');
    }

    function RandomObject() {
      // Génère un nombre aléatoire entre 1 et 6
      const randomNumber = Math.floor(Math.random() * 6) + 1;

      // Récupère l'objet correspondant au nombre aléatoire dans le fichier JSON
      let obj = data.Items.find(item => item.id === randomNumber);
      console.log(obj);
      console.log(randomNumber);

      // Vérifie si l'objet existe
      if (obj) {
    // Crée l'objet dans la scène avec les informations du JSON
    createObject(
        obj.modelPath, // Chemin du modèle
        `${obj.scale.x} ${obj.scale.y} ${obj.scale.z}`, // Échelle par défaut
        obj.name, // ID de l'objet
    );    
  } 
  };

  let Deposit = document.getElementById("DepositZone");

  let Destroy = document.getElementById("DestroyItems");

  // Function to create multiple objects at intervals
  function MultipleObject() {
    // Set an interval to call the RandomObject function every 2 seconds
    setInterval(RandomObject, 2000);
  }

  // CONTINUER LA FONCTION ICI !!!
  function MoveTheObjects() {
    // Sélectionner tous les objets avec la classe 'collidable' qui sont sur le convoyeur
    const conveyor = document.querySelector('.conveyor');
    const objects = RandomObject();
    
    // Parcourir chaque objet et le déplacer
    objects.forEach(object => {
      // Vérifier la position actuelle de l'objet
      const currentPosition = object.getAttribute('position');
    
      // Calculer la nouvelle position (par exemple, déplacer l'objet vers la gauche)
      const newPosition = {
        x: currentPosition.x - 2, // Déplacer vers la gauche
        y: currentPosition.y,
        z: currentPosition.z
      };
    
      // Définir la nouvelle position de l'objet
      object.setAttribute('position', newPosition);
    
      // Appeler cette fonction à intervalles réguliers pour animer le mouvement
      requestAnimationFrame(MoveTheObjects);
    }
  )}

  function init(){
    // Décommenter cette fonction pour générer des objets aléatoires toutes les 2 secondes
    MultipleObject();
    PersonArrival();
    // Appeler la fonction pour démarrer le mouvement des objets
    MoveTheObjects();
    console.log("Game started !");
  }

  function handleStartButtonClick(element) {
    const elementId = element.getAttribute('id');
    console.log(`Element with ID ${elementId} interacted!`);

    // Vérifier si l'élément touché est la boîte startButton
    if (elementId === 'startButton') {

      // Supprimer l'élément StartMenu
      const startMenu = document.querySelector('#StartMenu');
      if (startMenu) {
        startMenu.parentNode.removeChild(startMenu);
        console.log('StartMenu removed!');
      }

      // supprimer l'élément DepositText
      const DepositText = document.querySelector('#DepositText');
      if (DepositText) {
        DepositText.parentNode.removeChild(DepositText);
        console.log('DepositText removed!');
      }

      // Initialiser le jeu
      init();
    }
  }

  function startGame() {
    AFRAME.registerComponent('event-listener', {
      init: function () {
        this.el.addEventListener('hit', function (evt) {
          handleStartButtonClick(this);
        });

        this.el.addEventListener('click', function (evt) {
          handleStartButtonClick(this);
        });
      }
    });
  }

  startGame();