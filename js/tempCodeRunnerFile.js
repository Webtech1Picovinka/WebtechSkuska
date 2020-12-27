// make animal glow on mouseover
            animal.on('mouseover', function () {
              animal.image(images[privKey + '_glow']);
              animalLayer.draw();
              document.body.style.cursor = 'pointer';
            });