$(document).ready(function() {

	// Get A WebGL context
	var glCanvas = $("#canvas")[0];
	var gl = glCanvas.getContext('experimental-webgl');

	// Load data.
	var vx = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vx);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 1,1, 0,1]), gl.STATIC_DRAW);

	var ix = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2, 0,2,3]), gl.STATIC_DRAW);

	var videoTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, videoTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	function loadAndCompileShader(path, type) {
		return $.get(path).then(function(source) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw Error('Failed to compile "' + path + '" shader:\n' + gl.getShaderInfoLog(shader));
			}
			return shader;
		});
	}

	function attachAndLinkProgram(vertex, fragment) {
		var program = gl.createProgram();
		gl.attachShader(program, vertex);
		gl.attachShader(program, fragment);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw Error("Failed to link program:\n" + gl.getProgramInfoLog(program));
		}
		return program;
	}

	var vertexShaderPromise = loadAndCompileShader('vertex.glsl', gl.VERTEX_SHADER);
	var fragmentShaderPromise = loadAndCompileShader('skin-detector-yiq-fragment.glsl', gl.FRAGMENT_SHADER)
	$.get('skin-detector-yiq-fragment.glsl').then(function(source) {
		$('#fragment').text(source);
	});

	var shaderProgram = null;

	$.when(vertexShaderPromise, fragmentShaderPromise)
	.then(attachAndLinkProgram)
	.then(function(program) {
		shaderProgram = program;
		gl.useProgram(program);
		program.locVx = gl.getAttribLocation(program, 'vx');
		program.locTexSize = gl.getUniformLocation(program, 'texSize');
		program.locTex = gl.getUniformLocation(program, 'tex');
		gl.enableVertexAttribArray(program.locVx);
	}, function(error) { console.error(error); });

	// Create an HTML video element.
	var video = document.createElement("video");
	video.autoplay = true;
	video.loop = true;
	var videoReady = false;
	video.oncanplay = function() {
		videoReady = true;
		gl.clientWidth = glCanvas.width = video.videoWidth;
		gl.clientHeight = glCanvas.height = video.videoHeight;
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

	function loop() {
		gl.clear(gl.COLOR_BUFFER_BIT);

		if (videoReady) {
			if (shaderProgram) {
				gl.useProgram(shaderProgram);
				gl.uniform2f(shaderProgram.locTexSize, gl.clientWidth, gl.clientHeight);
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, videoTexture);
				gl.uniform1i(shaderProgram.locTex, 0);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
				gl.bindBuffer(gl.ARRAY_BUFFER, vx);
				gl.vertexAttribPointer(shaderProgram.locVx, 2, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix);
				gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
			}
		}

		window.requestAnimationFrame(loop);
	}

	loop();
})
