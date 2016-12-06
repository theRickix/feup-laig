function LinearAnimation(scene,id,span,controlPoints) {
    this.init(id,scene);

    this.span = span*1000; //duration in milisseconds

    this.controlPoints = controlPoints; //all control points in x,y,z vector

    this.span_per_control = this.span/this.controlPoints.length; //time between each control point in milisseconds

    this.totaldistance = 0; //unused

    this.currentControlPoint = 0; //index of current control point
    this.currentPoint = vec3.fromValues(0,0,0); //initialize current point (not control, actual point)

    this.time_begin = -1; //time of animation begin

    this.calcTotalDistances();

}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

//unused. this was in a earlier version, which calculate the distance between each control point before the animation;
//now, we do that in each frame
LinearAnimation.prototype.calcTotalDistances = function () {
    this.distX = 0;
    this.distY = 0;
    this.distZ = 0;

    for(var i=1; i<this.controlPoints.length; i++) {
        this.distX[i] = this.controlPoints[i][0] - this.controlPoints[i-1][0];
        this.distY[i] = this.controlPoints[i][1] - this.controlPoints[i-1][1];
        this.distZ[i] = this.controlPoints[i][2] - this.controlPoints[i-1][2];
    }

}

LinearAnimation.prototype.animate = function(time) {
    console.log('ANIMATION');

    //animation begin
    if (this.time_begin == -1) {
        this.time_begin = time; //beginning time of WHOLE animation
        this.time_last_frame = time; //initialize time of last frame
        this.time_begin_point = time; //beginning time of FIRST control point
    }
    else {

        //time between frames
        var deltaframe = time - this.time_last_frame; //calculate time between FRAMES
        var time_passed = time-this.time_begin_point; //calculate time since animation began
        var time_to_control = this.span_per_control-time_passed; //calculate how much time there is to reach control point

        //remaining distance to control point for each eaxis
        var deltapointX = this.controlPoints[this.currentControlPoint][0]-this.currentPoint[0];
        var deltapointY = this.controlPoints[this.currentControlPoint][1]-this.currentPoint[1];
        var deltapointZ = this.controlPoints[this.currentControlPoint][2]-this.currentPoint[2];

        //calculate velocity needed for each axis
        this.velocityX = deltapointX / time_to_control;
        this.velocityY = deltapointY / time_to_control;
        this.velocityZ = deltapointZ / time_to_control;

        //calculate the point translated in relation to direction
        this.currentPoint[0] += this.velocityX*deltaframe;
        this.currentPoint[1] += this.velocityY*deltaframe;
        this.currentPoint[2] += this.velocityZ*deltaframe;

        //console.log(deltapointX);

        //translate to next point
        this.scene.translate(this.currentPoint[0],this.currentPoint[1],this.currentPoint[2]);

        //if time to reach control point has passed, go to the next one and reset time_begin_point
        if(time-this.time_begin_point >= this.span_per_control) {
            this.currentControlPoint++;
            this.time_begin_point=time;

        }

        //check if there is more control points
        if (this.currentControlPoint >= this.controlPoints.length) {
            this.finished = true;
        }

        //assign this time to the last frame to be used in next
        this.time_last_frame = time;
    }
}

//the finishing point of animation
LinearAnimation.prototype.lastPoint = function(time) {
    this.scene.translate(this.currentPoint[0],this.currentPoint[1],this.currentPoint[2]);
}