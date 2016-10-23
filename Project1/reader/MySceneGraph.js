
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
	this.parseTextures(rootElement);
	this.parseMaterials(rootElement);
	this.parseTransformations(rootElement);
	this.parsePrimitives(rootElement);
	this.parseComponents(rootElement);


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
	this.axis_length = this.reader.getFloat(scene,'axis_length');

	console.log("Scene read from file: {root=" + this.root + ", axis_length=" + this.axis_length);

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

	for(var i=0; i < textures.childElementCount; i++) {
		var texture = textures.children[i];

		var tmp_texture = [];

		tmp_texture['id'] = this.reader.getString(texture,'id');
		tmp_texture['file'] = this.reader.getString(texture,'file');
		tmp_texture['length_s'] = this.reader.getString(texture,'length_s');
		tmp_texture['length_t'] = this.reader.getString(texture,'length_t');

		this.textures.push(tmp_texture);
		console.log("Texture #"+i+" with id '"+tmp_texture.id+"' added!");
	}

};

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('materials');
	var materials=elems[0];

	this.materials = [];

	for(var i=0; i < materials.childElementCount; i++) {
		var material = materials.children[i];

		var tmp_material = [];

		var emission = material.getElementsByTagName('emission');
		var ambient = material.getElementsByTagName('ambient');
		var diffuse = material.getElementsByTagName('diffuse');
		var specular = material.getElementsByTagName('specular');
		var shininess = material.getElementsByTagName('shininess');

		tmp_material['id'] = this.reader.getString(material,'id');
		tmp_material['emission'] = this.parseColours(emission[0]);
		tmp_material['ambient'] = this.parseColours(ambient[0]);
		tmp_material['diffuse'] = this.parseColours(diffuse[0]);
		tmp_material['specular'] = this.parseColours(specular[0]);
		tmp_material['shininess'] = this.reader.getFloat(shininess[0],'value');

		this.materials.push(tmp_material);
		console.log("Material #"+i+" with id '"+tmp_material.id+" added!");
	}
};

MySceneGraph.prototype.parseTransformations= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('transformations');

	var transformations = elems[0];
	this.transformations = [];
	//console.log(transformations.childElementCount);
	for(var i=0; i < transformations.childElementCount; i++) {

		var transformation = transformations.children[i];

		var tmp_transformation = [];

		for(var j=0; j<transformation.childElementCount; j++) {
			var transformationElement = [];

			switch (transformation.children[j].tagName) {
				case 'translate':
					transformationElement['attributes'] = this.parseCoordinates(transformation.children[j], false);
					transformationElement['type'] = 'translate';
					tmp_transformation.push(transformationElement);
					break;

				case 'rotate':
					transformationElement['axis'] = this.reader.getString(transformation.children[j], 'axis');
					transformationElement['angle'] = this.reader.getString(transformation.children[j], 'angle');
					transformationElement['type'] = 'rotate';
					tmp_transformation.push(transformationElement);
					break;

				case 'scale':
					transformationElement['attributes'] = this.parseCoordinates(transformation.children[j], false);
					transformationElement['type'] = 'scale';
					tmp_transformation.push(transformationElement);
					break;
			}
		}
		tmp_transformation['id'] = this.reader.getString(transformation,'id');
		this.transformations.push(tmp_transformation);
		console.log("Transformation #"+i+"' with id '"+tmp_transformation.id+"' added!");
	}
};

MySceneGraph.prototype.parsePrimitives= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('primitives');

	var primitives = elems[0];

	this.primitives = [];

	for ( var i=0; i < primitives.child.length; i++)  {
		var primitive = primitives.children[i];
		var id = this.reader.getString(primitive,'id');

		switch(primitive.firstChild.tagName) {
			case "rectangle":
				this.parseRectangle(primitive.firstChild,id);
				break;

			case "triangle":
				this.parseTriangle(primitive.firstChild,id);
				break;

			case "cylinder":
				this.parseCylinder(primitive.firstChild,id);
				break;

			case "sphere":
				this.parseSphere(primitive.firstChild,id);
				break;

			case "torus":
				this.parseTorus(primitive.firstChild,id);
				break;
		}
	}

};

MySceneGraph.prototype.parseRectangle= function(element,id) {
	var x1 = this.reader.getFloat(element, 'x1');
	var y1 = this.reader.getFloat(element, 'y1');
	var x2 = this.reader.getFloat(element, 'x2');
	var y2 = this.reader.getFloat(element, 'y2');

	var primitive = new MyRectangle(this.scene,id,x1,y1,x2,y2);
	primitive['id'] = id;
	this.primitives.push(primitive);
	

};

MySceneGraph.prototype.parseTriangle= function(element,id) {
	var x1 = this.reader.getFloat(element, 'x1');
	var y1 = this.reader.getFloat(element, 'y1');
	var z1 = this.reader.getFloat(element, 'z1');
	var x2 = this.reader.getFloat(element, 'x2');
	var y2 = this.reader.getFloat(element, 'y2');
	var z2 = this.reader.getFloat(element, 'z2');
	var x3 = this.reader.getFloat(element, 'x3');
	var y3 = this.reader.getFloat(element, 'y3');
	var z3 = this.reader.getFloat(element, 'z3');

	var primitive = new MyTriangle(this.scene,x1,y1,z1,x2,y2,z2,x3,y3,z3);
	primitive['id'] = id;

	this.primitives.push();

};

MySceneGraph.prototype.parseCylinder= function(element,id) {
	var base = this.reader.getFloat(element, 'base');
	var top = this.reader.getFloat(element, 'top');
	var height = this.reader.getFloat(element, 'height');
	var slices = this.reader.getInteger(element, 'slices');
	var stacks = this.reader.getInteger(element, 'stacks');

	var primitive = new MyCylinder(this.scene,base,top,height,slices,stack);
	primitive['id'] = id;

	this.primitives.push(primitive);
};

MySceneGraph.prototype.parseSphere= function(element,id) {
	var radius = this.reader.getFloat(element, 'radius');
	var slices = this.reader.getInteger(element, 'slices');
	var stacks = this.reader.getInteger(element, 'stacks');

	var primitive = new MySphere(this.scene,radius,slices,stacks);
	primitive['id'] = id;

	this.primitives.push(primitive);
};

MySceneGraph.prototype.parseTorus= function(element,id) {
	var inner = this.reader.getFloat(element, 'inner');
	var outer = this.reader.getFloat(element, 'outer');
	var slices = this.reader.getInteger(element, 'slices');
	var loops = this.reader.getInteger(element, 'loops');

	var primitive = new MyTorus(this.scene,inner,outer,slices,loops);
	primitive['id'] = id;

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

		//TRANSFORMATIONS
		var transformation = component.getElementsByTagName("transformation");

		tmp_component['transformations'] = [];

		if(transformation[0].getElementsByTagName("transformationref") != 0) {
			var transformationref = transformation[0].getElementsByTagName("transformationref");
			tmp_component['transformations']['hasRef'] = true;
			tmp_component['transformations']['transformationref'] = transformationref;
		}
		else {
			for(var j=0; j<transformation[0].childElementCount; j++) {
				var transformationElement = [];

				switch (transformation[0].children[j].tagName) {
					case 'translate':
						transformationElement['attributes'] = this.parseCoordinates(transformation[0].children[j], false);
						transformationElement['type'] = 'translate';
						tmp_component.transformations.push(transformationElement);
						break;

					case 'rotate':
						transformationElement['axis'] = this.reader.getString(transformation[0].children[j], 'axis');
						transformationElement['angle'] = this.reader.getString(transformation[0].children[j], 'angle');
						transformationElement['type'] = 'rotate';
						tmp_component.transformations.push(transformationElement);
						break;

					case 'scale':
						transformationElement['attributes'] = this.parseCoordinates(transformation[0].children[j], false);
						transformationElement['type'] = 'scale';
						tmp_component.transformations.push(transformationElement);
						break;
				}
			}
			tmp_component['transformation']['hasRef'] = false;
		}

		//MATERIALS
		var materials = component.getElementsByTagName("materials");

		tmp_component['material'] = [];
		for(var j=0; j<materials[0].childElementCount; j++) {
			var id = this.reader.getString(materials[0].children[j], "id");
			tmp_component.material.push(id);
		}

		var texture = component.getElementsByTagName("texture");

		tmp_component['texture'] = this.reader.getString(texture[0],'id');

		var children = component.getElementsByTagName("children");

		tmp_component['children'] = [];

		for(var j=0; j<children[0].childElementCount; j++) {
			var child = [];
			switch(children[0].children[j].tagName) {
                case "componentref":
				    child['id'] = this.reader.getString(children[0].children[j], "id");
                    child['type'] = 'component';
					tmp_component.children.push(child);
					break;

				case "primitiveref":
                    child['id'] = this.reader.getString(children[0].children[j], "id");
                    child['type'] = 'component';
					tmp_component.children.push(child);
					break;
			}
		}

		this.components[tmp_component.id] = tmp_component;
		console.log("Component #"+i+" with id '"+tmp_component.id+"' added!");

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


