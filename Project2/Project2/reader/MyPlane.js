function MyPlane(scene, xLength, yLength, uDivs, vDivs)
{

    this.scene = scene;

    this.xLength = xLength;
    this.uDivs = uDivs;

    this.yLength = yLength;
    this.vDivs = vDivs;

    //As it is a simple plane, u = 1 && v = 1
    //and the knots vector will be equal to this.
    var controlPoints = [
                            //Left control points
                            [
                                //Control Point 1
                                [-this.xLength/2, -this.yLength/2, 0, 1],
                                //Control Point 2
                                [-this.xLength/2, this.yLength/2, 0, 1]
                            ],
                            //Right control points
                            [
                                //Control Point 1
                                [this.xLength/2, -this.yLength/2, 0, 1],
                                //Control Point 2
                                [this.xLength/2, this.yLength/2, 0, 1]
                            ]
                        ];
    this.initValues();
    this.buildSurf(controlPoints);
}


MyPlane.prototype = Object.create(MySurface.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.buildSurf = function(controlPoints)
{
    var planeKnots = [0, 0, 1, 1];
    var planeNurbsSurf = new CGFnurbsSurface(1, 1, planeKnots, planeKnots, controlPoints);
    getSurfPoint = function(u, v)
    {
        return planeNurbsSurf.getPoint(u, v);
    };

    this.surfaceObject = new CGFnurbsObject(this.scene, getSurfPoint, this.uDivs, this.vDivs);
};

MyPlane.prototype.display = function() {
    this.getSurfaceObject().display();
}