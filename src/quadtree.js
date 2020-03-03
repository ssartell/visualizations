import Vector2 from './vector2.js';
import Rectangle from './rectangle.js';
import { MinHeap } from 'mnemonist';
import PriorityQueue from 'fastpriorityqueue';

let maxSEval = 0;
let maxPEval = 0;

export default class Quadtree {
    constructor(rect) {
        this.root = new Square(rect, 1);
        this.depth = 1;
    }

    log() {
        console.log(`${maxSEval},${maxPEval}`);
    }

    add(point) {
        this.depth = Math.max(this.depth, this.root.add(point));
    }

    anyPointWithin(point, radius) {
        let pEval = 0;
        let sEval = 0;
        let sqrRadius = radius * radius;
        let bounds = new Rectangle(point.x - radius, point.y - radius, 2 * radius, 2 * radius);
        let squares = [this.root];

        for(let i = 0; i < this.depth; i++) {
            for(let square of squares) {
                pEval++;
                if (square.hasPoint() 
                && bounds.contains(square.point) 
                && square.point.sqrDistanceFrom(point) < sqrRadius) {
                    maxPEval = Math.max(maxPEval, pEval);
                    maxSEval = Math.max(maxSEval, sEval);
                    return true;
                }
            }

            let newSquares = [];
            for(let square of squares) {
                if (!square.isLeaf()) {
                    for(let child of square.children) {
                        sEval++;
                        if (bounds.isOverlapping(child.bounds)) {
                            newSquares.push(child);
                        }
                    }
                }                
            }
            squares = newSquares;

            if (squares.length === 0) break
        }
        maxPEval = Math.max(maxPEval, pEval);
        maxSEval = Math.max(maxSEval, sEval);
        return false;
    }

    findNearestNeighbor(point) {
        let squares = [this.root];
        let closestDist = Infinity;
        let closest = null;

        for(let i = 0; i < this.depth; i++) {
            for(let square of squares) {
                if (square.hasPoint()) {
                    let dist = square.point.sqrDistanceFrom(point);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closest = square.point;
                    }
                }
            }

            let newSquares = [];
            for(let square of squares) {
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

    // findNearestNeighbor(point) {
    //     return this.findNearestNeighbors(point).next().value;
    // }

    // findNearestNeighbor(point) {
    //     let queue = new PriorityQueue((a, b) => a.sqrDistanceFrom(point) < b.sqrDistanceFrom(point));
    //     queue.add(this.root);

    //     while(queue.peek()) {
    //         let element = queue.poll();
    //         if (element instanceof Square) {
    //             if (element.point) queue.add(element.point);
    //             if (element.isLeaf()) continue;

    //             for(let child of element.children) {
    //                 queue.add(child);
    //             }
    //         } else if (element instanceof Vector2) {                   
    //             return element;
    //         }
    //     }
    // }

    // findNearestNeighborInner(point, square) {
    //     if (square.isLeaf()) {
    //         if (square.point.manhattanDistanceFrom(point) < best) {
                
    //         }
    //     } else {

    //     }
    // }

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
            } else if (element instanceof Vector2) {                   
                yield element;
            }
        }
    }

    // *findNearestNeighbors(point) {
    //     let queue = new MinHeap((a, b) => a.sqrDistanceFrom(point) - b.sqrDistanceFrom(point));
    //     queue.push(this.root);

    //     while(queue.peek()) {
    //         let element = queue.pop();
    //         if (element instanceof Square) {
    //             if (element.point) queue.push(element.point);
    //             if (element.isLeaf()) continue;

    //             for(let child of element.children) {
    //                 queue.push(child);
    //             }
    //         } else if (element instanceof Vector2) {                   
    //             yield element;
    //         }
    //     }
    // }

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