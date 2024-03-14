import { Vector2 } from './vector.mjs';

export class Sprite {
    constructor (url) {
        this.image = new Image();
        this.image.src = url;

        this.size = Vector2.zero;
        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
            this.size = new Vector2(this.image.width, this.image.height);
        };
    }

    get width () {
        return this.size.x;
    }

    get height () {
        return this.size.y;
    }

    get center () {
        return this.size.divide(2);
    }

    get bottomRight () {
        return this.size;
    }

    get bottomLeft () {
        return new Vector2(0, this.size.y);
    }

    get topLeft () {
        return Vector2.zero;
    }

    get topRight () {
        return new Vector2(this.size.x, 0);
    }
}