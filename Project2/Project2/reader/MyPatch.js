function MyPatch(scene, orderU, orderV, partsU, partsV, controlPoints)
{
    this.scene = scene;
    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlPoints = controlPoints;

    this.initValues();
    this.buildSurf();
}

MyPatch.prototype = Object.create(MySurface.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.buildSurf = function() {
    //Computes vertices according to given control points
    this.computedPoints = [];

    for (u = 0; u < this.orderU + 1; u++) {
        var tmp = [];
        for (var v = 0; v < this.orderV + 1; v++) {
            tmp.push([this.controlPoints[u * (this.orderV + 1) + v][0], this.controlPoints[u * (this.orderV + 1) + v][1], this.controlPoints[u * (this.orderV + 1) + v][2], 1]);
        }
        this.computedPoints.push(tmp);
    }

    var getSurfPoint = function(u, v)
    {
        return patchNurbsSurface.getPoint(u, v);
    }

    //Generates knots vectors according to given degree


    var knotsU = this.generateKnotsVector(this.orderU);
    var knotsV = this.generateKnotsVector(this.orderV);

    var patchNurbsSurface = new CGFnurbsSurface(this.orderU, this.orderV, knotsU, knotsV, this.computedPoints);


    this.surfaceObject = new CGFnurbsObject(this.scene, getSurfPoint, this.partsU, this.partsV);
};

MyPatch.prototype.generateKnotsVector = function(deg) {
    var knots = [];

    for(var i = 0; i <= deg; i++)
    {
        knots.push(0);
    }

    for(var i = 0; i <= deg; i++)
    {
        knots.push(1);
    }

    return knots;
};

MyPatch.prototype.display = function() {
    this.getSurfaceObject().display();
}