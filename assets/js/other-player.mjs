import { Entity } from './entity.mjs';

export class OtherPlayer extends Entity {
    constructor (position, sprite, size, id) {
        super(position, sprite, size, id);

        this.multi_ghost = true;
    }
}