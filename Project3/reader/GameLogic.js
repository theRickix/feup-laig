/*
 * GameLogic initializer with GameMode (unused) and scene
 */
function GameLogic(gamemode,scene)
{
    //The list of players currently playing the game
    this.player1;
    this.player2;

    //Initialize the Players in relation to the GameMode. However, because there's only
    //HvsH, the only "real" option is the first.
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
    //Used to know what player is playing
    this.currentPlayer = this.player1;
    this.otherPlayer = this.player2;

    this.scene = scene;
    //The current board object and auxiliar boards
    this.board = new Board(this.scene,this);
    this.auxBoardWhite = new AuxBoard(this.scene,this,Color.WHITE);
    this.auxBoardBlack = new AuxBoard(this.scene,this,Color.BLACK);

    //Initialize play history and showingReplay as false
    this.playHistory = [];
    this.showingReplay = false;

    //If Replay id is found in the page, show replay
    if(document.getElementById('replay') === null) {
        this.showingReplay = false;
        this.time_begin_turn = Date.now();
    }

    else {
        this.showingReplay = true;
        this.getHistory();
        this.time_begin = -1;
    }

    //Initialize all interface otpions
    this.scene.interface.initSurrender();
    this.scene.interface.initUndo();
    if(this.showingReplay)
        this.scene.interface.initMenu();
    else
        this.scene.interface.initTimer(30,1);
    this.scene.interface.initScore();
   // this.gameLoop();
    console.log(this.playHistory);
}

GameLogic.prototype.constructor = GameLogic;

/*
 * Check normal win condition. If one of the players has no pieces left, loses the game and the page
 * redirects to the game over page.
 */
GameLogic.prototype.checkWinCondition = function()
{
    if(this.player1.numberPieces <= 0)
    {
        this.playHistory.push(2);
        this.saveHistory();
        location.replace("gameoverblack.html");
    }
    else if(this.player2.numberPieces <= 0)
    {
        this.playHistory.push(1);
        this.saveHistory();
        location.replace("gameoverwhite.html");
    }
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
};

/*
 * Change player currently playing and show camera animation.
 */
GameLogic.prototype.changePlayer = function()
{
    this.time_begin_turn = Date.now();
    if(this.currentPlayer == this.player1) {
        this.currentPlayer = this.player2;
        this.otherPlayer = this.player1;
        this.scene.changingCamera = true;
        this.scene.cameraAnimation = new MyCameraAnimation(this.scene,"",1,this.scene.graph.view.perspectives[0],this.scene.graph.view.perspectives[1]);
    }
    else {
        this.currentPlayer = this.player1;
        this.otherPlayer = this.player2;
        this.scene.changingCamera = true;
        this.scene.cameraAnimation = new MyCameraAnimation(this.scene,"",1,this.scene.graph.view.perspectives[1],this.scene.graph.view.perspectives[0]);

    }

};

/*
 * Get the picked piece
 */
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

/*
 * Play to the destination tile with that id.
 */
GameLogic.prototype.playPiece = function(id)
{
    var xDest = this.getRow(id);
    var yDest = this.getCol(id);
    var xOrigin = this.getRow(this.selectedTile);
    var yOrigin = this.getCol(this.selectedTile);

    if(!this.board.pieces[this.board.tiles[xOrigin][yOrigin].piece].isKing()) {
        if(this.currentPlayer.color == Color.WHITE)
            this.checkValidMoveNormalWhite(xOrigin,yOrigin,xDest,yDest);
        else
            this.checkValidMoveNormalBlack(xOrigin,yOrigin,xDest,yDest);
    }
    else
        this.checkValidMoveKing(xOrigin,yOrigin,xDest,yDest);


};

/*
 * Reset the selected tile.
 */
GameLogic.prototype.resetSelectedTile = function()
{
    this.selectedTile = null;
    this.hasSelectedPiece = false;
};

/*
 * Get the row of the tile from the id.
 */
GameLogic.prototype.getRow = function(id) {
    return ~~((id-1)/8);
};

/*
 * Get the column of the tile from the id.
 */
GameLogic.prototype.getCol = function(id) {
    return (id-1)%8;
};

/*
 * Check if the move is valid for a white piece.
 */
GameLogic.prototype.checkValidMoveNormalWhite = function (xOrigin,yOrigin,xDest,yDest) {
    if(!this.board.tiles[xDest][yDest].isOccupied()) {
        //Check if  destination is diagonal and next to the piece.
        if(xDest == (xOrigin + 1) && (yDest == (yOrigin+1) || (yDest== yOrigin-1)))
            this.moveNormal(xOrigin,yOrigin,xDest,yDest);
        //Check if destination is diagonal and two tiles from original, to eat a piece.
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

/*
 * Check if the move is valid for a black piece.
 */
GameLogic.prototype.checkValidMoveNormalBlack = function (xOrigin,yOrigin,xDest,yDest) {
    if(!this.board.tiles[xDest][yDest].isOccupied()) {
        //Check if  destination is diagonal and next to the piece.
        if(xDest == (xOrigin -1) && (yDest == (yOrigin+1) || (yDest == yOrigin-1)))
            this.moveNormal(xOrigin,yOrigin,xDest,yDest);
        //Check if destination is diagonal and two tiles from original, to eat a piece.
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


/*
 * Check if the move is valid for a king piece.
 */
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

/*
 * Do a normal move.
 */
GameLogic.prototype.moveNormal = function (xOrigin,yOrigin,xDest,yDest) {
    this.board.tiles[xOrigin][yOrigin].setOccupied(false);
    this.board.tiles[xDest][yDest].setOccupied(true);
    this.board.tiles[xDest][yDest].piece = this.board.tiles[xOrigin][yOrigin].piece;
    this.board.tiles[xOrigin][yOrigin].piece = -1;
    this.board.pieces[this.board.tiles[xDest][yDest].piece].tile = this.board.tiles[xDest][yDest];
    this.board.pieces[this.board.tiles[xDest][yDest].piece].initAnimation(this.board.tiles[xOrigin][yOrigin]);

    var turnedKing = false;
    if(!this.board.pieces[this.board.tiles[xDest][yDest].piece].isKing())
        turnedKing = this.turnKingIfPossible(this.board.pieces[this.board.tiles[xDest][yDest].piece],xDest);

    if(!this.showingReplay)
        this.addToHistoryNormal(xOrigin,yOrigin,xDest,yDest,turnedKing);
    this.selectedTile = null;
    this.hasSelectedPiece = false;
    this.checkWinCondition();
    this.changePlayer();
};

/*
 * Do a eat piece move.
 */

GameLogic.prototype.moveEat = function (xOrigin,yOrigin,xDest,yDest,xEat,yEat) {
    this.board.tiles[xOrigin][yOrigin].setOccupied(false);
    this.board.tiles[xDest][yDest].setOccupied(true);
    this.board.tiles[xDest][yDest].piece = this.board.tiles[xOrigin][yOrigin].piece;
    this.board.tiles[xOrigin][yOrigin].piece = -1;
    this.board.pieces[this.board.tiles[xDest][yDest].piece].tile = this.board.tiles[xDest][yDest];
    this.board.pieces[this.board.tiles[xDest][yDest].piece].initAnimation(this.board.tiles[xOrigin][yOrigin]);

    console.log("Piece ID: "+this.board.tiles[xEat][yEat].piece);
    var pieceID = this.board.tiles[xEat][yEat].piece;
    this.board.pieces[this.board.tiles[xEat][yEat].piece].remove(this.auxBoardWhite,this.auxBoardBlack);

    this.board.tiles[xEat][yEat].piece = -1;
    this.board.tiles[xEat][yEat].setOccupied(false);

    var turnedKing = false;
    if(!this.board.pieces[this.board.tiles[xDest][yDest].piece].isKing())
        turnedKing = this.turnKingIfPossible(this.board.pieces[this.board.tiles[xDest][yDest].piece],xDest);

    this.otherPlayer.numberPieces--;

    if(!this.showingReplay)
        this.addToHistoryEat(xOrigin,yOrigin,xDest,yDest,xEat,yEat,pieceID,turnedKing);

    this.selectedTile = null;
    this.hasSelectedPiece = false;
    this.changePlayer();
    this.checkWinCondition();
    this.scene.interface.setScore(this.player1.numberPieces,this.player2.numberPieces);
};

/*
 * Main display of the game.
 */
GameLogic.prototype.display = function() {
    if(!this.showingReplay) {
        var player;
        var time_now = Date.now();
        if(time_now - this.time_begin_turn >= 30000)
            this.playerSurrender();
        else {
            if(this.currentPlayer == this.player1)
                player = 1;
            else
                player = 2;
            this.scene.interface.updateTimer((30000 - (time_now-this.time_begin_turn))/1000,player);
        }
    }
    this.scene.pushMatrix();
    this.board.display();
    this.auxBoardWhite.display();
    this.auxBoardBlack.display();
    this.scene.popMatrix();
    if(this.showingReplay)
        this.doHistoryPlay(Date.now());
};


/*
 * Turn king if on the end of the board.
 */
GameLogic.prototype.turnKingIfPossible = function(piece,x) {
    if((this.currentPlayer.color == Color.WHITE && x==7) ||
        (this.currentPlayer.color == Color.BLACK && x==0)) {
        piece.turnKing();
        return true;
    }
    return false;
};

/*
 * Do the surrender of a player
 */
GameLogic.prototype.playerSurrender = function() {
    if(this.currentPlayer == this.player1) {
        this.playHistory.push(2);
        this.saveHistory();
        location.replace("gameoverblack.html");
    }
    else if(this.currentPlayer == this.player2) {
        this.playHistory.push(2);
        this.saveHistory();
        location.replace("gameoverwhite.html");
    }
};

/*
 * Add a normal move to history.
 */
GameLogic.prototype.addToHistoryNormal = function(xOrigin,yOrigin,xDest,yDest,turnedKing) {
    var play = {
        type: MoveResult.NORMAL,
        xOrigin: xOrigin,
        yOrigin: yOrigin,
        xDest: xDest,
        yDest: yDest,
        turnedKing: turnedKing
    };
    this.playHistory.push(play);
};


/*
 * Add a eat move to history.
 */
GameLogic.prototype.addToHistoryEat = function(xOrigin,yOrigin,xDest,yDest,xEat,yEat,pieceEaten,turnedKing) {
    var play = {
        type: MoveResult.EAT,
        xOrigin: xOrigin,
        yOrigin: yOrigin,
        xDest: xDest,
        yDest: yDest,
        xEat: xEat,
        yEat: yEat,
        pieceEaten: pieceEaten,
        turnedKing: turnedKing
    };
    this.playHistory.push(play);
};

/*
 * Save the history in the end of the game.
 */
GameLogic.prototype.saveHistory = function() {
    localStorage.setItem('replay', JSON.stringify(this.playHistory));
};

/*
 * Retrieve history when doing replay.
 */
GameLogic.prototype.getHistory = function() {
    this.playHistory = JSON.parse(localStorage.getItem('replay'));
    this.playHistory.reverse();
    console.log("SIZE"+this.playHistory.length);
};

/*
 * Getter for showingReplay.
 */
GameLogic.prototype.showingReplay = function() {
    return this.showingReplay;
};

/*
 * Make a play from the history when replaying.
 */
GameLogic.prototype.doHistoryPlay = function(time) {
    if(this.playHistory.length >1) {


        if(this.time_begin == -1)
            this.time_begin = time;

        if(time - this.time_begin >= 3000) {
            this.time_begin = time;
            var play = this.playHistory.pop();
            if(play.type == MoveResult.NORMAL) {
                this.moveNormal(play.xOrigin,play.yOrigin,play.xDest,play.yDest);
            }
            else
                this.moveEat(play.xOrigin,play.yOrigin,play.xDest,play.yDest,play.xEat,play.yEat);
        }
    }
    else {
        var winner = this.playHistory.pop();

        if(winner == 1)
            location.replace("gameoverwhite.html");
        else
            location.replace("gameoverblack.html");

    }
};

/*
 * Undo a play.
 */
GameLogic.prototype.playUndo = function() {
    var play = this.playHistory.pop();

    this.changePlayer();

    this.board.tiles[play.xOrigin][play.yOrigin].setOccupied(true);
    this.board.tiles[play.xDest][play.yDest].setOccupied(false);

    this.board.tiles[play.xOrigin][play.yOrigin].piece = this.board.tiles[play.xDest][play.yDest].piece;
    this.board.tiles[play.xDest][play.yDest].piece = -1;
    this.board.pieces[this.board.tiles[play.xOrigin][play.yOrigin].piece].tile = this.board.tiles[play.xOrigin][play.yOrigin];
    this.board.pieces[this.board.tiles[play.xOrigin][play.yOrigin].piece].initAnimation(this.board.tiles[play.xDest][play.yDest]);

    if(play.turnedKing)
        this.board.pieces[this.board.tiles[play.xOrigin][play.yOrigin].piece].turnNormal();

    if(play.type == MoveResult.EAT) {
        this.board.tiles[play.xEat][play.yEat].setOccupied(true);
        this.board.tiles[play.xEat][play.yEat].piece = play.pieceEaten;
        this.board.pieces[play.pieceEaten].eaten = false;
        var oldTile = this.board.pieces[play.pieceEaten].tile;
        this.board.pieces[play.pieceEaten].tile = this.board.tiles[play.xEat][play.yEat];
        this.otherPlayer.numberPieces++;
        this.scene.interface.setScore(this.player1.numberPieces,this.player2.numberPieces);
        if(this.otherPlayer.color == Color.WHITE)
            this.auxBoardWhite.pieces.pop();
        else
            this.auxBoardBlack.pieces.pop();
    }

    this.selectedTile = null;
    this.hasSelectedPiece = false;


};