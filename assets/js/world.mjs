import { Vector2 } from "./vector.mjs";
import { getNoise } from "./perlin-noise.mjs";

export class World {
    constructor (size) {
        this.tiles = [];
        this.size = size;

        const smoothness = 0.1;
        const gate = 0.5;
        const local_gate = 10;

        this.seed = (Math.random() * 1000000) | 0;

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

        this.gravity = 9.81 * 2;
    }

    getTile (position) {
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        return this.tiles[position.y][position.x] ? this.tiles[position.y][position.x] : 0;
    }

    setTile (position, value) {
        if (typeof value !== "number" || value < 0) console.warn("Value must be a number or greater than 0.");

        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        this.tiles[position.y][position.x] = value;
    }
}