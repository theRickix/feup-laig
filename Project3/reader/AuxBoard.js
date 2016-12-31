function AuxBoard(scene,game,color)
{
    this.tiles = [];
    this.pieces = [];
    this.game = game;

    this.scene = scene;
    this.color = color;
    this.textures = [];
    this.textures["white"] = new CGFtexture(this.scene, "res/white.jpg");
    this.textures["black"] = new CGFtexture(this.scene, "res/black.jpg");
    this.textures["whitePiece"] = new CGFtexture(this.scene, "res/whitePiece.jpg");
    this.textures["blackPiece"] = new CGFtexture(this.scene, "res/blackPiece.jpg");
    this.textures["lightGreen"] = new CGFtexture(this.scene, "res/lightGreen.gif");

    this.buildBoard();
}

AuxBoard.prototype.constructor = AuxBoard;

AuxBoard.prototype.buildBoard = function() {
    //create tiles
    var id=1;
    for(var x = 0; x<8; x++) {
        this.tiles[x] = [];
        for(var y=0; y<2; y++) {
            if(x%2 == y%2)
                this.tiles[x][y] = new TileConfig(this.scene,vec4.fromValues(0.8, 0.8, 0.8, 0),x,y,this.textures["black"],this.textures["lightGreen"],id);
            else
                this.tiles[x][y] = new TileConfig(this.scene,vec4.fromValues(0,0, 0, 0),x,y,this.textures["white"],this.textures["lightGreen"],id);
            id++;
        }
    }
    console.log(this.tiles[1].length);

};

AuxBoard.prototype.display = function()
{
    this.scene.pushMatrix();
    if(this.color == Color.WHITE) {
        this.scene.translate(0,0,-3);
    }
    else
        this.scene.translate(0,0,9);

    for(var x = 0; x < 8; x++)
    {
        for(var y = 0; y < 2; y++)
        {
            var selected=false

            this.tiles[x][y].display(selected);
        }
    }

    for(p in this.pieces) {
        if (!this.pieces[p].isAlive())
            this.pieces[p].display();
    }
    this.scene.popMatrix();
};

AuxBoard.prototype.getRow = function(id) {
    return ~~((id-1)/2);
};

AuxBoard.prototype.getCol = function(id) {
    return (id-1)%2;
};