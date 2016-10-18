
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
	
	/*// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	*/

	this.parseScene(rootElement);
	this.parseViews(rootElement);
	this.parseIllumination(rootElement);
	this.parseLights(rootElement);

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

	console.log('View default: '+this.view.default);

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
		console.log("Perspective with id '"+camera.id+"' loaded.");

	}

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

	var ambient = illumination.getElementsByTagName("ambient");
	var background = illumination.getElementsByTagName("background");

	this.illumination['ambient'] = this.parseColours(ambient[0]);
	this.illumination['background']= this.parseColours(background[0]);


};

MySceneGraph.prototype.parseLights= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('lights');

	if (elems == null || elems.length <1) {
		return "no lights found";
	}

	var lights = elems[0];

	this.lights = [];
	this.lights['omni'] = [];
	this.lights['spot'] = [];

	for(var i=0; i < lights.childElementCount; i++) {
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

	var id = this.reader.getString(rootElement,"id");
	var enabled = this.reader.getBoolean(rootElement,"enabled");
	var location = rootElement.getElementsByTagName('location');
	var ambient = rootElement.getElementsByTagName('ambient');
	var diffuse = rootElement.getElementsByTagName('diffuse');
	var specular = rootElement.getElementsByTagName('specular');

	tmp_omni['id'] = id;
	tmp_omni['enabled'] = enabled;
	tmp_omni['location'] = this.parseCoordinates(location[0],true);
	tmp_omni['ambient'] = this.parseColours(ambient[0]);
	tmp_omni['diffuse'] = this.parseColours(diffuse[0]);
	tmp_omni['specular'] = this.parseColours(specular[0]);

	this.lights.omni.push(tmp_omni);
	console.log("Omni with id '"+tmp_omni.id+"' loaded.");
}

MySceneGraph.prototype.parseSpotLights= function(rootElement) {
	var tmp_spot = [];

	var id = this.reader.getString(rootElement,'id');
	var enabled = this.reader.getBoolean(rootElement,"enabled");
	var target = rootElement.getElementsByTagName('target');
	var location = rootElement.getElementsByTagName('location');
	var ambient = rootElement.getElementsByTagName('ambient');
	var diffuse = rootElement.getElementsByTagName('diffuse');
	var specular = rootElement.getElementsByTagName('specular');

	tmp_spot['id'] = id;
	tmp_spot['enabled'] = enabled;
	tmp_spot['target'] = this.parseCoordinates(target[0],false);
	tmp_spot['location'] = this.parseCoordinates(location[0],false);
	tmp_spot['ambient'] = this.parseColours(ambient[0]);
	tmp_spot['diffuse'] = this.parseColours(diffuse[0]);
	tmp_spot['specular'] = this.parseColours(specular[0]);

	this.lights.spot.push(tmp_spot);
	console.log("Spot with id '"+tmp_spot.id+"' loaded.");
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

	for(var i=0; i < materials.child.length; i++) {
		var material = materials.children[i];

		var tmp_material = [];

		var emission = material.getElementsByTagName('emission');
		var ambient = material.getElementsByTagName('ambient');
		var diffuse = material.getElementsByTagName('diffuse');
		var specular = material.getElementsByTagName('specular');
		var shininess = material.getElementsByTagName('shininess');

		tmp_material['id'] = this.reader.getString(material,'id');
		tmp_material['emission'] = this.parseColours(emission);
		tmp_material['ambient'] = this.parseColours(ambient);
		tmp_material['diffuse'] = this.parseColours(diffuse);
		tmp_material['specular'] = this.parseColours(specular);
		tmp_material['shininess'] = this.parseColours(shininess);

		this.materials.push(tmp_material);
	}
};

MySceneGraph.prototype.parseTransformations= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('transformations');

	var transformations = elems[0];
	this.transformations = [];

	for(var i=0; i < transformations.child.length; i++) {
		var transformation = transformations.children[i];

		var tmp_transformation = [];

		tmp_transformation['id'] = this.reader.getString(transformation,'id');

		var translate = transformation.getElementsByTagName('translate');
		var rotate = transformation.getElementsByTagName('rotate');
		var scale = transformation.getElementsByTagName('scale');

		tmp_transformation['translate'] = this.parseCoordinates(translate,false);
		tmp_transformation['rotate']['axis'] = this.reader.getString(rotate,'axis');
		tmp_transformation['rotate']['angle'] = this.reader.getString(rotate,'angle');
		tmp_transformation['scale'] = this.parseCoordinates(scale,false);

		this.transformations.push(tmp_transformation);
	}
};

MySceneGraph.prototype.parsePrimitives= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('primitives');

	var primitives = elems[0];

	this.primitives = [];

	for ( var i=0; i < primitives.child.length; i++)  {
		var primitive = primitives.children[i];

		switch(primitive.firstChild.tagName) {
			case "rectangle":
				this.parseRectangle(primitive.firstChild);
				break;

			case "triangle":
				this.parseTriangle(primitive.firstChild);
				break;

			case "cylinder":
				this.parseCylinder(primitive.firstChild);
				break;

			case "sphere":
				this.parseSphere(primitive.firstChild);
				break;

			case "torus":
				this.parseTorus(primitive.firstChild);
				break;
		}
	}

};

MySceneGraph.prototype.parseRectangle= function(element) {
	var x1 = this.reader.getFloat(element, 'x1');
	var y1 = this.reader.getFloat(element, 'y1');
	var x2 = this.reader.getFloat(element, 'x2');
	var y2 = this.reader.getFloat(element, 'y2');

	this.primitives.push(new MyRectangle(this.scene,id,x1,y1,x2,y2));
	

};

MySceneGraph.prototype.parseTriangle= function(element) {
	var x1 = this.reader.getFloat(element, 'x1');
	var y1 = this.reader.getFloat(element, 'y1');
	var z1 = this.reader.getFloat(element, 'z1');
	var x2 = this.reader.getFloat(element, 'x2');
	var y2 = this.reader.getFloat(element, 'y2');
	var z2 = this.reader.getFloat(element, 'z2');
	var x3 = this.reader.getFloat(element, 'x3');
	var y3 = this.reader.getFloat(element, 'y3');
	var z3 = this.reader.getFloat(element, 'z3');

	this.primitives.push(new MyTriangle(this.scene,x1,y1,z1,x2,y2,z2,x3,y3,z3));

};

MySceneGraph.prototype.parseCylinder= function(element,primitive) {
	var base = this.reader.getFloat(element, 'base');
	var top = this.reader.getFloat(element, 'top');
	var height = this.reader.getFloat(element, 'height');
	var slices = this.reader.getInteger(element, 'slices');
	var stacks = this.reader.getInteger(element, 'stacks');

	this.primitives.push(primitive);
};

MySceneGraph.prototype.parseSphere= function(rootElement,primitive) {
	var radius = this.reader.getFloat(element, 'radius');
	var slices = this.reader.getInteger(element, 'slices');
	var stacks = this.reader.getInteger(element, 'stacks');

	this.primitives.push(primitive);
};

MySceneGraph.prototype.parseTorus= function(rootElement,primitive) {
	var inner = this.reader.getFloat(element, 'inner');
	var outer = this.reader.getFloat(element, 'outer');
	var slices = this.reader.getInteger(element, 'slices');
	var loops = this.reader.getInteger(element, 'loops');

	this.primitives.push(primitive);
};

MySceneGraph.prototype.parseComponents= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('components');

	var components = elems[0];

	this.components = [];

	for(var i=0; i < components.children.length; i++) {
		var component = components.children[i];
		var tmp_component = [];

		tmp_component['id'] = this.reader.getString(component,'id');
	}
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


