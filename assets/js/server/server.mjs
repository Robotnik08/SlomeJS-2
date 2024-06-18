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


        socket.on('world', (data) => {
            if (!this.worlds[data]) {
                this.worlds[data] = new World(new Vector2(1000, 500));
                generate(this.worlds[data]);
            }

            socket.emit('world', this.worlds[data].toPacket());

            player.connected_world = data;
            socket.join(player.connected_world);

            player.loaded = true;
        });

        socket.on('disconnect', () => {
            this.players.splice(this.players.indexOf(player), 1);
        });

        socket.on('move', (data) => {
            if (!player.loaded) return;

            player.position = new Vector2(data.pos.x, data.pos.y);
            player.angle = data.angle;
            player.selectedType = data.selectedType;
            socket.emit('playerdata', this.getPlayersFromWorld(player.connected_world, player.id));
        });

        socket.on('change', (data) => {
            if (!player.loaded) return;

            this.worlds[player.connected_world].setTile(new Vector2(data.x, data.y), data.type, data.background);
            this.io.to(player.connected_world).emit('change', data);
        });
    }

    getPlayersFromWorld (world, id) {
        const result = this.players.filter(player => player.connected_world === world && player.id !== id);
        for (let i = 0; i < result.length; i++) {
            result[i] = {
                id: result[i].id,
                position: result[i].position.toObject(),
                angle: result[i].angle,
                selectedType: result[i].selectedType,
                name: result[i].name
            };
        }
        return JSON.stringify(result);
    }
}