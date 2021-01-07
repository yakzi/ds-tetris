let maxCounter = 0;
class TetrisGame extends CanvasGame{
    
    constructor()
    {
        super();
        this.boardArray = new Array(canvas.height/20).fill(0).map(() => new Array(canvas.width/20).fill(0));
        /* render the game on the canvas */
        this.playGameLoop();
    }

    playGameLoop()
    {
        if(pause == false){
            this.checkIfGameOver();
            this.checkFullLine();
            this.collisionDetection();
            super.render(); 
            this.checkIfSpawnNewBlock();        

            requestAnimationFrame(this.playGameLoop.bind(this));
        }
    }

    checkIfGameOver() {
        let middleY = canvas.height / 20 / 2;
        for (let i = 0; i < this.boardArray[0].length; i++) {
            if (this.boardArray[middleY + 2][i] == 1 || this.boardArray[middleY - 2][i] == 1) {
                pause = true;
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
            maxCounter = Math.max(counter, maxCounter);
            if (counter == this.boardArray[0].length) {
                //todo: usuwanie linijki
                pause = true;
            }
        }
    }

    checkIfSpawnNewBlock(){
        if(gameObjects[gameObjects.length - 1].isMoving == false){
            gameObjects[gameObjects.length] = spawnBlock();
            gameObjects[gameObjects.length -1].start();
            counter++;
        }
    }

    collisionDetection() {
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
            }
        } else {
            this.checkFillSurroundingOfBlock(xLeftUp, yLeftUp + 1, xRightDown, yRightDown + 1, reducedBlockMatrix, block, true);
            if (yLeftDown == canvas.height / 20){
                this.fillBoardArray(xLeftUp, yLeftUp, xRightDown, yRightDown, reducedBlockMatrix);
                block.isMoving = false;
            }
        }
    }

    fillBoardArray(xStart, yStart, xEnd, yEnd, blockMatrix){
        for (let x = xStart, i = 0; x < xEnd; x++, i++) {
            for (let y = yStart, j = 0; y < yEnd; y++, j++) {
                if (blockMatrix[j][i] != 0) {
                    this.boardArray[y][x] = blockMatrix[j][i];
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
                } else if (!isYChecking && x >= 0 && y >= 0 && this.boardArray[y][x] == 1 && blockMatrix[j][i] == 1) {
                    return false;
                }
            }
        }
        return true;
    }

}