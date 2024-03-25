export class Vector2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
    
    add (vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }
    
    subtract (vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }
    
    multiply (scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    
    divide (scalar) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }
    
    get magnitude () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    get normalized () {
        return this.divide(this.magnitude);
    }
    
    static get zero () {
        return new Vector2(0, 0);
    }
    
    static get one () {
        return new Vector2(1, 1);
    }
    
    static get up () {
        return new Vector2(0, -1);
    }
    
    static get down () {
        return new Vector2(0, 1);
    }
    
    static get left () {
        return new Vector2(-1, 0);
    }
    
    static get right () {
        return new Vector2(1, 0);
    }

    static interpolate (a, b, t) {
        t = Math.max(0, Math.min(1, t));
        return new Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    }

    toVector3 () {
        return new Vector3(this.x, this.y, 0);
    }

    toString () {
        return `Vec2(${this.x}, ${this.y})`;
    }

    round () {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }

    floor () {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }

    ceil () {
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
    }

    equals (vector) {
        return this.x === vector.x && this.y === vector.y;
    }
}

export class Vector3 {
    constructor (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    add (vector) {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }
    
    subtract (vector) {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }
    
    multiply (scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    
    divide (scalar) {
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    }
    
    get magnitude () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    
    get normalized () {
        return this.divide(this.magnitude);
    }
    
    static get zero () {
        return new Vector3(0, 0, 0);
    }
    
    static get one () {
        return new Vector3(1, 1, 1);
    }

    toVector2 () {
        return new Vector2(this.x, this.y);
    }

    toString () {
        return `Vec3(${this.x}, ${this.y}, ${this.z})`;
    }

    round () {
        return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
    }

    floor () {
        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }

    ceil () {
        return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
    }

    equals (vector) {
        return this.x === vector.x && this.y === vector.y && this.z === vector.z;
    }
}