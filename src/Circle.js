// Cyrus Amalan
// camalan@ucsc.edu

class Circle {
    constructor() {
        this.type = 'circle'; // Type identifier for the shape
        this.position = [0.0, 0.0]; // Center
        this.color = [1.0, 1.0, 1.0, 1.0]; // Default
        this.size = 5.0; // Default
        this.segments = 12; // Default
    }

    render() {
        const [x, y] = this.position; 
        const rgba = this.color; // Circle color
        const radius = this.size / 200.0; // Calculate radius 

        // Pass the color to the shader
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        const step = 360 / this.segments;

        // Draw each triangle for the circle
        for (let angle = 0; angle < 360; angle += step) {
            const rad1 = (angle * Math.PI) / 180; // Convert angle to radians
            const rad2 = ((angle + step) * Math.PI) / 180;

            // Compute vertices for the triangle
            const vertex1 = [x + Math.cos(rad1) * radius, y + Math.sin(rad1) * radius];
            const vertex2 = [x + Math.cos(rad2) * radius, y + Math.sin(rad2) * radius];

            // Draw the triangle
            drawTriangle([x, y, vertex1[0], vertex1[1], vertex2[0], vertex2[1]]);
        }
    }
}

function drawTriangle(vertices) {
    const n = 3; // Number of vertices per triangle

    // Create a buffer object
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer 
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer 
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
