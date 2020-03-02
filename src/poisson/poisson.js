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
    }

    canExpand() {
        return this.spawnPoints.length > 0;
    }

    expand() {
        let candidateAccepted = false;

        while (!candidateAccepted && this.canExpand()) {
            let spawn = this.spawnPoints.pop();

            for (let j = 0; j < 30; j++) {
                let angle = 2 * Math.PI * Math.random();
                let radius = this.radius * (1 + Math.random());
                let candidate = new Vector2(radius * Math.cos(angle) + spawn.x, radius * Math.sin(angle) + spawn.y);

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
        
        let nearestPoint = this.quadtree.findNearestNeighbor(candidate);
        let sqrDist = nearestPoint.subtract(candidate).sqrMagnitude;
        
        return sqrDist > this.sqrRadius;
    }
}