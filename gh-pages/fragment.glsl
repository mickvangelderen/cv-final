precision mediump float;

uniform sampler2D tex;
uniform vec2 texSize;
uniform float kernel[25];

varying vec2 texCoords;

void main() {
	vec2 d = vec2(1.0)/texSize;
	gl_FragColor = vec4(0.5) +
		kernel[ 0]*texture2D(tex, texCoords + d*vec2(-2.0,  2.0)) +
		kernel[ 1]*texture2D(tex, texCoords + d*vec2(-1.0,  2.0)) +
		kernel[ 2]*texture2D(tex, texCoords + d*vec2( 0.0,  2.0)) +
		kernel[ 3]*texture2D(tex, texCoords + d*vec2( 1.0,  2.0)) +
		kernel[ 4]*texture2D(tex, texCoords + d*vec2( 2.0,  2.0)) +
		kernel[ 5]*texture2D(tex, texCoords + d*vec2(-2.0,  1.0)) +
		kernel[ 6]*texture2D(tex, texCoords + d*vec2(-1.0,  1.0)) +
		kernel[ 7]*texture2D(tex, texCoords + d*vec2( 0.0,  1.0)) +
		kernel[ 8]*texture2D(tex, texCoords + d*vec2( 1.0,  1.0)) +
		kernel[ 9]*texture2D(tex, texCoords + d*vec2( 2.0,  1.0)) +
		kernel[10]*texture2D(tex, texCoords + d*vec2(-2.0,  0.0)) +
		kernel[11]*texture2D(tex, texCoords + d*vec2(-1.0,  0.0)) +
		kernel[12]*texture2D(tex, texCoords + d*vec2( 0.0,  0.0)) +
		kernel[13]*texture2D(tex, texCoords + d*vec2( 1.0,  0.0)) +
		kernel[14]*texture2D(tex, texCoords + d*vec2( 2.0,  0.0)) +
		kernel[15]*texture2D(tex, texCoords + d*vec2(-2.0, -1.0)) +
		kernel[16]*texture2D(tex, texCoords + d*vec2(-1.0, -1.0)) +
		kernel[17]*texture2D(tex, texCoords + d*vec2( 0.0, -1.0)) +
		kernel[18]*texture2D(tex, texCoords + d*vec2( 1.0, -1.0)) +
		kernel[19]*texture2D(tex, texCoords + d*vec2( 2.0, -1.0)) +
		kernel[20]*texture2D(tex, texCoords + d*vec2(-2.0, -2.0)) +
		kernel[21]*texture2D(tex, texCoords + d*vec2(-1.0, -2.0)) +
		kernel[22]*texture2D(tex, texCoords + d*vec2( 0.0, -2.0)) +
		kernel[23]*texture2D(tex, texCoords + d*vec2( 1.0, -2.0)) +
		kernel[24]*texture2D(tex, texCoords + d*vec2( 2.0, -2.0));
}