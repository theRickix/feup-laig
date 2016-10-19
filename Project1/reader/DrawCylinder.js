//used o make the top and base of the cylinder and the surface separately

function Base(scene, aux, slices) {  //for base (and top)
    CGFobject.call(this,scene);

    this.aux = parseFloat(aux);
    this.slices = parseInt(slices);


    this.initBuffers();
};


Base.prototype = Object.create(CGFobject.prototype);
Base.prototype.constructor = Base;

Base.prototype.initBuffers = function () {

    this.vertices = [];
    this.normals = [];
    this.textureCoords  =[];


    var angle = ( 2 * Math.PI) / this.slices;


}
