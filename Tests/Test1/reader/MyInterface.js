function MyInterface() {
    CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;


MyInterface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();


    this.lights = this.gui.addFolder("Lights");
    this.lights.open();

    return true;
};

MyInterface.prototype.addLights = function() {
    for(var i=0; i<this.scene.lights.length; i++) {
        this.lights.add(this.scene.lightStatus,i).name("Light #"+i);
    }
};


MyInterface.prototype.processKeyDown = function(event) {
    switch (event.keyCode) {
        case 86:
            this.scene.nextCamera();
            break;

        case 118:
            this.scene.nextCamera();
            break;
    }
};

