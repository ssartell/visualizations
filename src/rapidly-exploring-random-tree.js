import Quadtree from './quadtree';
import Rectangle from './rectangle';

export default class RapidlyExploringRandomTree {
    constructor(points, width, height) {
        this.verts = points || [];
        this.edges = [];
        this.quadtree = new Quadtree(new Rectangle(0, 0, width, height))
    }

    grow(point, growthRate) {
        let closestIndex = this.findClosestVertexIndex(point);
        let vert = this.verts[closestIndex];
        let vec = point.subtract(vert);
        let dir = vec.normalized;
        let newVert = vert.add(dir.scale(growthRate));

        this.verts.push(newVert);
        this.edges.push([closestIndex, this.verts.length - 1]);
        this.quadtree.addPoint(newVert);
    }

    findClosestVertexIndex(point) {
        return this.verts.reduce((a, x, i) => {
            let d = point.subtract(x).sqrMagnitude;
            return (d < a.dist) 
                ? { dist: d, index: i } 
                : a;
        }, { dist: Infinity, index: null }).index;
    }
}