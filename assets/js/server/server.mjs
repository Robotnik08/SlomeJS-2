import { World } from "../world.mjs";
import { Vector2 } from "../vector.mjs";

export class Server {
    constructor (io) {
        this.io = io;

        this.io.on('connection', this.userSocket.bind(this));

        this.worlds = {};

        this.worlds.test = new World(new Vector2(1000, 500));
        this.worlds.test.generate();
    }

    userSocket (socket) {
        console.log('User connected');

        socket.on('world', (data) => {
            console.log('World requested');

            socket.emit('world', this.worlds.test.toPacket());
        });
    }
}