export default class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static from(vec) {
        return new Vector2(vec.x, vec.y);
    }

    static zero() {
        return new Vector2(0, 0);
    }

    add(vec) {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }

    subtract(vec) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }

    scale(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    sqrDistanceFrom(point) {
        return this.subtract(point).sqrMagnitude;
    }

    distanceFrom(point) {
        return this.subtract(point).magnitude;
    }

    manhattanDistanceFrom(point) {
        return Math.abs(this.x - point.x) + Math.abs(this.y - point.y);
    }

    asArray() {
        return [this.x, this.y];
    }

    get sqrMagnitude() {
        return this.x * this.x + this.y * this.y;
    }

    get magnitude() {
        return Math.sqrt(this.sqrMagnitude);
    }

    get normalized() {
        return Vector2.from(this).scale(1 / this.magnitude);
    }

    get abs() {
        return new Vector2(Math.abs(this.x), Math.abs(this.y));
    }
}