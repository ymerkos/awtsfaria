/**
 * B"H
 */



        // Vertex Shader
        var vertexShader = /*glsl*/`
        varying vec2 vUv;
        varying vec4 worldPosition;
        
        void main() {
            vUv = uv;
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            worldPosition = modelMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
        }
        `;

        // Fragment Shader
        var fragmentShader = /*glsl*/`

        uniform sampler2D maskTexture;
        uniform sampler2D baseTexture;
        uniform sampler2D overlayTexture;


        uniform vec3 fogColor;
        uniform float fogNear;
        uniform float fogFar;

        
        uniform vec2 repeatVector; // Added a new uniform to pass the repeat vector
        varying vec2 vUv;

        varying vec4 worldPosition;

        void main() {

            vec2 uv = vUv;
            vec2 uvBase = vUv;
            // Inverting the y-coordinate if necessary
            // uv.y = 1.0 - uv.y;

            uv *= repeatVector; // Modifying the uv coordinates based on the repeat vector


            vec4 maskColor = texture2D(maskTexture, uvBase);
            vec4 baseColor = texture2D(baseTexture, uv);
            vec4 overlayColor = texture2D(overlayTexture, uv);

            // Using the mask texture's red channel to blend between the base and overlay textures
            float maskFactor = maskColor.r;
            vec4 maskedColors = mix(baseColor, overlayColor, maskFactor);

            gl_FragColor = maskedColors;
        }
        `;
        var material = new THREE.ShaderMaterial({
            uniforms: {
                maskTexture: { value: mask },
                baseTexture: { value: base },
                overlayTexture: { value: overlay },
                repeatVector: { value: new THREE.Vector2(repeatX, repeatY) },
            },
            
            vertexShader ,
            fragmentShader
        });