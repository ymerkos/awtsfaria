/**
 * B"H
 */
import * as THREE from '/games/scripts/build/three.module.js';
export default class GrassMaterial extends THREE.ShaderMaterial {
    uniforms = {
      fTime: {
        value: 0.0
      },
      vPlayerPosition: {
        value: new THREE.Vector3(0.0, -1.0, 0.0)
      },
      fPlayerColliderRadius: {
        value: 1.1,
      }
    };
  
    vertexShader = /*glsl*/`
      uniform float fTime;
      uniform vec3 vPlayerPosition;
      uniform float fPlayerColliderRadius;
    
      varying float fDistanceFromGround;
      varying vec3 vInstanceColor;
  
      float rand(float n){return fract(sin(n) * 43758.5453123);}
  
      float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }
      
      float createNoise(vec2 n) {
        vec2 d = vec2(0.0, 1.0);
        vec2 b = floor(n);
        vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
  
        return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
      }
  
      vec3 localToWorld(vec3 target) {
        return (modelMatrix * instanceMatrix * vec4(target, 1.0)).xyz;
      }
    
      void main() {
        fDistanceFromGround = max(0.0, position.y);
        vInstanceColor = instanceColor;
        
        vec3 worldPosition = localToWorld(position);
  
        float noise = createNoise(vec2(position.x, position.z)) * 0.6 + 0.4;
  
        float distanceFromPlayer = length(vPlayerPosition - worldPosition);
  
        vec3 sway = 0.1 * vec3(
          cos(fTime) * noise * fDistanceFromGround,
          0.0,
          0.0
        );
        
        vec3 vNormal = normalize(
          vPlayerPosition - worldPosition
        );
        vNormal.y = abs(vNormal.y);
  
        float fOffset = fPlayerColliderRadius - distanceFromPlayer;
        vec3 vPlayerOffset = -(vNormal * fOffset);
  
        worldPosition += mix(
          sway * min(1.0, distanceFromPlayer / 4.0),
          vPlayerOffset,
          float(distanceFromPlayer < fPlayerColliderRadius)
        );
  
        gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
      }
    `;
  
    fragmentShader = /*glsl*/`
      varying float fDistanceFromGround;
      varying vec3 vInstanceColor;
    
      void main() {
        vec3 colorDarkest = vec3(
          24.0 / 255.0,
          30.0 / 255.0,
          41.0 / 255.0
        );
        vec3 colorBrightest = vec3(
          88.0 / 255.0,
          176.0 / 255.0,
          110.0 / 255.0
        );
        vec3 color = mix(
          colorDarkest,
          colorBrightest,
          fDistanceFromGround / 2.0
        );
  
        color = clamp(color, 0.0, 1.0);
  
        gl_FragColor = vec4(color, 1.);
      }
    `;
    
    constructor(props) {
      super(props);
    }
  }