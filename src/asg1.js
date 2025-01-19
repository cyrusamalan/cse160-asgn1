// Cyrus Amalan
// camalan@ucsc.edu

// Vertex Shader
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }
`;

// Fragment Shader
const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`;

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let canvas, gl, a_Position, u_FragColor, u_Size;
let shapesList = [];
let currentType = POINT;
let currentSize = 5.0;
let currentColor = [1.0, 1.0, 1.0, 1.0];
let isDrawing = false;

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  setupUI();
  clearCanvas();
}

function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('Failed to get WebGL context.');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error('Failed to initialize shaders.');
    return;
  }
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
}

function setupUI() {
  canvas.onmousedown = (event) => {
    isDrawing = true;
    handleMouseDraw(event);
  };

  canvas.onmousemove = (event) => {
    if (isDrawing) {
      handleMouseDraw(event);
    }
  };

  canvas.onmouseup = () => {
    isDrawing = false;
  };

  canvas.onmouseleave = () => {
    isDrawing = false;
  };

  document.getElementById('clearButton').onclick = () => {
    shapesList = [];
    clearCanvas();
  };

  document.getElementById('pointButton').onclick = () => currentType = POINT;
  document.getElementById('triangleButton').onclick = () => currentType = TRIANGLE;
  document.getElementById('circleButton').onclick = () => currentType = CIRCLE;

  document.getElementById('sizeSlider').oninput = (e) => currentSize = parseFloat(e.target.value);

  document.getElementById('redSlider').oninput = updateColor;
  document.getElementById('greenSlider').oninput = updateColor;
  document.getElementById('blueSlider').oninput = updateColor;

  // Tree button toggle logic
  document.getElementById('treeButton').onclick = () => {
    const treeImage = document.getElementById('treeImage');
    if (treeImage.style.display === 'none') {
      treeImage.style.display = 'block';
    } else {
      treeImage.style.display = 'none';
    }
  };
}

function updateColor() {
  const r = document.getElementById('redSlider').value / 255;
  const g = document.getElementById('greenSlider').value / 255;
  const b = document.getElementById('blueSlider').value / 255;
  currentColor = [r, g, b, 1.0];
}

function clearCanvas() {
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function handleMouseDraw(event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;

  let shape;
  if (currentType === POINT) {
    shape = new Point();
  } else if (currentType === TRIANGLE) {
    shape = new Triangle();
  } else if (currentType === CIRCLE) {
    shape = new Circle();
  }

  shape.position = [x, y];
  shape.color = [...currentColor];
  shape.size = currentSize;
  shapesList.push(shape);

  renderShapes();
}

function renderShapes() {
  clearCanvas();
  shapesList.forEach(shape => shape.render());
}
