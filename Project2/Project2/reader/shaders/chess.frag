#ifdef GL_ES
precision highp float;
#endif

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

uniform float xDist;
uniform float yDist;
uniform float su;
uniform float sv;
uniform float du;
uniform float dv;
uniform float dim;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

varying vec4 coords;
varying float selected;

void main() {


	vec4 textureColor = texture2D(uSampler, vTextureCoord);

	float x = coords[0] / xDist;
	float y = coords[1] / yDist;

	if(mod(du, 2.0) != 0.0 || mod(dv, 2.0) != 0.0){
		x -= (xDist*du/2.0);
		y -= (yDist*dv/2.0);
	}

	if(mod(x, 2.0) < 1.0 ^^ mod(y, 2.0) < 1.0)
	    gl_FragColor = c1;
	else
	    gl_FragColor = c2;


	float diff = dv - sv - 1.0;
	if(su != -1.0 && sv != -1.0){
		float xMin = su * xDist - (xDist*du/2.0);
		float yMin = diff * yDist - (yDist*dv/2.0);
		float xMax = xMin + xDist;
		float yMax = yMin + yDist;

		float cx = coords[0];
		float cy = coords[1];
		if(cx >= xMin && cx <= xMax && cy >= yMin && cy <= yMax)
			gl_FragColor = cs;
	}

	gl_FragColor = textureColor * gl_FragColor;


}
