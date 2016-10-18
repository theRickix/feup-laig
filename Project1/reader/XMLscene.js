
function XMLscene() {
    CGFscene.call(this);
    graph = null;  //apontador para myscenegraph
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);
	this.axis=new CGFaxis(this);
    this.rect = new MyRectangle(this,'',1,1,5,5);
};



XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setCameras = function () {
    for (var i = 0; i < this.graph.view.perspectives.length; i++) {
        if (this.graph.view.perspectives[i].id === this.graph.view.default) {
            this.camera = this.graph.view.perspectives[i];
            this.activeCamera = i;
            console.log('Default camera from .dsx: OK!');
            break;
        }
    }
}

XMLscene.prototype.setIllumination = function () {
    this.gl.clearColor(this.graph.illumination.background[0],this.graph.illumination.background[1],this.graph.illumination.background[2],this.graph.illumination.background[3]);
    this.setGlobalAmbientLight(this.graph.illumination.ambient[0],this.graph.illumination.ambient[1],this.graph.illumination.ambient[2],this.graph.illumination.ambient[3]);
    console.log("Background and ambient illumination: OK!");
}


XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

XMLscene.prototype.setLights = function () {
    var lightN=0;
    for(var i=0; i<this.graph.lights.omni.length; i++) {
        var light = this.graph.lights.omni[i];

        this.lights[lightN].setPosition(light.location[0],
                                        light.location[1],
                                        light.location[2],
                                        light.location[3]);

        this.lights[lightN].setAmbient(light.ambient[0],
                                        light.ambient[1],
                                        light.ambient[2],
                                        light.ambient[3]);

        this.lights[lightN].setDiffuse(light.diffuse[0],
                                        light.diffuse[1],
                                        light.diffuse[2],
                                        light.diffuse[3]);

        this.lights[lightN].setSpecular(light.specular[0],
                                        light.specular[1],
                                        light.specular[2],
                                        light.specular[3]);

        console.log("Omni Light #"+i+": OK!");


        if(light.enabled) {
            this.lights[lightN].enable();
            console.log('...and enabled!');
        }

        lightN++
    }

    for(var i=0; i<this.graph.lights.spot.length; i++) {
        //TODO: add target???
        var light = this.graph.lights.spot[i];

        this.lights[lightN].setPosition(light.location[0],
                                        light.location[1],
                                        light.location[2]);

        this.lights[lightN].setAmbient(light.ambient[0],
                                        light.ambient[1],
                                        light.ambient[2],
                                        light.ambient[3]);

        this.lights[lightN].setDiffuse(light.diffuse[0],
                                        light.diffuse[1],
                                        light.diffuse[2],
                                        light.diffuse[3]);

        this.lights[lightN].setSpecular(light.specular[0],
                                        light.specular[1],
                                        light.specular[2],
                                        light.specular[3]);

        console.log("Spot Light #"+i+": OK!");

        if(light.enabled) {
            this.lights[lightN].enable();
            console.log('and enabled');
        }


        lightN++;
    }

    console.log(lightN+" lights: OK!")
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	/*this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    this.lights[0].enable();*/
	this.setIllumination();
    this.setCameras();
    this.setLights();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	//this.axis.display();

    this.rect.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk) {
	    for(var i=0; i<this.lights.length;i++) {
	       this.lights[i].update();
        }
	};	
};

