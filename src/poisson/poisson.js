import Rectangle from '../rectangle';
import Quadtree from '../quadtree';
import { vec2 } from 'gl-matrix';

export default class Poisson {
    constructor(radius, bounds) {
        this.radius = radius;
        this.sqrRadius = radius * radius;
        this.bounds = bounds;

        let startingPoint = vec2.fromValues(bounds.width / 2, bounds.height / 2);
        this.points = [startingPoint];
        this.spawnPoints = [startingPoint];
        this.quadtree = new Quadtree(bounds);
        this.quadtree.add(startingPoint);

        this.deltas = [];
        for(let i = 0; i < 1000; i++) {
            let angle = 2 * Math.PI * Math.random();
            let radius = this.radius * (1 + Math.random());
            this.deltas.push(vec2.fromValues(radius * Math.cos(angle), radius * Math.sin(angle)));
        }
    }

    canExpand() {
        return this.spawnPoints.length > 0;
    }

    expand() {
        let candidateAccepted = false;
        let candidate = vec2.create();

        while (!candidateAccepted && this.canExpand()) {
            let spawn = this.spawnPoints.shift();

            for (let j = 0; j < 30; j++) {
                // let angle = 2 * Math.PI * Math.random();
                // let radius = this.radius * (1 + Math.random());
                // let candidate = new Vector2(radius * Math.cos(angle) + spawn.x, radius * Math.sin(angle) + spawn.y);

                let i = Math.floor(1000 * Math.random());
                vec2.add(candidate, this.deltas[i], spawn);

                if (this.isValid(candidate)) {
                    let point = vec2.clone(candidate);
                    this.points.push(point);
                    this.spawnPoints.push(point);
                    this.quadtree.add(point);
                    candidateAccepted = true;
                }
            }
        }
    }

    isValid(candidate) {
        if (!this.bounds.contains(candidate)) return false;
        
        return !this.quadtree.anyPointWithin(candidate, this.radius);
    }
}