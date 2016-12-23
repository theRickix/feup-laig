function PieceConfig(scene, color, texture, boardPosition)
{
    this.scene = scene;
    this.tile = tile;
    this.color = color;
    this.dama = false;

    //Position on the board as a x,y pair (vec2)
    this.boardPosition = boardPosition;

    this.geom = new PiecePrimitive(this.scene, 1.5, 0.4, 0.4, 100, 100, texture, vec3.fromValues(boardPosition.x + .5, 0, boardPosition.y + .5));

    this.animation;
}

PieceConfig.prototype.constructor = Piece;

PieceConfig.prototype.display = function() {

    this.scene.pushMatrix();
    //register geometry instead of tile
    this.scene.registerForPick(this.tile.id, this.geom);
    this.scene.translate(this.tile.x, 1, this.tile.z);
    if(this.dama == true) {         //se dama, entao faz scale
        this.scene.scale(1, 2, 1);
    }
    this.geom.display();
    this.scene.popMatrix();
}

PieceConfig.prototype.setTile = function(newTile) {
    this.tile = newTile;
}