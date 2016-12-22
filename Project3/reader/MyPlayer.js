function MyPlayer(scene, type, color) {
    this.scene = scene;
    this.type = type;
    this.color = color;
}

MyPlayer.prototype = Object.create(MyPlayer.prototype);
MyPlayer.prototype.constructor = MyPlayer;

