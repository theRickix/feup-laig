function GameLogic(playerList, board)
{
    //The list of players currently playing the game
    this.playerList = playerList;
    //The current board object
    this.board = board;

    //The current turn of play
    this.turnNumber = 0;
    //The player index that won
    this.playerWon = -1;

    /*The current game state:
     * 0 - Game title
     * 1 - Game being played
     */
    this.currentGameState = 0;

    gameLoop();
}

GameLogic.prototype.constructor = GameLogic;

GameLogic.prototype.gameLoop = function()
{
    switch(this.currentGameState)
    {
        case 0:
            /* Present title screen */
            break;
        case 1:
            runGame();
            break;
    }
};

GameLogic.prototype.checkWinCondition = function()
{
    if(playerList[0].pieces <= 0)
    {
        this.playerWon = 1;
    }
    else if(player[1].pieces <= 0)
    {
        this.playerWon = 0;
    }
};

GameLogic.prototype.makePlay = function(play)
{
    this.currentPlay = play;
};

GameLogic.prototype.runGame = function()
{
    if(this.currentPlay != null)
    {
        //TODO: apply animation to pieces affected in play
        this.currentPlay = null;
    }

    checkWinCondition();
}