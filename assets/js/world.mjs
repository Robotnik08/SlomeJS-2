import { Vector2 } from "./vector.mjs";

export class World {
    constructor (size) {
        this.tiles = [];
        this.background_tiles = [];
        this.size = size;

        this.seed = (Math.random() * 1000000) | 0;
        
        this.gravity = 9.81 * 2;

        this.loaded = false;

        this.id = 0;
    }

    getTile (position, background = false) {
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        if (position.x < 0 || position.x >= this.size.x || position.y < 0 || position.y >= this.size.y) return 0;
        return (background ? this.background_tiles : this.tiles)[position.y][position.x] ? (background ? this.background_tiles : this.tiles)[position.y][position.x] : 0;
    }

    setTile (position, value, background = false) {
        if (typeof value !== "number" || value < 0) console.warn("Value must be a number or greater than 0.");

        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        if (position.x < 0 || position.x >= this.size.x || position.y < 0 || position.y >= this.size.y) return;
        (background ? this.background_tiles : this.tiles)[position.y][position.x] = value;
    }

    checkPlacement (position, background = false) {
        if (this.getTile(position.add(Vector2.up), background)) return true;
        if (this.getTile(position.add(Vector2.down), background)) return true;
        if (this.getTile(position.add(Vector2.left), background)) return true;
        if (this.getTile(position.add(Vector2.right), background)) return true;
        if (!background) {
            if (this.getTile(position, true)) return true;
        }

        return false;
    }

    getSpawn () {
        for (let x = Math.round(this.size.x / 2); x < this.size.x; x++) {
            for (let y = 0; y < Math.round(this.size.y / 2); y++) {
                if (this.tiles[y][x] === 0 && this.tiles[y + 1][x]) {
                    return new Vector2(x, y);
                }
            }
        }
        console.warn("No spawn found.");
        return new Vector2(0, 1);
    }

    toPacket () {
        return {
            tiles: this.tiles,
            background_tiles: this.background_tiles,
            size: this.size
        };
    }

    fromPacket (packet) {
        this.tiles = packet.tiles;
        this.background_tiles = packet.background_tiles;
        this.size = packet.size;

        this.loaded = true;
    }

    getJSON () {
        return JSON.stringify({
            tiles: this.tiles,
            background_tiles: this.background_tiles,
            size: this.size
        });
    }

    static fromJSON (json, id = 0) {
        const data = JSON.parse(json);
        const world = new World(data.size);
        world.tiles = data.tiles;
        world.background_tiles = data.background_tiles;

        world.id = id;
        return world;
    }
}