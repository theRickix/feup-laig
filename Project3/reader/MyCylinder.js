/**
 * Created by Ricardo on 18/10/2016.
 */
/**
 * MyCylinder
 * @constructor
 */

//creates the cylinder
function MyCylinder (scene,base, top, height, slices, stacks){


    CGFobject.call(this, scene);

    this.bottom = new Base(scene, base, slices);
    this.top = new Base(scene, top, slices);
    this.surface= new Surface(scene, base, top, height, slices, stacks);



};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;


MyCylinder.prototype.display = function () {

    this.surface.display();


    this.scene.pushMatrix();
    this.scene.translate(0, 0, 1);
    this.bottom.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.top.display();
    this.scene.popMatrix();
}