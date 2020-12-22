window.onload = function () {
  
  var seconds = 00, 
      tens = 00,
      appendTens = document.getElementById("tens"),
      appendSeconds = document.getElementById("seconds"),
      Interval; 
  
  function startTimer () {
    tens++; 
    
    if(tens < 9){
      appendTens.innerHTML = "0" + tens;
    }
    
    if (tens > 9){
      appendTens.innerHTML = tens;
      
    } 
    
    if (tens > 99) {
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }
    
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }
  }

  clearInterval(Interval);
  Interval = setInterval(startTimer, 10); 
 
}

var width = window.innerWidth,
    height = window.innerHeight,
    sources = {
    wood: 'background1.png',
    hviezda: 'hviezda.png',
    hviezda_black: 'hviezda_c.png',
    kosostvorec: 'kosostvorec.png',
    kosostvorec_black: 'kosostvorec_c.png',
    kruh: 'kruh.png',
    kruh_black: 'kruh_c.png',
    mesiac: 'mesiac.png',
    mesiac_black: 'mesiac_c.png',
    patuholnik: 'patuholnik.png',
    patuholnik_black: 'patuholnik_c.png',
    sipka: 'sipka.png',
    sipka_black: 'sipka_c.png',
    srdce: 'srdce.png',
    srdce_black: 'srdce_c.png',
    stvorec: 'stvorec.png',
    stvorec_black: 'stvorec_c.png',
    trojuholnik: 'trojuholnik.png',
    trojuholnik_black: 'trojuholnik_c.png',
};

function mainFun(images) {
  var stage = new Konva.Stage({
    container: 'containerGame',
    width: 1000,
    height: 1000,
  }),
      background = new Konva.Layer(),
      shapeLayer = new Konva.Layer(),
      allShapes = [],
      score = 0,

      shapes = {
    hviezda: {
      x: 650,
      y: 50,  
    },
    kosostvorec: {
      x: 800,
      y: 50,
    },
    kruh: {
      x: 650,
      y: 150,
    },
    mesiac: {
      x: 800,
      y: 150,
    },
    patuholnik: {
      x: 650,
      y: 250,
    },
    sipka: {
      x: 800,
      y: 250,
    },
    srdce: {
      x: 650,
      y: 350,
    },
    stvorec: {
      x: 800,
      y: 350,
    },
    trojuholnik: {
      x: 725,
      y: 450,
    },
  },

      outlines = {
    hviezda_black: {
      x: 450,
      y: 350,
    },
    kosostvorec_black: {
      x: 250,
      y: 350,
    },
    kruh_black: {
      x: 50,
      y: 350,
    },
    mesiac_black: {
      x: 450,
      y: 200,
    },
    patuholnik_black: {
      x: 250,
      y: 200,
    },
    sipka_black: {
      x: 50,
      y: 200,
    },
    srdce_black: {
      x: 450,
      y: 50,
    },
    stvorec_black: {
      x: 250,
      y: 50,
    },
    trojuholnik_black: {
      x: 50,
      y: 50,
    },
  };

  for (var key in shapes) {
    (function () {
      var privKey = key,
          sh = shapes[key],

          shape = new Konva.Image({
        image: images[key],
        x: sh.x,
        y: sh.y,
        draggable: true,
      });

      shape.on('dragstart', function () {
        this.moveToTop();
        shapeLayer.draw();
      });

      shape.on('dragend', function () {
        var outline = outlines[privKey + '_black'];
        if (!shape.inRightPlace && nearFinal(shape, outline)) {
          shape.position({
            x: outline.x,
            y: outline.y,
          });
          shapeLayer.draw();
          shape.inRightPlace = true;

          if (++score >= 9) {
            var text = document.getElementById("text");
            text.innerHTML = 'Gratulujem! Si šikovný/á :)';
          }

          setTimeout(function () {
            shape.draggable(false);
          }, 50);
        }
      });

      shape.on('mouseout', function () {
        shape.image(images[privKey]);
        shapeLayer.draw();
        document.body.style.cursor = 'default';
      });

      shape.on('dragmove', function () {
        document.body.style.cursor = 'pointer';
      });

      shapeLayer.add(shape);
      allShapes.push(shape);
    })();
  }

  for (var key in outlines) {
    (function () {
      var imageObj = images[key];
      var out = outlines[key];

      var outline = new Konva.Image({
        image: imageObj,
        x: out.x,
        y: out.y,
      });

      shapeLayer.add(outline);
    })();
  }

  stage.add(background);
  stage.add(shapeLayer);

  backgroundInit(
    background,
    images.wood, 
    ''
  );
}


function loadAll(sources, callback) {
  var directory = '../images/gameMartin/';
  var images = {};
  var loaded = 0;
  var num = 0;
  for (var src in sources) {
    num++;
  }
  for (var src in sources) {
    images[src] = new Image();
    images[src].onload = function () {
      if (++loaded >= num) {
        callback(images);
      }
    };
    images[src].src = directory + sources[src];
  }
}

function nearFinal(shape, outline) {
  var a = shape;
  var o = outline;
  var ax = a.x();
  var ay = a.y();

  if (ax > o.x - 20 && ax < o.x + 20 && ay > o.y - 20 && ay < o.y + 20) {
    return true;
  } else {
    return false;
  }
}

function backgroundInit(background, backgroundImg, text) {
  var context = background.getContext();
  context.drawImage(backgroundImg, 0, 0);
  context.setAttr('font', '20pt Calibri');
  context.setAttr('textAlign', 'center');
  context.setAttr('fillStyle', 'white');
  context.fillText(text, background.getStage().width() / 2, 40);
}

//main
loadAll(sources, mainFun);
