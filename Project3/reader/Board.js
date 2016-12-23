function Board(scene)
{
    this.whitePositions = new Array(12);
    this.blackPositions = new Array(12);

    this.scene = scene;

    this.boardObject = [];
    this.buildBoardObject();
}

Board.prototype.constructor = Board;

Board.prototype.buildBoardObject = function()
{
    var colorStart = false; //if true color = white else if false color = black
    for(var x = 0; x < 8; x++)
    {
        this.boardObject = new Array(10);
        this.boardObject.push(new Array(10));
        for(var y = 0; y < 8; y++)
        {
            var currentTileColor;
            if(y % 2 === 0)
            {
                if(!colorStart)
                {
                    currentTileColor = vec4.fromValues(0, 0, 0, 0);
                }
                else
                {
                    currentTileColor = vec4.fromValues(.8, .8, .8, 0);
                }
            }
            else
            {
                if(!colorStart)
                {
                    currentTileColor = vec4.fromValues(.8, .8, .8, 0);
                }
                else
                {
                    currentTileColor = vec4.fromValues(0, 0, 0, 0);
                }
            }
            //ID é uma string que contem "coluna+linha"
            this.boardObject[x].push(new TileConfig(this.scene, currentTileColor, x + .5, y + .5, null, y + "+" + x));
        }
        colorStart = !colorStart;
    }
};

Board.prototype.setPlayerPositions = function()
{
    //Cria um board de acordo com esta img: http://www.iggamecenter.com/images/info/checkers_rus/2.png

    this.whitePositions[0] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(0, 0));
    this.whitePositions[1] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(2, 0));
    this.whitePositions[2] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(4, 0));
    this.whitePositions[3] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(6, 0));

    this.whitePositions[4] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(1, 1));
    this.whitePositions[5] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(3, 1));
    this.whitePositions[6] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(5, 1));
    this.whitePositions[7] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(7, 1));

    this.whitePositions[8] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(0, 2));
    this.whitePositions[9] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(2, 2));
    this.whitePositions[10] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(4, 2));
    this.whitePositions[11] = new PieceConfig(this.scene, vec4.fromValues(1, 1, 1, 0), null, vec2.fromValues(6, 2));

    this.blackPositions[0] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(1, 5));
    this.blackPositions[1] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(3, 5));
    this.blackPositions[2] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(5, 5));
    this.blackPositions[3] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(7, 5));

    this.blackPositions[4] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(0, 6));
    this.blackPositions[5] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(2, 6));
    this.blackPositions[6] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(4, 6));
    this.blackPositions[7] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(6, 6));

    this.blackPositions[8] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(1, 7));
    this.blackPositions[9] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(3, 7));
    this.blackPositions[10] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(5, 7));
    this.blackPositions[11] = new PieceConfig(this.scene, vec4.fromValues(0, 0, 0, 0), null, vec2.fromValues(7, 7));
};

Board.prototype.display = function()
{
    for(var x = 0; x < 8; x++)
    {
        for(var y = 0; y < 8; y++)
        {
            this.boardObject[x][y].display();
        }
    }
};