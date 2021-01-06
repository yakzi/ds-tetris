

/******************** Declare game specific global data and functions *****************/
/* images must be declared as global, so that they will load before the game starts  */
let backgroundImage = new Image();
backgroundImage.src = "img/background.png";

let t1 = new Image();
t1.src = "img/T1.png"

let t2 = new Image();
t2.src = "img/T2.png"

let t3 = new Image();
t3.src = "img/T3.png"

let t4 = new Image();
t4.src = "img/T4.png"

let t5 = new Image();
t5.src = "img/T5.png"

const LEFT = 1;
const ROTATE = 2;
const RIGHT = 3;
const DOWN = 4;
const UP = 5;

const MAPW = 400;
const MAPH = 700;

/******************* END OF Declare game specific data and functions *****************/

let counter = 1;



function spawnBlock()
{
    let min = 1;
    let max = 5;        
    let blockType = Math.floor(Math.random() * (max - min + 1)) + min;
    let type = 0;
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let arrayView = [4][4];
    while (y % 20 != 0) {
        y-=y%20;
    }
    if (blockType === 1){
        type = t1;   
        arrayView = [
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0]
        ];
    }
    else if (blockType === 2){
        type = t2;
        arrayView = [
            [1,0,0,0],
            [1,0,0,0],
            [1,1,0,0],
            [0,0,0,0]
        ];
    }
    else if (blockType === 3){
        type = t3;
        arrayView = [
            [0,1,0,0],
            [1,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ];
    }
    else if (blockType === 4){
        type = t4;
        arrayView = [
            [0,1,1,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ];
    }
    else if (blockType === 5){
        type = t5;
        arrayView = [
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ];
    }
    return new TetrisBlock(type, x, y, type.width, type.height, arrayView);
}


/* Always have a playGame() function                                     */
/* However, the content of this function will be different for each game */
function playGame()
{
    /* We need to initialise the game objects outside of the Game class */
    /* This function does this initialisation.                          */
    /* This function will:                                              */
    /* 1. create the various game game gameObjects                   */
    /* 2. store the game gameObjects in an array                     */
    /* 3. create a new Game to display the game gameObjects          */
    /* 4. start the Game                                                */


    /* Create the various gameObjects for this game. */
    /* This is game specific code. It will be different for each game, as each game will have it own gameObjects */
    gameObjects[0] = new StaticImage(backgroundImage, 0, 0, MAPW, MAPH);     //BACKGROUND

    /* Set the initial speed for the car to match the HTML speed slider */
    /* Higher speeds mean small interval update times */
    /* Subtracting the speed from the max speed gives the correct interrupt time */
    gameObjects[counter] = spawnBlock();          //TETRIS
    counter++;
 
    /* END OF game specific code. */


    /* Always create a game that uses the gameObject array */
    let game = new TetrisGame();

    /* Always play the game */
    game.start();


    /* If they are needed, then include any game-specific mouse and keyboard listners */
    document.addEventListener("keydown", function (e)
    {
    if (e.keyCode === 37)  // left
    {
        gameObjects[counter-1].move(LEFT);
    }
    else if (e.keyCode === 39) // right
    {
        gameObjects[counter-1].move(RIGHT);
    }
    else if (e.keyCode === 32) // space
    {
        gameObjects[counter-1].move(ROTATE);
    }
    else if (e.keyCode === 40) // down
    {
        gameObjects[counter-1].move(DOWN);
    }
    else if (e.keyCode === 38) // up
    {
        gameObjects[counter-1].move(UP);
    }
});
}