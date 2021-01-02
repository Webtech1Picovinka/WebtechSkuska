var width = window.innerWidth;
var height = window.innerHeight;
var end = false;
var start = false;
function nacitajObrazky(zdroj, callback) {
  var assetDir = '../images/gameKuboImages/';
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  for (var src in zdroj) {
    numImages++;
  }
  for (var src in zdroj) {
    images[src] = new Image();
    images[src].onload = function () {
      if (++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = assetDir + zdroj[src];
  }
}
function jeBlizko(ozdoba, outline) {
  var a = ozdoba;
  var o = outline;
  var ax = a.x();
  var ay = a.y();

  if (ax > o.x - 20 && ax < o.x + 20 && ay > o.y - 20 && ay < o.y + 20) {
    return true;
  } else {
    return false;
  }
}
function kresliPozadie(pozadie, stromImg) {
  var context = pozadie.getContext();
  var text = "";
  context.drawImage(stromImg, 0, 0);
  context.setAttr('font', '20pt Calibri');
  context.setAttr('textAlign', 'center');
  context.setAttr('fillStyle', 'white');
  context.fillText(pozadie.getStage().width() / 2, 40);
}

function zacPozicia(images) {
  var stage = new Konva.Stage({
    container: 'container',
    width:650,
    height: 700,
  });
  var pozadie = new Konva.Layer();
  var layer = new Konva.Layer();
  var shapes = [];
  var score = 0;

  // pozicia obrazkov
  var ozdoby = {
    gula: {
      x: 450,
      y: 0,
    },
    lizatko: {
      x: 450,
      y: 80,
    },
    hviezda:{
        x: 450,
        y: 170,
    },
    ponozka: {
      x: 450,
      y: 250,
    },
    zvoncek: {
      x: 450,
      y: 350,
    },
    hviezdaMala: {
      x: 463,
      y: 450,
    },
    lizatkoMale: {
      x: 463,
      y: 490,
    },
    zvoncekMaly: {
      x: 463,
      y: 580,
    },
  };

  var outlines = {
    gula_black: {
      x: 260,
      y: 170,
    },
    lizatko_black: {
      x: 110,
      y: 255,
    },
    hviezda_black: {
      x: 180,
      y: -10,
    },
    ponozka_black: {
      x: 300,
      y: 420,
    },
    zvoncek_black: {
      x: 230,
      y: 493,
    },
    hviezdaMala_black: {
      x: 118,
      y: 395,
    },
    lizatkoMale_black: {
      x: 237,
      y: 397,
    },
    zvoncekMaly_black: {
      x: 137,
      y: 190,
    },
  
  };

  window.onload = function () {
    var sekunda = 00, 
        desiatka = 00,
        appendDesiatka = document.getElementById("desiatky"),
        appendSekunda = document.getElementById("sekundy"),
        Interval; 
    
    function casovac () {
      if ((end == false)&&(start == true)){
        desiatka++; 
      }
      if(desiatka){
        appendDesiatka.innerHTML = "sekúnd";
      } 
      
      if (desiatka > 99) {
        sekunda++;
        appendSekunda.innerHTML = "0" + sekunda;
        desiatka = 0;
      }
      
      if (sekunda > 9){
        appendSekunda.innerHTML = sekunda;
      }
    }

    clearInterval(Interval);
    Interval = setInterval(casovac, 10); 
  
  }

  // vytvorenie posuvania obrazkov
  for (var key in ozdoby) {
    // funkcia na vyvolanie rozsahu
    (function () {
      var privKey = key;
      var anim = ozdoby[key];

      var ozdoba = new Konva.Image({
        image: images[key],
        x: anim.x,
        y: anim.y,
        draggable: true,
      });

      ozdoba.on('dragstart', function () {
        this.moveToTop();
        layer.draw();
      });
      //skontroluje ci je ozdoba na spravnom mieste a ak ano tak ho tam dosadi
      ozdoba.on('dragend', function () {
        var outline = outlines[privKey + '_black'];
        if (!ozdoba.inRightPlace && jeBlizko(ozdoba, outline)) {
          ozdoba.position({
            x: outline.x,
            y: outline.y,
          });
          layer.draw();
          ozdoba.inRightPlace = true;
          if (++score >= 1) {
            start = true;
          }
          if (++score >= 15) {
            var text = document.getElementById("text");
            text.innerHTML = 'Výborne! Stromček je dozdobený.';
            end = true;
            var text2 = document.getElementById("text2");
            text2.innerHTML ='Trvalo ti to ';
          }
          
          window.onload = function () {
    clearInterval(Interval);
    Interval = setInterval(casovac, 10); 
    }

                // zrusenie drag and drop
                setTimeout(function () {
                  ozdoba.draggable(false);
                }, 50);
              }
            });
           
            // vrat ozbobu na mouseout
            ozdoba.on('mouseout', function () {
              ozdoba.image(images[privKey]);
              layer.draw();
              document.body.style.cursor = 'default';
            });

            ozdoba.on('dragmove', function () {
              document.body.style.cursor = 'pointer';
            });

            layer.add(ozdoba);
            shapes.push(ozdoba);
          })();
        }

        // funkcia na cierne obrazky
        for (var key in outlines) {
          (function () {
            var imageObj = images[key];
            var out = outlines[key];

            var outline = new Konva.Image({
              image: imageObj,
              x: out.x,
              y: out.y,
            });

            layer.add(outline);
          })();
        }

        stage.add(pozadie);
        stage.add(layer);

        kresliPozadie(
          pozadie,
          images.strom,
          
          
        );
}

var zdroj = {
  strom: 'strom.png',
  gula: 'gula.png',
  lizatko: 'lizatko.png',
  hviezda: 'hviezda.png',
  ponozka: 'ponozka.png',
  zvoncek: 'zvoncek.png',
  hviezdaMala: 'hviezdaMala.png',
  lizatkoMale: 'lizatkoMale.png',
  zvoncekMaly: 'zvoncekMaly.png',
  gula_black: 'gulaCierne.png',
  lizatko_black: 'lizatkoCierne.png',
  hviezda_black: 'hviezdaCierne.png',
  ponozka_black: 'ponozkaCierne.png',
  zvoncek_black: 'zvoncekCierne.png',
  hviezdaMala_black: 'hviezdaMalaCierne.png',
  lizatkoMale_black: 'lizatkoMaleCierne.png',
  zvoncekMaly_black: 'zvoncekMalyCierne.png'
};
nacitajObrazky(zdroj, zacPozicia);