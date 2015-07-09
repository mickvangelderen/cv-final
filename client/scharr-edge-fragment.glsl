precision mediump float;

uniform sampler2D tex;
uniform vec2 texSize;

varying vec2 texCoords;

void main() {
	vec2 d = vec2(1.0)/texSize;
	vec3 dx =
		-0.09375*texture2D(tex, texCoords + d*vec2(-1.0,  1.0)).xyz +
		-0.31250*texture2D(tex, texCoords + d*vec2(-1.0,  0.0)).xyz +
		-0.09375*texture2D(tex, texCoords + d*vec2(-1.0, -1.0)).xyz +
		 0.09375*texture2D(tex, texCoords + d*vec2( 1.0,  1.0)).xyz +
		 0.31250*texture2D(tex, texCoords + d*vec2( 1.0,  0.0)).xyz +
		 0.09375*texture2D(tex, texCoords + d*vec2( 1.0, -1.0)).xyz;
	vec3 dy =
		-0.09375*texture2D(tex, texCoords + d*vec2( 1.0,  1.0)).xyz +
		-0.31250*texture2D(tex, texCoords + d*vec2( 0.0,  1.0)).xyz +
		-0.09375*texture2D(tex, texCoords + d*vec2(-1.0,  1.0)).xyz +
		 0.09375*texture2D(tex, texCoords + d*vec2( 1.0, -1.0)).xyz +
		 0.31250*texture2D(tex, texCoords + d*vec2( 0.0, -1.0)).xyz +
		 0.09375*texture2D(tex, texCoords + d*vec2(-1.0, -1.0)).xyz;
	float f = dot(dx, dx) + dot(dy, dy);
	vec3 color = texture2D(tex, texCoords).xyz;

	gl_FragColor = vec4(mix(color, vec3(0.),f*400.0), 1.0);
}