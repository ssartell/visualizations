export function clamp(x, min, max) {
    return Math.min(Math.max(min, x), max);
}

export function smoothstep(edge0, edge1, x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * (3 - 2 * x);
}

export function mix(a, b, t) {
    return a * (1 - t) + b * t;
}

export function fract(x) {
    return x % 1;
}