/**
 * MyDiamond
 * @constructor
 */
function MyDiamond(scene, slices) {
    CGFobject.call(this, scene);

    this.slices = slices;
    this.angle = 2*Math.PI/this.slices;

    this.vec = [];
    this.bottom = [];
    this.base = [];
    console.log("criou o diamond");
    this.initBuffers();
};

MyDiamond.prototype = Object.create(CGFobject.prototype);
MyDiamond.prototype.constructor = MyDiamond;

MyDiamond.prototype.initBuffers = function(){
    console.log("initing buffers");

    //triangulos das faces
    for(var i = 0; i < this.slices; i++){
        this.vec[i] = new MyTriangle(this.scene,
            Math.cos(i*this.angle) , 0, Math.sin(i*this.angle),
            0, 2, 0,
            Math.cos((i+1) *this.angle), 0, Math.sin((i+1) * this.angle) );

        console.log(i);
        this.vec[i].initBuffers();
    }

    for(var i = 0; i < this.slices; i++){
        this.bottom[i] = new MyTriangle(this.scene,
            0, -2, 0,
            Math.cos(i*this.angle) , 0, Math.sin(i*this.angle),
            Math.cos((i+1) *this.angle), 0, Math.sin((i+1) * this.angle) );

        console.log(i);
        this.bottom[i].initBuffers();
    }


    //triangulos da base
    for(var i = 0; i < this.slices; i++){
        this.base[i] = new MyTriangle(this.scene,
            0, 0, 0,
            Math.cos(i*this.angle) , 0, Math.sin(i*this.angle),
            Math.cos((i+1) *this.angle), 0, Math.sin((i+1) * this.angle) );

        console.log(i);
        this.base[i].initBuffers();
    }


};

MyDiamond.prototype.display = function() {
    for(var i = 0; i < this.slices; i++){
        this.scene.pushMatrix();
        this.vec[i].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.bottom[i].display();
        this.scene.popMatrix();

    }
};