import Vector2 from '../vector2';
import Rectangle from '../rectangle';
import Quadtree from '../quadtree';
import Poisson from './poisson';
import PoissonGrid from './poissonGrid';

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
    poisson = new Poisson(5, bounds);
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
        poisson.quadtree.log();
    }
}

function draw() {
    let ctx = canvas.getContext('2d');
    for(let i = drawn; i < poisson.points.length; i++) {
        let point = poisson.points[i];
        ctx.beginPath();
        ctx.fillRect(Math.floor(point.x), Math.floor(point.y), 2, 2);
        ctx.stroke();
    }

    drawn = poisson.points.length;
}