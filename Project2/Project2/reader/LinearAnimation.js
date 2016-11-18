function LinearAnimation(scene,id,span,controlPoints) {
    init(id,scene);

    this.span = span*1000;
    this.controlPoints = controlPoints;

    this.vectors = [];

    this.currentControlPoint = 0; //indice de ponto de controlo atual
    this.currentPoint = this.controlPoints[0]; //current point
    //this.points = [];

    this.time_begin = null; //time of animation begin
    this.time_begin_point = 0; //time of control point begin
    this.time_between_points = this.span/(this.controlPoints.length-1); //time elapsed between control points

    this.calcVectors();

}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.calcVectors = function () {

    for(var i=1; i<this.controlPoints.length; i++) {
        var vector = [];
        vector[0] = this.controlPoints[i][0] - this.controlPoints[i-1][0];
        vector[1] = this.controlPoints[i][1] - this.controlPoints[i-1][1];
        vector[2] = this.controlPoints[i][2] - this.controlPoints[i-1][2];
        this.vectors.push(vector);
    }

}

LinearAnimation.prototype.calcInc = function(timeElapsed,vector) {
    var inc = [];

    inc[0] = vector[0] / timeElapsed;
    inc[1] = vector[1] / timeElapsed;
    inc[2] = vector[2] / timeElapsed;

    return inc;
}

LinearAnimation.prototype.animate = function(time) {

    //animation begin
    if(this.time_begin === null) {}
        this.time_begin = this.time_begin_point = time;


    if(this.currentControlPoint >= this.controlPoints.length) {
        this.finished = true;
        return this.finished;
    }

    //calculate incrementation in relation to elapsed time
    var inc = this.calcInc(this.time_between_points-(time-this.time_begin_point),
                         this.vectors[this.currentControlPoint]);

    //translate to next point
    this.scene.translate(inc[0], inc[1], inc[2]);

    //calculate the point translated
    this.currentPoint[0] += inc[0];
    this.currentPoint[1] += inc[1];
    this.currentPoint[2] += inc[2];

    if(this.currentPoint >= this.controlPoints[this.currentControlPoint+1])
        this.currentControlPoint++;

    var deltaPoint = (time-this.time_begin_point)/this.time_between_points;

    if(deltaPoint === 1) {
        this.time_begin_point = time;
        deltaPoint = 0;
        this.currentControlPoint++;
    }
}