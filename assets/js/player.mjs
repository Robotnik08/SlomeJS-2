import { Entity } from './entity.mjs';
import { Vector2 } from './vector.mjs';
import { HitBox } from './hitbox.mjs';

export class Player extends Entity {
    
    IS_PLAYER = true;

    constructor (position, sprite, size) {
        super(position, sprite, size);

        this.hasPhysics = true;

        this.hitbox = new HitBox(new Vector2(-0.38, -0.33), new Vector2(0.76, 0.76));

        this.max_speed = 4;
        this.acceleration = 0.09;
        this.jumpStrength = 12;

        this.selectedType = 0;
        this.angle = 0;
    }

    move (input, dt) {
        if (input.getKey('KeyA')) {
            this.velocity.x -= this.acceleration * dt * 640;
            if (this.velocity.x < -this.max_speed) this.velocity.x = -this.max_speed;
        }
        if (input.getKey('KeyD')) {
            this.velocity.x += this.acceleration * dt * 640;
            if (this.velocity.x > this.max_speed) this.velocity.x = this.max_speed;
        }
        if (input.getKey('Space') && this.is_grounded) {
            this.velocity.y = -this.jumpStrength;
        }
    }

    fixedUpdate (world) {
        super.fixedUpdate();
    }

    update (dt) {
        super.update(dt);
    }
}