
function CircularAnimation(scene, id, span, center, radius, startang, rotang) {
    init(id,scene);

    this.span = span*1000;
    this.center = center;
    this.radius = radius;
    this.startang = startang * Math.PI / 180;
    this.rotang = rotang * Math.PI / 180;
    this.time_begin = null;
    this.currentAngle = startang;


}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;


CircularAnimation.prototype.animate = function(time) {

    //animation begin
    if(this.time_begin === null)
        this.time_begin = time;


    var delta = (time-this.time_begin)/this.span;

    //animation end
    if(delta === 1)
        return true;

    this.currentAngle = this.startang+delta*this.rotang;

    //translate in relation to center
    this.scene.translate(this.center[0],
                        this.center[1],
                        this.center[2]);

    //translate no next angle position
    this.scene.translate(this.radius*Math.cos(this.currentAngle),
                        0,
                        this.radius*Math.sin(this.currentAngle)
    );


    //rotate to maintain facing position
    this.scene.rotate(-delta*this.rotang, 0, 1, 0);

    return false;





}