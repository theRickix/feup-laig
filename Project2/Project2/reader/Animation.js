function Animation() {};

Animation.prototype.constructor = Animation;

Animation.prototype.init = function (id,scene){
    this.id = id;
    this.scene = scene;
}