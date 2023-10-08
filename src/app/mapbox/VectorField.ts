// import * as twgl from "twgl.js/dist/5.x/twgl-full";
// import mapboxgl, {CustomLayerInterface, LngLatBounds} from "mapbox-gl";
// import {
//     glsl_flow_fs,
//     glsl_flow_fs_screen,
//     glsl_flow_fs_update,
//     glsl_flow_vs,
//     glsl_flow_vs_quad
// } from "@/app/flow/FlowShaders";
//
// class VectorField implements CustomLayerInterface {
//     id = "flow-layer";
//     type: "custom" = "custom";
//     source = {};
//
//     data: { width: number; height: number; };
//     bounds: LngLatBounds;
//     range: number[];
//
//     programInfo: twgl.ProgramInfo;
//     screenProgramInfo: twgl.ProgramInfo;
//     updateProgramInfo: twgl.ProgramInfo;
//
//     textures: { [key: string]: WebGLTexture; };
//     particleTextures: { [key: string]: WebGLTexture; };
//
//     numParticles: number;
//     framebuffer: WebGLFramebuffer;
//
//     particleIndices: Float32Array;
//     particleRes: number;
//     state = "PAUSED";
//     mapBounds: number[];
//
//     fadeOpacity: number;
//     speedFactor: number;
//     dropRate: number;
//     dropRateBump: number;
//
//     animationId: number;
//
//     nParticles = 2000;
//
//     setBounds(bounds: LngLatBounds) {
//         const nw = bounds.getNorthWest();
//         const se = bounds.getSouthEast();
//         const nwMercator = mapboxgl.MercatorCoordinate.fromLngLat(nw);
//         const seMercator = mapboxgl.MercatorCoordinate.fromLngLat(se);
//
//         //minx miny maxx maxy
//         this.mapBounds = [nwMercator.x, seMercator.y, seMercator.x, nwMercator.y];
//     }
//
//     // setData(dataObject) {
//     //     //set vectorField data and bounds of data, and range of vector components
//     //     ({data, bounds, range} = dataObject);
//     //
//     //     //initialize settings, programs, buffers
//     //     initialize();
//     //
//     //     //start animating field
//     //     startAnimation();
//     // }
//
//     onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext): void {
//         this.fadeOpacity = 0.985;
//         this.speedFactor = 0.075;
//         this.dropRate = 0.003;
//         this.dropRateBump = 0.05;
//
//         this.programInfo = twgl.createProgramInfo(gl, [glsl_flow_vs, glsl_flow_fs]);
//         this.screenProgramInfo = twgl.createProgramInfo(gl, [glsl_flow_vs_quad, glsl_flow_fs_screen]);
//         this.updateProgramInfo = twgl.createProgramInfo(gl, [glsl_flow_vs_quad, glsl_flow_fs_update]);
//
//         //initial setting of particle positions
//         this.setParticles(gl, this.nParticles);
//
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");
//
//         canvas.width = data.width;
//         canvas.height = data.height;
//
//         context.drawImage(dataCanvas, 0, 0);
//         const myData = context.getImageData(0, 0, data.width, data.height);
//
//         const emptyPixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
//
//         this.textures = twgl.createTextures(gl, {
//             u_image: {
//                 mag: gl.LINEAR,
//                 min: gl.LINEAR,
//                 width: myData.width,
//                 height: myData.height,
//                 format: gl.RGBA,
//                 src: myData.data,
//             },
//             backgroundTexture: {
//                 mag: gl.NEAREST,
//                 min: gl.NEAREST,
//                 width: gl.canvas.width,
//                 height: gl.canvas.height,
//                 format: gl.RGBA,
//                 src: emptyPixels,
//                 wrap: gl.CLAMP_TO_EDGE
//             },
//             screenTexture: {
//                 mag: gl.NEAREST,
//                 min: gl.NEAREST,
//                 width: gl.canvas.width,
//                 height: gl.canvas.height,
//                 format: gl.RGBA,
//                 src: emptyPixels,
//                 wrap: gl.CLAMP_TO_EDGE
//             },
//         });
//
//         this.framebuffer = gl.createFramebuffer();
//     }
//
//     setParticles(gl: WebGLRenderingContext, num: number) {
//         this.particleRes = Math.ceil(Math.sqrt(num));
//         this.numParticles = this.particleRes * this.particleRes;
//
//         const particleState = new Uint8Array(this.numParticles * 4);
//
//         for (let i = 0; i < particleState.length; i++) {
//             particleState[i] = Math.floor(Math.random() * 256);
//         }
//
//         this.particleTextures = twgl.createTextures(gl, {
//             particleTexture0: {
//                 mag: gl.NEAREST,
//                 min: gl.NEAREST,
//                 width: this.particleRes,
//                 height: this.particleRes,
//                 format: gl.RGBA,
//                 src: particleState,
//                 wrap: gl.CLAMP_TO_EDGE
//             },
//             particleTexture1: {
//                 mag: gl.NEAREST,
//                 min: gl.NEAREST,
//                 width: this.particleRes,
//                 height: this.particleRes,
//                 format: gl.RGBA,
//                 src: particleState,
//                 wrap: gl.CLAMP_TO_EDGE
//             }
//         });
//
//         this.particleIndices = new Float32Array(this.numParticles);
//         for (let i = 0; i < this.numParticles; i++) {
//             this.particleIndices[i] = i;
//         }
//     }
//
//     drawParticles(gl: WebGLRenderingContext) {
//         gl.useProgram(this.programInfo.program);
//
//         const arrays = {
//             a_index: {
//                 numComponents: 1,
//                 data: this.particleIndices
//             }
//         };
//
//         const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
//
//         const uniforms = {
//             u_vector: this.textures.u_image,
//             u_particles: this.particleTextures.particleTexture0,
//             u_particles_res: this.particleRes,
//             u_vector_min: [this.range[0], this.range[0]],
//             u_vector_max: [this.range[1], this.range[1]],
//             u_bounds: this.mapBounds,
//             u_data_bounds: this.bounds
//         };
//
//         twgl.setBuffersAndAttributes(gl, this.programInfo, bufferInfo);
//         twgl.setUniforms(this.programInfo, uniforms);
//
//         twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
//     }
//
//     drawTexture(gl: WebGLRenderingContext, texture: WebGLTexture, opacity: number) {
//         gl.useProgram(this.screenProgramInfo.program);
//
//         const arrays = {
//             a_pos: {
//                 numComponents: 2,
//                 data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])
//             }
//         };
//
//         const uniforms = {
//             u_screen: texture,
//             u_opacity: opacity
//         };
//
//         const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
//         twgl.setBuffersAndAttributes(gl, this.screenProgramInfo, bufferInfo);
//         twgl.setUniforms(this.screenProgramInfo, uniforms);
//         twgl.drawBufferInfo(gl, bufferInfo);
//     }
//
//     drawScreen(gl: WebGLRenderingContext) {
//         //bind framebuffer
//         gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
//         //draw to screenTexture
//         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures.screenTexture, 0);
//         //set viewport to size of canvas
//
//         gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//
//         //first disable blending
//         gl.disable(gl.BLEND);
//
//         //draw backgroundTexture to screenTexture target
//         this.drawTexture(gl, this.textures.backgroundTexture, this.fadeOpacity);
//         //draw particles to screentexture
//         this.drawParticles(gl);
//
//         //target normal canvas by setting FRAMEBUFFER to null
//         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//
//         //enable blending for final render to map
//         gl.enable(gl.BLEND);
//         gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//
//         this.drawTexture(gl, this.textures.screenTexture, 1.0);
//
//         gl.disable(gl.BLEND);
//
//         //swap background with screen
//         const temp = this.textures.backgroundTexture;
//         this.textures.backgroundTexture = this.textures.screenTexture;
//         this.textures.screenTexture = temp;
//     }
//
//     updateParticles(gl: WebGLRenderingContext) {
//         gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
//         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.particleTextures.particleTexture1, 0);
//
//         gl.viewport(0, 0, this.particleRes, this.particleRes);
//
//         gl.useProgram(this.updateProgramInfo.program);
//
//         const arrays = {
//             a_pos: {
//                 numComponents: 2,
//                 data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])
//             }
//         };
//
//         const uniforms = {
//             u_vector: this.textures.u_image,
//             u_particles: this.particleTextures.particleTexture0,
//             u_vector_min: [this.range[0], this.range[0]],
//             u_vector_max: [this.range[1], this.range[1]],
//             u_rand_seed: Math.random(),
//             u_vector_res: [data.width, data.height],
//             u_speed_factor: this.speedFactor,
//             u_drop_rate: this.dropRate,
//             u_drop_rate_bump: this.dropRateBump,
//             u_bounds: this.mapBounds,
//             u_data_bounds: this.bounds
//         };
//
//         const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
//         twgl.setBuffersAndAttributes(gl, this.updateProgramInfo, bufferInfo);
//
//         twgl.setUniforms(this.updateProgramInfo, uniforms);
//
//         twgl.drawBufferInfo(gl, bufferInfo);
//
//         const temp = this.particleTextures.particleTexture0;
//         this.particleTextures.particleTexture0 = this.particleTextures.particleTexture1;
//         this.particleTextures.particleTexture1 = temp;
//     }
//
//     render(gl: WebGLRenderingContext, matrix: number[]): void {
//         if (this.state != "ANIMATING")
//             return;
//
//         gl.disable(gl.DEPTH_TEST);
//         gl.disable(gl.STENCIL_TEST);
//
//         this.drawScreen();
//         this.updateParticles();
//     }
//
//     frame() {
//         this.map.triggerRepaint();
//         this.animationId = requestAnimationFrame(this.frame);
//     }
//
//     startAnimation() {
//         this.state = "ANIMATING";
//         this.setBounds(this.map.getBounds());
//         this.frame();
//     }
//
//     stopAnimation(gl: WebGLRenderingContext) {
//         this.state = "PAUSED";
//         this.clear(gl);
//         cancelAnimationFrame(this.animationId);
//     }
//
//     clear(gl: WebGLRenderingContext) {
//         gl.clearColor(0.0, 0.0, 0.0, 0.0);
//
//         //clear framebuffer textures
//         gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
//         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures.screenTexture, 0);
//         gl.clear(gl.COLOR_BUFFER_BIT);
//         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures.backgroundTexture, 0);
//         gl.clear(gl.COLOR_BUFFER_BIT);
//
//         //generate new random particle positions
//         this.setParticles(gl, this.nParticles);
//
//         //target normal canvas
//         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//
//         //clear canvas
//         gl.clear(gl.COLOR_BUFFER_BIT);
//     }
//
// }
