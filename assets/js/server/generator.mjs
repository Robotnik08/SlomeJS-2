import { getNoise } from './perlin-noise.mjs';

export function generate (world) {
    const smoothness = 0.1;
    const gate = 0.5;
    const local_gate = 10;

    const size = world.size;

    for (let y = 0; y < size.y; y++) {
        world.tiles[y] = [];
        for (let x = 0; x < size.x; x++) {
            world.tiles[y][x] = getNoise(x * smoothness, y * smoothness, world.seed) > (gate - ((y - size.y + size.y / 2) / size.y + 0.2)*local_gate) ? 3 : 0;
        }
    }

    // paint grass
    for (let y = 0; y < size.y; y++) {
        for (let x = 0; x < size.x; x++) {
            if (world.tiles[y][x] === 3 && world.tiles[y - 1][x] === 0) {
                world.tiles[y][x] = 1;
                if (world.tiles[y + 1][x] === 3) {
                    world.tiles[y + 1][x] = 2;
                }
                if (world.tiles[y + 2][x] === 3) {
                    world.tiles[y + 2][x] = 2;
                }
                if (world.tiles[y + 3][x] === 3) {
                    world.tiles[y + 3][x] = 2;
                }
            }
        }
    }

    world.background_tiles = world.tiles.map(row => row.map(tile => tile)); // deep copy

    world.loaded = true;
}