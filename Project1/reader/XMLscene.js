
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
    this.torus = new MyTorus(this,5,10,5,5);
    this.sphere = new MySphere(this,'',2,10,10);
    this.cylinder = new MyCylinder(this,5,5,10,5,5);
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

XMLscene.prototype.setInterface = function (interface) {
    this.interface = interface;
    this.interface.scene = this;
}

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setAxis = function () {
    this.axis = new CGFaxis(this,this.graph.axis_length);
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
};


XMLscene.prototype.setIllumination = function () {
    this.gl.clearColor(this.graph.illumination.background[0],this.graph.illumination.background[1],this.graph.illumination.background[2],this.graph.illumination.background[3]);
    this.setGlobalAmbientLight(this.graph.illumination.ambient[0],this.graph.illumination.ambient[1],this.graph.illumination.ambient[2],this.graph.illumination.ambient[3]);
    console.log("Background and ambient illumination: OK!");
};


XMLscene.prototype.setLights = function () {
    var lightN=0;
    this.lightStatus = [];
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
            this.lightStatus.push(true);
            console.log('...and enabled!');
        }
        else {
            this.lights[lightN].disable();
            this.lightStatus.push(false);
            console.log('and disabled!');
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
            this.lightStatus.push(true);
            console.log('and enabled');
        }
        else {
            this.lights[lightN].disable();
            this.lightStatus.push(false);
            console.log('and disabled!');
        }


        lightN++;
    }

    console.log(lightN+" lights: OK!")
};

XMLscene.prototype.setMaterials = function () {
    this.materials = [];

    for (var i = 0; i < this.graph.materials.length; i++) {

        //For better organization of code
        var material = this.graph.materials[i];
        var id = material.id;

        this.materials[id] = new CGFappearance(this);

        this.materials[id].setEmission(material.emission[0],
            material.emission[1],
            material.emission[2],
            material.emission[3]);

        this.materials[id].setAmbient(material.ambient[0],
            material.ambient[1],
            material.ambient[2],
            material.ambient[3]);

        this.materials[id].setDiffuse(material.diffuse[0],
            material.diffuse[1],
            material.diffuse[2],
            material.diffuse[3]);

        this.materials[id].setSpecular(material.specular[0],
            material.specular[1],
            material.specular[2],
            material.specular[3]);

        this.materials[id].setShininess(material.shininess);

        console.log('Material #'+i+': OK!');
    }
};

XMLscene.prototype.setTransformations = function () {
    this.transformations = [];

    for(var i=0; i < this.graph.transformations.length; i++) {
        var transformation = this.graph.transformations[i];
        var id = transformation.id;

        this.transformations[id] = transformation;
        console.log('Transformation #'+i+": OK!");

    }
};

XMLscene.prototype.setTransformation = function (transformation) {

    for(var j=0; j < transformation.length; j++) {
        if (transformation[j].type === 'translate') {
            this.translate(transformation[j].attributes[0], transformation[j].attributes[1], transformation[j].attributes[2]);
        }

        if (transformation[j].type === 'scale') {
            this.scale(transformation[j].attributes[0], transformation[j].attributes[1], transformation[j].attributes[2]);
        }

        if (transformation[j].type === 'rotate') {
            switch (transformation[j].axis) {
                case 'x':
                    this.rotate(transformation[j].angle * Math.PI / 180, 1, 0, 0);
                    break;

                case 'y':
                    this.rotate(transformation[j].angle * Math.PI / 180, 0, 1, 0);
                    break;

                case 'z':
                    this.rotate(transformation[j].angle * Math.PI / 180, 0, 0, 1);
                    break;
            }
        }
    }
};

XMLscene.prototype.setTextures = function () {
    this.textures = [];

    for(var i=0; i < this.graph.textures.length; i++) {
        var texture = this.graph.textures[i];
        var id = texture.id;

        this.textures[id] = new CGFtexture(this,texture.file);
        this.textures[id].length_s = texture.length_s;
        this.textures[id].length_t = texture.length_t;
        this.textures[id].file = texture.file;

        console.log('Texture #'+i+": OK!");
    }
};

XMLscene.prototype.setPrimitives = function () {
    this.primitives = [];

    for(var i=0; i < this.graph.primitives.length; i++) {
        var primitive = this.graph.primitives[i];
        var id = primitive.id;

        this.primitives[id] = primitive;

        console.log('Primitive #'+i+": OK!");
    }
};

XMLscene.prototype.setComponent = function (component,fatherTexture,fatherMaterial) {
    //console.log(component.id);
    this.pushMatrix();

    /*if(component.id === this.graph.root) {
        if(component.transformations.hasRef) {
            this.currentMatrix = this.transformations[component.transformations.transformationref];
        }
        else {
            for(var i=0; i < component.transformations.length; i++) {
                var transformation = component.transformations[i];
                var id = transformation.id;

                var currentMatrix = this.setTransformation(id,transformation);

            }
        }
    }*/

    if(component.transformations.hasRef) {
       // console.log(component.transformations.transformationref);
        this.setTransformation(this.transformations[component.transformations.transformationref]);
    }
    else {
        for(var i=0; i < component.transformations.length; i++) {
            var transformation = component.transformations[i];
            var id = transformation.id;
            this.setTransformation(transformation);
        }
    }

    for(var i=0; i<component.childrenNodes.length; i++) {
        if(component.material[0] === 'inherit')
            var material = fatherMaterial;
        else
            var material = this.materials[component.material[0]]

        if(component.texture === 'inherit')
            var texture = fatherTexture;
        else
            var texture = this.textures[component.texture];


        if(texture !== 'none') {
           material.setTexture(texture);
        }

        material.apply();

        if (component.childrenNodes[i].type === "component") {

            this.setComponent(this.graph.components[component.childrenNodes[i].id], texture, material);

        }
        else {
            this.primitives[component.childrenNodes[i].id].display();
           // console.log('Draw primitive '+component.childrenNodes[i].id+"'");
        }
    }
    this.popMatrix();

};

XMLscene.prototype.nextCamera = function () {
    //If there's just 1 camera, stop function
    if(this.graph.view.perspectives.length == 0)
        return;

    //Go to next camera or back to beginning if finalone
    if(this.activeCamera < this.graph.view.perspectives.length-1)
        this.activeCamera++;
    else
        this.activeCamera=0;

    this.camera = this.graph.view.perspectives[this.activeCamera];
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	/*this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    this.lights[0].enable();*/
	this.setAxis();
	this.setIllumination();
    this.setCameras();
    this.setLights();
    this.setMaterials();
    this.setTransformations();
    this.setTextures();
    this.setPrimitives();
    this.interface.addLights();
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


   // this.torus.display();
   //this.cylinder.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk) {
       // this.rect.display();
        for(var i=0; i<this.lights.length;i++) {
            if(this.lightStatus[i])
                this.lights[i].enable();
            else
                this.lights[i].disable();
            this.lights[i].update();
        }
	   this.setComponent(this.graph.components[this.graph.root]);


	}
};

