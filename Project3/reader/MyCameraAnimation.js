
function MyCameraAnimation(scene, id, span, initialView,finalView) {
    this.init(id,scene);
    this.scene = scene;
    this.span = span * 1000; //span in ms
    this.initialView = initialView;
    this.finalView = finalView;

    this.vecPosition = vec3.fromValues(finalView.position[0]-initialView.position[0],
                                        finalView.position[1]-initialView.position[1],
                                    finalView.position[2]-initialView.position[2]);

    this.vecTarget = vec3.fromValues(finalView.target[0]-initialView.target[0],
                                    finalView.target[1]-initialView.target[1],
                                    finalView.target[2]-initialView.target[2]);
    this.time_begin = -1;

}

MyCameraAnimation.prototype = Object.create(Animation.prototype);
MyCameraAnimation.prototype.constructor = MyCameraAnimation;


MyCameraAnimation.prototype.animate = function(time) {

    //animation begin
    if(this.time_begin == -1)
        this.time_begin = time;


    //time passed in %
    var delta = (time-this.time_begin)/this.span

    var position = vec3.fromValues(this.initialView.position[0]+this.vecPosition[0]*delta,this.initialView.position[1]+this.vecPosition[1]*delta,this.initialView.position[2]+this.vecPosition[2]*delta);
    var target =  vec3.fromValues(this.initialView.target[0]+this.vecTarget[0]*delta,this.initialView.target[1]+this.vecTarget[1]*delta,this.initialView.target[2]+this.vecTarget[2]*delta);
    //console.log(position);
    this.scene.camera = new CGFcamera(this.finalView.fov, this.finalView.near, this.finalView.far,
        position,
       target);


    //if time has ended, end animation
    if(delta >= 1) {
        this.finished = true;
        return true;

    }
        return false;

};