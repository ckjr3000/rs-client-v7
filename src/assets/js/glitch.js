const glitch = require('glitch-canvas');

export function glitchImage(canvas, glitchParams) {
    try {
      var ctx = canvas.getContext('2d');
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      glitch(glitchParams)
        .fromImageData(imageData)
        .toImageData()
        .then(function (glitchedImageData) {
          ctx.putImageData(glitchedImageData, 0, 0);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log('Error accessing canvas data:', error);
    }
  }