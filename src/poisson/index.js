import Vector2 from '../vector2';
import Rectangle from '../rectangle';
import Quadtree from '../quadtree';
import Poisson from './poisson';

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let drawn = 0;
let bounds, poisson;

window.requestAnimationFrame(expand);
window.addEventListener('resize', init, false);
init();

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bounds = new Rectangle(0, 0, canvas.width, canvas.height);
    poisson = new Poisson(10, bounds);
    drawn = 0;
    window.requestAnimationFrame(expand);
}

function expand() {
    let count = 0;
    while(poisson.canExpand() && count < 100) {
        poisson.expand();
        count++;
    }
    draw();
    if (poisson.canExpand())
        window.requestAnimationFrame(expand);
}

function draw() {
    var ctx = canvas.getContext('2d');
    for(let i = drawn; i < poisson.points.length; i++) {
        let point = poisson.points[i];
        ctx.beginPath();
        ctx.arc(Math.round(point.x), Math.round(point.y), 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
}