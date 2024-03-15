import { Entity } from './entity.mjs';

export class Player extends Entity {
    constructor (position, sprite, size) {
        super(position, sprite, size);

        this.speed = 25;
        this.jumpStrength = 1;
    }

    move (input, dt) {
        if (input.getKey('KeyA')) {
            this.velocity.x = -this.speed * dt;
        }
        if (input.getKey('KeyD')) {
            this.velocity.x = this.speed * dt;
        }
        if (input.getKey('Space')) {
            this.velocity.y -= this.jumpStrength;
        }
    }

    fixedUpdate (world) {
        super.fixedUpdate();
    }

    update (dt) {
        super.update(dt);
    }

    physics (world) {

        this.position = this.position.add(this.velocity.divide(60));

        this.velocity.x *= 0.9;
        this.velocity.y += world.gravity * 0.00000004;
    }
}