function MyVehicle(scene){
    CGFobject.call(this,scene);

    this.scene = scene;
    this.controlPoints =
        [[-0.048,-0.491,0.000],
            [-0.048,-0.491,0.000],
            [-0.048,-0.491,0.000],
            [-0.048,-0.491,0.000],
            [-0.048,-0.491,0.000],
            [-0.048,-0.491,0.000],

            [0.000,	-1.000,	0.400],
            [-1.000,	-1.000,	0.400],
            [-1.047,	0.837,	0.567],
            [0.913,	0.789,	0.393],
            [1.000,	-1.000,	0.400],
            [0.000,	-1.000, 0.400],

            [0.000,	-1.000,	0.800],
            [-1.000,	-1.000,	0.800],
            [-1.063,	0.838,	0.756],
            [0.912,	0.795,	0.820],
            [1.000,	-1.000,	0.800],
            [0.000,	-1.000,	0.800],

            [0.000,	-1.000,	1.200],
            [-1.000,	-1.000,	1.200],
            [-1.067,	0.840,	1.199],
            [0.913,	0.795,	1.215],
            [1.000,	-1.000,	1.200],
            [0.000,	-1.000, 1.200],

            [0.000,	-1.000,	1.600],
            [-1.000,	-1.000,	1.600],
            [-1.078,	0.815,	1.610],
            [0.912,	0.790,	1.599],
            [1.000,	-1.000,	1.600],
            [0.000,	-1.000,	1.600],

            [-0.048,	-0.491,	2.000],
            [-0.048,	-0.491, 2.000],
            [-0.048, -0.491,	2.000],
            [-0.048,	-0.491,	2.000],
            [-0.048,	-0.491,	2.000],
            [-0.048,	-0.491,	2.000]];

    console.log(this.controlPoints.length);

    this.patch = new MyPatch(this.scene,5,5,60,30,this.controlPoints);

};

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

MyVehicle.prototype.display = function(){
    this.scene.pushMatrix();
        this.patch.display();
    this.scene.popMatrix();

};