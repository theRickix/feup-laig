function MyPlane(scene, dimX, dimY, partsX, partsY) {

    this.scene = scene;

    this.dimX = dimX;
    this.partsX = partsX;

    this.dimY = dimY;
    this.partsY = partsY;

    //calculate vertex points o
    var controlPoints = [[
                        [-this.dimX/2, -this.dimY/2, 0, 1],
                        [-this.dimX/2, this.dimY/2, 0, 1]],
                        [[this.dimX/2, -this.dimY/2, 0, 1],
                        [this.dimX/2, this.dimY/2, 0, 1]]];
    this.surfaceObject = null;
    this.buildSurf(controlPoints);
}


MyPlane.prototype = Object.create(MyPlane.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.buildSurf = function(controlPoints) {
    var planeKnots = [0, 0, 1, 1];
    var planeNurbsSurf = new CGFnurbsSurface(1, 1, planeKnots, planeKnots, controlPoints);

    getSurfPoint = function(u, v) {
        return planeNurbsSurf.getPoint(u, v);
    };

    this.surfaceObject = new CGFnurbsObject(this.scene, getSurfPoint, this.partsX, this.partsY);
};

MyPlane.prototype.display = function() {
    this.surfaceObject.display();
}