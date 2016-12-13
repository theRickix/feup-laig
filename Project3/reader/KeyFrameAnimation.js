function KeyFrameAnimation(scene, keyframeSet)
{
	this.scene = scene;
	
	this.keyframeSet = keyframeSet;
	
	this.currentKeyFrame = 0;
	this.currentAnimationTime = 0;
	this.animBegin = false;
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
	
	this.currentAnimationTime += time - this.lastFrameTime;
	
	this.interpTargetKeyFrames();
	
	this.lastFrameTime = time;
};

KeyFrameAnimation.prototype.interpTargetKeyFrames = function()
{
	//Probable bug (causes jumping around, if slow enough)
	if(this.currentAnimationTime >= this.keyframeSet[this.currentKeyFrame++].time)
	{
		this.currentKeyFrame++;
		this.interpFrame = this.keyframeSet[this.currentKeyFrame];
		return;
	}
	
	//Make the interpolated frame always the current key frame
	this.interpFrame = this.keyframeSet[currentKeyFrame];
	
	//Calculate current factor to interp, by getting the remaning percentage
	var interpFactor = 1 - (this.keyframeSet[this.currentKeyFrame++] - this.currentAnimationTime) / (keyframeSet[currentKeyFrame++] - keyframeSet[currentKeyFrame]);
	
	this.interpCurrFrame(interpFactor);
};

KeyFrameAnimation.prototype.interpCurrFrame = function(interpFac)
{
	this.interpFrame.targetPos += interpFac * (this.keyframeSet[this.currentKeyFrame++] - this.interpFrame.targetPos);
	this.interpFrame.targetRot += interpFac * (this.keyframeSet[this.currentKeyFrame++] - this.interpFrame.targetPos);
	this.interpFrame.targetScale += interpFac * (this.keyframeSet[this.currentKeyFrame++] - this.interpFrame.targetPos);
};