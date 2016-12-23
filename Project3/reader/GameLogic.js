function GameLogic(gamemode,scene)
{
    //The list of players currently playing the game

    this.player1;
    this.player2;
    if(gamemode == GameMode.HvsH) { //Human vs Human
        this.player1 = new MyPlayer(scene,PlayerType.HUMAN,Color.WHITE);
        this.player2 = new MyPlayer(scene,PlayerType.HUMAN,Color.BLACK);
    }
    else if(gamemode == GameMode.HvsC) { //Human vs Human
        this.player1 = new MyPlayer(scene,PlayerType.HUMAN,Color.WHITE);
        this.player2 = new MyPlayer(scene,PlayerType.COMPUTER,Color.BLACK);
    }
    else if(gamemode == GameMode.CvsC) { //Human vs Human
        this.player1 = new MyPlayer(scene,PlayerType.COMPUTER,Color.WHITE);
        this.player2 = new MyPlayer(scene,PlayerType.COMPUTER,Color.BLACK);
    }
    else {
        return "error in game mode";
    }
    this.currentPlayer = this.player1;

    this.scene = scene;
    //The current board object
    this.board = new Board(this.scene);

    //The current turn of play
    this.turnNumber = 0;
    //The player index that won
    this.playerWon = -1;

    //The current play being made
    this.currentPlay = null;

   // this.gameLoop();
}

GameLogic.prototype.constructor = GameLogic;

GameLogic.prototype.gameLoop = function()
{
    if(this.currentPlay != null)
    {
        var animationKeyFrames = createAnimationKeyFrames();
        //apply the animation to the piece
        this.currentPlay.targetpiece.animation = new KeyFrameAnimation(
            this.board.scene,
            animationKeyFrames
        );
    }

    //this.checkWinCondition();

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

GameLogic.prototype.changePlayer = function()
{
    if(this.currentPlayer == this.player1)
        this.currentPlayer = this.player2;
    else
        this.currentPlayer = this.player1;
};