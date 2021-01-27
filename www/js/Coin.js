class Coin extends GameObject {

constructor(image, centreX, centreY, size, moveX, moveY, delay = 100)
    {
        super(100, delay); /* as this class extends from GameObject, you must always call super() */

        /* These variables depend on the object */
        this.image = image;
        this.centreX = centreX;
        this.centreY = centreY;
        this.size = size;
        this.delay = delay;
        this.moveX = moveX;
        this.moveY = moveY;
        this.NUMBER_OF_SPRITES = 7; // the number of gameObjects in the gameObject image
        this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE = 8; // the number of columns in the gameObject image
        this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE = 1; // the number of rows in the gameObject image	
        this.START_ROW = 0;
        this.START_COLUMN = 0;

        this.currentgameObject = 0; // the current gameObject to be displayed from the gameObject image  
        this.row = this.START_ROW; // current row in gameObject image
        this.column = this.START_COLUMN; // current column in gameObject image

        this.SPRITE_WIDTH = (this.image.width / this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE);
        this.SPRITE_HEIGHT = (this.image.height / this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE);
    }

    updateState()
    {
        if (this.currentgameObject === this.NUMBER_OF_SPRITES)
        {
            this.currentgameObject = 0;
            this.row = 0;
            this.column = 0;
        }
        this.currentgameObject++;

        this.column++;
        if (this.column >= this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE)
        {
            this.column = 0;
            this.row++;
        }

        this.centreX += this.moveX;
        this.centreY += this.moveY;
    }

    render()
    {
        ctx.drawImage(this.image, this.column * this.SPRITE_WIDTH, this.row * this.SPRITE_WIDTH, this.SPRITE_WIDTH, 
            this.SPRITE_HEIGHT, this.centreX - parseInt(this.size / 2), this.centreY - parseInt(this.size / 2), this.size, this.size);
    }
}