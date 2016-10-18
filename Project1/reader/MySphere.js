/**
 * Created by Ricardo on 18/10/2016.
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




}

