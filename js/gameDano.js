const app = new PIXI.Application({ width: 705, height: 750});
document.getElementById("game").appendChild(app.view);
const texture = PIXI.Texture.from('../images/gameDano/bg.png');
const pozadie = new PIXI.Sprite(texture);
app.stage.addChild(pozadie);

var score =0;
const toolsStorage = [];

var buttonGame = document.getElementById("gameButton");
buttonGame.innerText= "Hrať";

document.addEventListener("DOMContentLoaded", ()=>{
    var textureTool;
    fetch('../js/tools.json')
        .then(response => response.json())
        .then(json => {

            json.tools.forEach((item, index) => {
                textureTool = PIXI.Texture.from('../images/gameDano/'+item.src);
                textureTool.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                creatToolTexture(item.x,item.y,item.x1,item.y1,index);
            });
        })


    
    function creatToolTexture(x, y,x1,y1, index) {
        const tool = new PIXI.Sprite(textureTool);
        tool.id = index;
        tool.x1 = x1;
        tool.y1 = y1;
        tool.interactive = true;
        tool.buttonMode = true;
        // center the tool's anchor point
        tool.anchor.set(0.5);


        // setup events for mouse + touch using
        // the pointer events
        tool
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);



        tool.x = x;
        tool.y = y;

        toolsStorage.push(tool);

        app.stage.addChild(tool);
    }

    function onDragStart(event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
 

        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    }
    
    function onDragEnd() {
        this.alpha = 1;
        this.dragging = false;


        var text = document.getElementById("score");
        
        if((this.x > this.x1 - 10 && this.x < this.x1 + 10 )&& (this.y > this.y1 - 10 && this.y < this.y1 + 10)){
            this.x = this.x1;
            this.y = this.y1;
            this.interactive = false;
            this.buttonMode = false;
            score++;
    
        
            
            if(score <8 ){
                text.innerText = "Vaše skóre je " + score;
                buttonGame.innerText ="Hrať znova";
            }
            else{
                stopCount();
                buttonGame.disabled = false;
                text.innerText = "Vaše skóre je " + score + "   VYHRALI STE!!";
            }
        }
 
        // set the interaction data to null
        this.data = null;
    }
    
    function onDragMove() {
        if (this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
            if(score== 0){
                startCount();
                
            }
        }
    }
});




var i = 0;                 

function demo() {
    for(let iter = 0;iter < 8;iter++){
        toolsStorage[iter].interactive = false;
        toolsStorage[iter].buttonMode = false;
    }
    buttonGame.disabled = true;
  setTimeout(function() {   
    const tool = toolsStorage[i];
    tool.x = tool.x1;
    tool.y = tool.y1;
    i++;                    
    if (i < 8) {          
      demo();
      if(i == 7){
        buttonGame.disabled = false;
        stopCount();
      }             
    }                       
  }, 1000)
 
}


var c = 0;
var t;
var timer_is_on = 0;

function timedCount() {
  document.getElementById("txt").innerText = "čas skaldania: "  + c  + "s";
  c = c + 1;
  t = setTimeout(timedCount, 1000);
}

function startCount() {
  if (!timer_is_on) {
    timer_is_on = 1;
    timedCount();
  }
}

function stopCount() {
  clearTimeout(t);
  timer_is_on = 0;
}



function playAgain(){
    location.reload();
    return false;
}




