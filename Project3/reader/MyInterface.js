function MyInterface() {
    CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;


MyInterface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();
    this.gui2 = new dat.GUI();


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

MyInterface.prototype.initScore = function() {
    var Score = function() {
        this.Player1 = 12;
        this.Player2 = 12;
    };
    var text = new Score();
    this.score1 = this.gui2.add(text, 'Player1', 0,12);
    this.score2 = this.gui2.add(text, 'Player2', 0,12);
    this.score1.domElement.style.pointerEvents = "none";
    this.score2.domElement.style.pointerEvents = "none";
};

MyInterface.prototype.initSurrender = function() {
    var self = this;
    var surrender = { Surrender:function(){ self.scene.game.playerSurrender();}};
    this.surrenderBtn = this.gui2.add(surrender,"Surrender");

};

MyInterface.prototype.setScore = function(score1,score2) {
    var Score = function() {
        this.Player1 = score1;
        this.Player2 = score2;
    };
    var text = new Score();
    this.gui2.remove(this.score1);
    this.gui2.remove(this.score2);
    this.score1 = this.gui2.add(text, 'Player1', 0,12);
    this.score2 = this.gui2.add(text, 'Player2', 0,12);
    this.score1.domElement.style.pointerEvents = "none";
    this.score2.domElement.style.pointerEvents = "none";
    this.gui2.enabled = false;
};