/*
 * MyPlayer constructor.
 */
function MyPlayer(scene, type, color) {
    this.scene = scene;
    this.type = type;
    this.color = color;
    //Currently selected piece by the player
    this.selectedPiece = null;

    this.numberPieces=12;
}

MyPlayer.prototype = Object.create(MyPlayer.prototype);
MyPlayer.prototype.constructor = MyPlayer;