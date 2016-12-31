function MyInterface() {
    CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;


MyInterface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);

   // this.gui = new dat.GUI();
    this.gui2 = new dat.GUI();


    //this.lights = this.gui.addFolder("Lights");
    //this.lights.open();
    return true;
};

/*MyInterface.prototype.addLights = function() {
    for(var i=0; i<this.scene.lights.length; i++) {
        this.lights.add(this.scene.lightStatus,i).name("Light #"+i);
    }
};*/


MyInterface.prototype.processKeyDown = function(event) {
    switch (event.keyCode) {
        /*case 86:
            this.scene.nextCamera();
            break;

        case 118:
            this.scene.nextCamera();
            break;*/
    }
};

MyInterface.prototype.initScore = function() {
    var Score = function() {
        this.White = 12;
        this.Black = 12;
    };
    var text = new Score();
    this.score1 = this.gui2.add(text, 'White', 0,12);
    this.score2 = this.gui2.add(text, 'Black', 0,12);
    this.score1.domElement.style.pointerEvents = "none";
    this.score2.domElement.style.pointerEvents = "none";
};

MyInterface.prototype.initSurrender = function() {
    var self = this;
    var surrender = { Surrender:function(){ self.scene.game.playerSurrender();}};
    this.surrenderBtn = this.gui2.add(surrender,"Surrender");

};


MyInterface.prototype.initUndo = function() {
    var self = this;
    var undo = { Undo:function(){ self.scene.game.playUndo();}};
    this.surrenderBtn = this.gui2.add(undo,"Undo");

};


MyInterface.prototype.initMenu = function() {
    var menu = { Menu:function(){ location.replace("index.html");}};
    this.surrenderBtn = this.gui2.add(menu,"Menu");

};

MyInterface.prototype.initTimer = function(time,player) {
    this.gui3 = new dat.GUI();
    var Timer;
    if(player == 1) {
        var Timer = function() {
            this.WhiteTurn = time
        }
        var text = new Timer();
        this.timer = this.gui3.add(text,"WhiteTurn",0,30);
    }
    else {
        var Timer = function() {
            this.BlackTurn = time
        }
        var text = new Timer();
        this.timer = this.gui3.add(text,"BlackTurn",0,30);
    }
    this.timer.domElement.style.pointerEvents = "none";
    console.log("Teste");
};

MyInterface.prototype.updateTimer = function(time,player) {

    this.gui3.remove(this.timer);
    var Timer;
    if(player == 1) {
        var Timer = function() {
            this.WhiteTurn = time
        }
        var text = new Timer();
        this.timer = this.gui3.add(text,"WhiteTurn",0,30);
    }
    else {
        var Timer = function() {
            this.BlackTurn = time
        }
        var text = new Timer();
        this.timer = this.gui3.add(text,"BlackTurn",0,30);
    }
    this.timer.domElement.style.pointerEvents = "none";
    console.log("Teste");
};

MyInterface.prototype.removeUndo = function() {
    this.gui2.remove(this.surrenderBtn);

};

MyInterface.prototype.setScore = function(score1,score2) {
    var Score = function() {
        this.White = score1;
        this.Black = score2;
    };
    var text = new Score();
    this.gui2.remove(this.score1);
    this.gui2.remove(this.score2);
    this.score1 = this.gui2.add(text, 'White', 0,12);
    this.score2 = this.gui2.add(text, 'Black', 0,12);
    this.score1.domElement.style.pointerEvents = "none";
    this.score2.domElement.style.pointerEvents = "none";
    this.gui2.enabled = false;
};