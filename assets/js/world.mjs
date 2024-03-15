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

        this.setTile(size.divide(2), 0);

        this.gravity = 9.81;
    }

    getTile (position) {
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        return this.tiles[position.y][position.x];
    }

    setTile (position, value) {
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        this.tiles[position.y][position.x] = value;
    }
}