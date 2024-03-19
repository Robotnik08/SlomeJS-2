import { Vector2 } from './vector.mjs';

export class HitBox {
    constructor (position, size, bounds = null) {
        this.position = position;
        this.size = size;

        if (bounds === null) {
            this.topLeft = position;
            this.topRight = position.add(new Vector2(size.x, 0));
            this.bottomLeft = position.add(new Vector2(0, size.y));
            this.bottomRight = position.add(size);
        } else {
            this.topLeft = bounds[0];
            this.topRight = bounds[1];
            this.bottomLeft = bounds[2];
            this.bottomRight = bounds[3];
        }

        this.list = [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight];
    }
}