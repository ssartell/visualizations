import Vector2 from './vector2';
import Rectangle from './rectangle';

export default class Quadtree {
    constructor(rect) {
        this.root = new Square(rect);
    }

    addPoint(point) {
        this.root.addPoint(point);
    }

    findNearestNeighbor(point) {
        return this.root.findNearestNeighbor(point);
    }

    draw(ctx) {
        this.root.draw(ctx);
        this.findNearestNeighbor(new Vector2(0, 0));
    }
}

class Square {
    constructor(rect) {
        this.bounds = rect;
    }

    contains(point) {
        return this.bounds.contains(point);
    }

    addPoint(point) {
        if (!this.bounds.contains(point)) return;

        if (!this.point) {
            this.point = point;
        } else {
            if (!this.children) {
                this.children = this.split();
                this.children.find(x => x.contains(this.point)).addPoint(this.point);
            }
                    
            this.children.find(x => x.contains(point)).addPoint(point);
        }
    }

    findSquare(point) {
        if (!this.children) return this;

        return this.children.find(x => x.contains(point)).findSquare(point);
    }

    findNearestNeighbor(point) {
        if (!this.point) return;

        let dist = this.point.subtract(point).magnitude;
        
        for(let child of this.children) {
            let d = child.bounds.distanceToPoint(point);
            if (d <= dist) {

            }
        }
        debugger;
    }

    split() {
        let width = this.bounds.width / 2;
        let height = this.bounds.height / 2;
        return [
            new Square(new Rectangle(this.bounds.x, this.bounds.y, width, height)),
            new Square(new Rectangle(this.bounds.x + width, this.bounds.y, width, height)),
            new Square(new Rectangle(this.bounds.x, this.bounds.y + height, width, height)),
            new Square(new Rectangle(this.bounds.x + width, this.bounds.y + height, width, height)),
        ];
    }

    draw(ctx) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';

        if (this.point) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        }

        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

        if (this.children) {
            for(let child of this.children) {
                child.draw(ctx);
            }
        }        
    }
}