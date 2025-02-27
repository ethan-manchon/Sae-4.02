AFRAME.registerComponent("music-checkbox", {
  schema: {
    checked: { type: "boolean", default: false },
  },

  init: function () {
    this.el.addEventListener("click", (event) => {
      console.log("Clicked element ID:", this.el.id);
      // Check if the clicked element is the music button
      if (this.el.closest("#MusicButton")) {
        const checked = !this.data.checked;
        this.el.setAttribute("music-checkbox", "checked", checked);

        const backgroundMusic = document.querySelector("#backgroundMusic");
        if (checked) {
          backgroundMusic.setAttribute("volume", 0);
          console.log("Music stopped, volume = 0");
          // Change the box color when checked
          this.el.setAttribute("color", "red");
        } else {
          backgroundMusic.setAttribute("volume", 0.6);
          console.log("Music playing, volume = 0.6");
          // Change the box color when unchecked
          this.el.setAttribute("color", "green");
        }
      }
      event.stopPropagation(); // Prevent propagation of the event
    });
  },
});
