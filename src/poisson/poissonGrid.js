import Vector2 from '../vector2';
import Rectangle from '../rectangle';

export default class PoissonGrid {
    constructor(radius, bounds) {
        this.radius = radius;
        this.sqrRadius = radius * radius;
        this.cellSize = radius / Math.sqrt(2);
        this.bounds = bounds;

        let startingPoint = new Vector2(bounds.halfWidth, bounds.halfHeight);
        this.points = [startingPoint];
        this.spawnPoints = [startingPoint];

        // init grid
        let rows = Math.ceil(bounds.width / this.cellSize);
        let cols = Math.ceil(bounds.height / this.cellSize);
        this.grid = new Array(Math.ceil(rows));
        for(let i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(cols);
        }
    }

    canExpand() {
        return this.spawnPoints.length > 0;
    }

    expand() {
        let candidateAccepted = false;

        while (!candidateAccepted && this.canExpand()) {
            let i = Math.floor(Math.random() * this.spawnPoints.length);
            let spawn = this.spawnPoints[i];

            for (let j = 0; j < 30; j++) {
                let a = Math.random() * 2 * Math.PI;
                let rad = this.radius * (1 + Math.random());
                let candidate = new Vector2(rad * Math.cos(a) + spawn.x, rad * Math.sin(a) + spawn.y);

                if (this.isValid(candidate)) {
                    this.points.push(candidate);
                    this.spawnPoints.push(candidate);
                    this.grid[Math.floor(candidate.x / this.cellSize)][Math.floor(candidate.y / this.cellSize)] = this.points.length - 1;
                    candidateAccepted = true;
                }
            }

            if (!candidateAccepted) {
                this.spawnPoints.splice(i, 1);
            }
        }
    }

    isValid(candidate) {
        if (!this.bounds.contains(candidate)) return false;

        let cellX = Math.floor(candidate.x / this.cellSize);
        let cellY = Math.floor(candidate.y / this.cellSize);
        let minX = Math.max(0, cellX - 2);
        let maxX = Math.min(cellX + 2, this.grid.length - 1);
        let minY = Math.max(0, cellY - 2);
        let maxY = Math.min(cellY + 2, this.grid[0].length - 1);

        for(let x = minX; x <= maxX; x++) {
            for(let y = minY; y <= maxY; y++) {
                let index = this.grid[x][y];
                if (index !== undefined) {
                    let dist = candidate.subtract(this.points[index]).sqrMagnitude;
                    if (dist < this.sqrRadius) {
                        return false;
                    }
                }
            }    
        }
        return true;
    }
}