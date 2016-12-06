attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

varying vec4 coords;
varying float selected;
varying vec4 select;

uniform float xDist;
uniform float yDist;
uniform float du;
uniform float dv;
uniform float su;
uniform float sv;

void main() {
	vec4 vertex = vec4(aVertexPosition, 1.0);
	coords= vertex;

	float diff = dv - sv - 1.0;

	if(su != -1.0 && sv != -1.0) {
		float xMin = su * xDist - (xDist*du/2.0);
		float yMin = diff * yDist - (yDist*dv/2.0);
		float xMax = xMin + xDist;
		float yMax = yMin + yDist;

		float x = vertex[0];
		float y = vertex[1];

		if(x >= xMin && x <= xMax
		    && y >= yMin && y <= yMax) {

			vertex = vertex + vec4(0,0,0.01,0);
			selected = 1.0;

		}
		else
			selected = 0.0;
	}

	gl_Position = uPMatrix * uMVMatrix * vertex;

	vTextureCoord = aTextureCoord;
}
