
function CircularAnimation(scene, id, span, center, radius, startang, endang) {
    init(id,scene);

    this.span = span;
    this.center = center;
    this.radius = radius;
    this.startang = startang * Math.PI / 180;
    this.endang = endang * Math.PI / 180;

    this.currentAngle = startang;



}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;


CircularAnimation.prototype.animate = function() {

}