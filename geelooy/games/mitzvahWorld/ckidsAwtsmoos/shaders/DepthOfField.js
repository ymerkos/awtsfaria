//B"H
export default {
    vertex: /*glsl*/`
        layout(location = 0) in vec3 aPos;
        layout(location = 1) in vec2 aTexCoord;
        
        out vec2 TexCoord;
        
        uniform mat4 model;
        uniform mat4 view;
        uniform mat4 projection;
        
        void main()
        {
            gl_Position = projection * view * model * vec4(aPos, 1.0);
            TexCoord = aTexCoord;
        }
    
    `,
    fragment: /*glsl*/`
        // Fragment shader code
            // Fragment shader code

    in vec2 TexCoord;

    uniform sampler2D screenTexture;
    uniform sampler2D depthTexture;
    uniform float focalDepth; // The distance at which objects are in perfect focus
    uniform float focalLength; // Typically a value like 1.0
    uniform float fStop; // Controls the amount of blur
    uniform vec2 screenSize; // The size of the screen in pixels

    float calculateBlur(float depth) {
        // This function calculates the amount of blur based on the depth
        // The equation will change depending on the DoF effect you want
        return clamp(abs(focalLength / (depth - focalLength) / fStop), 0.0, 1.0);
    }

    void main() {    
        float depth = texture(depthTexture, TexCoord).r;
        float blurAmount = calculateBlur(depth);

        vec2 blurSize = blurAmount / screenSize; // Size of the blur
        vec4 color = vec4(0.0);

        // Simple box blur for demonstration
        for(int x = -1; x <= 1; ++x) {
            for(int y = -1; y <= 1; ++y) {
                vec2 shift = vec2(
                    blurSize.x * float(x), 
                    blurSize.y * float(y)
                );
                color += texture(screenTexture, TexCoord + shift);
            }
        }
        color /= 9.0;

        gl_FragColor = color; // Use gl_FragColor instead of FragColor
        gl_FragColor.a = 1.0;
    }
    
    `
}