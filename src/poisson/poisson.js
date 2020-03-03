import Vector2 from '../vector2';
import Rectangle from '../rectangle';
import Quadtree from '../quadtree';

export default class Poisson {
    constructor(radius, bounds) {
        this.radius = radius;
        this.sqrRadius = radius * radius;
        this.bounds = bounds;

        let startingPoint = new Vector2(bounds.width / 2, bounds.height / 2);
        this.points = [startingPoint];
        this.spawnPoints = [startingPoint];
        this.quadtree = new Quadtree(bounds);
        this.quadtree.add(startingPoint);

        this.xs = [];
        this.ys = [];
        for(let i = 0; i < 1000; i++) {
            let angle = 2 * Math.PI * Math.random();
            let radius = this.radius * (1 + Math.random());
            this.xs.push(radius * Math.cos(angle));
            this.ys.push(radius * Math.sin(angle));
        }
    }

    canExpand() {
        return this.spawnPoints.length > 0;
    }

    expand() {
        let candidateAccepted = false;

        while (!candidateAccepted && this.canExpand()) {
            let spawn = this.spawnPoints.shift();

            for (let j = 0; j < 30; j++) {
                // let angle = 2 * Math.PI * Math.random();
                // let radius = this.radius * (1 + Math.random());
                // let candidate = new Vector2(radius * Math.cos(angle) + spawn.x, radius * Math.sin(angle) + spawn.y);

                let i = Math.floor(1000 * Math.random());
                let candidate = new Vector2(this.xs[i] + spawn.x, this.ys[i] + spawn.y);

                if (this.isValid(candidate)) {
                    this.points.push(candidate);
                    this.spawnPoints.push(candidate);
                    this.quadtree.add(candidate);
                    candidateAccepted = true;
                }
            }
        }
    }

    isValid(candidate) {
        if (!this.bounds.contains(candidate)) return false;
        
        return !this.quadtree.anyPointWithin(candidate, this.radius);
        //let nearestPoint = this.quadtree.findNearestNeighbor(candidate);
        //let sqrDist = nearestPoint.subtract(candidate).sqrMagnitude;
        
        //return sqrDist > this.sqrRadius;
    }
}