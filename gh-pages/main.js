$(document).ready(function() {

	// Get A WebGL context
	var canvas = $("#canvas")[0];
	var gl = canvas.getContext("experimental-webgl");
	var program = null;
	var vx_ptr = null;
	var dim_ptr = null;
	var kernel_ptr = null;
	var vx = null;
	var ix = null;
	var tex = null;

	// Load data.
	vx = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vx);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 1,1, 0,1]), gl.STATIC_DRAW);

	ix = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2, 0,2,3]), gl.STATIC_DRAW);

	tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	// Load and compile shaders, link program and query program attributes.
	$.when(
		$.get('vertex.glsl').then(function(source) {
			var shader = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw Error("Failed to compile vertex shader:\n" + gl.getShaderInfoLog(shader));
			}
			return shader;
		}),
		$.get('fragment.glsl').then(function(source) {
			var shader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw Error("Failed to compile fragment shader:\n" + gl.getShaderInfoLog(shader));
			}
			return shader;
		})
	).then(function(vertex, fragment) {
		var program = gl.createProgram();
		gl.attachShader(program, vertex);
		gl.attachShader(program, fragment);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw Error("Failed to link program:\n" + gl.getProgramInfoLog(program));
		}
		return program;
	}).then(function(p) {
		program = p;

		gl.useProgram(program);

		vx_ptr = gl.getAttribLocation(program, "vx");
		gl.enableVertexAttribArray(vx_ptr);
		gl.uniform1i(gl.getUniformLocation(program, "sm"), 0);

		dim_ptr = gl.getUniformLocation(program, "texSize");

		kernel_ptr = gl.getUniformLocation(program, "kernel[0]");

	}, function(error) {
		console.error(error);
	});

	// Create an HTML video element.
	var video = document.createElement("video");
	video.autoplay = true;
	video.loop = true;
	var videoReady = false;
	video.oncanplay = function() {
		videoReady = true;
		gl.clientWidth = canvas.width = video.videoWidth;
		gl.clientHeight = canvas.height = video.videoHeight;
		gl.viewport(0, 0, gl.clientWidth, gl.clientHeight);
	};

	video.onerror = function() {
		console.error("Video Error", video.error);
	};

	// Obtain a webcam video feed and set it as the source of the created element.
	var getUserMedia = function() {
		if (navigator.getUserMedia) return navigator.getUserMedia.apply(navigator, arguments);
		if (navigator.webkitGetUserMedia) return navigator.webkitGetUserMedia.apply(navigator, arguments);
		if (navigator.mozGetUserMedia) return navigator.mozGetUserMedia.apply(navigator, arguments);
		alert("Did not manage to have your browser supply a webcam feed. ");
	}

	var createObjectURL = function() {
		if (window.URL.createObjectURL) return window.URL.createObjectURL.apply(window.URL, arguments);
		if (window.webkitURL.createObjectURL) return window.webkitURL.createObjectURL.apply(window.webkitURL, arguments);
		return arguments[0];
	}

	getUserMedia({ video: true }, function(stream) {
		video.src = createObjectURL(stream);
		video.play();
	}, function(error) {
		console.error("Get User Media error", error);
	});

	var kernel = [];
	readKernel();

	function readKernel() {
		$('input.kernel').each(function(index, element) {
			kernel[index] = 1.0*element.value;
		});
	};

	function writeKernel() {
		$('input.kernel').each(function(index, element) {
			element.value = kernel[index];
		});
	};

	$('input.kernel').change(readKernel);

	$('#fill').click(function() {
		readKernel();
		var value = kernel[Math.floor(kernel.length/2)];
		for (var i = 0; i < kernel.length; i++) {
			kernel[i] = value;
		}
		writeKernel();
	});

	$('#normalize').click(function() {
		readKernel();
		var sum = 0;
		for (var i = 0; i < kernel.length; i++) {
			sum += kernel[i];
		}
		var scale = 1/sum;
		for (var i = 0; i < kernel.length; i++) {
			kernel[i] *= scale;
		}
		writeKernel();
	});

	function loop() {
		gl.clear(gl.COLOR_BUFFER_BIT);

		if (program && videoReady) {
			gl.uniform2f(dim_ptr, gl.clientWidth, gl.clientHeight);
			gl.uniform1fv(kernel_ptr, new Float32Array(kernel));
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);

			gl.bindBuffer(gl.ARRAY_BUFFER, vx);
			gl.vertexAttribPointer(vx_ptr, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
		}

		window.requestAnimationFrame(loop);
	}

	loop();
})
