import { Vector2 } from '../vector.mjs';

export class PlayerClient {
    constructor (socket, position = Vector2.zero, name = "Player") {
        this.position = position;

        this.name = name;
        this.connected_world = null;

        this.socket = socket;

        this.id = socket.id;

        this.loaded = false;
    }
}