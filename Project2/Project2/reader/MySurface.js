//Class to hold common methods and values for each 2D surface objects.
function MySurface() {}

//Initializes the surface object as null.
MySurface.prototype.initValues = function() { this.surfaceObject = null };

//Returns the built surface object.
MySurface.prototype.getSurfaceObject = function() { return this.surfaceObject; };

//Should be overwritten in child classes to implement surface building functionality.
MySurface.prototype.buildSurf = function() {};