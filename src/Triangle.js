// Triangle.js
// Defines the Triangle class with position, color, and size for a triangle

class Triangle {
    constructor() {
        this.type = 'triangle';
        this.position = [0.0, 0.0]; // Center of the triangle
        this.color = [1.0, 1.0, 1.0, 1.0]; // Default color: white
        this.size = 5.0; // Default size
        this.isRightOriented = true; // Default orientation
    }

    render() {
        const [x, y] = this.position;
        const rgba = this.color;
        const sizeOffset = this.size / 200.0;

        // Pass the color to the shader
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Generate vertices based on the orientation
        const vertices = this.isRightOriented
            ? [
                x, y,                       // Bottom-left
                x + sizeOffset, y,          // Bottom-right
                x, y + sizeOffset           // Top
              ]
            : [
                x, y,                       // Bottom-left
                x - sizeOffset, y,          // Bottom-left
                x, y - sizeOffset           // Bottom
              ];

        // Draw the triangle
        drawTriangle(vertices);
    }
}

function drawTriangle(vertices) {
    const n = 3; // Number of vertices for a triangle

    // Create a buffer object
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer and write vertices to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer to the shader's attribute
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
