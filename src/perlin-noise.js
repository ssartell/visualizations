import { vec2 } from "gl-matrix";
import { smoothstep, fract, mix } from './mathf';

const steps = [
    vec2.fromValues(0, 0),
    vec2.fromValues(1, 0),
    vec2.fromValues(-1, 1),
    vec2.fromValues(1, 0),
];

export default function perlinNoise(vec) {
    let i = vec2.floor(vec2.create(), vec);
    let f = vec2.fromValues(fract(vec[0]), fract(vec[1]));

    vec2.add(i, i, steps[0]);
    let a = random(i);
    vec2.add(i, i, steps[1]);
    let b = random(i);
    vec2.add(i, i, steps[2]);
    let c = random(i);
    vec2.add(i, i, steps[3]);
    let d = random(i);

    let x = smoothstep(0, 1, f[0]);
    let y = smoothstep(0, 1, f[1]);

    return mix(mix(a, b, x), mix(c, d, x), y);
}

const rngVec = vec2.fromValues(12.9898, 78.233);

function random(vec) {
    return Math.abs((Math.sin(vec2.dot(vec, rngVec)) * 43758.5453123)) % 1;
}