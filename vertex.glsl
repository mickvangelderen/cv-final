// Texture coordinates.
attribute vec2 vx;

// Texture coordinates for fragment shader.
varying vec2 texCoords;

void main() {
	gl_Position = vec4(vx.x*2.0 - 1.0, 1.0 - vx.y*2.0, 0, 1);
	texCoords = vx;
}