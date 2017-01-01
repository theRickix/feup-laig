/*
 * TileConfig constructor.
 */
function TileConfig(scene, color, x, z, texture,selectedTexture, id,forPick) {
    this.scene = scene;
    this.texture = texture;
    this.selectedTexture = selectedTexture;
    this.init_texture = texture;
    this.forPick = forPick;
    this.occupied = false;
    this.color = color;
    this.x = x;
    this.z = z;
    this.id = id;
    this.type = "Tile";
    this.selected = false;
    this.piece = -1;

    this.geom = new TilePrimitive(scene, 1, this.texture,this.selectedTexture);
}

TileConfig.prototype.constructor = TileConfig;

/*
 * Set the piece as occupied or not.
 */
TileConfig.prototype.setOccupied = function(newOccupied) {
    this.occupied = newOccupied;
};

/*
 * Check if piece is occupied or not.
 */
TileConfig.prototype.isOccupied = function() {
    return this.occupied;
};

/*
 * Display the tile.
 */
TileConfig.prototype.display = function(selected) {
    this.scene.pushMatrix();
    this.scene.registerForPick(this.id, this);
    this.scene.translate(this.x, 0, this.z);
    this.geom.display(selected);
    this.scene.popMatrix();
};

/*
 * Get the X of the Tile.
 */
TileConfig.prototype.getX= function() {
    return this.x;
};

/*
 * Get the Z of the file.
 */
TileConfig.prototype.getZ= function() {
    return this.y;
};