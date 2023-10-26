export function resizeImage(file, maxWidth, maxHeight, callback) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
  
    img.onload = function() {
      let width = img.width;
      let height = img.height;
  
      // Calculate the new dimensions to maintain aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
  
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Set the canvas dimensions and draw the image with the new size
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
  
      // Convert the canvas content to a Blob object
      canvas.toBlob(callback);
    };
  
    const reader = new FileReader();
    reader.onload = function(e) {
      img.src = e.target.result;
    };
  
    reader.readAsDataURL(file);
  }