/**
 * MyTorus
 * @constructor
 */

function MyTorus (scene, inner, outter, slices, loops)
{

    CGFobject.call(this,scene);

    this.inner = inner;
    this. outter = outter;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
};

MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor= MyTorus;


MyTorus.prototype.initBuffers = function () {


    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.textureCoords = [];

    for (var latNumber = 0; latNumber <= this.loops; latNumber++)
    {  var theta = latNumber * 2 * Math.PI / this.loops;






        for (var longNumber = 0; longNumber <= this.slices; longNumber++) {

            var phi = longNumber * 2 * Math.PI / this.slices;


            var x = (this.outter + (this.inner * Math.cos(theta))) * Math.cos(phi);
            var y = (this.outter + (this.inner * Math.cos(theta))) * Math.sin(phi);
            var z = this.inner * Math.sin(theta);    //raio *



            this.vertices.push(x,y,z);
            this.normals.push(x,y,z);
            this.textureCoords.push(1 - (latNumber / this.loops), 1 - (longNumber / this.slices));

        }
    }


    for (var latNumber = 0; latNumber < this.loops; latNumber++)
    {
        for(var longNumber= 0; longNumber < this.slices ; longNumber++)
        {

            this.indices.push((latNumber * (this.slices + 1)) + longNumber, ((latNumber * (this.slices + 1)) + longNumber) + this.slices + 1 + 1, ((latNumber * (this.slices + 1)) + longNumber) + this.slices + 1);
            this.indices.push((latNumber * (this.slices + 1)) + longNumber, ((latNumber * (this.slices + 1)) + longNumber) + 1, ((latNumber * (this.slices + 1)) + longNumber) + this.slices + 1 + 1);


        }

    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};