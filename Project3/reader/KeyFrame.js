function KeyFrame(scene, keyTime, targetPos, targetRot, targetScale)
{
	this.scene = scene;
	this.keyTime = keyTime;
	
	//All vec3
	this.targetPos = targetPos;
	this.targetRot = targetRot;
	this.targetScale = targetScale;
}

KeyFrame.prototype.constructor = KeyFrame;