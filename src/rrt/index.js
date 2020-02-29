import Vector2 from '../vector2';
import Rrt from './rapidly-exploring-random-tree';
import { Vector } from 'mnemonist';

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rrt;
let drawn = 0;
let growthRate = 1;
let startDate = new Date();

window.addEventListener('resize', resetTree, false);
initTree();

function initTree() {
    rrt = new Rrt([
        new Vector2(canvas.width / 4, canvas.height / 4),
        new Vector2(canvas.width / 4 * 3, canvas.height / 4 * 3)
    ], canvas.width, canvas.height);
    drawn = 0;
    window.requestAnimationFrame(growTree);
}

function resetTree() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initTree();
}

function growTree() {
    for(let i = 0; i < 1000; i++) {
        let point = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
        rrt.grow(point, growthRate);
    }
    draw();
    window.requestAnimationFrame(growTree);
}

function draw() {
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        
        for(let i = drawn; i < rrt.edges.length; i++) {
            let edge = rrt.edges[i];
            let a = edge[0];
            let b = edge[1];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }

        drawn = rrt.edges.length;

        if (drawn % 1000000 === 0) {
            console.log(`${drawn}: ${(new Date() - startDate) / 1000}s`);
        }
        
        if (drawn === 200) {
            //rrt.quadtree.draw(ctx);
            console.log(rrt.quadtree.depth);
            let neighbors = rrt.quadtree.findNearestNeighbors(new Vector2(0, 0));
            console.log(Array.from(neighbors).map(x => x.magnitude));
        }
    }
}