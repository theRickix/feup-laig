function TilePrimitive(scene, lenght, texture) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.lenght = lenght;
    this.texture = texture;


    this.appearance = new CGFappearance(this.scene);
    this.appearance.setAmbient(0.8, 0.7, 0.8, 1);
    this.appearance.setDiffuse(0.2, 0.2, 0.2, 1);
    this.appearance.setSpecular(0.2, 0.2, 0.2, 1);
    this.appearance.setShininess(120);
    this.appearance.setTexture(this.texture);


    this.rect = new MyRectangle(this.scene, -lenght/2, -lenght/2, lenght/2, lenght/2);

    this.initBuffers();
};

TilePrimitive.prototype = Object.create(CGFobject.prototype);
TilePrimitive.prototype.constructor = TilePrimitive;

TilePrimitive.prototype.display = function() {

    this.scene.pushMatrix();
    this.appearance.apply();
    this.scene.translate(0, 0, -this.lenght/2);
    this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.appearance.apply();
    this.scene.translate(-this.lenght/2, 0, 0);
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.appearance.apply();
    this.scene.translate(0, 0, this.lenght/2);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.appearance.apply();
    this.scene.translate(this.lenght/2, 0, 0);
    this.scene.rotate(-Math.PI/2, 0, 1, 0);
    this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.appearance.apply();
    this.scene.translate(0, this.lenght/2, 0);
    this.scene.rotate(Math.PI/2, 1, 0, 0);
    this.rect.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.appearance.apply();
    this.scene.translate(0, -this.lenght/2, 0);
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.rect.display();
    this.scene.popMatrix();
};