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

            var u = 1 - (longNumber / this.slices);
            var v = 1 - (latNumber / this.loops);

            this.vertices.push(x,y,z);
            this.normals.push(x,y,z);
            this.textureCoords.push(v,u);

        }
    }


    for (var latNumber = 0; latNumber < this.loops; latNumber++)
    {
        for(var longNumber= 0; longNumber < this.slices ; longNumber++)
        {
            var first = (latNumber * (this.slices + 1)) + longNumber;
            var second = first + this.slices + 1;

            // this.indices.push(first);
            //  this.indices.push(second);
            //  this.indices.push(first + 1);
            //  this.indices.push(second);
            //  this.indices.push(second + 1);
            //  this.indices.push(first + 1);

            this.indices.push(first, second + 1, second);
            this.indices.push(first, first + 1, second + 1);

        }

    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};