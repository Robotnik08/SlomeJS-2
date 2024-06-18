import { Entity } from './entity.mjs';
import { Vector2 } from './vector.mjs';
import { HitBox } from './hitbox.mjs';

export class OtherPlayer extends Entity {
    IS_OTHER_PLAYER = true;
    
    constructor (position, sprite, size, id) {
        super(position, sprite, size, id);
        
        this.angle = 0;
        this.selectedType = 0;

        this.hitbox = new HitBox(new Vector2(-0.38, -0.33), new Vector2(0.76, 0.76));

    }
}