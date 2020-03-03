import Vector2 from './vector2.js';

export default class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        this.center = new Vector2(this.x + this.halfWidth, this.y + this.halfHeight);
    }

    contains(point) {
        return this.x <= point.x && point.x <= this.x + this.width 
            && this.y <= point.y && point.y <= this.y + this.height;
    }

    isOverlapping(rect) {
        return this.x < rect.x + rect.width && rect.x < this.x + this.width
            && this.y < rect.y + rect.height && rect.y < this.y + this.height;
    }

    distanceFrom(point) {
        return Math.sqrt(this.sqrDistanceFrom(point));
    }

    sqrDistanceFrom(point) {
        let px = Math.max(0, Math.abs(point.x - this.center.x) - this.halfWidth);
        let py = Math.max(0, Math.abs(point.y - this.center.y) - this.halfHeight);
        return px * px + py * py;
    }
}