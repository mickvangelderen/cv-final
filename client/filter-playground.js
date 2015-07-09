$(document).ready(function() {

	var snapCanvas = $("#snap")[0];
	var ctx = snapCanvas.getContext('2d')

	// Get A WebGL context
	var glCanvas = $("#canvas")[0];
	var gl = glCanvas.getContext('webgl') || glCanvas.getContext('experimental-webgl');
	var program = null;
	var vx_ptr = null;
	var dim_ptr = null;
	var kernel_ptr = null;
	var bias_ptr = null;

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
		$.get('filter-playground-vertex.glsl').then(function(source) {
			var shader = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw Error("Failed to compile vertex shader:\n" + gl.getShaderInfoLog(shader));
			}
			return shader;
		}),
		$.get('filter-playground-fragment.glsl').then(function(source) {
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

		kernel_ptr = gl.getUniformLocation(program, "kernel");

		bias_ptr = gl.getUniformLocation(program, "bias");

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
		gl.clientWidth = glCanvas.width = snapCanvas.width = video.videoWidth;
		gl.clientHeight = glCanvas.height = snapCanvas.height = video.videoHeight;
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

	var bias = [];
	readBias();

	function readBias() {
		$('input.bias').each(function(index, element) {
			bias[index] = 1.0*element.value;
		});
	};

	function writeBias() {
		$('input.bias').each(function(index, element) {
			element.value = bias[index];
		});
	};

	$('input.bias').change(readBias);

	$('#bias-fill').click(function() {
		readBias();
		var value = bias[Math.floor(bias.length/2)];
		for (var i = 0; i < bias.length; i++) {
			bias[i] = value;
		}
		writeBias();
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

	$('#kernel-fill').click(function() {
		readKernel();
		var value = kernel[Math.floor(kernel.length/2)];
		for (var i = 0; i < kernel.length; i++) {
			kernel[i] = value;
		}
		writeKernel();
	});

	$('#normalize').click(function() {
		readKernel();
		var pos = 0;
		var neg = 0;
		for (var i = 0; i < kernel.length; i++) {
			if (kernel[i] > 0) {
				pos += kernel[i];
			} else {
				neg += kernel[i];
			}
		}
		console.log(pos, neg);
		var a = 1/(pos - neg);
		var b = -neg*a;
		for (var i = 0; i < bias.length; i++) {
			bias[i] = b;
		}
		writeBias();
		for (var i = 0; i < kernel.length; i++) {
			kernel[i] *= a;
		}
		writeKernel();
	});

	// Some predifined filters

	$('#gauss').click(function() {
		bias = [0, 0, 0];
		writeBias();
		kernel = [
			0.0000, 0.0000, 0.0002, 0.0000, 0.0000,
			0.0000, 0.0113, 0.0837, 0.0113, 0.0000,
			0.0002, 0.0837, 0.6187, 0.0837, 0.0002,
			0.0000, 0.0113, 0.0837, 0.0113, 0.0000,
			0.0000, 0.0000, 0.0002, 0.0000, 0.0000
		];
		writeKernel();
	});

	$('#edge').click(function() {
		bias = [0.5, 0.5, 0.5];
		writeBias();
		kernel = [
			   -0.0005, -0.0050, -0.0109, -0.0050, -0.0005,
			   -0.0050, -0.0506, -0.0769, -0.0506, -0.0050,
			   -0.0109, -0.0769,  0.5958, -0.0769, -0.0109,
			   -0.0050, -0.0506, -0.0769, -0.0506, -0.0050,
			   -0.0005, -0.0050, -0.0109, -0.0050, -0.0005
		];
		writeKernel();
	});

	$('#invert').click(function() {
		bias = [1, 1, 1];
		writeBias();
		kernel = [
			0, 0,  0, 0, 0,
			0, 0,  0, 0, 0,
			0, 0, -1, 0, 0,
			0, 0,  0, 0, 0,
			0, 0,  0, 0, 0
		];
		writeKernel();
	});

	$('#sobel-x').click(function() {
		bias = [0.5, 0.5, 0.5];
		writeBias();
		kernel = [
			0,  0, 0, 0, 0,
			0, -1, 0, 1, 0,
			0, -2, 0, 2, 0,
			0, -1, 0, 1, 0,
			0,  0, 0, 0, 0
		];
		writeKernel();
	});

	$('#sobel-y').click(function() {
		bias = [0.5, 0.5, 0.5];
		writeBias();
		kernel = [
			0,  0,  0,  0, 0,
			0, -1, -2, -1, 0,
			0,  0,  0,  0, 0,
			0,  1,  2,  1, 0,
			0,  0,  0,  0, 0
		];
		writeKernel();
	});

	$('#scharr-x').click(function() {
		bias = [0.5, 0.5, 0.5];
		writeBias();
		kernel = [
			0,  0,  0,  0, 0,
			0, -3,  0,  3, 0,
			0, -10, 0, 10, 0,
			0, -3,  0,  3, 0,
			0,  0,  0,  0, 0
		];
		writeKernel();
	});

	$('#scharr-y').click(function() {
		bias = [0.5, 0.5, 0.5];
		writeBias();
		kernel = [
			0,  0,   0,  0, 0,
			0, -3, -10, -3, 0,
			0,  0,   0,  0, 0,
			0,  3,  10,  3, 0,
			0,  0,   0,  0, 0
		];
		writeKernel();
	});

	$('#download').click(function() {
		var image = snapCanvas.toDataURL('image/png');
		window.open(image);
	});

	tex2 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex2);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 640, 480, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	var fb = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex2, 0);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	function loop() {
		gl.clear(gl.COLOR_BUFFER_BIT);

		if (program && videoReady) {

			gl.useProgram(program);

			gl.uniform2f(dim_ptr, gl.clientWidth, gl.clientHeight);
			gl.uniform1fv(kernel_ptr, new Float32Array(kernel));
			gl.uniform3fv(bias_ptr, new Float32Array(bias));
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);

			gl.bindBuffer(gl.ARRAY_BUFFER, vx);
			gl.vertexAttribPointer(vx_ptr, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix);

			gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

			if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE) {

				var pixels = new Uint8Array(4*640*480);
				gl.readPixels(0, 0, 640, 480, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

				// for (var iy = 0; iy < 480; iy++) {
				// 	for (var ix = 0; ix < 640; ix++) {
				// 		var ip = 4*(iy*640 + ix);
				// 		var r = pixels[ip + 0];
				// 		pixels[ip + 0] = r;
				// 		pixels[ip + 1] = r;
				// 		pixels[ip + 2] = r;
				// 		pixels[ip + 3] = r;
				// 	}
				// }
				var imageData = ctx.createImageData(640, 480);
				imageData.data.set(pixels);
				ctx.putImageData(imageData, 0, 0);
			}
		}

		window.requestAnimationFrame(loop);
	}

	loop();
})
