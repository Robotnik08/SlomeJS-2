import { World } from "../world.mjs";
import { Vector2 } from "../vector.mjs";
import { generate } from "./generator.mjs";
import { PlayerClient } from "./player-client.mjs";
import { SaveManager } from "./save-manager.mjs";

export class Server {
    constructor (io) {
        this.io = io;

        this.players = [];
        this.worlds = {};

        this.io.on('connection', this.userSocket.bind(this));

        this.saveManager = new SaveManager();
    }

    userSocket (socket) {
        if (!socket.request.session || !socket.request.session.user) {
            console.log('Unauthorized user tried to connect');
            socket.disconnect(true);
            return;
        }

        const username = socket.request.session.user;
        const userId = socket.id;

        const player = new PlayerClient(socket);
        player.name = username;

        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].name === player.name) {
                this.players[i].socket.disconnect(true);
                this.players.splice(i, 1);
                break;
            }
        }

        this.players.push(player);

        console.log(`<${player.name}> connected`);

        socket.on('world', (data) => {
            if (player.loaded) return;

            if (!this.worlds[data]) {
                this.saveManager.loadWorld(data).then(world => {
                    if (world === null) {
                        // only the owner of the world can generate it
                        if (player.name !== data) {
                            socket.emit('error', 'World not found');
                            return;
                        }
                        this.worlds[data] = new World(new Vector2(300, 200));
                        generate(this.worlds[data]);

                        this.saveManager.saveWorld(this.worlds[data], data);

                        socket.emit('world', this.worlds[data].toPacket());
    
                        player.connected_world = data;
                        socket.join(player.connected_world);
                        console.log(`<${player.name}> joined world <${data}>`);
    
                        player.loaded = true;
                    } else {
                        this.worlds[data] = world;

                        // check if the player is allowed to join the world (whitelist or owner)
                        this.saveManager.getOwner(world.id).then(link_data => {
                            const whitelist_on = link_data.whitelist_on;
                            const whitelist = link_data.whitelist.split(',');
                            if (player.name !== data && (whitelist.indexOf(player.name) === -1 && whitelist_on)) {
                                socket.emit('error', 'You are not whitelisted for this world');
                                return;
                            }

                            socket.emit('world', this.worlds[data].toPacket());
        
                            player.connected_world = data;
                            socket.join(player.connected_world);
                            console.log(`<${player.name}> joined world <${data}>`);
        
                            player.loaded = true;
                        });

                    }
                });
            } else {
                // check if the player is allowed to join the world (whitelist or owner)
                this.saveManager.getOwner(this.worlds[data].id).then(link_data => {
                    const whitelist_on = link_data.whitelist_on;
                    const whitelist = link_data.whitelist.split(',');
                    if (player.name !== data && (whitelist.indexOf(player.name) === -1 && whitelist_on)) {
                        socket.emit('error', 'You are not whitelisted for this world');
                        return;
                    }

                    socket.emit('world', this.worlds[data].toPacket());

                    player.connected_world = data;
                    socket.join(player.connected_world);
                    console.log(`<${player.name}> joined world <${data}>`);

                    player.loaded = true;
                });
            }
        });

        socket.on('disconnect', () => {
            if (this.worlds[player.connected_world] != null) this.saveManager.saveWorld(this.worlds[player.connected_world], player.connected_world);
            this.players.splice(this.players.indexOf(player), 1);
            console.log(`<${player.name}> disconnected`);
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