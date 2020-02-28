import Quadtree from '../quadtree.js';
import Rectangle from '../rectangle.js';
import Vector2 from '../vector2.js';

export default class RapidlyExploringRandomTree {
    constructor(points, width, height, gridAligned = false) {
        this.edges = [];
        this.quadtree = new Quadtree(new Rectangle(0, 0, width, height));
        for(let point of points) {
            this.quadtree.addPoint(point);
        }
        this.gridAligned = gridAligned
    }

    grow(point, growthRate) {
        let closest = this.quadtree.findNearestNeighbor(point);
        let vec = point.subtract(closest);
        let dir = null;
        if (this.gridAligned) {
            if (Math.abs(vec.x) > Math.abs(vec.y)) {
                dir = new Vector2(Math.min(growthRate, Math.abs(vec.x)) * Math.sign(vec.x), 0);
            } else {
                dir = new Vector2(0, Math.min(growthRate, Math.abs(vec.y)) * Math.sign(vec.y));
            }
        } else {
            dir = vec.normalized.scale(Math.min(growthRate, vec.magnitude));
        }
        //let dir = vec.normalized.scale(Math.min(growthRate, vec.magnitude));
        let newVert = closest.add(dir);

        this.edges.push([closest, newVert]);
        this.quadtree.addPoint(newVert);
    }
}