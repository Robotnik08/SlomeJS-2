import { io } from 'https://cdn.socket.io/4.3.0/socket.io.esm.min.js';
const socket = io();

export class Client {
    constructor (game_instance) {
        this.game = game_instance;


        // init receive
        socket.on('world', this.getWorld.bind(this));
        

        // ask for world
        socket.emit('world');
    }

    getWorld (data) {
        this.game.world.fromPacket(data);
        this.game.entities[0].position = this.game.world.getSpawn();
    }
}