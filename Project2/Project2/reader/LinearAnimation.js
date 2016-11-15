function LinearAnimation(id,span,controlPoints,scene) {
    init(id,scene);

    this.span = span;
    this.controlPoints = controlPoints;

    this.vectors = [];
    this.inc = [];

    this.currentPoint = 0;
    this.points = [];

    this.calcPoints();

}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.calcPoints = function () {

    for(var i=1; i<this.controlPoints.length; i++) {
        var vector = [];
        vector[0] = this.controlPoints[i][0] - this.controlPoints[i-1][0];
        vector[1] = this.controlPoints[i][1] - this.controlPoints[i-1][1];
        vector[2] = this.controlPoints[i][2] - this.controlPoints[i-1][2];
        this.vectors.push(vector);
    }

    var time = this.span/(this.controlPoints.length - 1);


    for(var i=0; i<this.vectors.length; i++) {
        this.inc[i] = calcInc(time,this.vectors[i]);
    }

    var i=1;
    var notFinished = true;
    var controlPointDestination = 1;

    //initialize points with first control point
    this.points[0][0] = this.controlPoints[0][0];
    this.points[0][1] = this.controlPoints[0][1];
    this.points[0][2] = this.controlPoints[0][2];

    //create all points, including intermediates
    while(notFinished) {
        this.points[i][0] = this.points[i-0][0] + this.inc[controlPointDestination-1][0]; //increment x
        this.points[i][1] = this.points[i-0][1] + this.inc[controlPointDestination-1][1]; //increment y
        this.points[i][2] = this.points[i-0][2] + this.inc[controlPointDestination-1][2]; //increment z
        if(this.points[i] == this.controlPoints[controlPointDestination])
            controlPointDestination++; //next
    }
}

LinearAnimation.prototype.calcInc = function(time,vector) {
    var inc = [];

    inc[0] = vector[0] / (30 * time);
    inc[1] = vector[1] / (30 * time);
    inc[2] = vector[2] / (30 * time);

    return inc;
}

LinearAnimation.prototype.animate = function() {
    if(this.currentPoint >= this.points.length) {
        this.scene.translate(this.points[this.currentPoint][0],
                            this.points[this.currentPoint][1],
                            this.points[this.currentPoint][2]);

        return;
    }

    this.scene.translate(this.points[this.currentPoint][0],
                        this.points[this.currentPoint][1],
                        this.points[this.currentPoint][2]);

}