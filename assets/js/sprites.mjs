import { Sprite } from "./sprite.mjs";
import { Vector2 } from "./vector.mjs";

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

        this.dark_tiles = [];

        for (let key in this.sprites) {
            const sprite = new Sprite(this.sprites[key]);
            this.sprites[key] = sprite;
        }

        // dark tiles (for background tiles)
        this.tiles.forEach((tile, index) => {
            const sprite = new Sprite(tile);
            this.tiles[index] = sprite;

            const darkTile = new Sprite(tile);
            darkTile.image.onload = () => {
                if (darkTile.loaded) return;
                darkTile.loaded = true;
                darkTile.size = new Vector2(darkTile.image.width, darkTile.image.height);
                
                const canvas = document.createElement('canvas');
                canvas.width = darkTile.width;
                canvas.height = darkTile.height;
                const context = canvas.getContext('2d');
                context.drawImage(darkTile.image, 0, 0);
                const imageData = context.getImageData(0, 0, darkTile.size.x, darkTile.size.y);
                for (let i = 0; i < imageData.data.length; i += 4) {
                    imageData.data[i] *= 0.55;
                    imageData.data[i + 1] *= 0.55;
                    imageData.data[i + 2] *= 0.55;
                }
                context.putImageData(imageData, 0, 0);
                darkTile.image.src = canvas.toDataURL();
            };
            this.dark_tiles[index] = darkTile;
        });	
    }

    getSprite(name) {
        return this.sprites[name] ? this.sprites[name] : this.missing;
    }

    getTile(index, dark = false) {
        return (dark ? this.dark_tiles : this.tiles)[index - 1] ? (dark ? this.dark_tiles : this.tiles)[index - 1] : this.missing;
    }
}