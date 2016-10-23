//used o make the top and base of the cylinder and the surface separately

function Base(scene, radius, slices) {  //for base (and top)
    CGFobject.call(this,scene);

    this.radius = radius;
    this.slices = slices;


    this.initBuffers();
};


Base.prototype = Object.create(CGFobject.prototype);
Base.prototype.constructor = Base;

Base.prototype.initBuffers = function () {

    this.vertices = [];
    this.normals = [];
    this.textureCoords  = [];
    this.indices = [];


    var angleSlice = ( 2 * Math.PI) / this.slices; //angle of the slice
    var numSlices = 1;


    //center
    this.vertices.push(0,0,0);
    this.normals.push(0,0,1);
    this.textureCoords.push(0.5,0.5);

    for(var longNumber = 0; longNumber <= this.slices; longNumber++) //iterate through  the slices

    {
        var xposition = Math.cos(longNumber * angleSlice); //position of the vertice in x
        var yposition = Math.sin(longNumber * angleSlice);//position of the vertice in y

        this.vertices.push(this.radius * xposition, this.radius * yposition, 0);
        this.normals.push(0,0,1);
        this.textureCoords.push(0.5 + 0.5 * xposition, 0.5 - 0.5 * yposition);

        if(longNumber > 1)
        {
            this.indices.push(numSlices++, numSlices, 0);
        }

    }

    this.indices.push(0, numSlices, 1);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();



};


function Surface (scene, base, top, height, slices, stacks)
{
    CGFobject.call(this,scene);

    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();

};

Surface.prototype = Object.create(CGFobject.prototype);
Surface.prototype.constructor = Surface;

Surface.prototype.initBuffers = function () {

    this.indices = [];
    this.normals = [];
    this.vertices = [];
    this.textureCoords = [];


    var theta = (2*Math.PI) / this.slices;
    var r = (this.top - this.base) / this.stacks;
    var znum = this.height / this.stacks;

    for (var latNumber = 0; latNumber <= this.stacks; latNumber++)
    {
        var z = znum * latNumber
        var radius = (this.top - latNumber) * r;

        for (var longNumber = 0; longNumber <= this.slices; longNumber++) //iterate through slices
        {
            var x = (Math.cos(theta * longNumber)) * radius;
            var y = (Math.sin(theta * longNumber)) * radius;

            this.vertices.push(x, y, z);
            this.textureCoords.push(latNumber / this.stacks, longNumber / this.slices);
            this.normals.push(x, y, 0);
        }
    }

    for (var latNumber = 0; latNumber <= this.stacks; latNumber++)
    {
        for (var longNumber = 0; longNumber <= this.slices; longNumber++) //iterate through slices
        {
            var fIndice = (latNumber * (this.slices + 1)) + longNumber;
            var sIndice = fIndice + this.slices + 1;


            this.indices.push(fIndice, sIndice + 1, sIndice);
            this.indices.push(fIndice, fIndice + 1, sIndice + 1);

        }

    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
