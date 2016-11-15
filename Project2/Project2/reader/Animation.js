function Animation() {};

Animation.prototype.constructor = Animation;

Animation.prototype.init = function (id,scene){
    this.id = id;
    this.scene = scene;
    this.finished = false;
}

Animation.prototype.hasFinished = function() {
    return this.finished;
}

Animation.prototype.getId = function() {
    return this.id;
}