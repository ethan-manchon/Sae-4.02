// Enregistrez le composant 'music-checkbox'
AFRAME.registerComponent("music-checkbox", {
  schema: {
    checked: { type: "boolean", default: false },
  },

  init: function () {
    this.el.addEventListener("click", (event) => {
      console.log("Clicked element ID:", this.el.id);
      // Vérifiez si l'élément cliqué est la boîte avec l'ID 'MusicButton' ou un de ses enfants
      if (this.el.closest("#MusicButton")) {
        const checked = !this.data.checked;
        this.el.setAttribute("music-checkbox", "checked", checked);

        const backgroundMusic = document.querySelector("#backgroundMusic");
        if (checked) {
          backgroundMusic.setAttribute("volume", 0);
          console.log("Music stopped, volume = 0");
          // Change la couleur de la boîte lorsqu'elle est checked
          this.el.setAttribute("color", "red");
        } else {
          backgroundMusic.setAttribute("volume", 0.6);
          console.log("Music playing, volume = 0.6");
          // Change la couleur de la boîte lorsqu'elle n'est pas checked
          this.el.setAttribute("color", "green");
        }
      }
      event.stopPropagation(); // Empêche la propagation de l'événement
    });
  },
});
