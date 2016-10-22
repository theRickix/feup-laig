//used o make the top and base of the cylinder and the surface separately

function Base(scene, radius, slices) {  //for base (and top)
    CGFobject.call(this,scene);

    this.radius = parseFloat(radius);
    this.slices = parseInt(slices);


    this.initBuffers();
};


Base.prototype = Object.create(CGFobject.prototype);
Base.prototype.constructor = Base;

Base.prototype.initBuffers = function () {

    this.vertices = [];
    this.normals = [];
    this.textureCoords  =[];


    var angleSlice = ( 2 * Math.PI) / this.slices; //angle of the slice
    var numSlices = 1;


    //center
    this.vertices.push(0,0,0);
    this.normals.push(0,0,1);
    this.textureCoords.push(0.5,0.5);

    for(var latNumber = 0; latNumber <= this.slices; latNumber++)

    {


    }



}
