/**
 * MySphere
 * @constructor
 */

function MySphere (scene, id, radius, slices, stacks)
{
    CGFobject.call(this,scene);

    this.id = id;
    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;


    this.initBuffers();



};


MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function() {

this.primitiveType = this.scene.gl.TRIANGLES;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.textureCoords=[];


    var theta = Math.PI / this.stacks;
    var phi = 2*Math.PI / this.slices;


    for ( var latband = 0; latband <= this.stacks; ++latband)
    {
        for (var slice = 0; slice <=this.slices; ++latband)
        {
            this.vertices.push(this.radius * Math.sin(latband * theta) * Math.cos(slice * phi), this.radius * Math.sin(latband * theta) * Math.sin(slice * phi), this.radius * Math.cos(latband * theta));
            this.normals.push(Math.sin(latband * theta) * Math.cos(slice * phi), Math.sin(latband * theta) * Math.sin(slice * phi), Math.cos(latband * theta));
            this.textureCoords.push(slice/this.slices, latband/this.stacks);
        }
        }

    for ( var latband = 0; latband < this.stacks; ++latband)
    {
        for(var slice = 0; slice < this.slices; ++slice)
        {
            this.indices.push(latband * (this.slices + 1) + slice, (latband + 1) * (this.slices + 1) + slice, (latband + 1) * (this.slices + 1) + slice + 1);
            this.indices.push(latband * (this.slices + 1) + slice, (latband + 1) * (this.slices + 1) + slice + 1, latband * (this.slices + 1) + slice + 1);
        }
    }


    };







