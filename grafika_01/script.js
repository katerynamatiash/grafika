console.error('works');
const vertexShaderTxt = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;
const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;

let gl, program, vertexBuffer, posAttribLocation, colorAttribLocation;
let shape = 'square'; // current shape: 'square' or 'hexagon'
let canvasColor = [0.2, 0.5, 0.8];
let squareColor = [1.0, 0.0, 0.0]; // Initial color of the square

function drawSquare() {
    const canvas = document.getElementById('main-canvas');
    gl = canvas.getContext('webgl');

    checkGl(gl);

    gl.clearColor(...canvasColor, 1.0); // R, G, B, A
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    checkShaderCompile(gl, vertexShader);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(posAttribLocation);

    colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT,
    );
    gl.enableVertexAttribArray(colorAttribLocation);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    let vertices;
    if (shape === 'square') {
        vertices = new Float32Array([
            // X, Y            R, G, B
            // First Triangle
            -0.5,  0.5,       ...squareColor,
            -0.5, -0.5,       ...squareColor,
            0.5,  0.5,       ...squareColor,
            // Second Triangle
            -0.5, -0.5,       ...squareColor,
            0.5, -0.5,       ...squareColor,
            0.5,  0.5,       ...squareColor
        ]);
    } else if (shape === 'hexagon') {
        vertices = new Float32Array([
            // X, Y          R, G, B
            0.0,  0.5,    Math.random(), Math.random(), Math.random(),
            -0.43, 0.25,   Math.random(), Math.random(), Math.random(),
            -0.43, -0.25,  Math.random(), Math.random(), Math.random(),
            0.0, -0.5,    Math.random(), Math.random(), Math.random(),
            0.43, -0.25,  Math.random(), Math.random(), Math.random(),
            0.43, 0.25,   Math.random(), Math.random(), Math.random(),
            0.0,  0.5,    Math.random(), Math.random(), Math.random()
        ]);
    }

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(program);

    if (shape === 'square') {
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else if (shape === 'hexagon') {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 7);
    }
}

function changeColor() {
    // Generate random colors for the square
    squareColor = [Math.random(), Math.random(), Math.random()];
    render();
}

function toggleShape() {
    shape = (shape === 'square') ? 'hexagon' : 'square';
    render();
}

function checkGl(gl) {
    if (!gl) {
        console.log('WebGL not supported, use another browser');
    }
}

function checkShaderCompile(gl, shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('shader not compiled', gl.getShaderInfoLog(shader));
    }
}

// Call the drawSquare function to start rendering
drawSquare();