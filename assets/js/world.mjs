import { Vector2 } from "./vector.mjs";

export class World {
    constructor (size) {
        this.tiles = [];
        this.size = size;

        for (let y = 0; y < size.y; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < size.x; x++) {
                this.tiles[y][x] = Math.random() > 0.5 ? 1 : 0;
            }
        }
    }

    getTile (position) {
        return this.tiles[position.y][position.x];
    }

    setTile (position, value) {
        this.tiles[position.y][position.x] = value;
    }
}