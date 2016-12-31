function PieceConfig(scene,tile, texture,color,id)
{
    this.scene = scene;
    this.tile = tile;
    this.id = id;
    this.tile.piece = this.id;
    this.tile.setOccupied(true);
    this.color = color;
    this.dama = false;
    this.eaten = false;

    this.unselectedTexture = texture;   //Texture when unselected
    this.selectedTexture = null;        //Texture when selected

    //Position on the board as a x,y pair (vec2)

    this.geom = new PiecePrimitive(this.scene, 0.2, 0.5, 0.5, 50, 50, texture, vec3.fromValues(this.tile.getX() + .5, 0, this.tile.getZ() + .5));

    this.animation;
}

PieceConfig.prototype.constructor = PieceConfig;

PieceConfig.prototype.display = function()
{
    if(this.selected)
    {
        this.geom.appearance.setTexture(this.selectedTexture);
    }
    else
    {
        this.geom.appearance.setTexture(this.unselectedTexture);
    }

    this.scene.pushMatrix();
    //register geometry instead of tile
    this.scene.registerForPick(this.tile.id, this.geom);
    this.scene.translate(this.tile.x, 1, this.tile.z);
    if(this.dama && !this.eaten) {         //se dama, entao faz scale
        this.scene.scale(1, 3, 1);
        this.scene.translate(0,0.4,0);
    }
    this.geom.display();
    this.scene.popMatrix();
}

PieceConfig.prototype.setTile = function(newTile) {
    this.tile = newTile;
}

PieceConfig.prototype.remove = function(white,black) {
    this.eaten = true;
    if(this.color == white.color) {
        var nPieces = white.pieces.length;
        var row = white.getRow(nPieces+1);
        var col = white.getCol(nPieces+1);
        this.tile = white.tiles[row][col];
        white.pieces.push(this);
    }
    else {
        var nPieces = black.pieces.length;
        var row = black.getRow(nPieces+1);
        var col = black.getCol(nPieces+1);
        this.tile = black.tiles[row][col];
        black.pieces.push(this);
    }
    console.log("x,y: "+row+" "+col);
};

PieceConfig.prototype.isAlive = function() {
    return !this.eaten;
};

PieceConfig.prototype.turnKing = function() {
    this.dama = true;
};

PieceConfig.prototype.turnNormal = function() {
    this.dama = false;
};

PieceConfig.prototype.isKing = function() {
    return this.dama;
};