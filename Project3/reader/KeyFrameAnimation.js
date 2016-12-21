function KeyFrameAnimation(scene, keyframeSet)
{
	//Reference to the scene
	this.scene = scene;
	
	//The set of keyframes
	this.keyframeSet = keyframeSet;
	
	//Current key frame
	this.currentKeyFrame = 0;
	//Time since animation started
	this.currentAnimationTime = 0;
	//Has the animation begun?
	this.animBegin = false;
	//The current interpolated frame
	this.interpFrame = new keyframeSet[0];
}

KeyFrameAnimation.prototype.constructor = KeyFrameAnimation;

KeyFrameAnimation.prototype.animate = function(time)
{
	if(!animBegin)
	{
		animBegin = true;
		this.beginTime = time;
		this.lastFrameTime = time;
	}

	//If the last keyframe has been reached, stops animating
	if(currentKeyFrame >= keyframeSet.length)
	{
		return;
	}
	
	//Set the current animation time in millisecs
	this.currentAnimationTime += time - this.lastFrameTime;

	this.interpTargetKeyFrames();
	
	//Set the last frame time
	this.lastFrameTime = time;
};

KeyFrameAnimation.prototype.interpTargetKeyFrames = function()
{
	//Probable bug (causes jumping around, if slow enough)
	if(this.currentAnimationTime >= this.keyframeSet[this.currentKeyFrame++].time)
	{
		this.currentKeyFrame++;
	}
	else
	{
		//Calculate current factor to interp, by getting the remaning percentage
		var interpFactor = 1 - (this.keyframeSet[this.currentKeyFrame++] - this.currentAnimationTime) / (keyframeSet[currentKeyFrame++] - keyframeSet[currentKeyFrame]);

		this.interpCurrFrame(interpFactor);
	}

	this.applyTransformation();
};

KeyFrameAnimation.prototype.interpCurrFrame = function(interpFac)
{
	//Make the interpolated frame always the current key frame
	this.interpFrame = this.keyframeSet[currentKeyFrame];

	this.interpFrame.targetPos += interpFac * (this.keyframeSet[this.currentKeyFrame++] - this.interpFrame.targetPos);
	this.interpFrame.targetRot += interpFac * (this.keyframeSet[this.currentKeyFrame++] - this.interpFrame.targetPos);
	this.interpFrame.targetScale += interpFac * (this.keyframeSet[this.currentKeyFrame++] - this.interpFrame.targetPos);
};

KeyFrameAnimation.prototype.applyTransformation = function()
{
	this.scene.translate(interpFrame.targetPos);
	this.scene.rotate(interpFrame.targetRot);
	this.scene.scale(interp.targetScale);
};