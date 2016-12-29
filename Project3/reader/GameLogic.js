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
    this.otherPlayer = this.player2;

    this.scene = scene;
    //The current board object
    this.board = new Board(this.scene,this);

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
    if(this.player1.numberPieces <= 0)
    {
        this.playerWon = this.player1;
    }
    else if(this.player2.numberPieces <= 0)
    {
        this.playerWon = this.player2;
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
    if(this.currentPlayer == this.player1) {
        this.currentPlayer = this.player2;
        this.otherPlayer = this.player1;
    }
    else {
        this.currentPlayer = this.player1;
        this.otherPlayer = this.player2;
    }

};

GameLogic.prototype.getPickedObject = function(id)
{
    var tileX = this.getRow(id);
    var tileY = this.getCol(id);
    console.log(tileX);
    console.log(tileY);
    if(this.board.tiles[tileX][tileY].isOccupied() &&  this.board.pieces[this.board.tiles[tileX][tileY].piece].color == this.currentPlayer.color) {
        this.selectedTile = id;
        this.hasSelectedPiece = true;
    }

};

GameLogic.prototype.playPiece = function(id)
{
    var xDest = this.getRow(id);
    var yDest = this.getCol(id);
    var xOrigin = this.getRow(this.selectedTile);
    var yOrigin = this.getCol(this.selectedTile);

    if(!this.board.pieces[this.board.tiles[xOrigin ][yOrigin].piece].isKing()) {
        if(this.currentPlayer.color == Color.WHITE)
            this.checkValidMoveNormalWhite(xOrigin,yOrigin,xDest,yDest);
        else
            this.checkValidMoveNormalBlack(xOrigin,yOrigin,xDest,yDest);
    }
    else
        this.checkValidMoveKing(xOrigin,yOrigin,xDest,yDest);


};

GameLogic.prototype.resetSelectedTile = function()
{
    this.selectedTile = null;
    this.hasSelectedPiece = false;
};

GameLogic.prototype.getRow = function(id) {
    return ~~((id-1)/8);
};

GameLogic.prototype.getCol = function(id) {
    return (id-1)%8;
};

GameLogic.prototype.checkValidMoveNormalWhite = function (xOrigin,yOrigin,xDest,yDest) {
    if(!this.board.tiles[xDest][yDest].isOccupied()) {
        if(xDest == (xOrigin + 1) && (yDest == (yOrigin+1) || (yDest== yOrigin-1)))
            this.moveNormal(xOrigin,yOrigin,xDest,yDest);

        if (xDest == (xOrigin + 2)) {
            if (yDest == (yOrigin + 2)) {
                if (this.board.pieces[this.board.tiles[xOrigin + 1][yOrigin + 1].piece].color != this.currentPlayer.color)
                    this.moveEat(xOrigin, yOrigin, xDest, yDest, xOrigin + 1, yOrigin + 1);
            }

            if (yDest == (yOrigin - 2)) {
                if (this.board.pieces[this.board.tiles[xOrigin + 1][yOrigin - 1].piece].color != this.currentPlayer.color)
                    this.moveEat(xOrigin, yOrigin, xDest, yDest, xOrigin + 1, yOrigin - 1);
            }
        }

    }
};

GameLogic.prototype.checkValidMoveNormalBlack = function (xOrigin,yOrigin,xDest,yDest) {
    if(!this.board.tiles[xDest][yDest].isOccupied()) {
        if(xDest == (xOrigin -1) && (yDest == (yOrigin+1) || (yDest == yOrigin-1)))
            this.moveNormal(xOrigin,yOrigin,xDest,yDest);

        if (xDest == (xOrigin - 2)) {
            if (yDest == (yOrigin + 2)) {
                if (this.board.pieces[this.board.tiles[xOrigin - 1][yOrigin + 1].piece].color != this.currentPlayer.color)
                    this.moveEat(xOrigin, yOrigin, xDest, yDest, xOrigin - 1, yOrigin + 1);
            }

            if (yDest == (yOrigin - 2)) {
                if (this.board.pieces[this.board.tiles[xOrigin - 1][yOrigin - 1].piece].color != this.currentPlayer.color)
                    this.moveEat(xOrigin, yOrigin, xDest, yDest, xOrigin - 1, yOrigin - 1);
            }
        }
    }
};

GameLogic.prototype.checkValidMoveKing = function (xOrigin,yOrigin,xDest,yDest) {
    if(!this.board.tiles[xDest][yDest].isOccupied()) {
        if(xDest == (xOrigin -1) && (yDest == (yOrigin+1) || (yDest == yOrigin-1)))
            this.moveNormal(xOrigin,yOrigin,xDest,yDest);

        if (xDest == (xOrigin - 2)) {
            if (yDest == (yOrigin + 2)) {
                if (this.board.pieces[this.board.tiles[xOrigin - 1][yOrigin + 1].piece].color != this.currentPlayer.color)
                    this.moveEat(xOrigin, yOrigin, xDest, yDest, xOrigin - 1, yOrigin + 1);
            }

            if (yDest == (yOrigin - 2)) {
                if (this.board.pieces[this.board.tiles[xOrigin - 1][yOrigin - 1].piece].color != this.currentPlayer.color)
                    this.moveEat(xOrigin, yOrigin, xDest, yDest, xOrigin - 1, yOrigin - 1);
            }
        }

        if(xDest == (xOrigin + 1) && (yDest == (yOrigin+1) || (yDest== yOrigin-1)))
            this.moveNormal(xOrigin,yOrigin,xDest,yDest);

        if (xDest == (xOrigin + 2)) {
            if (yDest == (yOrigin + 2)) {
                if (this.board.pieces[this.board.tiles[xOrigin + 1][yOrigin + 1].piece].color != this.currentPlayer.color)
                    this.moveEat(xOrigin, yOrigin, xDest, yDest, xOrigin + 1, yOrigin + 1);
            }

            if (yDest == (yOrigin - 2)) {
                if (this.board.pieces[this.board.tiles[xOrigin + 1][yOrigin - 1].piece].color != this.currentPlayer.color)
                    this.moveEat(xOrigin, yOrigin, xDest, yDest, xOrigin + 1, yOrigin - 1);
            }
        }
    }
};

GameLogic.prototype.moveNormal = function (xOrigin,yOrigin,xDest,yDest) {
    this.board.tiles[xOrigin][yOrigin].setOccupied(false);
    this.board.tiles[xDest][yDest].setOccupied(true);
    this.board.tiles[xDest][yDest].piece = this.board.tiles[xOrigin][yOrigin].piece;
    this.board.tiles[xOrigin][yOrigin].piece = -1;
    this.board.pieces[this.board.tiles[xDest][yDest].piece].tile = this.board.tiles[xDest][yDest];

    this.turnKingIfPossible(this.board.pieces[this.board.tiles[xDest][yDest].piece],xDest);

    this.selectedTile = null;
    this.hasSelectedPiece = false;
    this.changePlayer();
};

GameLogic.prototype.moveEat = function (xOrigin,yOrigin,xDest,yDest,xEat,yEat) {
    this.board.tiles[xOrigin][yOrigin].setOccupied(false);
    this.board.tiles[xDest][yDest].setOccupied(true);
    this.board.tiles[xDest][yDest].piece = this.board.tiles[xOrigin][yOrigin].piece;
    this.board.tiles[xOrigin][yOrigin].piece = -1;
    this.board.pieces[this.board.tiles[xDest][yDest].piece].tile = this.board.tiles[xDest][yDest];

    console.log("Piece ID: "+this.board.tiles[xEat][yEat].piece);
    this.board.pieces[this.board.tiles[xEat][yEat].piece].remove();

    this.board.tiles[xEat][yEat].piece = -1;
    this.board.tiles[xEat][yEat].setOccupied(false);

    this.turnKingIfPossible(this.board.pieces[this.board.tiles[xDest][yDest].piece],xDest);

    this.otherPlayer.numberPieces--;

    this.selectedTile = null;
    this.hasSelectedPiece = false;
    this.changePlayer();
};

GameLogic.prototype.display = function() {
    this.board.display();
};

GameLogic.prototype.turnKingIfPossible = function(piece,x) {
    if((this.currentPlayer.color == Color.WHITE && x==7) ||
        (this.currentPlayer.color == Color.BLACK && x==0)) {
        piece.turnKing();
    }
};