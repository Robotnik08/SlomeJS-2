import { Sprite } from "./sprite.mjs";

export class Sprites {
    constructor () {
        this.sprites = {
            'slome': 'img/game/character/slome.png'
        };

        for (let key in this.sprites) {
            const sprite = new Sprite(this.sprites[key]);
            this.sprites[key] = sprite;
        }
    }

    getSprite(name) {
        return this.sprites[name] ? this.sprites[name] : null;
    }
}