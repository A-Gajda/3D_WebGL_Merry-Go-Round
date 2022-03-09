const canvas = document.querySelector(`canvas`);
const gl = canvas.getContext(`webgl`);

if(!gl)
{
    throw new Error(`WebGL not supported`);
}

var model;

var horse;
var simpleHorse;
var ball;
var bench;
var chair;

var standVertices;
var standIndices;
var standNormals;	

const InitApp = () => {
    loadTextResource('shader.vs.glsl', function (vsErr, vsText) {
        if (vsErr) {
            alert('error vertex shader (console)');
            console.error(vsErr);
        }
        else {
            loadTextResource('shader.fs.glsl', function (fsErr, fsText) {
                if (fsErr) {
                    alert('error fragment shader (console)');
                    console.error(fsErr);
                }
                else {
                    loadJSONResource("Horse.json", function (modelErr, modelObj) {
                        if (modelErr) {
                            alert('error json (console)');
                            console.error(modelErr);
                        }
                        else {
                            loadJSONResource("Simple_horse.json", function (simpleModelErr, simpleModelObj) {
								if (simpleModelErr) {
									alert('error json (console)');
									console.error(simpleModelErr);
								}
								else {
									loadJSONResource("Ball.json", function (ballModelErr, ballModelObj) {
										if (ballModelErr) {
											alert('error json (console)');
											console.error(ballModelErr);
										}
										else {
											loadJSONResource("Bench.json", function (benchModelErr, benchModelObj) {
												if (benchModelErr) {
													alert('error json (console)');
													console.error(benchModelErr);
												}
												else {
													horse = modelObj;
													simpleHorse = simpleModelObj;
													ball = ballModelObj;
													bench = benchModelObj;
													RunApp(vsText, fsText, modelObj);
												}
											});
										}
									});
								}
							});
                        }
                    });
                }
            });
        }
    });
}

const LoadHorses = (simple) => {
    if (simple) model = simpleHorse;
	else model = horse;
}

var RunApp = function (vertexShaderText, fragmentShaderText, HorseModel) {

	console.log('This is working');
	model = HorseModel;

	gl.clearColor(dayLight, dayLight, dayLight, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

    gl.useProgram(program);

	var horseVertices = model.meshes[0].vertices;
	var horseIndices = [].concat.apply([], model.meshes[0].faces);
	var horseNormals = model.meshes[0].normals;

	var ballVertices = ball.meshes[0].vertices;
	var ballIndices = [].concat.apply([], ball.meshes[0].faces);
	var ballNormals = ball.meshes[0].normals;

	var benchVertices = bench.meshes[0].vertices;
	var benchIndices = [].concat.apply([], bench.meshes[0].faces);
	var benchNormals = bench.meshes[0].normals;

	var chairVertices = bench.meshes[1].vertices;
	var chairIndices = [].concat.apply([], bench.meshes[1].faces);
	var chairNormals = bench.meshes[1].normals;
	//5.5436616

	var red = [0.6, 0.6, 0.8];
	var white = [0.8, 0.8, 0.8];
	var standHeight = 0.05;

	var lightCoords = {
		ballLight: [-1, -5, 5],
		reflector1: [1.0, standHeight, 0.0],
	};

	standVertices = [

		// X, Y, Z, R, G, B

		// white --> 1, 2, 4, 6, -1, -3, -5, -7
		// red --> 3, 5, 7, -2, -4, -6

		// upper face

		0.0, standHeight, 0.0, ...white, //1
		1.0, standHeight, 0.0, .0, .0, .0, //2
		0.5, standHeight, 0.866025, ...red, //3

		0.0, standHeight, 0.0, ...white, //1
		0.5, standHeight, 0.866025, ...red, //3
		-0.5, standHeight, 0.866025, ...white, //4

		0.0, standHeight, 0.0, ...white, //1
		-0.5, standHeight, 0.866025, ...white, //4
		-1.0, standHeight, 0.0, ...red, //5

		0.0, standHeight, 0.0, ...white, //1
		-1.0, standHeight, 0.0, ...red, //5
		-0.5, standHeight, -0.866025, ...white, //6

		0.0, standHeight, 0.0, ...white, //1
		-0.5, standHeight, -0.866025, ...white, //6
		0.5, standHeight, -0.866025, ...red, //7

		0.0, standHeight, 0.0, ...white, //1
		0.5, standHeight, -0.866025, ...red, //7
		1.0, standHeight, 0.0, ...white, //2

		// sides

		1.0, standHeight, 0.0, ...white, //2
		0.5, standHeight, 0.866025, ...white, //3
		1.0, 0.0, 0.0, ...white, //-2

		0.5, standHeight, 0.866025, ...white, //3
		1.0, 0.0, 0.0, ...white, //-2
		0.5, 0.0, 0.866025, ...white, //-3

		0.5, standHeight, 0.866025, ...white, //3
		-0.5, standHeight, 0.866025, ...white, //4
		0.5, 0.0, 0.866025, ...white, //-3

		-0.5, standHeight, 0.866025, ...white, //4
		0.5, 0.0, 0.866025, ...white, //-3
		-0.5, 0.0, 0.866025, ...white, //-4

		-0.5, standHeight, 0.866025, ...white, //4
		-1.0, standHeight, 0.0, ...white, //5
		-0.5, 0.0, 0.866025, ...white, //-4

		-1.0, standHeight, 0.0, ...white, //5
		-0.5, 0.0, 0.866025, ...white, //-4
		-1.0, 0.0, 0.0, ...white, //-5

		-1.0, standHeight, 0.0, ...white, //5
		-0.5, standHeight, -0.866025, ...white, //6
		-1.0, 0.0, 0.0, ...white, //-5

		-0.5, standHeight, -0.866025, ...white, //6
		-1, 0, 0, ...white, //-5
		-0.5, 0, -0.866025, ...white, //-6

		-0.5, standHeight, -0.866025, ...white, //6
		0.5, standHeight, -0.866025, ...white, //7
		-0.5, 0.0, -0.866025, ...white, //-6

		0.5, standHeight, -0.866025, ...white, //7
		-0.5, 0.0, -0.866025, ...white, //-6
		0.5, 0.0, -0.866025, ...white, //-7

		0.5, standHeight, -0.866025, ...white, //7
		1.0, standHeight, 0.0, ...white, //2
		0.5, 0.0, -0.866025, ...white, //-7

		1.0, standHeight, 0.0, ...white, //2
		0.5, 0.0, -0.866025, ...white, //-7
		1.0, 0.0, 0.0, ...white, //-2

		// bottom face

		0.0, 0.0, 0.0, ...white, //-1
		1.0, 0.0, 0.0, ...white, //-2
		0.5, 0.0, 0.866025, ...white, //-3

		0.0, 0.0, 0.0, ...white, //-1
		0.5, 0.0, 0.866025, ...white, //-3
		-0.5, 0.0, 0.866025, ...white, //-4

		0.0, 0.0, 0.0, ...white, //-1
		-0.5, 0.0, 0.866025, ...white, //-4
		-1.0, 0.0, 0.0, ...white, //-5

		0.0, 0.0, 0.0, ...white, //-1
		-1.0, 0.0, 0.0, ...white, //-5
		-0.5, 0.0, -0.866025, ...white, //-6

		0.0, 0.0, 0.0, ...white, //-1
		-0.5, 0.0, -0.866025, ...white, //-6
		0.5, 0.0, -0.866025, ...white, //-7

		0.0, 0.0, 0.0, ...white, //-1
		0.5, 0.0, -0.866025, ...white, //-7
		1.0, 0.0, 0.0, ...white, //-2
	];

	function repeat(n, pattern) {
		return [...Array(n)].reduce(sum => sum.concat(pattern), []);
	}

	standNormals = [
		...repeat(18, [0.0, 1.0, 0.0]),
		...repeat(6, [0.866025, 0.0, 0.5]),
		...repeat(6, [0.0, 0.0, 1.0]),
		...repeat(6, [-0.866025, 0.0, 0.5]),
		...repeat(6, [-0.866025, 0.0, -0.5]),
		...repeat(6, [0.0, 0.0, -1.0]),
		...repeat(6, [0.866025, 0.0, -0.5]),
		...repeat(18, [0.0, -1.0, 0.0]),
	];

	var green = [0.5, 0.75, 0.5];
	var groundHeight = -4;
	var groundLength = 18.0;
	var zTranslation = 12;

	var backgroundVertices = [

		groundLength, groundHeight, groundLength + zTranslation, ...green,
		-groundLength, groundHeight, groundLength + zTranslation, ...green,
		groundLength, groundHeight, -groundLength + zTranslation, ...green,

		-groundLength, groundHeight, groundLength + zTranslation, ...green,
		groundLength, groundHeight, -groundLength + zTranslation, ...green,
		-groundLength, groundHeight, -groundLength + zTranslation, ...green,

	];

	var backgroundNormals = [

		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
	]

	var horsePosVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, horsePosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(horseVertices), gl.STATIC_DRAW);

	var horseNormalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, horseNormalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(horseNormals), gl.STATIC_DRAW);

	var horseIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, horseIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(horseIndices), gl.STATIC_DRAW);

	var ballPosVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, ballPosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ballVertices), gl.STATIC_DRAW);

	var ballNormalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, ballNormalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ballNormals), gl.STATIC_DRAW);

	var ballIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ballIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ballIndices), gl.STATIC_DRAW);

	var benchPosVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, benchPosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(benchVertices), gl.STATIC_DRAW);

	var benchNormalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, benchNormalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(benchNormals), gl.STATIC_DRAW);

	var benchIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, benchIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(benchIndices), gl.STATIC_DRAW);

	var chairPosVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, chairPosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chairVertices), gl.STATIC_DRAW);

	var chairNormalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, chairNormalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chairNormals), gl.STATIC_DRAW);

	var chairIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chairIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(chairIndices), gl.STATIC_DRAW);

	var standVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, standVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(standVertices), gl.STATIC_DRAW);

	var standNormalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, standNormalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(standNormals), gl.STATIC_DRAW);

	var backgroundVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(backgroundVertices), gl.STATIC_DRAW);

	var backgroundNormalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, backgroundNormalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(backgroundNormals), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.enableVertexAttribArray(positionAttribLocation);

	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

	var normalAttribLocation = gl.getAttribLocation(program, 'normal');
	gl.enableVertexAttribArray(normalAttribLocation);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
	var matNormUniformLocation = gl.getUniformLocation(program, 'mNormal');
	var colorVecUniformLocation = gl.getUniformLocation(program, 'colorVec');
	var ifColorVecUniformLocation = gl.getUniformLocation(program, 'ifColorVec');
	var dayLightUniformLocation = gl.getUniformLocation(program, 'dayLight');
	var lightCoords1UniformLocation = gl.getUniformLocation(program, 'lightCoords1');
	var fogUniformLocation = gl.getUniformLocation(program, 'fog');
	var reflectorCoords1UniformLocation = gl.getUniformLocation(program, 'reflectorCoords1');
	var angleUniformLocation = gl.getUniformLocation(program, 'angle');
	var phongUniformLocation = gl.getUniformLocation(program, 'phong');
	var blinnUniformLocation = gl.getUniformLocation(program, 'blinn');

	var worldHorseMatrices;

	var colors = {
		pink: [0.72, 0.55, 0.6, 1.0],
		blue: [0.7, 0.8, 0.85, 1.0],
		yellow: [0.7, 0.7, 0.55, 1.0],
		ballColor: [1.0, 1.0, 1.0, 1.0],
		benchColor: [0.5, 0.4, 0.2, 1.0],
	}

	var viewMatrix = mat4.create();
	var projMatrix = mat4.create();
	var normalMatrix;

	mat4.lookAt(viewMatrix, [0, 2, -8], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.0001, 1000.0);

	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	gl.uniform3f(lightCoords1UniformLocation, ...lightCoords.ballLight);

	var scaleVector;

	var translateVector;

	var rotationAngle;

	var firstTranslateVector;

	var cameraPointStartVector2;
	var cameraPointStartVector3;

	var harmonicMotionVector = [0, 0.1, 0];

	const MoveHarmonic = () => {
		setTimeout(() => {
			harmonicMotionVector = [-harmonicMotionVector[0], -harmonicMotionVector[1], -harmonicMotionVector[2]];
			MoveHarmonic();
		}, 2000);
	}

	MoveHarmonic();

	var worldStandMatrix;

	var worldBenchMatrix = mat4.create();
	mat4.translate(worldBenchMatrix, worldBenchMatrix, [5, -3.9, 20]);
	mat4.scale(worldBenchMatrix, worldBenchMatrix, [0.035, 0.035, 0.035]);
	mat4.rotateY(worldBenchMatrix, worldBenchMatrix, -3.5 * Math.PI / 4);

	var worldBallMatrix = mat4.create();
	mat4.translate(worldBallMatrix, worldBallMatrix, [-1, -0.5, 5.5436616]);
	// [-1, -0.5, 5.5436616]
	mat4.scale(worldBallMatrix, worldBallMatrix, [0.1, 0.1, 0.1]);
	mat4.rotateX(worldBallMatrix, worldBallMatrix, Math.PI / 4);

	const SetHorseThings = () => {

		horseVertices = model.meshes[0].vertices;
		horseIndices = [].concat.apply([], model.meshes[0].faces);
		horseNormals = model.meshes[0].normals;

		gl.bindBuffer(gl.ARRAY_BUFFER, horsePosVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(horseVertices), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, horseNormalBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(horseNormals), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, horseIndexBufferObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(horseIndices), gl.STATIC_DRAW);
		
		normalMatrix = mat4.create();
		
		worldHorseMatrices = {
			horsePink: mat4.create(),
			horseBlue: mat4.create(),
			horseYellow: mat4.create(),
		};

		worldStandMatrix = mat4.create();
		mat4.translate(worldStandMatrix, worldStandMatrix, [-1, -3.5, 5.5436616]);
		mat4.rotateY(worldStandMatrix, worldStandMatrix, - Math.PI / 6);
		mat4.scale(worldStandMatrix, worldStandMatrix, [6.0, 6.0, 6.0]);
	
		scaleVector = [.07, .07, .07];
		if (simple) scaleVector = [.012, .012, .012];
		
		firstTranslateVector = [-1, -2.42, 5.5436616];
		if (simple) firstTranslateVector = [-1, -3.2, 5.5436616];
	
		mat4.translate(worldHorseMatrices.horsePink, worldHorseMatrices.horsePink, firstTranslateVector);
		mat4.translate(worldHorseMatrices.horsePink, worldHorseMatrices.horsePink, [0, 0, 4.4563384]);
		mat4.scale(worldHorseMatrices.horsePink, worldHorseMatrices.horsePink, scaleVector);
		if (!simple)
			mat4.rotateY(worldHorseMatrices.horsePink, worldHorseMatrices.horsePink, Math.PI / 2);
	
		mat4.translate(worldHorseMatrices.horseBlue, worldHorseMatrices.horseBlue, firstTranslateVector);
		mat4.rotateY(worldHorseMatrices.horseBlue, worldHorseMatrices.horseBlue, 2 * Math.PI / 3);
		mat4.translate(worldHorseMatrices.horseBlue, worldHorseMatrices.horseBlue, [0, 0, 4.4563384]);
		mat4.scale(worldHorseMatrices.horseBlue, worldHorseMatrices.horseBlue, scaleVector);
		if (!simple)
			mat4.rotateY(worldHorseMatrices.horseBlue, worldHorseMatrices.horseBlue, Math.PI / 2);
		
		mat4.translate(worldHorseMatrices.horseYellow, worldHorseMatrices.horseYellow, firstTranslateVector);
		mat4.rotateY(worldHorseMatrices.horseYellow, worldHorseMatrices.horseYellow, 4 * Math.PI / 3);
		mat4.translate(worldHorseMatrices.horseYellow, worldHorseMatrices.horseYellow, [0, 0, 4.4563384]);
		mat4.scale(worldHorseMatrices.horseYellow, worldHorseMatrices.horseYellow, scaleVector);
		if (!simple)
			mat4.rotateY(worldHorseMatrices.horseYellow, worldHorseMatrices.horseYellow, Math.PI / 2);
	
		translateVector = [0, 0, 0.5];
		if (simple) translateVector = [0.5 * 0.7 / 0.12, 0, 0]
	
		rotationAngle = Math.PI / 12;
		if (simple) rotationAngle = 0;

		cameraPointStartVector2 = [0, 20, 0, 1];
		if (simple) cameraPointStartVector2 = [0, 20 * 0.7 / 0.12, 0, 1];
		cameraPointStartVector3 = [cameraPointStartVector2[0], cameraPointStartVector2[1] * 2,
		cameraPointStartVector2[2], cameraPointStartVector2[3]];
	}

	SetHorseThings();

	var loop = function () {

		requestAnimationFrame(loop);

		gl.enable(gl.CULL_FACE);

		gl.clearColor(dayLight / 2, dayLight / 2, dayLight / 2, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		
		var worldReflector = vec3.create();
		vec3.transformMat4(worldReflector, lightCoords.reflector1, worldStandMatrix);
		
		gl.uniform1f(dayLightUniformLocation, dayLight);
		gl.uniform1f(fogUniformLocation, fog);
		gl.uniform3f(reflectorCoords1UniformLocation, ...worldReflector);
		gl.uniform1f(angleUniformLocation, angle);
		if (shading == 2) gl.uniform1i(phongUniformLocation, true);
		else gl.uniform1i(phongUniformLocation, false);
		if (lighting == 2) gl.uniform1i(blinnUniformLocation, true);
		else gl.uniform1i(blinnUniformLocation, false);

		if (horsesChanged) {
			horsesChanged = false;
			SetHorseThings();
		}

		// First horse

		gl.bindBuffer(gl.ARRAY_BUFFER, horsePosVertexBufferObject);
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, horseNormalBufferObject);
		gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.TRUE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, horseIndexBufferObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(horseIndices), gl.STATIC_DRAW);

        mat4.rotateY(worldHorseMatrices.horsePink, worldHorseMatrices.horsePink, Math.PI / 400);
		mat4.translate(worldHorseMatrices.horsePink, worldHorseMatrices.horsePink, translateVector);
        mat4.rotateX(worldHorseMatrices.horsePink, worldHorseMatrices.horsePink, rotationAngle);

		mat4.multiply(normalMatrix, viewMatrix, worldHorseMatrices.horsePink);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldHorseMatrices.horsePink);
		gl.uniformMatrix4fv(matNormUniformLocation, gl.FALSE, normalMatrix);
		gl.uniform4f(colorVecUniformLocation, ...colors.pink);
		gl.uniform1i(ifColorVecUniformLocation, true);

		if(camera == 1) mat4.lookAt(viewMatrix, [0, 2, -8], [0, 0, 0], [0, 1, 0]);
		if(camera == 2)
		{
			var cameraPoint = [...cameraPointStartVector2];
			vec4.transformMat4(cameraPoint, cameraPoint, worldHorseMatrices.horsePink);
			mat4.lookAt(viewMatrix, [0, 2, -8], cameraPoint, [0, 1, 0]);
		}
		if(camera == 3)
		{
			var cameraPoint = [...cameraPointStartVector3];
			vec4.transformMat4(cameraPoint, cameraPoint, worldHorseMatrices.horsePink);
			mat4.lookAt(viewMatrix, cameraPoint, [-1, -1, 5.5436616], [0, 1, 0]);
		}
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

		mat4.rotateX(worldHorseMatrices.horsePink, worldHorseMatrices.horsePink, -rotationAngle);

		gl.drawElements(gl.TRIANGLES, horseIndices.length, gl.UNSIGNED_SHORT, 0);


		// Blue horse

        mat4.rotateY(worldHorseMatrices.horseBlue, worldHorseMatrices.horseBlue, Math.PI / 400);
		mat4.translate(worldHorseMatrices.horseBlue, worldHorseMatrices.horseBlue, translateVector);
        mat4.rotateX(worldHorseMatrices.horseBlue, worldHorseMatrices.horseBlue, rotationAngle);

		mat4.multiply(normalMatrix, viewMatrix, worldHorseMatrices.horseBlue);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldHorseMatrices.horseBlue);
		gl.uniformMatrix4fv(matNormUniformLocation, gl.FALSE, normalMatrix);
		gl.uniform4f(colorVecUniformLocation, ...colors.blue);
		gl.uniform1i(ifColorVecUniformLocation, true);

        mat4.rotateX(worldHorseMatrices.horseBlue, worldHorseMatrices.horseBlue, -rotationAngle);

		gl.drawElements(gl.TRIANGLES, horseIndices.length, gl.UNSIGNED_SHORT, 0);

		
		// Yellow horse
		
        mat4.rotateY(worldHorseMatrices.horseYellow, worldHorseMatrices.horseYellow, Math.PI / 400);
		mat4.translate(worldHorseMatrices.horseYellow, worldHorseMatrices.horseYellow, translateVector);
        mat4.rotateX(worldHorseMatrices.horseYellow, worldHorseMatrices.horseYellow, rotationAngle);

		mat4.multiply(normalMatrix, viewMatrix, worldHorseMatrices.horseYellow);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldHorseMatrices.horseYellow);
		gl.uniformMatrix4fv(matNormUniformLocation, gl.FALSE, normalMatrix);
		gl.uniform4f(colorVecUniformLocation, ...colors.yellow);
		gl.uniform1i(ifColorVecUniformLocation, true);

        mat4.rotateX(worldHorseMatrices.horseYellow, worldHorseMatrices.horseYellow, -rotationAngle);

		gl.drawElements(gl.TRIANGLES, horseIndices.length, gl.UNSIGNED_SHORT, 0);


		// Bench

		gl.bindBuffer(gl.ARRAY_BUFFER, benchPosVertexBufferObject);
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, benchNormalBufferObject);
		gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.TRUE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, benchIndexBufferObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(benchIndices), gl.STATIC_DRAW);

		mat4.multiply(normalMatrix, viewMatrix, worldBenchMatrix);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldBenchMatrix);
		gl.uniformMatrix4fv(matNormUniformLocation, gl.FALSE, normalMatrix);
		gl.uniform4f(colorVecUniformLocation, ...colors.benchColor);
		gl.uniform1i(ifColorVecUniformLocation, true);

		gl.drawElements(gl.TRIANGLES, benchIndices.length, gl.UNSIGNED_SHORT, 0);

		
		// Chair

		gl.bindBuffer(gl.ARRAY_BUFFER, chairPosVertexBufferObject);
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, chairNormalBufferObject);
		gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.TRUE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chairIndexBufferObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(chairIndices), gl.STATIC_DRAW);

		mat4.multiply(normalMatrix, viewMatrix, worldBenchMatrix);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldBenchMatrix);
		gl.uniformMatrix4fv(matNormUniformLocation, gl.FALSE, normalMatrix);
		gl.uniform4f(colorVecUniformLocation, ...colors.benchColor);
		gl.uniform1i(ifColorVecUniformLocation, true);

		gl.drawElements(gl.TRIANGLES, chairIndices.length, gl.UNSIGNED_SHORT, 0);


		// Ball

		gl.bindBuffer(gl.ARRAY_BUFFER, ballPosVertexBufferObject);
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, ballNormalBufferObject);
		gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.TRUE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ballIndexBufferObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ballIndices), gl.STATIC_DRAW);

		mat4.translate(worldBallMatrix, worldBallMatrix, harmonicMotionVector);

		mat4.multiply(normalMatrix, viewMatrix, worldBallMatrix);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldBallMatrix);
		gl.uniformMatrix4fv(matNormUniformLocation, gl.FALSE, normalMatrix);
		gl.uniform4f(colorVecUniformLocation, ...colors.ballColor);
		gl.uniform1i(ifColorVecUniformLocation, true);

		gl.drawElements(gl.TRIANGLES, ballIndices.length, gl.UNSIGNED_SHORT, 0);


		// Stand

		gl.disable(gl.CULL_FACE);

		gl.bindBuffer(gl.ARRAY_BUFFER, standVertexBufferObject);
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE,
			6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

		gl.enableVertexAttribArray(colorAttribLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, standNormalBufferObject);
		gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.TRUE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		mat4.rotateY(worldStandMatrix, worldStandMatrix, Math.PI / 400);

		mat4.multiply(normalMatrix, viewMatrix, worldStandMatrix);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldStandMatrix);
		gl.uniformMatrix4fv(matNormUniformLocation, gl.FALSE, normalMatrix);
		gl.uniform1i(ifColorVecUniformLocation, false);

		gl.drawArrays(gl.TRIANGLES, 0, standVertices.length / 6);


		// Background

		gl.bindBuffer(gl.ARRAY_BUFFER, backgroundVertexBufferObject);
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);

		gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE,
			6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

		gl.enableVertexAttribArray(colorAttribLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, backgroundNormalBufferObject);
		gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.TRUE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

		mat4.multiply(normalMatrix, viewMatrix, mat4.create());
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, mat4.create());
		gl.uniformMatrix4fv(matNormUniformLocation, gl.FALSE, normalMatrix);
		gl.uniform1i(ifColorVecUniformLocation, false);

		gl.drawArrays(gl.TRIANGLES, 0, backgroundVertices.length / 6);


		gl.disableVertexAttribArray(colorAttribLocation);
	};
	requestAnimationFrame(loop);
}