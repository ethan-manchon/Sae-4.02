AFRAME.registerComponent('hide-in-vr', {
    init: function () {
      this.el.addEventListener('enter-vr', () => {
        this.el.setAttribute('visible', false);
      });

      this.el.addEventListener('exit-vr', () => {
        this.el.setAttribute('visible', true);
      });
    }
  });