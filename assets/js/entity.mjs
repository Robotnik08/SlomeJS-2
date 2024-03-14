import { Vector2 } from "./vector.mjs";

export class Entity {
    constructor (position, sprite, size = null) {
        this.position = position;
        this.projectedPosition = position;
        this.sprite = sprite;

        this.velocity = Vector2.zero;

        this.size = size ? size : Vector2.one;
    }

    fixedUpdate () {
        // 60 times per second
    }

    update (dt) {
        // interpolate position based on delta time
        this.projectedPosition = Vector2.interpolate(this.projectedPosition, this.position, dt);
    }
}