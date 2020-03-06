import { vec2, vec3 } from "gl-matrix";
import { smoothstep, fract, mix } from './mathf';

const temp2d = vec2.create();
const steps2d = [
    vec2.fromValues(0, 0),
    vec2.fromValues(1, 0),
    vec2.fromValues(0, 1),
    vec2.fromValues(1, 1),
];

export function perlin2d(vec) {
    let i = vec2.floor(vec2.create(), vec);
    let f = vec2.fromValues(fract(vec[0]), fract(vec[1]));

    let values = steps2d.map(step => {
        vec2.add(temp2d, i, step);
        return random2d(temp2d);
    })
    
    let x = smoothstep(0, 1, f[0]);
    let y = smoothstep(0, 1, f[1]);

    return mix(mix(values[0], values[1], x), mix(values[2], values[3], x), y);
}

const temp3d = vec3.create();
const steps3d = [
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(1, 0, 0),
    vec3.fromValues(0, 1, 0),
    vec3.fromValues(1, 1, 0),
    vec3.fromValues(0, 0, 1),
    vec3.fromValues(1, 0, 1),
    vec3.fromValues(0, 1, 1),
    vec3.fromValues(1, 1, 1),
];

export function perlin3d(vec) {
    let i = vec3.floor(vec3.create(), vec);
    let f = vec3.fromValues(fract(vec[0]), fract(vec[1]), fract(vec[2]));

    let values = steps3d.map(step => {
        vec3.add(temp3d, i, step);
        return random3d(temp3d);
    })
    
    let x = smoothstep(0, 1, f[0]);
    let y = smoothstep(0, 1, f[1]);
    let z = smoothstep(0, 1, f[2]);

    return mix(
            mix(mix(values[0], values[1], x), mix(values[2], values[3], x), y),
            mix(mix(values[4], values[5], x), mix(values[6], values[7], x), y),
            z);
}

const rngVec2 = vec2.fromValues(12.9898, 78.233);
const rngVec3 = vec3.fromValues(12.9898, 78.233, 45.729);

function random2d(vec) {
    return Math.abs((Math.sin(vec2.dot(vec, rngVec2)) * 43758.5453123)) % 1;
}

function random3d(vec) {
    return Math.abs((Math.sin(vec3.dot(vec, rngVec3)) * 43758.5453123)) % 1;
}