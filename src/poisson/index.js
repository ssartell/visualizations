import Vector2 from '../vector2';
import Rectangle from '../rectangle';
import Quadtree from '../quadtree';
import Poisson from './poisson';
import PoissonGrid from './poissonGrid';
import Delaunator from 'delaunator';

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
    poisson = new Poisson(2, bounds);
    drawn = 0;
    window.requestAnimationFrame(update);
}

function update() {
    let count = 0;
    while(poisson.canExpand() && count < 500) {
        poisson.expand();
        count++;
    }
    draw();
    if (poisson.canExpand()) {
        window.requestAnimationFrame(update);
    } else {
        console.log(`points: ${drawn}`);
        console.log(`time: ${Math.round(performance.now() - timeStamp)}ms`);
        //drawDelaunayTriangulation();
    }
}

function draw() {
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    for(let i = drawn; i < poisson.points.length; i++) {
        let point = poisson.points[i];
        ctx.fillRect(Math.floor(point.x), Math.floor(point.y), 2, 2);
    }
    ctx.stroke();

    drawn = poisson.points.length;
}

function drawDelaunayTriangulation() {
    let points = poisson.points.map(x => x.toArray());
    let delaunator = Delaunator.from(points);
    let triangles = delaunator.triangles;
    let ctx = canvas.getContext('2d');
    for (let i = 0; i < triangles.length; i += 3) {
        ctx.beginPath();
        ctx.moveTo(points[triangles[i]][0], points[triangles[i]][1]);
        ctx.lineTo(points[triangles[i+1]][0], points[triangles[i+1]][1]);
        ctx.lineTo(points[triangles[i+2]][0], points[triangles[i+2]][1]);
        ctx.lineTo(points[triangles[i]][0], points[triangles[i]][1]);
        ctx.stroke();
    }
}