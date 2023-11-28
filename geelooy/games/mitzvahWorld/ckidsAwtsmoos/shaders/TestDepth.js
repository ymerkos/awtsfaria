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
    uniform float focusDepth; // The depth at which the center of the scene is in focus
    uniform float focusSize; // Size of the focus region
    uniform float blurScale; // Scale of blur based on depth difference
    uniform int samples;
    float calculateBlurAmount(float depth) {
        // Calculate distance from the focus region
        float depthDistance = abs(depth - focusDepth) - (focusSize / 2.0);
        depthDistance = max(depthDistance, 0.0); // Ensure non-negative value
        // Calculate blur amount based on distance from the focus region
        return depthDistance * blurScale;
    }

    void main() {
        float depth = texture2D(depthTexture, vUv).r;
        float blurAmount = calculateBlurAmount(depth);

        vec4 color = vec4(0.0);
        
        for (int i = -samples; i <= samples; i++) {
            for (int j = -samples; j <= samples; j++) {
                float offsetScale = 1.0 / float(samples * 2 + 1);
                vec2 offset = vec2(float(i), float(j)) * offsetScale * blurAmount;
                color += texture2D(screenTexture, vUv + offset);
            }
        }

        color /= float((samples * 2 + 1) * (samples * 2 + 1)); // Average the color values
        gl_FragColor = color;
    }

    `
}