// Register a new AFRAME component for the checkbox functionality
// Vérifiez si l'élément avec l'ID darkModeButton existe
const darkModeButton = document.querySelector("#darkModeButton");

AFRAME.registerComponent('darkmode-checkbox', {
  schema: {
      checked: { type: 'boolean', default: false }
  },

  init: function () {
      this.el.addEventListener('click', () => {
          // Vérifiez si l'élément cliqué est la boîte avec l'ID 'darkModeButton'
          if (this.el.id === 'darkModeButton') {
              const checked = !this.data.checked;
              this.el.setAttribute('darkmode-checkbox', 'checked', checked);
              
              if (checked) {
                  darkModeOn();
                  console.log("checked");
              } else {
                  darkModeOff();
                  console.log("unchecked");
              }
          }
      });
  }
});

// Dark mode setup
const lights = document.querySelectorAll("a-light");
const camera = document.querySelector("a-camera");

function darkModeOn() {
  // Turn off all lights except the fire light
  lights.forEach((light) => light.setAttribute("intensity", "0"));

  // Create a new spot light attached to the camera
  const headlamp = document.createElement("a-light");
  headlamp.setAttribute("id", "FrontLight");
  headlamp.setAttribute("type", "spot");
  headlamp.setAttribute("intensity", "1.2");
  headlamp.setAttribute("angle", "20");
  headlamp.setAttribute("color", "#fff");
  headlamp.setAttribute("distance", "100");
  headlamp.setAttribute("penumbra", "0.2");
  headlamp.setAttribute("decay", "1");
  headlamp.setAttribute("position", "0 0 0");

  camera.appendChild(headlamp);
}

function darkModeOff() {
  // Turn on all lights
  lights.forEach((light) => light.setAttribute("intensity", "0.8"));
  // Remove the headlamp
  const headlamp = document.querySelector("#FrontLight");
  if (headlamp) headlamp.remove();
}

export { darkModeButton, darkModeOn, darkModeOff };