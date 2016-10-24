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
    this.texCoords=[];


    var theta = Math.PI / this.stacks;
    var phi = 2*Math.PI / this.slices;


    for ( var latband = 0; latband <= this.stacks; ++latband)
    {
        for (var longBand = 0; longBand <=this.slices; ++longBand)
        {
            this.vertices.push(this.radius * Math.sin(latband * theta) * Math.cos(longBand * phi), this.radius * Math.sin(latband * theta) * Math.sin(longBand * phi), this.radius * Math.cos(latband * theta));
            this.normals.push(Math.sin(latband * theta) * Math.cos(longBand * phi), Math.sin(latband * theta) * Math.sin(longBand * phi), Math.cos(latband * theta));
            this.texCoords.push(longBand/this.slices, latband/this.stacks);
        }
    }

    for ( var latband = 0; latband < this.stacks; ++latband)
    {
        for(var longBand = 0; longBand < this.slices; ++longBand)
        {
            this.indices.push(latband * (this.slices + 1) + longBand, (latband + 1) * (this.slices + 1) + longBand, (latband + 1) * (this.slices + 1) + longBand + 1);
            this.indices.push(latband * (this.slices + 1) + longBand, (latband + 1) * (this.slices + 1) + longBand + 1, latband * (this.slices + 1) + longBand + 1);
        }
    }


    this.initGLBuffers();

};
