import { Entity } from './entity.mjs';

export class Player extends Entity {
    constructor (position, sprite, size) {
        super(position, sprite, size);

        this.speed = 3;
    }

    move (input) {
        if (input.getKey('KeyW')) {
            this.velocity.y = -this.speed;
        }
        if (input.getKey('KeyS')) {
            this.velocity.y = this.speed;
        }
        if (input.getKey('KeyA')) {
            this.velocity.x = -this.speed;
        }
        if (input.getKey('KeyD')) {
            this.velocity.x = this.speed;
        }
    }

    fixedUpdate () {
        super.fixedUpdate();
        this.position = this.position.add(this.velocity.divide(60));
        this.velocity = this.velocity.multiply(0.9);
    }

    update (dt) {
        super.update(dt);
    }
}