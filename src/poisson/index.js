import Vector2 from '../vector2';
import Rectangle from '../rectangle';
import Quadtree from '../quadtree';
import Poisson from './poisson';
import PoissonGrid from './poissonGrid';
import Delaunator from 'delaunator';
import perlinNoise from '../perlin-noise';
import { vec2 } from 'gl-matrix';

let canvas = document.getElementById('canvas');
let drawn = 0;
let bounds, poisson;
let timeStamp;

window.addEventListener('resize', init, false);
init();

function init() {
    timeStamp = performance.now();
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    let scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;

    let ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    bounds = new Rectangle(0, 0, width, height);
    poisson = new Poisson(10, bounds);
    drawn = 0;
    window.requestAnimationFrame(update);
}

function update() {
    let count = 0;
    while (poisson.canExpand() && count < 500) {
        poisson.expand();
        count++;
    }
    draw();
    if (poisson.canExpand()) {
        window.requestAnimationFrame(update);
    } else {
        let ms = Math.round(performance.now() - timeStamp);
        console.log(`points: ${drawn}`);
        console.log(`time: ${ms}ms`);
        console.log(`points per ms: ${drawn / ms}`)
        drawDelaunayTriangulation();
    }
}

function draw() {
    let ctx = canvas.getContext('2d');

    for (let i = drawn; i < poisson.points.length; i++) {
        let point = poisson.points[i];
        ctx.fillRect(Math.floor(point[0]), Math.floor(point[1]), 2, 2);
    }

    drawn = poisson.points.length;
}

function drawDelaunayTriangulation() {
    let points = poisson.points;
    let delaunay = Delaunator.from(points);
    //forEachTriangeEdge(points, deluanay, drawEdge);
    forEachTriange(points, delaunay, drawTriangle);
}

function drawEdge(a, b) {
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
}

const scale = 6;
function drawTriangle(a, b, c) {
    //let color = Math.floor(Math.random() * 256);
    //let color = Math.floor(a[0] / window.innerWidth * 256);
    let vec = vec2.create();
    vec2.scale(vec, a, 1 / window.innerWidth);
    vec2.scale(vec, vec, scale);
    let color = Math.floor(perlinNoise(vec) * 256);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgba(${color}, ${color}, ${color}, 1)`;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.fill();
    ctx.stroke();
}

function nextHalfEdge(e) {
    return (e % 3 === 2) ? e - 2 : e + 1;
}

function prevHalfEdge(e) {
    return (e % 3 === 0) ? e + 2 : e - 1;
}

function forEachTriangeEdge(points, delaunay, callback) {
    let triangles = delaunay.triangles;
    let halfedges = delaunay.halfedges;
    for (let e = 0; e < halfedges.length; e++) {
        if (e < halfedges[e]) {
            let a = points[triangles[e]];
            let b = points[triangles[nextHalfEdge(e)]];
            callback(a, b);
        }
    }
}

function forEachTriange(points, delaunay, callback) {
    let triangles = delaunay.triangles;
    for(let e = 0; e < triangles.length; e += 3) {
        callback(points[triangles[e]], points[triangles[e + 1]], points[triangles[e + 2]]);
    }
}