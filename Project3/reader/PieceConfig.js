function PieceConfig(scene,tile, color, texture)
{
    this.scene = scene;
    this.tile = tile;
    this.color = color;
    this.dama = false;

    this.unselectedTexture = texture;   //Texture when unselected
    this.selectedTexture = null;        //Texture when selected

    //Position on the board as a x,y pair (vec2)

    this.geom = new PiecePrimitive(this.scene, 1.5, 0.4, 0.4, 100, 100, texture, vec3.fromValues(this.tile.getX() + .5, 0, this.tile.getZ() + .5));

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
    if(this.dama == true) {         //se dama, entao faz scale
        this.scene.scale(1, 2, 1);
    }
    this.geom.display();
    this.scene.popMatrix();
}

PieceConfig.prototype.setTile = function(newTile) {
    this.tile = newTile;
}