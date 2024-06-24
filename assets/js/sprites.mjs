import { Color } from "./color.mjs";
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
            new TileData('img/game/tiles/missing_block.png', true, false), // air
            new TileData('img/game/tiles/grass.png', false, true),
            new TileData('img/game/tiles/dirt.png', false, true),
            new TileData('img/game/tiles/stone.png', false, true),
            new TileData('img/game/tiles/oak_log.png', false, true),
            new TileData('img/game/tiles/oak_leaves.png', false, true),
            new TileData('img/game/tiles/oak_planks.png', false, true),
            new TileData('img/game/tiles/cobbled_stone.png', false, true),
            new TileData('img/game/tiles/glass.png', true, true),
            new TileData('img/game/tiles/bedrock.png', false, true),
            new TileData('img/game/tiles/missing_block.png', false, true), // missing block
            new TileData('img/game/tiles/coal_ore.png', false, true),
            new TileData('img/game/tiles/iron_ore.png', false, true),
            new TileData('img/game/tiles/gold_ore.png', false, true),
            new TileData('img/game/tiles/coal_block.png', false, true),
            new TileData('img/game/tiles/iron_block.png', false, true),
            new TileData('img/game/tiles/gold_block.png', false, true),
            new TileData('img/game/tiles/granite.png', false, true),
            new TileData('img/game/tiles/sand_stone.png', false, true),
            new TileData('img/game/tiles/sand.png', false, true),
            new TileData('img/game/tiles/missing_block.png', false, true), // missing block
            new TileData('img/game/tiles/bush.png', true, false),
            new TileData('img/game/tiles/tall_grass.png', true, false),
            new TileData('img/game/tiles/red_rose.png', true, false),
            new TileData('img/game/tiles/pink_rose.png', true, false),
            new TileData('img/game/tiles/dandilion.png', true, false),
            new TileData('img/game/tiles/yellow_carnation.png', true, false),
            new TileData('img/game/tiles/white_dahlia.png', true, false),
            new TileData('img/game/tiles/purple_orchid.png', true, false),
            new TileData('img/game/tiles/blue_dahlia.png', true, false),
            new TileData('img/game/tiles/missing_block.png', false, true), // missing block
            new TileData('img/game/tiles/anvil.png', true, false),
            new TileData('img/game/tiles/carpentry_table.png', true, false),
            new TileData('img/game/tiles/furnace.png', true, false),
            new TileData('img/game/tiles/blastfurnace.png', true, false),
            new TileData('img/game/tiles/gold_chest.png', true, false),
            new TileData('img/game/tiles/iron_chest.png', true, false),
            new TileData('img/game/tiles/oak_table.png', true, false),
            new TileData('img/game/tiles/spruce_table.png', true, false),
            new TileData('img/game/tiles/workbench.png', true, false),
            new TileData('img/game/tiles/missing_block.png', true, false), // missing block
            new TileData('img/game/tiles/spruce_log.png', false, true),
            new TileData('img/game/tiles/spruce_planks.png', false, true),
            new TileData('img/game/tiles/spruce_leaves.png', false, true),
            new TileData('img/game/tiles/cobbled_bedrock.png', false, true),
            new TileData('img/game/tiles/oak_sign_ground.png', true, false),
            new TileData('img/game/tiles/spruce_sign_ground.png', true, false),
            new TileData('img/game/tiles/record_player.png', true, false),
            new TileData('img/game/tiles/straw_bed.png', true, false),
            new TileData('img/game/tiles/oak_log_top.png', false, true)            
        ];

        this.max_tile_id = this.tiles.length;


        for (let key in this.sprites) {
            const sprite = new Sprite(this.sprites[key]);
            this.sprites[key] = sprite;
        }

        // dark tiles (for background tiles)
        this.tiles.forEach((tile, index) => {
            const sprite = new Sprite(tile.sprite);
            this.tiles[index].sprite = sprite;

            const darkTile = new Sprite(tile.darkSprite);
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
                const averageColor = [];
                for (let i = 0; i < imageData.data.length; i += 4*64) {
                    if (imageData.data[i + 3] === 0) continue;
                    averageColor.push(new Color(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], 1));
                }
                averageColor.sort((a, b) => a.r + a.g + a.b - b.r - b.g - b.b);
                this.tiles[index].color = averageColor[averageColor.length / 2 | 0];
                for (let i = 0; i < imageData.data.length; i += 4) {
                    imageData.data[i] *= 0.55;
                    imageData.data[i + 1] *= 0.55;
                    imageData.data[i + 2] *= 0.55;
                }
                
                context.putImageData(imageData, 0, 0);
                darkTile.image.src = canvas.toDataURL();
            };
            this.tiles[index].darkSprite = darkTile;
        });	
    }

    getSprite(name) {
        return this.sprites[name] ? this.sprites[name] : this.missing;
    }

    getTransparent(index) {
        return this.tiles[index]?.is_transparent || false;
    }

    getCollision(index) {
        return this.tiles[index]?.has_collision || false;
    }

    getTileColor(index) {
        return this.tiles[index] ? this.tiles[index].color.copy() : Color.white;
    }

    getTile(index, dark = false) {
        if (index == 0) return this.sprites.pickaxe;

        return this.tiles[index] ? dark ? this.tiles[index].darkSprite : this.tiles[index].sprite : this.missing;
    }
}

export class TileData {
    constructor (sprite, is_transparent, has_collision) {
        this.sprite = sprite;
        this.darkSprite = sprite;
        this.color = Color.white;
        this.is_transparent = is_transparent;
        this.has_collision = has_collision;
    }
}