let grabSound = new Audio("./assets/sounds/Pick_item.mp3");
grabSound.volume = 1; // Sound of the object being picked up

AFRAME.registerComponent("oculus-grab", {
  init: function () {
    let el = this.el;
    let isGrabbed = false;
    let controller = null;

    this.onGrabStart = function (evt) {
      let raycaster = evt.target.components.raycaster;
      if (!raycaster) return;
      let intersectedEls = raycaster.intersectedEls;
      if (intersectedEls.length === 0 || intersectedEls[0] !== el) return; // only take the first intersected element

      isGrabbed = true;
      controller = evt.target;
      grabSound.play();
      el.setAttribute("dynamic-body", "mass: 0");
      el.setAttribute("grab", "");
      controller.addEventListener("triggerup", this.onGrabEnd);
    };

    this.onGrabEnd = function () {
      if (isGrabbed) {
        el.setAttribute(
          "dynamic-body",
          "mass: 1; restitution: 0.6; friction: 0.5"
        );
        el.removeAttribute("grab");
        isGrabbed = false;
        controller.removeEventListener("triggerup", this.onGrabEnd);
        controller = null;
      }
    };

    this.tick = function () {
      if (isGrabbed && controller) {
        let controllerPos = new THREE.Vector3();
        let controllerQuat = new THREE.Quaternion();

        controller.object3D.getWorldPosition(controllerPos);
        controller.object3D.getWorldQuaternion(controllerQuat);

        let offset = new THREE.Vector3(0, 0, -1.5);
        offset.applyQuaternion(controllerQuat);

        let newPosition = controllerPos.clone().add(offset);
        el.object3D.position.copy(newPosition);
      }
    };

    el.sceneEl.addEventListener("triggerdown", this.onGrabStart);
  },
});

// Code for the browser version
AFRAME.registerComponent("click-grab", {

  init: function () {
    let el = this.el;
    let scene = el.sceneEl;
    let camera = document.querySelector("a-camera");
    let isGrabbed = false;

    function updatePosition(event) {
      if (isGrabbed) {
        let cameraPos = new THREE.Vector3();
        let cameraQuat = new THREE.Quaternion();

        camera.object3D.getWorldPosition(cameraPos);
        camera.object3D.getWorldQuaternion(cameraQuat);

        // Convert the mouse position to a 3D position
        let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        let offset = new THREE.Vector3(mouseX * 0.5, mouseY * 0.5, -2.5); // Always 2.5 meters in front of the camera
        offset.applyQuaternion(cameraQuat); // Put the object in front of the camera

        let newPosition = cameraPos.clone().add(offset);
        el.object3D.position.copy(newPosition);
      }
    }

    el.addEventListener("mousedown", function () {
      isGrabbed = true;
      grabSound.play();
      el.setAttribute("dynamic-body", "mass: 0"); // Deactivate gravity
      el.setAttribute("grab", "");
      window.addEventListener("mousemove", updatePosition);
    });

    scene.addEventListener("mouseup", function () {
      if (isGrabbed) {
        el.setAttribute(
          "dynamic-body",
          "mass: 1; restitution: 0.6; friction: 0.5"
        ); // Reativating gravity
        el.removeAttribute("grab");
        isGrabbed = false;
        window.removeEventListener("mousemove", updatePosition);
      }
    });
  },
});