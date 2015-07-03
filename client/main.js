$(document).ready(function() {

	// Get A WebGL context
	var canvas = $("#canvas")[0];
	var gl = canvas.getContext("experimental-webgl");
	var program = null;

	$.when(
		$.get('vertex.glsl').then(function(source) {
			var shader = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw Error("Failed to compile vertex shader: " + gl.getShaderInfoLog(shader));
			}
			return shader;
		}),
		$.get('fragment.glsl').then(function(source) {
			var shader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw Error("Failed to compile fragment shader: " + gl.getShaderInfoLog(shader));
			}
			return shader;
		})
	).then(function(vertex, fragment) {
		var program = gl.createProgram();
		gl.attachShader(program, vertex);
		gl.attachShader(program, fragment);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw Error("Failed to link program: " + gl.getProgramInfoLog(program));
		}
		return program;
	}).then(function(p) {
		console.log(p);
		console.log(gl.getProgramInfoLog(p));
		program = p;

		gl.useProgram(program);

		var vertices = new Float32Array([
			-1.0, -1.0,
			 1.0, -1.0,
			-1.0,  1.0,
			-1.0,  1.0,
			 1.0, -1.0,
			 1.0,  1.0
		]);

		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		var a_position = gl.getAttribLocation(program, "a_position");
		gl.enableVertexAttribArray(a_position);
		gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}, function(error) {
		console.error(error);
	});

})
