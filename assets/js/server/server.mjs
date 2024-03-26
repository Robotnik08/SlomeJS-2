import { World } from "../world.mjs";
import { Vector2 } from "../vector.mjs";
import { generate } from "./generator.mjs";
import { PlayerClient } from "./player-client.mjs";

export class Server {
    constructor (io) {
        this.io = io;

        this.players = [];
        this.worlds = {};

        this.io.on('connection', this.userSocket.bind(this));

    }

    userSocket (socket) {
        const player = new PlayerClient(socket);

        this.players.push(player);

        console.log(socket.id);
        console.log(this.players.length);

        socket.on('world', (data) => {
            if (!this.worlds[data]) {
                this.worlds[data] = new World(new Vector2(1000, 500));
                generate(this.worlds[data]);
            }

            socket.emit('world', this.worlds[data].toPacket());

            player.connected_world = data;
        });

        socket.on('disconnect', () => {
            this.players.splice(this.players.indexOf(player), 1);
        });

        socket.on('move', (data) => {
            player.position = new Vector2(data.x, data.y);
            socket.emit('playerdata', this.getPlayersFromWorld(player.connected_world, player.id));
        });
    }

    getPlayersFromWorld (world, id) {
        const result = this.players.filter(player => player.connected_world === world && player.id !== id);
        for (let i = 0; i < result.length; i++) {
            result[i] = {
                id: result[i].id,
                position: result[i].position.toObject(),
                name: result[i].name
            };
        }
        return JSON.stringify(result);
    }
}