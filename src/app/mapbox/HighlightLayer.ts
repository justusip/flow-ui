// import mapboxgl, {CustomLayerInterface} from "mapbox-gl";
//
// const vertexSource = `
//     uniform mat4 u_matrix;
//     attribute vec2 a_pos;
//     void main() {
//         gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
//     }
// `;
//
// const fragmentSource = `
//     void main() {
//         gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);
//     }
// `;
//
// class HighlightLayer implements CustomLayerInterface {
//     id = "highlight-layer";
//     type: "custom" = "custom";
//     source = {};
//
//     program: WebGLProgram;
//     aPos: GLint;
//     buffer: WebGLBuffer;
//
//     onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext): void {
//         // create a vertex shader
//         const vertexShader = gl.createShader(gl.VERTEX_SHADER);
//         gl.shaderSource(vertexShader, vertexSource);
//         gl.compileShader(vertexShader);
//
//         // create a fragment shader
//         const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//         gl.shaderSource(fragmentShader, fragmentSource);
//         gl.compileShader(fragmentShader);
//
//         // link the two shaders into a WebGL program
//         this.program = gl.createProgram();
//         gl.attachShader(this.program, vertexShader);
//         gl.attachShader(this.program, fragmentShader);
//         gl.linkProgram(this.program);
//
//         this.aPos = gl.getAttribLocation(this.program, "a_pos");
//
//         // define vertices of the triangle to be rendered in the custom style layer
//         const p1 = mapboxgl.MercatorCoordinate.fromLngLat({
//             lat: 22.30,
//             lng: 114.10
//         });
//         const p2 = mapboxgl.MercatorCoordinate.fromLngLat({
//             lat: 22.34,
//             lng: 114.12
//         });
//         const p3 = mapboxgl.MercatorCoordinate.fromLngLat({
//             lat: 22.38,
//             lng: 114.10
//         });
//
//         // create and initialize a WebGLBuffer to store vertex and color data
//         this.buffer = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
//         gl.bufferData(
//             gl.ARRAY_BUFFER,
//             new Float32Array([
//                 p1.x,
//                 p1.y,
//                 p2.x,
//                 p2.y,
//                 p3.x,
//                 p3.y
//             ]),
//             gl.STATIC_DRAW
//         );
//     }
//
//     // method fired on each animation frame
//     // https://docs.mapbox.com/mapbox-gl-js/api/#map.event:render
//     render(gl: WebGLRenderingContext, matrix: number[]): void {
//         gl.useProgram(this.program);
//         gl.uniformMatrix4fv(
//             gl.getUniformLocation(this.program, "u_matrix"),
//             false,
//             matrix
//         );
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
//         gl.enableVertexAttribArray(this.aPos);
//         gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
//         gl.enable(gl.BLEND);
//         gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
//     }
// }
//
// export default HighlightLayer;