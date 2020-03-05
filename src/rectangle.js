import { vec2 } from 'gl-matrix';

export default class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.x2 = x + width;
        this.y = y;
        this.y2 = y + height;
        this.width = width;
        this.height = height;
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        this.center = vec2.fromValues(this.x + this.halfWidth, this.y + this.halfHeight);
    }

    contains(point) {
        return this.x <= point[0] && point[0] <= this.x2 
            && this.y <= point[1] && point[1] <= this.y2;
    }

    isOverlapping(rect) {
        return this.x <= rect.x2 && rect.x <= this.x2
            && this.y <= rect.y2 && rect.y <= this.y2;
    }

    distanceFrom(point) {
        return Math.sqrt(this.sqrDistanceFrom(point));
    }

    sqrDistanceFrom(point) {
        let px = Math.max(0, Math.abs(point[0] - this.center[0]) - this.halfWidth);
        let py = Math.max(0, Math.abs(point[1] - this.center[1]) - this.halfHeight);
        return px * px + py * py;
    }
}