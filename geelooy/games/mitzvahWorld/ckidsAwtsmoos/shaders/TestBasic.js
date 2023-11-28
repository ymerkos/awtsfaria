/**
 * B"H
 */

export default {
    vertex: /*glsl*/`
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    
    `,
    fragment: /*glsl*/`
    varying vec2 vUv;
    uniform sampler2D screenTexture;
    
    uniform sampler2D depthTexture;
    void main() {
        vec4 col = vec4( 0.0 );
        col += texture2D( myTexture, vUv.xy );
        gl_FragColor = col;
        gl_FragColor.a = 1.0;
        
    }

    `
}