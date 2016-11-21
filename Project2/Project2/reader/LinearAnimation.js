function LinearAnimation(scene,id,span,controlPoints) {
    this.init(id,scene);

    this.span = span*1000;

    this.controlPoints = controlPoints;

    this.span_per_control = this.span/this.controlPoints.length;

    this.totaldistance = 0;

    this.currentControlPoint = 0; //indice de ponto de controlo atual
    this.currentPoint = vec3.fromValues(0,0,0); //initialize current point

    this.time_begin = -1; //time of animation begin

    this.calcTotalDistances();

}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

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
        this.time_begin = time;
        this.time_last_frame = time;
        this.time_begin_point = time;
    }
    else {


        //time between frames
        var deltaframe = time - this.time_last_frame;
        var time_passed = time-this.time_begin_point;
        var time_to_control = this.span_per_control-time_passed;

        var deltapointX = this.controlPoints[this.currentControlPoint][0]-this.currentPoint[0];
        var deltapointY = this.controlPoints[this.currentControlPoint][1]-this.currentPoint[1];
        var deltapointZ = this.controlPoints[this.currentControlPoint][2]-this.currentPoint[2];

        this.velocityX = deltapointX / time_to_control;
        this.velocityY = deltapointY / time_to_control;
        this.velocityZ = deltapointZ / time_to_control;

        //calculate the point translated in relation to direction
        this.currentPoint[0] += this.velocityX*deltaframe;
        this.currentPoint[1] += this.velocityY*deltaframe;
        this.currentPoint[2] += this.velocityZ*deltaframe;

        console.log(deltapointX);

        //translate to next point
        this.scene.translate(this.currentPoint[0],this.currentPoint[1],this.currentPoint[2]);

        if(time-this.time_begin_point >= this.span_per_control) {
            this.currentControlPoint++;
            this.time_begin_point=time;

        }

        if (this.currentControlPoint >= this.controlPoints.length) {
            this.finished = true;
        }

        this.time_last_frame = time;
    }
}

LinearAnimation.prototype.lastPoint = function(time) {
    this.scene.translate(this.currentPoint[0],this.currentPoint[1],this.currentPoint[2]);
}