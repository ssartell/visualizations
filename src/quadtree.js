import Rectangle from './rectangle.js';
import { MinHeap } from 'mnemonist';
import PriorityQueue from 'fastpriorityqueue';
import { vec2 } from 'gl-matrix';

export default class Quadtree {
    constructor(rect) {
        this.root = new Square(rect, 1);
        this.depth = 1;
    }

    add(point) {
        this.depth = Math.max(this.depth, this.root.add(point));
    }

    anyPointWithin(point, radius) {
        let sqrRadius = radius * radius;
        let bounds = new Rectangle(point[0] - radius, point[1] - radius, 2 * radius, 2 * radius);
        let squares = [this.root];

        for(let d = 0; d < this.depth; d++) {
            let newSquares = [];

            for(let i = 0; i < squares.length; i++) {
                let square = squares[i];

                if (square.hasPoint() 
                && bounds.contains(square.point)
                && vec2.squaredDistance(square.point, point) < sqrRadius) {
                    return true;
                }

                if (!square.isLeaf()) {
                    for(let j = 0; j < square.children.length; j++) {
                        let child = square.children[j];
                        if (bounds.isOverlapping(child.bounds)) {
                            newSquares.push(child);
                        }
                    }
                } 
            }
            squares = newSquares;

            if (squares.length === 0) break;
        }
        return false;
    }

    findNearestNeighbor(point) {
        let squares = [this.root];
        let closestDist = Infinity;
        let closest = null;

        for(let d = 0; d < this.depth; d++) {
            for(let i = 0; i < squares.length; i++) {
                let square = squares[i];
                if (square.hasPoint()) {
                    let dist = square.point.sqrDistanceFrom(point);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closest = square.point;
                    }
                }

                if (!square.isLeaf()) {
                    for(let child of square.children) {
                        if (child.sqrDistanceFrom(point) <= closestDist) {
                            newSquares.push(child);
                        }
                    }
                }
            }
            
            squares = newSquares;
            if (squares.length === 0) break;
        }
        return closest;
    }

    findNearestKNeighbors(point, k) {
        let i = 0;
        let neighbors = [];
        for(let neighbor of this.findNearestNeighbors(point)) {
            if (i >= k) break;

            neighbors.push(neighbor);
            i++;
        }

        return neighbors;
    }

    *findNearestNeighbors(point) {
        let queue = new PriorityQueue((a, b) => a.sqrDistanceFrom(point) < b.sqrDistanceFrom(point));
        queue.add(this.root);

        while(queue.peek()) {
            let element = queue.poll();
            if (element instanceof Square) {
                if (element.point) queue.add(element.point);
                if (element.isLeaf()) continue;

                for(let child of element.children) {
                    queue.add(child);
                }
            } else {                   
                yield element;
            }
        }
    }

    draw(ctx) {
        this.root.draw(ctx);
    }
}

class Square {
    constructor(rect, depth) {
        this.bounds = rect;
        this.depth = depth;
    }

    contains(point) {
        return this.bounds.contains(point);
    }

    sqrDistanceFrom(point) {
        return this.bounds.sqrDistanceFrom(point);
    }

    hasPoint() {
        return this.point !== undefined;
    }

    add(point) {
        if (!this.bounds.contains(point)) return this.depth;

        if (!this.hasPoint()) {
            this.point = point;
            return this.depth;
        } else {
            if (this.isLeaf()) {
                this.children = this.split();
            }
                    
            return this.children.find(x => x.contains(point)).add(point);
        }
    }

    isLeaf() {
        return this.children === undefined;
    }

    findSquare(point) {
        if (this.isLeaf()) return this;

        return this.children.find(x => x.contains(point)).findSquare(point);
    }

    split() {
        let width = this.bounds.halfWidth;
        let height = this.bounds.halfHeight;
        let depth = this.depth + 1;
        return [
            new Square(new Rectangle(this.bounds.x, this.bounds.y, width, height), depth),
            new Square(new Rectangle(this.bounds.center[0], this.bounds.y, width, height), depth),
            new Square(new Rectangle(this.bounds.x, this.bounds.center[1], width, height), depth),
            new Square(new Rectangle(this.bounds.center[0], this.bounds.center[1], width, height), depth),
        ];
    }

    draw(ctx) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';

        if (this.point) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        }

        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

        if (!this.isLeaf()) {
            for(let child of this.children) {
                child.draw(ctx);
            }
        }        
    }
}