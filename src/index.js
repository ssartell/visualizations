let canvas = document.getElementById('canvas');

let width, height;

let verts, edges, drawn;
let growRate = 1;

window.addEventListener('resize', resetTree, false);
initTree();

function initTree() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;

    verts = [];
    edges = [];
    drawn = 0;
    verts.push({x: width / 2, y: height / 2});
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
    for(let i = 0; i < 50; i++) {
        let point = { x: Math.random() * width, y: Math.random() * height };
        let closestIndex = findClosestVertIndex(verts, point);
        let vert = verts[closestIndex];
        let vec = subtract(point, vert);
        let dir = unit(vec);
        let branch = add(vert, scale(dir, growRate));
    
        verts.push(branch);
        edges.push([closestIndex, verts.length - 1]);
    }
    draw();
    window.requestAnimationFrame(growTree);
}

function draw() {
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        
        for(let i = drawn; i < edges.length; i++) {
            let edge = edges[i];
            let a = verts[edge[0]];
            let b = verts[edge[1]];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }

        drawn = edges.length;
    }
}

function findClosestVertIndex(verts, p) {
    return verts.reduce((a, x, i) => {
        let d = dist(p, x);
        if (d < a.dist) {
            return { dist: d, index: i };
        } else {
            return a;
        }
    }, { dist: Infinity, index: null }).index;
}

function length(vec) {
    return dist({x: 0, y: 0}, vec);
}

function dist(a, b) {
    return Math.sqrt(sqrDist(a, b));
}

function sqrDist(a, b) {
    let x = a.x - b.x;
    let y = a.y - b.y;
    return x * x + y * y;
}

function unit(vec) {
    return scale(vec, 1 / length(vec));
}

function scale(vec, scalar) {
    return { x: vec.x * scalar, y: vec.y * scalar };
}

function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}

function subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y };
}