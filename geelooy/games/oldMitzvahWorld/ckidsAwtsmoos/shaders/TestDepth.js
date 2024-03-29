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
    uniform sampler2D screenTexture;
    uniform sampler2D depthTexture;
    uniform float focusDepth; // Distance from camera to focused object in Three.js units
    uniform float focusSize; // Range around focusDepth that remains sharp in Three.js units
    uniform float blurScale;  // Blur intensity
    uniform int samples;      // Number of samples for blur
    uniform float near;       // Camera's near plane
    uniform float far;        // Camera's far plane
    uniform vec2 resolution;  // Screen resolution
    
    varying vec2 vUv;
    
    // Normalize depth
    float normalizeDepth(float depth) {
        return 0.5 * depth / far + 0.5;
    }
    
    // Apply blur based on distance from focus range
    vec4 applyBlur(vec2 uv, float blurAmount) {
        vec4 blurredColor = vec4(0.0);
        float totalWeight = 0.0;
    
        for (int i = -samples / 2; i <= samples / 2; i++) {
            for (int j = -samples / 2; j <= samples / 2; j++) {
                vec2 offset = vec2(float(i), float(j)) * blurAmount / resolution;
                blurredColor += texture2D(screenTexture, uv + offset);
                totalWeight += 1.0;
            }
        }
    
        return blurredColor / totalWeight;
    }
    
    void main() {
        vec2 uv = vUv;
        // Get normalized depth from the depth texture
        float depth = texture2D(depthTexture, uv).r;
        float focusDepthNormalized = normalizeDepth(focusDepth);
    
        // Calculate focus range
        float focusRangeStart = focusDepthNormalized - normalizeDepth(focusSize / 2.0);
        float focusRangeEnd = focusDepthNormalized + normalizeDepth(focusSize / 2.0);
    
        // Determine blur amount based on distance from focus range
        float blurAmount = 0.0;
        if (depth < focusRangeStart) {
            blurAmount = blurScale * (focusRangeStart - depth);
        } else if (depth > focusRangeEnd) {
            blurAmount = blurScale * (depth - focusRangeEnd);
        }
    
        // Apply blur
        vec4 color = (blurAmount > 0.0) ? applyBlur(uv, blurAmount) : texture2D(screenTexture, uv);
    
        gl_FragColor = color;
    }
      
    `
}