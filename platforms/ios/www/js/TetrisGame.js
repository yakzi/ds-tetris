class TetrisGame extends CanvasGame{

    constructor()
    {
        super();
        this.boardArray = new Array(canvas.height/20).fill(0).map(() => new Array(canvas.width/20).fill(0));
        this.indexBoardArray = new Array(canvas.height/20).fill(0).map(() => new Array(canvas.width/20).fill(0));
        this.playGameLoop();
    }

    playGameLoop()
    {
        if(gameOver == false && pause == false){
            super.render();
            this.checkIfGameOver();
            this.collisionDetection();
            this.checkIfSpawnNewBlock();
            this.checkFullLine();
            this.checkSpawnBonus();

            if(gameOver) {
                this.drawGameOverScreen();
                saveToDatabase();
            }

            requestAnimationFrame(this.playGameLoop.bind(this));
        }
    }

    checkSpawnBonus() {
        if (Math.floor(Math.random() * 250) == 1){
            let block = gameObjects[gameObjects.length - 1];
            if((Math.floor(Math.random() * 2) == 1)){
                gameObjects[gameObjects.length - 1] = spawnCoin();
            }
            else{
                gameObjects[gameObjects.length - 1] = spawnBonus();
            }
            gameObjects[gameObjects.length - 1].start();
            gameObjects[gameObjects.length] = block;
        }
    }

    checkIfSpeedUp() {
        let block = gameObjects[gameObjects.length - 1];
        if (score != 0 && score % 100 == 0 && speed > 1) {
            speed = block.getSpeed() - 50;
            block.setSpeed(speed);
        }
    }

    drawGameOverScreen() {
        ctx.filter = 'blur(4px)';
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'blur(0px)';
        ctx.font = "bold 70px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over", 40, canvas.height / 2 + 10);
        ctx.font = "bold 30px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.fillText("Score: " + score, canvas.width/3, canvas.height / 2 + 70);
        ctx.fillText("Highscore: " + highscore, canvas.width/4, canvas.height / 2 + 100);
        if (highscore < score) {
            ctx.fillText("You set new highscore!", 50, canvas.height / 2 + 130);
        }
        ctx.font = "bold 20px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.fillText("Tap to restart", canvas.width/3, canvas.height / 2 + 170);
    }

    checkIfGameOver() {
        let middleY = canvas.height / 20 / 2;
        for (let i = 0; i < this.boardArray[0].length; i++) {
            if (this.boardArray[middleY + 2][i] == 1 || this.boardArray[middleY - 2][i] == 1) {
                gameOver = true;
            }
        }
    }

    checkFullLine(){
        for (let i = 0; i < this.boardArray.length; i++){
            let counter = 0;
            for (let j = 0; j < this.boardArray[0].length; j++) {
                if(this.boardArray[i][j] == 1) {
                    counter++;
                }
            }
            if (counter == this.boardArray[0].length) {
                this.deleteLine(i);
                score += 200;
            }
        }
    }

    deleteLine(line) {
        navigator.vibrate(500);
        let middleBlockY = (this.boardArray.length / 2);
        for(let i = 0; i < this.boardArray[0].length; i++) {
            for (let j = 0; j < middleBlockY; j++) {
                if (line <= middleBlockY) {
                    this.boardArray[line + j][i] = this.boardArray[line + j + 1][i];
                } else {
                    this.boardArray[line - j][i] = this.boardArray[line - j - 1][i];
                }
            }
        }

        let temporaryCanvas = document.createElement("canvas");
        var temporaryContext = temporaryCanvas.getContext('2d');
        temporaryCanvas.height = canvas.height;
        temporaryCanvas.width = canvas.width;

        let y1, y2, h1, h2;
        if (line <= middleBlockY) {
            y1 = line * 20 + 20;
            y2 = (middleBlockY - 2) * 20 - 2;
            h1 = 0;
            h2 = line * 20;
        } else {
            y1 = (middleBlockY + 2) * 20 + 2;
            y2 = line * 20;
            h1 = 0;
            h2 = (middleBlockY + 2) * 20 + 2 + 20;
        }

        let backgroundImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let imageData = ctx.getImageData(0, y1, canvas.width, y2);

        temporaryCanvas.width = backgroundImageData.width;
        temporaryCanvas.height = backgroundImageData.height;

        temporaryContext.putImageData(backgroundImageData, 0, 0);
        temporaryContext.putImageData(imageData, h1, h2);

        let finishedImageData = temporaryContext.getImageData(0, 0, canvas.width, canvas.height);

        for(let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].stopAndHide();
        }
        gameObjects = [];
        gameObjects[0] = new StaticImage(this.imagedata_to_image(finishedImageData), 0, 0, finishedImageData.width, finishedImageData.height);
        gameObjects[0].start();
        this.spawnNewBlock();
    }

    imagedata_to_image(imagedata) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);

        var image = new Image();
        image.src = canvas.toDataURL();
        return image;
    }

    checkIfSpawnNewBlock(){
        if(gameObjects.length > 0 && gameObjects[gameObjects.length - 1].isMoving == false){
            this.spawnNewBlock();
        }
    }

    spawnNewBlock() {
        gameObjects[gameObjects.length] = spawnBlock();
        gameObjects[gameObjects.length - 1].start();
        score+=20;
        this.setScore();
        this.checkIfSpeedUp();
    }

    setScore() {
        var scoreText = document.getElementById("scoreText");
        scoreText.textContent = "Score: " + score;
    }

    collisionDetection() {
        if (gameObjects.length > 0) {
            let block = gameObjects[gameObjects.length - 1];
            let xLeftUp = block.imageX / 20;
            let yLeftUp = block.imageY / 20;
            let xRightUp = block.imageWidth / 20 + xLeftUp;
            let yLeftDown = block.imageHeight / 20 + yLeftUp;
            let xRightDown = xRightUp;
            let yRightDown = yLeftDown;
            let reducedBlockMatrix = reduceZeros(block.arrayView);
            if (block.updown == 1) {
                this.checkFillSurroundingOfBlock(xLeftUp, yLeftUp - 1, xRightDown, yRightDown - 1, reducedBlockMatrix, block, true);
                if (yLeftUp == 0 ) {
                    this.fillBoardArray(xLeftUp, yLeftUp, xRightDown, yRightDown, reducedBlockMatrix);
                    block.isMoving = false;
                    // score += 10;
                }
            } else {
                this.checkFillSurroundingOfBlock(xLeftUp, yLeftUp + 1, xRightDown, yRightDown + 1, reducedBlockMatrix, block, true);
                if (yLeftDown == canvas.height / 20){
                    this.fillBoardArray(xLeftUp, yLeftUp, xRightDown, yRightDown, reducedBlockMatrix);
                    block.isMoving = false;
                    // score +=10;
                }
            }
        }
    }

    fillBoardArray(xStart, yStart, xEnd, yEnd, blockMatrix){
        for (let x = xStart, i = 0; x < xEnd; x++, i++) {
            for (let y = yStart, j = 0; y < yEnd; y++, j++) {
                if (blockMatrix[j][i] != 0) {
                    this.boardArray[y][x] = blockMatrix[j][i];
                    this.indexBoardArray[y][x] = gameObjects.length - 1;
                }
            }
        }
    }

    checkFillSurroundingOfBlock(xStart, yStart, xEnd, yEnd, blockMatrix, block, isYChecking){
        let h = this.boardArray.length;
        let w = this.boardArray[0].length;
        for (let x = xStart, i = 0; x < xEnd; x++, i++) {
            for (let y = yStart, j = 0; y < yEnd; y++, j++) {
                if(isYChecking && x >= 0 && y >= 0 && x < w && y < h && this.boardArray[y][x] == 1 && blockMatrix[j][i] == 1) {
                    if(block.updown == 1) {
                        this.fillBoardArray(xStart, yStart + 1, xEnd, yEnd + 1, blockMatrix);
                    } else {
                        this.fillBoardArray(xStart, yStart - 1, xEnd, yEnd - 1, blockMatrix);
                    }
                    block.isMoving = false;
                    // score += 10;
                } else if (!isYChecking && x >= 0 && y >= 0 && this.boardArray[y][x] == 1 && blockMatrix[j][i] == 1) {
                    return false;
                }
            }
        }
        return true;
    }

}