import { Entity } from "./entity.mjs";
import { Vector2 } from "./vector.mjs";
import { HitBox } from "./hitbox.mjs";

export class BreakParticle extends Entity {
    IS_BREAK_PARTICLE = true;

    constructor (position, size, color) {
        super(position, null, size);
        
        this.usesSprite = false;
        this.color = color.copy();

        this.hitbox = new HitBox(new Vector2(0, 0), size);

        this.hasPhysics = true;

        this.velocity.x = (Math.random() * 2 - 1) * 10;
        this.velocity.y = (Math.random()) * -5;

        this.lifetime = 0;
        this.maxLifetime = 50;
    }

    fixedUpdate () {
        super.fixedUpdate();

        this.lifetime++;
        this.color.a = 1 - this.lifetime / this.maxLifetime;
        if (this.lifetime >= this.maxLifetime) {
            this.destroy();
        }
    }
    
    static spawnGroup (position, size, color, count) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new BreakParticle(position, size, color));
        }
        return particles;
    }
}