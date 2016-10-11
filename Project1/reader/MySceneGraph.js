
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
	this.axis_length = this.reader.getFloat(scene,'axis_length');

	console.log("Scene read from file: {root=" + this.root + ", axis_length=" + this.axis_length);

};

MySceneGraph.prototype.parseData = function(rootElement) {
	//TODO
	this.perspectives = [];

}

MySceneGraph.prototype.parseViews = function(rootElement) {
    var elems =  rootElement.getElementsByTagName('views');
    if (elems == null) {
        return "view element is missing.";
    }

    if (elems.length < 1) {
        return "no 'view' element found.";
    }

    var view = elems[0];

    this.default = this.reader.getString(view,'default');

	var perspectives = view.getElementsByTagName('perspective');

	for(var i=0; i<perspectives.length; i++) {
		var id = this.reader.getString(perspectives[i], 'id');
		var near = this.reader.getFloat(perspectives[i], 'near');
		var far = this.reader.getFloat(perspectives[i], 'far');
		var angle = this.reader.getFloat(perspectives[i], 'angle');

		var from = perspectives[i].getElementsByTagName('from');
		var to = perspectives[i].getElementsByTagName('to');

		var camera = new CGFcamera(angle, near, far, this.parseCoordinates(from), this.parseCoordinates(target));
		camera.id = id;
		this.perspectives.push(camera);

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

	var doublesided = this.reader.getBoolean(illumination, "doublesided");
	var local = this.reader.getBoolean(illumination, "local");

	var ambient = illumination.getElementsByName("ambient");
	var background = illumination.getElementsByName("background");

	this.ambient = this.parseColours(ambient);
	this.background = this.parseColours(background);


};

MySceneGraph.prototype.parseLights= function(rootElement) {
	//TODO
};

MySceneGraph.prototype.parseTextures= function(rootElement) {
	//TODO
};

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	//TODO
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

MySceneGraph.prototype.parseCoordinates= function(element) {
	var x = this.reader.getFloat(element, 'x');
	var y = this.reader.getFloat(element, 'y');
	var z = this.reader.getFloat(element, 'z');
	return vec3.fromValues(x, y, z);
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


