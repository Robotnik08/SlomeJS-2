import { Sprite } from "./sprite.mjs";
import { Vector2 } from "./vector.mjs";

export class Sprites {
    constructor () {

        this.missing = new Sprite('img/game/tiles/missing_block.png');

        this.sprites = {
            'pickaxe': 'img/game/items/iron_pickaxe.png',
            'slome': 'img/game/character/slome.png',
            'hotbar': 'img/game/ui/hotbar.png',
            'hotbar_select': 'img/game/ui/hotbar_select.png'
        };

        this.tiles = [
            'img/game/tiles/grass.png',
            'img/game/tiles/dirt.png',
            'img/game/tiles/stone.png',
            'img/game/tiles/oak_log.png',
            'img/game/tiles/oak_leaves.png',
            'img/game/tiles/oak_planks.png',
            'img/game/tiles/cobbled_stone.png',
            'img/game/tiles/glass.png',
            'img/game/tiles/bedrock.png',
        ];


        this.is_transparent = [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            false
        ];

        this.max_tile_id = this.tiles.length;

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
        if (index == 0) return this.sprites.pickaxe;

        return (dark ? this.dark_tiles : this.tiles)[index - 1] ? (dark ? this.dark_tiles : this.tiles)[index - 1] : this.missing;
    }
}