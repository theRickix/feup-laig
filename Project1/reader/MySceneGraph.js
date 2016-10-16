
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseScene = function(rootElement) {
	var elems =  rootElement.getElementsByTagName('scene');
	if (elems == null) {
		return "scene element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'scene' element found.";
	}

	var scene = elems[0];

	this.root = this.reader.getString(scene,'root');
	this.axis_lenght = this.reader.getFloat(scene,'axis_length');

	console.log("Scene read from file: {root=" + this.scene.root + ", axis_length=" + this.scene.axis_length);

};

MySceneGraph.prototype.parseViews = function(rootElement) {
    var elems =  rootElement.getElementsByTagName('views');
    if (elems == null) {
        return "view element is missing.";
    }

    if (elems.length < 1) {
        return "no 'view' element found.";
    }

    var view = elems[0];

	this.view = [];

    this.view['default'] = this.reader.getString(view,'default');
	this.view['perspectives'] = [];

	var perspectives = view.getElementsByTagName('perspective');

	for(var i=0; i<perspectives.length; i++) {
		var id = this.reader.getString(perspectives[i], 'id');
		var near = this.reader.getFloat(perspectives[i], 'near');
		var far = this.reader.getFloat(perspectives[i], 'far');
		var angle = this.reader.getFloat(perspectives[i], 'angle');

		var from = perspectives[i].getElementsByTagName('from');
		var to = perspectives[i].getElementsByTagName('to');

		var camera = new CGFcamera(angle, near, far, this.parseCoordinates(from[0], false), this.parseCoordinates(to[0], false));
		camera.id = id;
		this.view.perspectives.push(camera);
	}

    //console.log("view read from file: {default=" + this.default);

};

MySceneGraph.prototype.parseIllumination = function(rootElement) {
	var elems =  rootElement.getElementsByTagName('illumination');
	if (elems == null) {
		return "illumination element is missing.";
	}

	if (elems.length < 1) {
		return "no 'illumination' element found.";
	}

	var illumination = elems[0];

	this.illumination = [];

	this.illumination['doublesided'] = this.reader.getBoolean(illumination, "doublesided");
	this.illumination['local'] = this.reader.getBoolean(illumination, "local");

	var ambient = illumination.getElementsByName("ambient");
	var background = illumination.getElementsByName("background");

	this.illumination['ambient'] = this.parseColours(ambient[0]);
	this.illumination['background']= this.parseColours(background[0]);


};

MySceneGraph.prototype.parseLights= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('illumination');

	if (elems == null || elems.length <1) {
		return "no lights found";
	}

	var lights = elems[0];

	this.lights = [];
	this.lights['omni'] = [];
	this.lights['spot'] = [];

	for(var i=0; i < lights.child.length; i++) {
		switch(lights.children[i].tagName) {
			case "omni":
				this.parseOmniLights(lights.children[i]); break;

			case "spot":
				this.parseSpotLights(lights.children[i]); break;
		}
	}
};

MySceneGraph.prototype.parseOmniLights= function(rootElement) {
	var tmp_omni = [];

	var location = rootElement.getElementsByTagName('location');
	var ambient = rootElement.getElementsByTagName('ambient');
	var diffuse = rootElement.getElementsByTagName('diffuse');
	var specular = rootElement.getElementsByTagName('specular');

	omni['location'] = this.parseCoordinates(location);
	omni['ambient'] = this.parseColours(ambient);
	omni['diffuse'] = this.parseColours(diffuse);
	omni['specular'] = this.parseColours(specular);

	this.lights.omni.push(tmp_omni);
}

MySceneGraph.prototype.parseSpotLights= function(rootElement) {
	var tmp_spot = [];

	var target = rootElement.getElementsByTagName('target');
	var location = rootElement.getElementsByTagName('location');
	var ambient = rootElement.getElementsByTagName('ambient');
	var diffuse = rootElement.getElementsByTagName('diffuse');
	var specular = rootElement.getElementsByTagName('specular');

	spot['target'] = this.parseCoordinates(target,false);
	spot['location'] = this.parseCoordinates(location,false);
	spot['ambient'] = this.parseColours(ambient);
	spot['diffuse'] = this.parseColours(diffuse);
	spot['specular'] = this.parseColours(specular);

	this.lights.spot.push(tmp_spot);
}


MySceneGraph.prototype.parseTextures= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('textures');

	var textures = elems[0];
	this.textures = [];

	for(var i=0; i < textures.child.length; i++) {
		var texture = textures.children[i];

		var tmp_texture = [];

		tmp_texture['id'] = this.reader.getString(texture,'id');
		tmp_texture['file'] = this.reader.getString(texture,'file');
		tmp_texture['length_s'] = this.reader.getString(texture,'length_s');
		tmp_texture['length_t'] = this.reader.getString(texture,'length_t');

		this.textures.push(tmp_texture);
	}

};

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('materials');
	var materials=elems[0];

	this.materials = [];

	var tmp_material=[];

	var emission = rootElement.getElementsByTagName('emission');
	var ambient = rootElement.getElementsByTagName('ambient');
	var diffuse = rootElement.getElementsByTagName('diffuse');
	var specular = rootElement.getElementsByTagName('specular');
	var shininess = rootElement.getElementsByTagName('shininess');


	material['emission'] = this.parseColours(emission);
	material['ambient'] = this.parseColours(ambient);
	material['diffuse'] = this.parseColours(diffuse);
	material['specular'] = this.parseColours(specular);
	material['shininess'] = this.parseColours(shininess);

	this.materials.material.push(tmp_material);
};

MySceneGraph.prototype.parseTransformations= function(rootElement) {
	//TODO
};

MySceneGraph.prototype.parsePrimitives= function(rootElement) {
	//TODO
};

MySceneGraph.prototype.parseComponents= function(rootElement) {
	//TODO
};

MySceneGraph.prototype.parseCoordinates= function(element,hasW) {
	var x = this.reader.getFloat(element, 'x');
	var y = this.reader.getFloat(element, 'y');
	var z = this.reader.getFloat(element, 'z');
	if(!hasW)
		return vec3.fromValues(x, y, z);
	else {
		var w = this.reader.getFloat(element, 'w');
		return vec4.fromValues(x, y, z, w);
	}
};

MySceneGraph.prototype.parseColours= function(element) {
	var r = this.reader.getFloat(element, 'r');
	var g = this.reader.getFloat(element, 'g');
	var b = this.reader.getFloat(element, 'b');
	var a = this.reader.getFloat(element, 'a');

	return vec4.fromValues(r, g, b, a);
};
/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


