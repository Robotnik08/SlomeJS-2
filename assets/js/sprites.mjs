import { Sprite } from "./sprite.mjs";

export class Sprites {
    constructor () {

        this.missing = new Sprite('img/game/tiles/MissingBlock.png');

        this.sprites = {

            'slome': 'img/game/character/slome.png'
        };

        this.tiles = [
            'img/game/tiles/grass.png',
            'img/game/tiles/dirt.png',
            'img/game/tiles/stone.png',
        ];

        for (let key in this.sprites) {
            const sprite = new Sprite(this.sprites[key]);
            this.sprites[key] = sprite;
        }

        this.tiles.forEach((tile, index) => {
            const sprite = new Sprite(tile);
            this.tiles[index] = sprite;
        });	
    }

    getSprite(name) {
        return this.sprites[name] ? this.sprites[name] : this.missing;
    }

    getTile(index) {
        return this.tiles[index - 1] ? this.tiles[index - 1] : this.missing;
    }
}