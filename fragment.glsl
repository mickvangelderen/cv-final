precision mediump float;

uniform sampler2D tex;
uniform vec2 texSize;
uniform float kernel[25];
uniform vec3 bias;

varying vec2 texCoords;

void main() {
	vec2 d = vec2(1.0)/texSize;
	gl_FragColor = vec4(bias, 1.0) + vec4(
		kernel[ 0]*vec3(texture2D(tex, texCoords + d*vec2(-2.0,  2.0))) +
		kernel[ 1]*vec3(texture2D(tex, texCoords + d*vec2(-1.0,  2.0))) +
		kernel[ 2]*vec3(texture2D(tex, texCoords + d*vec2( 0.0,  2.0))) +
		kernel[ 3]*vec3(texture2D(tex, texCoords + d*vec2( 1.0,  2.0))) +
		kernel[ 4]*vec3(texture2D(tex, texCoords + d*vec2( 2.0,  2.0))) +
		kernel[ 5]*vec3(texture2D(tex, texCoords + d*vec2(-2.0,  1.0))) +
		kernel[ 6]*vec3(texture2D(tex, texCoords + d*vec2(-1.0,  1.0))) +
		kernel[ 7]*vec3(texture2D(tex, texCoords + d*vec2( 0.0,  1.0))) +
		kernel[ 8]*vec3(texture2D(tex, texCoords + d*vec2( 1.0,  1.0))) +
		kernel[ 9]*vec3(texture2D(tex, texCoords + d*vec2( 2.0,  1.0))) +
		kernel[10]*vec3(texture2D(tex, texCoords + d*vec2(-2.0,  0.0))) +
		kernel[11]*vec3(texture2D(tex, texCoords + d*vec2(-1.0,  0.0))) +
		kernel[12]*vec3(texture2D(tex, texCoords + d*vec2( 0.0,  0.0))) +
		kernel[13]*vec3(texture2D(tex, texCoords + d*vec2( 1.0,  0.0))) +
		kernel[14]*vec3(texture2D(tex, texCoords + d*vec2( 2.0,  0.0))) +
		kernel[15]*vec3(texture2D(tex, texCoords + d*vec2(-2.0, -1.0))) +
		kernel[16]*vec3(texture2D(tex, texCoords + d*vec2(-1.0, -1.0))) +
		kernel[17]*vec3(texture2D(tex, texCoords + d*vec2( 0.0, -1.0))) +
		kernel[18]*vec3(texture2D(tex, texCoords + d*vec2( 1.0, -1.0))) +
		kernel[19]*vec3(texture2D(tex, texCoords + d*vec2( 2.0, -1.0))) +
		kernel[20]*vec3(texture2D(tex, texCoords + d*vec2(-2.0, -2.0))) +
		kernel[21]*vec3(texture2D(tex, texCoords + d*vec2(-1.0, -2.0))) +
		kernel[22]*vec3(texture2D(tex, texCoords + d*vec2( 0.0, -2.0))) +
		kernel[23]*vec3(texture2D(tex, texCoords + d*vec2( 1.0, -2.0))) +
		kernel[24]*vec3(texture2D(tex, texCoords + d*vec2( 2.0, -2.0))),
	1.0);
}