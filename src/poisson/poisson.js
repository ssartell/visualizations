import Vector2 from '../vector2';
import Rectangle from '../rectangle';
import Quadtree from '../quadtree';

export default class Poisson {
    constructor(r, bounds) {
        this.r = r;
        this.r2 = r * r;
        this.bounds = bounds;

        let startingPoint = new Vector2(canvas.width / 2, canvas.height / 2);
        this.points = [startingPoint];
        this.activePoints = [startingPoint];
        this.quadtree = new Quadtree(bounds);
        this.quadtree.addPoint(startingPoint);
    }

    canExpand() {
        return this.activePoints.length > 0;
    }

    expand() {
        let wasPointAdded = false;

        while (!wasPointAdded && this.canExpand()) {
            let i = Math.floor(Math.random() * this.activePoints.length);
            let active = this.activePoints[i];

            for (let j = 0; j < 30; j++) {
                let a = Math.random() * 2 * Math.PI;
                let rad = this.r * (1 + Math.random());

                let p = new Vector2(rad * Math.cos(a) + active.x, rad * Math.sin(a) + active.y);
                if (!this.bounds.contains(p)) continue;

                let nearestPoint = this.quadtree.findNearestNeighbor(p);
                let dist = nearestPoint.subtract(p).sqrMagnitude;
                if (dist > this.r2) {
                    this.points.push(p);
                    this.activePoints.push(p);
                    this.quadtree.addPoint(p);
                    wasPointAdded = true;
                    break;
                }
            }

            if (!wasPointAdded) {
                this.activePoints.splice(i, 1);
            }
        }
    }
}