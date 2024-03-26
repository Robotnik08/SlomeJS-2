import { Entity } from './entity.mjs';
import { Vector2 } from './vector.mjs';
import { HitBox } from './hitbox.mjs';

export class OtherPlayer extends Entity {
    constructor (position, sprite, size, id) {
        super(position, sprite, size, id);

        this.hitbox = new HitBox(new Vector2(-0.38, -0.33), new Vector2(0.76, 0.76));

        this.multi_ghost = true;
    }
}