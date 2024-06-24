import { getNoise } from './perlin-noise.mjs';

const treeLeaves = [
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
];

const treeChance = 0.06;
const bushChance = 0.25;

const flowerTypes = [23, 24, 25, 26, 27, 28, 29];

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

    // add some bushes and grass
    for (let x = 0; x < size.x; x++) {
        if (Math.random() < bushChance) {
            for (let y = 0; y < size.y; y++) {
                if (world.tiles[y][x] === 1) {
                    world.tiles[y - 1][x] = Math.random() < 0.2 ? flowerTypes[Math.round(Math.random() * flowerTypes.length)] : Math.random() < 0.5 ? 21 : 22;
                    break;
                }
            }
        }
    }

    // add some trees
    for (let x = 0; x < size.x; x++) {
        if (Math.random() < treeChance) {
            for (let y = 0; y < size.y; y++) {
                if (world.tiles[y][x] === 1) {
                    const treeLength = Math.floor(Math.random() * 3) + 5;
                    for (let i = 0; i < treeLength; i++) {
                        if (y + i >= size.y) break;
                        world.background_tiles[y - i - 1][x] = 4;
                    }
                    for (let i = 0; i < treeLeaves.length; i++) {
                        for (let j = 0; j < treeLeaves[i].length; j++) {
                            if (x + j - 2 < 0 || x + j - 2 >= size.x || y - treeLeaves.length + i < 0 || y - treeLeaves.length + i >= size.y) continue;
                            if (treeLeaves[i][j]) {
                                if (!world.background_tiles[y - treeLeaves.length + i - treeLength + 2][x + j - 2]) {
                                    world.background_tiles[y - treeLeaves.length + i - treeLength + 2][x + j - 2] = 5;
                                }
                                if (!world.tiles[y - treeLeaves.length + i - treeLength + 2][x + j - 2]) {
                                    world.tiles[y - treeLeaves.length + i - treeLength + 2][x + j - 2] = 5;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
    }

    world.loaded = true;
}