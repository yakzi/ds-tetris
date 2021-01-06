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
        this.collisionDetection();
        super.render(); 
        this.checkIfSpawnNewBlock();        

        requestAnimationFrame(this.playGameLoop.bind(this));
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
        let yRightUp = yLeftUp;
        let xLeftDown = xLeftUp;
        let yLeftDown = block.imageHeight / 20 + yLeftUp;
        let xRightDown = xRightUp;
        let yRightDown = yLeftDown;
        let reducedBlockMatrix = reduceZeros(block.arrayView);
        if (block.updown == 1) {
            for (let x = xLeftUp, i = 0; x < xRightDown; x++, i++) {
                for (let y = yLeftUp - 1, j = 0; y < yRightDown - 1; y++, j++) {
                    if(x >= 0 && y >= 0 && this.boardArray[y][x] == 1 && reducedBlockMatrix[j][i] == 1) {
                        this.fillBoardArray(xLeftUp, yLeftUp, xRightDown, yRightDown, reducedBlockMatrix);
                        block.isMoving = false;
                        console.log(this.boardArray);
                    }
                }
            }
            if (yLeftUp == 0 ) {
                this.fillBoardArray(xLeftUp, yLeftUp, xRightDown, yRightDown, reducedBlockMatrix);
                block.isMoving = false;
                //console.log(this.boardArray);
            }
        } else {
            if (yLeftDown == canvas.height / 20){
                this.fillBoardArray(xLeftUp, yLeftUp, xRightDown, yRightDown, reducedBlockMatrix);
                block.isMoving = false;
                //console.log(this.boardArray);
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

}