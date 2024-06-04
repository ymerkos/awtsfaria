/**
 * B"H
 * custom tree sway texture
 * 
 * 
 */
import * as THREE from '/games/scripts/build/three.module.js';
let fs='fragmentShader'
let vs='vertexShader'
let ck = THREE.ShaderChunk;
let timeUniform={
    get value(){return performance.now()/1000;},
    set value(v){}
}
export default function TreeShader(s){
    s.uniforms.uTime = timeUniform;
    s[vs]=`
    varying vec3 vPosWorld;
    uniform float uTime;
    `+s[vs];
    let pv = ck.project_vertex;
    pv = pv.replace(`mvPosition = modelViewMatrix * mvPosition;`,/*glsl*/`
        vPosWorld = vec3(modelMatrix * mvPosition);
        mvPosition = modelViewMatrix * mvPosition;
        float offset = pow((vPosWorld.y-modelMatrix[3].y)*.1,2.);
        vPosWorld.x += .02*offset*sin(uTime*2.5);
        mvPosition = viewMatrix * vec4(vPosWorld,1.);
    `)
    s[vs]=s[vs].replace(`#include <project_vertex>`,pv)
}