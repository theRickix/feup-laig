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

    this.gameLoop();
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
            this.runGame();
            this.applyAnimations();
            break;
    }
    this.gameLoop();
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

GameLogic.prototype.setPlay = function(play)
{
    this.currentPlay = play;
};

GameLogic.prototype.runGame = function()
{
    if(this.currentPlay != null)
    {
        var animationKeyFrames = createAnimationKeyFrames();
        //apply the animation to the piece
        this.currentPlay.targetpiece.animation = new KeyFrameAnimation(
            this.board.scene,
            animationKeyFrames
        );
        this.currentPlay = null;
    }

    checkWinCondition();
};

GameLogic.prototype.createAnimationKeyFrames = function()
{
    var pieceAnimation = [];
    pieceAnimation.push(new KeyFrame(
        this.board.scene,                       //the scene
        0,                                      //the keyframe time
        this.currentPlay.targetPiece.truePosition,  //the target position
        0,                                      //the target rotation
        1                                       //the target scale
    ));
    
    pieceAnimation.push(new KeyFrame(
        this.board.scene,                       //the scene
        2,                                      //the keyframe time
        vec3.fromValues(this.currentPlay.targetPiece.truePosition.x, 
                        this.currentPlay.targetPiece.truePosition.y + 2, 
                        this.currentPlay.targetPiece.truePosition.z),  //the target position
        0,                                      //the target rotation
        1                                       //the target scale
    ));

    pieceAnimation.push(new KeyFrame(
        this.board.scene,                       //the scene
        2,                                      //the keyframe time
        vec3.fromValues(this.currentPlay.targetPos.x, 
                        this.currentPlay.targetPos.y + 2, 
                        this.currentPlay.targetPos.z),  //the target position
        0,                                      //the target rotation
        1                                       //the target scale
    ));

    pieceAnimation.push(new KeyFrame(
        this.board.scene,                       //the scene
        0,                                      //the keyframe time
        this.currentPlay.targetPos,  //the target position
        0,                                      //the target rotation
        1                                       //the target scale
    ));

    return pieceAnimation;
}