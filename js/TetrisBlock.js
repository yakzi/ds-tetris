/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland. */

class TetrisBlock extends GameObject
{
    /* Each gameObject MUST have a constructor() and a render() method.        */
    /* If the object animates, then it must also have an updateState() method. */

    constructor(image, x, y, width, height, arrayView)
    {
        super(250); /* as this class extends from GameObject, you must always call super() */

        /* These variables depend on the object */
        this.updown = Math.round(Math.random());
        this.image = image;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.isMoving = true;
        this.arrayView = arrayView;

        this.imageHeight = this.height;
        this.imageWidth = this.width;
        this.imageX = this.x;
        this.imageY = this.y;

        this.blockCanvas = document.createElement('canvas');
        this.blockCanvasCtx = this.blockCanvas.getContext('2d');
        this.blockCanvas.width = canvas.width;
        this.blockCanvas.height = canvas.height;

    }

    updateState()
    {
        if (this.isMoving) {
            if(this.updown === 0 && this.imageY < canvas.height - this.imageHeight){            
                this.y += 20;
                this.imageY += 20;
            }
            else if(this.updown === 1 && this.imageY > 0) {
                this.y -= 20;
                this.imageY -= 20;
            }
            else{
                this.isMoving = false;
            }
        }
    }

    render()
    {
        this.blockCanvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        let shapeCenterX = this.x + this.width/2;
        let shapeCenterY = this.y + this.height/2;
        while (shapeCenterX % 20 != 0) {
            shapeCenterX -= shapeCenterX % 20;
        }
        while (shapeCenterY % 20 != 0) {
            shapeCenterY -= shapeCenterY % 20;
        }
        this.blockCanvasCtx.save();
        this.blockCanvasCtx.translate(shapeCenterX, shapeCenterY);
        this.blockCanvasCtx.rotate(Math.radians(this.rotation));
        this.blockCanvasCtx.translate(-shapeCenterX, -shapeCenterY);
        this.blockCanvasCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.blockCanvasCtx.restore();
        
        ctx.drawImage(this.blockCanvas, 0, 0);
    }

    checkBordersWhileRotation(){
        while (this.imageX + this.imageWidth > canvas.width) {
            this.x -= 20;
            this.imageX -= 20;
        }

        while (this.imageX < 0){
            this.x += 20;
            this.imageX +=20;
        }

        while (this.imageY + this.imageHeight > canvas.height) {
            this.y -= 20;
            this.imageY -= 20;
        }

        while (this.imageY < 0){
            this.y += 20;
            this.imageY +=20;
        }
    }

    setSpeed(newSpeed)
    {
        this.updateStateMilliseconds = newSpeed;
        if (this.gameObjectInterval !== null) // car is moving
        {
            // restart with the new interrupt time
            this.stopAndHide();
            this.start();
        }
    }

    move(direction)
    {
        if(this.isMoving) {
            if (direction === LEFT)
            {
                if(this.updown == 0 && this.imageX > 0){
                    this.x -= 20;
                    this.imageX -= 20;
                }
                else if (this.updown == 1 && this.imageX < canvas.width - this.imageWidth) {
                    this.x += 20;
                    this.imageX += 20;
                }
            }
            else if (direction === RIGHT)
            {
                if(this.updown == 0 && this.imageX < canvas.width - this.imageWidth){
                    this.x += 20;
                    this.imageX += 20;
                }
                else if (this.updown == 1 && this.imageX > 0) {
                    this.x -= 20;
                    this.imageX -= 20;
                }
            }
            else if (direction === DOWN && this.updown == 0 && this.imageY + this.imageHeight < canvas.height){
                this.y += 20;
                this.imageY += 20;
            }
            else if (direction === UP && this.updown == 1 && this.imageY > 0){
                this.y -= 20;
                this.imageY -= 20;
            }
            else if (direction === ROTATE)
            {
                this.rotation += 90;
                this.rotation %= 360;

                let h = this.imageHeight;
                this.imageHeight = this.imageWidth;
                this.imageWidth = h;
 
                this.calculateNewLeftPoint();
                this.checkBordersWhileRotation();
                this.rotateArrayView();
            }
        }
    }

    getDirection()
    {
        return(this.direction);
    }

    rotateArrayView(){
        this.arrayView = rotate(this.arrayView);
    }

    calculateNewLeftPoint(){
        let p = this.x + this.width/2;
        let q = this.y + this.height/2;
        while (p % 20 != 0) {
            p -= p % 20;
        }
        while (q % 20 != 0) {
            q -= q % 20;
        }
        let a = this.rotation * Math.PI / 180;
        this.imageX=(this.x - p)*Math.cos(a) - (this.y - q)*Math.sin(a) + p;
        this.imageY=(this.x - p)*Math.sin(a) + (this.y - q)*Math.cos(a) + q;
        if (this.rotation == 90) {
            this.imageX -= this.imageWidth;
        } else if (this.rotation == 180) {
            this.imageX -= this.imageWidth;
            this.imageY -= this.imageHeight
        } else if (this.rotation == 270) {
            this.imageY -= this.imageHeight;
        }
        if (this.imageX < 20 && this.imageX > 0) {
            this.imageX = 0;
        }
        if (this.imageY < 20 && this.imageY > 0) {
            this.imageY = 0;
        }
    }

}