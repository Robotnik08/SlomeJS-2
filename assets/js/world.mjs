import { Vector2 } from "./vector.mjs";
import { getNoise } from "./perlin-noise.mjs";

export class World {
    constructor (size) {
        this.tiles = [];
        this.background_tiles = [];
        this.size = size;

        this.seed = (Math.random() * 1000000) | 0;
        
        this.gravity = 9.81 * 2;

        this.loaded = false;
    }

    generate () {
        const smoothness = 0.1;
        const gate = 0.5;
        const local_gate = 10;

        const size = this.size;

        for (let y = 0; y < size.y; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < size.x; x++) {
                this.tiles[y][x] = getNoise(x * smoothness, y * smoothness, this.seed) > (gate - ((y - size.y + size.y / 2) / size.y + 0.2)*local_gate) ? 3 : 0;
            }
        }

        // paint grass
        for (let y = 0; y < size.y; y++) {
            for (let x = 0; x < size.x; x++) {
                if (this.tiles[y][x] === 3 && this.tiles[y - 1][x] === 0) {
                    this.tiles[y][x] = 1;
                    if (this.tiles[y + 1][x] === 3) {
                        this.tiles[y + 1][x] = 2;
                    }
                    if (this.tiles[y + 2][x] === 3) {
                        this.tiles[y + 2][x] = 2;
                    }
                    if (this.tiles[y + 3][x] === 3) {
                        this.tiles[y + 3][x] = 2;
                    }
                }
            }
        }

        this.background_tiles = this.tiles.map(row => row.map(tile => tile)); // deep copy

        this.loaded = true;
    }

    getTile (position, background = false) {
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        return (background ? this.background_tiles : this.tiles)[position.y][position.x] ? (background ? this.background_tiles : this.tiles)[position.y][position.x] : 0;
    }

    setTile (position, value, background = false) {
        if (typeof value !== "number" || value < 0) console.warn("Value must be a number or greater than 0.");

        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
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
        return new Vector2(Math.round(this.size / 2), 1);
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
}