function Board(scene)
{
    /*The 1st position is for the 1st player postions
      The 2nd is for the 2nd*/
    this.currentPlayerPositions = [];

    this.boardObject = [];
    this.buildBoardObject();
}

Board.prototype.constructor = Board;

Board.prototype.buildBoardObject = function()
{
    var colorStart = false; //if true color = white else if false color = black
    for(var x = 0; x < 10; x++)
    {
        this.boardObject.push(new Array(10));
        for(var y = 0; y < 10; y++)
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
                    currentTileColor = vec4.fromValues(1, 1, 1, 0);
                }
            }
            else
            {
                if(!colorStart)
                {
                    currentTileColor = vec4.fromValues(1, 1, 1, 0);
                }
                else
                {
                    currentTileColor = vec4.fromValues(0, 0, 0, 0);
                }
            }
            //ID é uma string que contem "coluna + linha"
            this.boardObject[x].push(new TileConfig(this.scene, currentTileColor, x + .5, y + .5, null, x + "+" + y));
        }
        colorStart = !colorStart;
    }
}

Board.prototype.

Board.prototype.display = function()
{
    for(var x = 0; x < 10; x++)
    {
        for(var y = 0; y < 10; y++)
        {
            this.boardObject[x][y].display();
        }
    }
}