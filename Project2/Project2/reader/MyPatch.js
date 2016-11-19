function MyPatch(scene, degU, degV, partsU, partsV, controlVertices)
{
    this.scene = scene;
    this.degU = degU;
    this.degV = degV;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlVertices = controlVertices;

    this.initValues();
    this.buildSurf();
}

MyPatch.prototype = Object.create(MySurface.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.buildSurf = function()
{
    //Computes vertices according to given control vertices
        this.computedVertices = [];

        for (var u = 0; u <= this.degU; u++)
        {
            var tmp = [];
            for (var v = 0; v <= this.degV; v++)
            {
                tmp.push(this.controlVertices[u * (this.degV + 1) + v]);
            }
            this.computedVertices.push(tmp);
        }


    //Generates knots vectors according to given degree


    var knotsU = this.generateKnotsVector(this.degU);
    var knotsV = this.generateKnotsVector(this.degV);

    var patchNurbsSurface = new CGFnurbsSurface(this.degU, this.degV, knotsU, knotsV, this.computedVertices);
    this.getSurfPoint = function(u, v)
    {
        return patchNurbsSurface.getPoint(u, v);
    }

    this.surfaceObject = new CGFnurbsObject(this.scene, this.getSurfPoint(), this.partsU, this.partsV);
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