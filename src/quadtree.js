import Vector2 from './vector2.js';
import Rectangle from './rectangle.js';
import { MinHeap } from 'mnemonist';

export default class Quadtree {
    constructor(rect) {
        this.root = new Square(rect, 1);
        this.depth = 1;
    }

    addPoint(point) {
        this.depth = Math.max(this.depth, this.root.addPoint(point));
    }

    *findNearestNeighbors(point) {
        let queue = new MinHeap((a, b) => a.distanceFrom(point) - b.distanceFrom(point));
        queue.push(this.root);

        while(queue.peek()) {
            let element = queue.pop();
            if (element instanceof Square) {
                if (element.point) queue.push(element.point);
                if (element.isLeaf()) continue;

                for(let child of element.children) {
                    queue.push(child);
                }
            } else if (element instanceof Vector2) {
                while(queue.peek() === element)
                    queue.pop();
                    
                yield element;
            }
        }
    }

    findNearestNeighbor(point) {
        let squares = [this.root];
        let dist = Infinity;
        let closest = null;

        for(let i = 1; i <= this.depth; i++) {
            for(let square of squares) {
                if (square.point) {
                    let newDist = square.point.subtract(point).magnitude;
                    if (newDist < dist) {
                        dist = newDist;
                        closest = square.point;
                    }
                }
            }

            let newSquares = [];
            for(let square of squares) {
                if (square.children) {
                    for(let child of square.children) {
                        if (child.bounds.distanceFrom(point) <= dist) {
                            newSquares.push(child);
                        }
                    }
                }                
            }
            squares = newSquares;
        }
        return closest;
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

    distanceFrom(point) {
        return this.bounds.distanceFrom(point);
    }

    addPoint(point) {
        if (!this.bounds.contains(point)) return this.depth;

        if (!this.point) {
            this.point = point;
            return this.depth;
        } else {
            if (this.isLeaf()) {
                this.children = this.split();
                this.children.find(x => x.contains(this.point)).addPoint(this.point);
            }
                    
            return this.children.find(x => x.contains(point)).addPoint(point);
        }
    }

    isLeaf() {
        return !this.children;
    }

    findSquare(point) {
        if (this.isLeaf()) return this;

        return this.children.find(x => x.contains(point)).findSquare(point);
    }

    split() {
        let width = this.bounds.width / 2;
        let height = this.bounds.height / 2;
        return [
            new Square(new Rectangle(this.bounds.x, this.bounds.y, width, height), this.depth + 1),
            new Square(new Rectangle(this.bounds.x + width, this.bounds.y, width, height), this.depth + 1),
            new Square(new Rectangle(this.bounds.x, this.bounds.y + height, width, height), this.depth + 1),
            new Square(new Rectangle(this.bounds.x + width, this.bounds.y + height, width, height), this.depth + 1),
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