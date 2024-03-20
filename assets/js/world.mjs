import { Vector2 } from "./vector.mjs";

export class World {
    constructor (size) {
        this.tiles = [];
        this.size = size;

        for (let y = 0; y < size.y; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < size.x; x++) {
                this.tiles[y][x] = Math.random() > 0.9 ? Math.ceil(Math.random() * 3) : 0;
            }
        }

        this.setTile(size.divide(2), 0);

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