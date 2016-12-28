function TileConfig(scene, color, x, z, texture,selectedTexture, id) {
    this.scene = scene;
    this.texture = texture;
    this.selectedTexture = selectedTexture;
    this.init_texture = texture;

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

TileConfig.prototype.setOccupied = function(newOccupied) {
    this.occupied = newOccupied;   //tile occuppied
};

TileConfig.prototype.isOccupied = function() {
    return this.occupied;
};

TileConfig.prototype.display = function(selected) {
    this.scene.pushMatrix();
    this.scene.registerForPick(this.id, this);
    this.scene.translate(this.x, 0, this.z);
    this.geom.display(selected);
    this.scene.popMatrix();
}

TileConfig.prototype.getX= function() {
    return this.x;
}

TileConfig.prototype.getZ= function() {
    return this.y;
}