
precision mediump float;

uniform sampler2D tex;

varying vec2 texCoords;

const mat3 rgb2yiq = mat3(
	0.299,  0.596,  0.211,
	0.587, -0.274, -0.523,
	0.114, -0.322,  0.312
);

const vec2 mu = vec2(0.0976, 0.0347);
const mat2 invSigma = mat2(47.3331, 0, -32.7669, 99.5820);

void main() {

	vec4 color = texture2D(tex, texCoords);

	vec2 iq = (rgb2yiq*color.rgb).gb;

	vec2 x = invSigma*(iq - mu);
	float p = exp(-0.5*dot(x, x));
	if (p > 0.001) {
		gl_FragColor = color;
	} else {
		gl_FragColor = vec4(vec3(0.0), 1.0);
	}
}