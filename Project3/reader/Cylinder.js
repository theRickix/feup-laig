/**
 * cylinder
 * @constructor
 */
function Cylinder(scene, base, top, height, slices, stacks) {
    CGFobject.call(this,scene);

    this.coverBase = new Circle(this.scene, base, slices);
    this.coverTop = new Circle(this.scene, top , slices);
    this.surface = new Surface(this.scene, base, top , height ,slices , stacks);


    this.slices = slices;
    this.height = height;
};

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.display = function() {


    this.surface.display();


    this.scene.pushMatrix();
    this.scene.translate(0,0,this.height);
    this.coverTop.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI * this.slices, 0,0,1);
    this.scene.rotate(Math.PI, 0 ,1, 0);
    this.coverBase.display();
    this.scene.popMatrix();



};


//=============================================================================

//the surface


function Surface(scene, base ,top , height, slices, stacks) {
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

Surface.prototype.initBuffers = function() {

    this.angulo = (Math.PI*2)/this.slices;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var ang=0;
    var x,y;
    var z=0;
    var radius = this.base;
    var inc = (this.top - this.base)/this.stacks;

    for(k = 0; k <= this.stacks; k++){
        this.vertices.push(this.base + k * inc, 0, z);
        this.normals.push(1, 0, 0);
        this.texCoords.push(0,k/this.stacks);
        ang=0;
        for(i = 0; i < this.slices; i++){

            if(i!=(this.slices-1)){
                ang+=this.angulo;
                x = Math.cos(ang) * radius;
                y = Math.sin(ang) * radius;
                this.vertices.push(x, y, z);
                this.normals.push(x, y, 0);
                this.texCoords.push(1 -(i+1)/this.slices,1 - k/this.stacks);
            }

            if(k > 0){
                if(i==(this.slices-1)){
                    this.indices.push(((k-1)*this.slices)+i,((k-1)*this.slices),(k*this.slices)+i);
                    this.indices.push((k*this.slices)+i,((k-1)*this.slices),(k*this.slices));
                }else{
                    this.indices.push(((k-1)*this.slices)+i,((k-1)*this.slices)+1+i,(k*this.slices)+i);
                    this.indices.push((k*this.slices)+i,((k-1)*this.slices)+1+i,(k*this.slices)+1+i);
                }
            }
        }
        radius += inc;
        z += this.height/this.stacks;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

//======================

//Circle for top and bottom

function Circle(scene,radius, slices) {
    CGFobject.call(this,scene);

    this.slices = slices;
    this.radius = radius;

    this.initBuffers();
};

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var ang=Math.PI*2/this.slices;
    var angAux=0;
    var x,y;

    this.vertices.push(0,0,0);
    this.normals.push(0,0,1);
    this.texCoords.push(0.5,0.5);

    for(j = 0; j <= this.slices; j++){

        if(j == this.slices){
            this.indices.push(0, j, 1);
        }else{
            x=Math.cos(angAux) * this.radius;
            y=Math.sin(angAux) * this.radius;

            this.vertices.push(x,y,0);
            this.normals.push(0,0,1);

            this.texCoords.push((x/2)+0.5,-(y/2)+0.5);

            if(j>0){
                this.indices.push(0, j, j+1);
            }
        }

        angAux+=ang;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};