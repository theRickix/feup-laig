
function CircularAnimation(scene, id, span, center, radius, startang, rotang) {
    this.init(id,scene);

    this.span = span*1000; //duration in ms
    this.center = center; //center point in xyz
    this.radius = radius;
    this.startang = startang * Math.PI / 180; //starting angle, ex: 0º, converted to radians
    this.rotang = rotang * Math.PI / 180; //angle to roate, ex: initial is 10 and rotang is 20, the end angle is 30, in radians
    this.time_begin = -1;
    this.currentAngle = startang; //initialize current angle


}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;


CircularAnimation.prototype.animate = function(time) {

    //animation begin
    if(this.time_begin == -1)
        this.time_begin = time;


    //time passed in %
    var delta = (time-this.time_begin)/this.span;

    //calculate current angle
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
    this.scene.rotate(-(delta*this.rotang), 0, 1, 0);

    //if time has ended, end animation
    if(delta >= 1) {
        this.finished = true;
        return;

    }

}

//last point of animation
CircularAnimation.prototype.lastPoint = function(time) {
    this.scene.translate(this.radius*Math.cos(this.currentAngle),
        0,
        this.radius*Math.sin(this.currentAngle)
    );
    this.scene.rotate(-1*this.rotang, 0, 1, 0);
}