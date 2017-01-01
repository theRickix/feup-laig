/*
 * PieceConfig constructor.
 */
function PieceConfig(scene,tile, texture,color,id)
{
    this.scene = scene;
    this.tile = tile;
    this.oldTile = null;
    this.beingAnimated = false;
    this.id = id;
    this.tile.piece = this.id;
    this.tile.setOccupied(true);
    this.color = color;
    this.dama = false;
    this.eaten = false;

    //Position on the board as a x,y pair (vec2)

    this.geom = new PiecePrimitive(this.scene, 0.2, 0.5, 0.5, 50, 50, texture, vec3.fromValues(this.tile.getX() + .5, 0, this.tile.getZ() + .5));

    this.animation;
}

PieceConfig.prototype.constructor = PieceConfig;

/*
 * Main display of piece.
 */
PieceConfig.prototype.display = function()
{
    this.scene.pushMatrix();
    //register geometry instead of tile
    this.scene.registerForPick(this.tile.id, this.geom);
    if(!this.beingAnimated)
        this.scene.translate(this.tile.x, 1, this.tile.z);
    else {
        console.log("animou?");
        var delta = (Date.now() - this.time_begin_animation)/500;
        if(delta <=0.5)
            var y = 1+4*delta;
        else
            var y = 3 - 4*(delta-0.5);
        console.log(y);
        this.scene.translate(this.oldTile.x+this.vecX*delta, y, this.oldTile.z+this.vecZ*delta);
        if(delta >= 1) {
            this.time_begin_animation=-1;
            this.beingAnimated = false;
        }
    }

    if(this.dama && !this.eaten) {         //se dama, entao faz scale
        this.scene.scale(1, 3, 1);
        this.scene.translate(0,0.4,0);
    }
    this.geom.display();
    this.scene.popMatrix();
};

PieceConfig.prototype.setTile = function(newTile) {
    this.tile = newTile;
};

/*
 * Remove the piece to its auxiliar board.
 */
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

/*
 * Getter to check if the piece is alive or not.
 */
PieceConfig.prototype.isAlive = function() {
    return !this.eaten;
};

/*
 * Set the piece to king.
 */
PieceConfig.prototype.turnKing = function() {
    this.dama = true;
};

/*
 * Reset the piece back to normal.
 */
PieceConfig.prototype.turnNormal = function() {
    this.dama = false;
};

/*
 * Getter to check if piece is king.
 */
PieceConfig.prototype.isKing = function() {
    return this.dama;
};

/*
 * Initialize animation when piece is played.
 */
PieceConfig.prototype.initAnimation = function(tile) {
    this.beingAnimated = true;
    this.oldTile = tile;
    this.vecX = this.tile.x - this.oldTile.x;
    this.vecZ = this.tile.z - this.oldTile.z;
    this.time_begin_animation = Date.now();
};