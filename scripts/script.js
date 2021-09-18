// connect the canvas with js script.

var g_canvas = document.getElementById('gameCanvas');
var g_ctx = g_canvas.getContext('2d');
var g_fps = 30; // frame control. 
var g_timeInterval = 1000/g_fps;

// loading images
var g_car1Pic = document.createElement('img');
g_car1Pic.src = 'images/car1.png';
var g_carAngle = 0;

// canvas Related Variables.
g_drawEmptyCanvas = {
    color : 'black',
    canvasWidth : 800,
    canvasHeight : 600,
}
// car properties
g_car ={
    radius : 10,
    color : 'white',
    xpos : 400,
    ypos : 400

}
 var g_carCollisionVariables = {
        carSpeed : 0,
        negetiveSpeed : -1
}
// brick wall properties.
g_trackWalls = {
    brickXpos : 10,
    brickYpos : 10,
    brickCol : 20,
    brickRows : 15 ,
    brickWidth : 40,
    brickHeight : 40,
    brickflags :[   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
                    1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
                    1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
                    1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                    1, 0, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                    1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    brickColor  : 'red'
}

// key codes for car motion 

    const moveUp_W = 87 ;
    const moveDown_S = 83 ;
    const moveLeft_A = 65 ;
    const moveRight_D = 68 ;

   var up = false;
    var down = false;
    var left = false;
   var  right = false;


// function that draws  Blank canvas.
function f_drawCanvas(l_ctx,l_color,l_canvasWidth,l_canvasHeight){
    // this function draws a blank canvas.
    l_ctx.beginPath();
    l_ctx.fillStyle = l_color;
    l_ctx.fillRect(0,0, l_canvasWidth,l_canvasHeight);
    l_ctx.strokeRect(0,0, l_canvasWidth,l_canvasHeight);

}

// draws the car in ball form
function f_drawCar(l_ctx,l_xpos,l_ypos,l_r,l_c){
    l_ctx.beginPath();
    l_ctx.fillStyle = l_c;
    l_ctx.arc(l_xpos,l_ypos,l_r,0,Math.PI * 2,true);
    l_ctx.fill();
}

// car rotation
function f_drawBitmapCenteredWithRotation(l_ctx,l_useBitmap,l_atX,l_atY,l_angle){
    l_ctx.save();
    l_ctx.translate(l_atX,l_atY);
    l_ctx.rotate(l_angle);
    l_ctx.drawImage(l_useBitmap,-l_useBitmap.width/2,-l_useBitmap.height/2);
    l_ctx.restore()
}


function f_carMoveAndCollision(){
    // car Move logic
    g_car.xpos += Math.cos(g_carAngle) * g_carCollisionVariables.carSpeed;
    g_car.ypos += Math.sin(g_carAngle) * g_carCollisionVariables.carSpeed;
    g_carCollisionVariables.carSpeed *= 0.97;
    if(left){
        g_carAngle -= 0.04;
    }
    if(right){
        g_carAngle += 0.04; 
    }
    if(up){
        g_carCollisionVariables.carSpeed += 0.2;
        
    }
    if(down){
        g_carCollisionVariables.carSpeed -= 0.2;
    }
}

function f_isTrackAtColRow(l_col,l_row){
    if(l_col >= 0 && l_col < g_trackWalls.brickCol &&
        l_row >= 0 && l_row < g_trackWalls.brickRows){
            var l_trackIndexUnderCoord = f_turnArrayToFalse(l_col,l_row);
            return(g_trackWalls.brickflags[l_trackIndexUnderCoord] == 1);
        }else{
            return false;
        }
}

function f_collisionBetweenCarAndWall(){
    //coloum position
    var l_carTrackColoumn = Math.floor(g_car.xpos/g_trackWalls.brickWidth);
    // row Postion
    var l_carTrackRow = Math.floor(g_car.ypos/g_trackWalls.brickHeight); 
    var l_trackIndexUnderCar = f_turnArrayToFalse(l_carTrackColoumn,l_carTrackRow);

    if(l_carTrackColoumn >= 0 && l_carTrackColoumn < g_trackWalls.brickCol 
        && l_carTrackRow >= 0 && l_carTrackRow < g_trackWalls.brickRows){
           // console.log('detecting rows');
            if(f_isTrackAtColRow(l_carTrackColoumn,l_carTrackRow)){
                 g_carCollisionVariables.carSpeed *= -0.5;
            } // end of track found
        } // end of valid col and row
}// end of car track Handeling Function


// when called draws a brick.
function f_drawTrackWall(l_ctx,l_xpos,l_ypos,l_brickWidth,l_brickHeight,l_color){
    l_ctx.fillStyle = l_color;
    l_ctx.fillRect(l_xpos,l_ypos, l_brickWidth,l_brickHeight);
}

// grid Related functions.

function f_turnArrayToFalse(l_col,l_row){
    return l_col + g_trackWalls.brickCol * l_row;
}

function f_drawgrid(){ //function draws a grid.
    for(var i = 0; i < g_trackWalls.brickRows; i++){
       
        for( var j = 0; j < g_trackWalls.brickCol; j++){
           var l_FalseIndex = f_turnArrayToFalse(j,i);
            if(g_trackWalls.brickflags[l_FalseIndex] === 1){
                f_drawTrackWall(g_ctx, g_trackWalls.brickWidth * j,g_trackWalls.brickHeight * i , g_trackWalls.brickWidth - 2,g_trackWalls.brickHeight - 2,g_trackWalls.brickColor);
            } // if condition end.
        } // colums for loop end.
    } //rows for loop end 
} // function end.

function f_carReset(){ // resets the car to an initail position.
    for(var i = 0; i < g_trackWalls.brickRows;i++){
        for(var j = 0 ; j < g_trackWalls.brickCol;j++){ 
                var l_index = f_turnArrayToFalse(j,i);  
                if(g_trackWalls.brickflags[l_index] == 2){
                
                    g_trackWalls.brickflags[l_index] = 0;
                    g_carAngle = -Math.PI/2;
                    g_car.xpos = j * g_trackWalls.brickWidth + g_trackWalls.brickWidth/2;
                    g_car.ypos = i * g_trackWalls.brickHeight + g_trackWalls.brickHeight/2;
                }
         }
   }
}
function f_loadImageAndDraw(l_ctx){
       f_drawBitmapCenteredWithRotation(l_ctx,g_car1Pic,g_car.xpos,g_car.ypos,g_carAngle);
}

// keyBoard event listener

function f_movementBool(){
    
}

function f_keyPressed(l_event){
    if(l_event.keyCode == moveLeft_A){
        left = true;
    }
    if(l_event.keyCode == moveRight_D){
        right = true;
    }
    if(l_event.keyCode == moveUp_W){
        up = true;
    }
    if(l_event.keyCode == moveDown_S){
        down = true;
    }
    l_event.preventDefault();
}

function f_keyReleased(l_event){
    if(l_event.keyCode == moveLeft_A){
        left = false;
        console.log('false');
    }
    if(l_event.keyCode == moveRight_D){
        right = false;
    }
    if(l_event.keyCode == moveUp_W){
       up = false;
    }
    if(l_event.keyCode == moveDown_S){
       down = false;
    }
    l_event.preventDefault();

}
document.addEventListener('keydown',f_keyPressed);
document.addEventListener('keyup',f_keyReleased);

// functions which are being instantiaed only once.



// main gameloop.
function f_gameloop(){
   
    f_drawCanvas(g_ctx,g_drawEmptyCanvas.color,g_drawEmptyCanvas.canvasWidth,g_drawEmptyCanvas.canvasHeight);
    f_loadImageAndDraw(g_ctx);
    f_drawgrid();
    f_carMoveAndCollision();
    f_collisionBetweenCarAndWall();
    f_carReset();
    f_keyPressed();
    f_keyReleased();
    
    
}

// gameloop Interval.
setInterval(f_gameloop,g_timeInterval);