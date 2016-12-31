function Board(scene,game)
{
    this.tiles = [];
    this.pieces = [];
    this.game = game;

    this.scene = scene;
    this.textures = [];
    this.textures["white"] = new CGFtexture(this.scene, "res/white.jpg");
    this.textures["black"] = new CGFtexture(this.scene, "res/black.jpg");
    this.textures["whitePiece"] = new CGFtexture(this.scene, "res/whitePiece.jpg");
    this.textures["blackPiece"] = new CGFtexture(this.scene, "res/blackPiece.jpg");
    this.textures["lightGreen"] = new CGFtexture(this.scene, "res/lightGreen.gif");

    this.buildBoard();
    this.buildPieces();
}

Board.prototype.constructor = Board;

Board.prototype.buildBoard = function() {
    //create tiles
    var id=1;
    for(var x = 0; x<8; x++) {
        this.tiles[x] = [];
        for(var y=0; y<8; y++) {
            if(x%2 == y%2)
                this.tiles[x][y] = new TileConfig(this.scene,vec4.fromValues(0.8, 0.8, 0.8, 0),x,y,this.textures["black"],this.textures["lightGreen"],id,true);
            else
                this.tiles[x][y] = new TileConfig(this.scene,vec4.fromValues(0,0, 0, 0),x,y,this.textures["white"],this.textures["lightGreen"],id,true);
            id++;
        }
    }
    console.log(this.tiles[1].length);

};

Board.prototype.buildPieces= function()
{
    //Cria um board de acordo com esta img: http://www.iggamecenter.com/images/info/checkers_rus/2.png

    this.pieces[0] = new PieceConfig(this.scene, this.tiles[0][0], this.textures["whitePiece"],Color.WHITE,0);
    this.pieces[1] = new PieceConfig(this.scene, this.tiles[0][2], this.textures["whitePiece"],Color.WHITE,1);
    this.pieces[2] = new PieceConfig(this.scene, this.tiles[0][4], this.textures["whitePiece"],Color.WHITE,2);
    this.pieces[3] = new PieceConfig(this.scene, this.tiles[0][6], this.textures["whitePiece"],Color.WHITE,3);

    this.pieces[4] = new PieceConfig(this.scene, this.tiles[1][1], this.textures["whitePiece"],Color.WHITE,4);
    this.pieces[5] = new PieceConfig(this.scene, this.tiles[1][3], this.textures["whitePiece"],Color.WHITE,5);
    this.pieces[6] = new PieceConfig(this.scene, this.tiles[1][5], this.textures["whitePiece"],Color.WHITE,6);
    this.pieces[7] = new PieceConfig(this.scene, this.tiles[1][7], this.textures["whitePiece"],Color.WHITE,7);

    this.pieces[8] = new PieceConfig(this.scene, this.tiles[2][0], this.textures["whitePiece"],Color.WHITE,8);
    this.pieces[9] = new PieceConfig(this.scene, this.tiles[2][2], this.textures["whitePiece"],Color.WHITE,9);
    this.pieces[10] = new PieceConfig(this.scene, this.tiles[2][4], this.textures["whitePiece"],Color.WHITE,10);
    this.pieces[11] = new PieceConfig(this.scene, this.tiles[2][6], this.textures["whitePiece"],Color.WHITE,11);

    this.pieces[12] = new PieceConfig(this.scene, this.tiles[5][1], this.textures["blackPiece"],Color.BLACK,12);
    this.pieces[13] = new PieceConfig(this.scene, this.tiles[5][3], this.textures["blackPiece"],Color.BLACK,13);
    this.pieces[14] = new PieceConfig(this.scene, this.tiles[5][5], this.textures["blackPiece"],Color.BLACK,14);
    this.pieces[15] = new PieceConfig(this.scene, this.tiles[5][7], this.textures["blackPiece"],Color.BLACK,15);

    this.pieces[16] = new PieceConfig(this.scene, this.tiles[6][0], this.textures["blackPiece"],Color.BLACK,16);
    this.pieces[17] = new PieceConfig(this.scene, this.tiles[6][2], this.textures["blackPiece"],Color.BLACK,17);
    this.pieces[18] = new PieceConfig(this.scene, this.tiles[6][4], this.textures["blackPiece"],Color.BLACK,18);
    this.pieces[19] = new PieceConfig(this.scene, this.tiles[6][6], this.textures["blackPiece"],Color.BLACK,19);

    this.pieces[20] = new PieceConfig(this.scene, this.tiles[7][1], this.textures["blackPiece"],Color.BLACK,20);
    this.pieces[21] = new PieceConfig(this.scene, this.tiles[7][3], this.textures["blackPiece"],Color.BLACK,21);
    this.pieces[22] = new PieceConfig(this.scene, this.tiles[7][5], this.textures["blackPiece"],Color.BLACK,22);
    this.pieces[23] = new PieceConfig(this.scene, this.tiles[7][7], this.textures["blackPiece"],Color.BLACK,23);
};

Board.prototype.display = function()
{
    for(var x = 0; x < 8; x++)
    {
        for(var y = 0; y < 8; y++)
        {   var selected;
            if(this.game.selectedTile != this.tiles[x][y].id)
                selected=false;
            else
                selected=true;

            this.tiles[x][y].display(selected);
        }
    }

    for(p in this.pieces) {
        if (this.pieces[p].isAlive())
            this.pieces[p].display();
    }

};