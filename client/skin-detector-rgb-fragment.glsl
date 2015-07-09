
precision mediump float;

uniform sampler2D tex;

varying vec2 texCoords;

const vec3 mu = vec3(0.4750, 0.3689, 0.3308);
const mat3 invSigma = mat3(
  255.2322, -382.9785,  137.2378,
 -382.9785,  926.4744, -535.0295,
  137.2378, -535.0295,  420.6782
);

void main() {
	vec4 color = texture2D(tex, texCoords);
	vec3 x = invSigma*(color.rgb - mu);
	float p = exp(-0.5*dot(x, x));
	gl_FragColor = mix(color, vec4(0.0, 0.0, 0.0, 1.0), step(750.0, dot(x, x)));
}