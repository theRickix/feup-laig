function MyPlayer(scene, type, color, ) {
    this.scene = scene;
    this.type = type;
    this.color = color;
    //Currently selected piece by the player
    this.selectedPiece = null;
}

MyPlayer.prototype = Object.create(MyPlayer.prototype);
MyPlayer.prototype.constructor = MyPlayer;
/* Call this when selecting any board piece */
MyPlayer.prototype.selectPiece = function(selectedPiece)
{
    this.selectedPiece = selectedPiece;

    selectedPiece.selected = true;
};

/*Call this right before selecting a new piece/ when not picking any object
  to return to unselected state */
MyPlayer.prototype.unselectCurrentPiece = function()
{
    if(this.selectedPiece != null)
    {
        this.selectedPiece.selected = false;
        this.selectedPiece = null;
    }
}