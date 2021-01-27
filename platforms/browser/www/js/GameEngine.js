

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

let coin = new Image();
coin.src = "img/coin.png"

let bonus = new Image();
bonus.src = "img/ball.png"

const LEFT = 1;
const ROTATE = 2;
const RIGHT = 3;
const DOWN = 4;
const UP = 5;

const MAPW = 400;
const MAPH = 720;

let pause = false;
let game;
let gameOver = false;
let score = 0;
let speed = 500;

let coinObjects = [];
let bonusObjects = [];

let xDown = null;                                                        
let yDown = null;
let mylatesttap;

let brightnessLevelRed = 0;
let brightnessLevelGreen = 0;
let brightnessLevelBlue = 0;

let highscore = 0;

var firebaseConfig = {
    apiKey: "AIzaSyBDlUjQiZXg2jQBkaeQ-3PIukeTdA_oJ4M",
    authDomain: "doublesidedtetris.firebaseapp.com",
    projectId: "doublesidedtetris",
    storageBucket: "doublesidedtetris.appspot.com",
    messagingSenderId: "1012243678751",
    appId: "1:1012243678751:web:7300a40a8a4abf277e772a"
};

firebase.initializeApp(firebaseConfig);
database = firebase.firestore();
readFromDatabase();

/******************* END OF Declare game specific data and functions *****************/


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
        y -= 20;
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
    return new TetrisBlock(type, x, y, type.width, type.height, arrayView, speed);
}

function saveToDatabase() {
    database.collection("game").doc("highscore").set({
        score: this.score,
        date: this.getDate()
    })
    .catch(error => {
        console.error("Error adding document: ", error);
    });
}

function readFromDatabase() {
    database.collection("game").doc("highscore").get().then(doc => {
        if (doc.exists) {
            highscore = doc.data()['score'];
        }
    }).catch(error => {
        console.log("Error getting document:", error);
    });
}

function spawnCoin(){
    let coinObject = new Coin(coin,Math.floor(Math.random() * MAPW),Math.floor(Math.random() * MAPH), 40,
    Math.floor(Math.random() * (5 + 5) ) -5, Math.floor(Math.random() * (5 + 5) ) -5 );
    coinObjects[coinObjects.length] = coinObject;
    return coinObject;
}

function spawnBonus(){
    let bonusObject = new Bonus(bonus,Math.floor(Math.random() * MAPW),Math.floor(Math.random() * MAPH), 40,
    Math.floor(Math.random() * (5 + 5) ) -5, Math.floor(Math.random() * (2 + 2) ) -2, 1 );
    bonusObjects[bonusObjects.length] = bonusObject;
    return bonusObject;
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
    gameObjects[1] = spawnBlock();

    /* END OF game specific code. */


    /* Always create a game that uses the gameObject array */
    game = new TetrisGame();

    /* Always play the game */
    game.start();


    /* If they are needed, then include any game-specific mouse and keyboard listners */
    document.addEventListener("keydown", handleEvents);
    document.addEventListener('touchstart', handleTouchStart);        
    document.addEventListener('touchmove', handleEvents);
    document.addEventListener("touchend", handleDoubleTouch);
    document.addEventListener("onmousedown", handleEvents);
}

function resetGame() {
    gameObjects = gameObjects.slice(0, 1);
    gameOver = false;
    pause = false;
    score = 0;
    game.setScore();
    speed = 500;
    document.removeEventListener("keydown", handleEvents);
    document.removeEventListener('touchstart', handleTouchStart);        
    document.removeEventListener('touchmove', handleEvents);
    document.removeEventListener("touchend", handleDoubleTouch);
    document.removeEventListener("onmousedown", handleEvents);
    playGame();
}

function getTouches(evt) {
    return evt.touches || evt.originalEvent.touches;
}

function handleDoubleTouch(evt) {
    var now = new Date().getTime();
    var timesince = now - mylatesttap;
    if((timesince < 200) && (timesince > 0)){
        doubleTouch();
    }
    mylatesttap = new Date().getTime();
}

function doubleTouch() {
    let length = gameObjects.length;
    if (length > 1) {
        let block = gameObjects[length - 1];
        let xLeftUp = block.imageX / 20;
        let yLeftUp = block.imageY / 20;
        let xRightUp = block.imageWidth / 20 + xLeftUp;
        let yLeftDown = block.imageHeight / 20 + yLeftUp;
        let xRightDown = xRightUp;
        let yRightDown = yLeftDown;
        let reducedBlockMatrix = reduceZeros(block.arrayView);
        if (gameOver) {
            resetGame();
        }
        else if (game.checkFillSurroundingOfBlock(xLeftUp - 1, yLeftUp, xRightDown - 1, yRightDown, reducedBlockMatrix, block, false) == true
        && game.checkFillSurroundingOfBlock(xLeftUp + 1, yLeftUp, xRightDown + 1, yRightDown, reducedBlockMatrix, block, false) == true){
            gameObjects[length-1].move(ROTATE);
        }
    }
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
    checkBonusesClicked();
};

function checkBonusesClicked() {
    let bonusClicked = null;
    coinObjects.forEach(c => {
        if (xDown > c.centreX - (c.size/2) && xDown < c.centreX + (c.size/2)
            && yDown > c.centreY - (c.size/2) && yDown < c.centreY + (c.size/2)) {
                score += 35;
                game.setScore();
                c.stopAndHide();
                bonusClicked = c;
            }
    });
    if (bonusClicked != null) {
        coinObjects = coinObjects.filter(c => c != clickedCoin);
        bonusClicked = null;
    }
    bonusObjects.forEach(c => {
        if (xDown > c.centreX - (c.size/2) && xDown < c.centreX + (c.size/2)
            && yDown > c.centreY - (c.size/2) && yDown < c.centreY + (c.size/2)) {
                catchedBonus();
                c.stopAndHide();
                bonusClicked = c;
            }
    })
    if (bonusClicked != null) {
        bonusObjects = bonusObjects.filter(c => c != bonusClicked);
    }
}

function catchedBonus() {
    brightnessLevelRed = Math.floor(Math.random() * 255);
    brightnessLevelGreen = Math.floor(Math.random() * 255);
    brightnessLevelBlue = Math.floor(Math.random() * 255);
}

function detectLeftButton(event) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return false;
    } else if ('buttons' in event) {
        return event.buttons === 1;
    } else if ('which' in event) {
        return event.which === 1;
    } else {
        return (event.button == 1 || event.type == 'click');
    }
}

function handleEvents(e) {
    let length = gameObjects.length;
    if (length > 1) {
        let block = gameObjects[length - 1];
        let xLeftUp = block.imageX / 20;
        let yLeftUp = block.imageY / 20;
        let xRightUp = block.imageWidth / 20 + xLeftUp;
        let yLeftDown = block.imageHeight / 20 + yLeftUp;
        let xRightDown = xRightUp;
        let yRightDown = yLeftDown;
        let reducedBlockMatrix = reduceZeros(block.arrayView);

        //swipe stuff
        if ( ! xDown || ! yDown ) {
            return;
        }
        var xUp = e.touches[0].clientX;                                    
        var yUp = e.touches[0].clientY;
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
            if ( xDiff > 0 ) {
                if (block.updown == 1) {
                    if (game.checkFillSurroundingOfBlock(xLeftUp + 1, yLeftUp, xRightDown + 1, yRightDown, reducedBlockMatrix, block, false) == true){
                        gameObjects[length-1].move(LEFT);
                    }
                }
                else {
                    if (game.checkFillSurroundingOfBlock(xLeftUp - 1, yLeftUp, xRightDown - 1, yRightDown, reducedBlockMatrix, block, false) == true){
                        gameObjects[length-1].move(LEFT);
                    }
                }
            } else {
                if (block.updown == 1) {
                    if (game.checkFillSurroundingOfBlock(xLeftUp - 1, yLeftUp, xRightDown - 1, yRightDown, reducedBlockMatrix, block, false) == true){
                        gameObjects[length-1].move(RIGHT);
                    }
                }
                else {
                    if (game.checkFillSurroundingOfBlock(xLeftUp + 1, yLeftUp, xRightDown + 1, yRightDown, reducedBlockMatrix, block, false) == true){
                        gameObjects[length-1].move(RIGHT);
                    }
                }
            }                       
        } else {
            if ( yDiff > 0 ) {
                gameObjects[length-1].move(UP);
            } else { 
                gameObjects[length-1].move(DOWN);
            }                                                                 
        }

        //keyboard stuff
        if (detectLeftButton(e)) {
            checkBonusesClicked();
        }
        if (e.keyCode === 37)  // left
        {
            if (block.updown == 1) {
                if (game.checkFillSurroundingOfBlock(xLeftUp + 1, yLeftUp, xRightDown + 1, yRightDown, reducedBlockMatrix, block, false) == true){
                    gameObjects[length-1].move(LEFT);
                }
            }
            else {
                if (game.checkFillSurroundingOfBlock(xLeftUp - 1, yLeftUp, xRightDown - 1, yRightDown, reducedBlockMatrix, block, false) == true){
                    gameObjects[length-1].move(LEFT);
                }
            }
        }
        else if (e.keyCode === 39) // right
        {
            if (block.updown == 1) {
                if (game.checkFillSurroundingOfBlock(xLeftUp - 1, yLeftUp, xRightDown - 1, yRightDown, reducedBlockMatrix, block, false) == true){
                    gameObjects[length-1].move(RIGHT);
                }
            }
            else {
                if (game.checkFillSurroundingOfBlock(xLeftUp + 1, yLeftUp, xRightDown + 1, yRightDown, reducedBlockMatrix, block, false) == true){
                    gameObjects[length-1].move(RIGHT);
                }
            }
        }
        else if (e.keyCode === 32) // space
        {
            if (gameOver) {
                resetGame();
            }
            else if (game.checkFillSurroundingOfBlock(xLeftUp - 1, yLeftUp, xRightDown - 1, yRightDown, reducedBlockMatrix, block, false) == true
            && game.checkFillSurroundingOfBlock(xLeftUp + 1, yLeftUp, xRightDown + 1, yRightDown, reducedBlockMatrix, block, false) == true){
                gameObjects[length-1].move(ROTATE);
            }
        }
        else if (e.keyCode === 40) // down
        {
            gameObjects[length-1].move(DOWN);
        }
        else if (e.keyCode === 38) // up
        {
            gameObjects[length-1].move(UP);
        }
        else if (e.keyCode === 80) // p
        {
            pause = !pause;
            if (pause == false)
                game.playGameLoop();
        }
        xDown = null;
        yDown = null;  
    }
}