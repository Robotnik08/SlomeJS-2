import { World } from "../world.mjs";
import { Vector2 } from "../vector.mjs";
import { generate } from "./generator.mjs";
import { PlayerClient } from "./player-client.mjs";
import { SaveManager } from "./save-manager.mjs";
import { Console } from "./console.mjs";

export class Server {
    constructor (io) {
        this.io = io;

        this.players = [];
        this.worlds = {};

        this.focusedWorld = null;

        this.io.on('connection', this.userSocket.bind(this));

        this.saveManager = new SaveManager();

        this.console = new Console();

        
        this.console.addCommand('focus', (world) => {
            if (!world) {
                console.log('Usage: focus <world>');
                return;
            }
            this.focusedWorld = world;
            console.log(`Focused on world '${world}'`);
        });

        this.console.addCommand('unfocus', () => {
            console.log(`Unfocused from '${this.focusedWorld}'`);
            this.focusedWorld = null;
        });

        this.console.addCommand('listworlds', () => {
            console.log('Worlds:');
            console.log(Object.keys(this.worlds));
        });

        this.console.addCommand('listplayers', () => {
            console.log('Players:');
            this.players.forEach(player => {
                console.log(player.name + ' in (' + player.connected_world + ')');
            });
        });

        this.console.addCommand('say', (...args) => {
            if (args.length === 0) {
                console.log('Usage: say <message>');
                return;
            }
            if (this.focusedWorld === null) {
                console.log('No world focused');
                return;
            }
            const message = args.join(' ');
            this.serverLog(`${message}`);
            this.io.to(this.focusedWorld).emit('chat', {author: null, message: message});
        });

        this.console.addCommand('broadcast', (...args) => {
            if (args.length === 0) {
                console.log('Usage: broadcast <message>');
                return;
            }
            const message = args.join(' ');
            this.serverLog(`${message}`);
            this.io.emit('chat', {author: null, message: message});
        });

        this.console.addCommand('kick', (name) => {
            if (!name) {
                console.log('Usage: kick <player>');
                return;
            }
            const player = this.players.find(player => player.name === name);
            if (player) {
                player.socket.disconnect(true);
                console.log(`Kicked ${name}`);
            } else {
                console.log('Player not found');
            }
        });

        this.console.addCommand('kickall', () => {
            console.log('Kicking all players...');
            this.players.forEach(player => player.socket.disconnect(true));
            console.log('Kicked all players');
        });

        this.console.addCommand('save', (world) => {
            if (!world) {
                console.log('Usage: save <world>');
                return;
            }
            if (this.worlds[world]) {
                this.saveManager.saveWorld(this.worlds[world], world);
                console.log(`Saved world '${world}'`);
            } else {
                console.log('World not found');
            }
        });

        this.console.addCommand('saveall', () => {
            console.log('Saving all worlds...');
            for (const world in this.worlds) {
                this.saveManager.saveWorld(this.worlds[world], world);
            }
            console.log('Saved all worlds');
        });

        this.console.addCommand('stop', () => {
            console.log('Stopping server...');
            process.exit(0);
        });
    }

    getIfFocused (world) {
        return this.focusedWorld === null || this.focusedWorld === world;
    }

    serverLog (message) {
        const time = new Date().toLocaleTimeString();
        console.log("[" + time + "] " + message);
    }

    userSocket (socket) {
        if (!socket.request.session || !socket.request.session.user) {
            this.serverLog('Unauthorized user tried to connect');
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


        socket.on('chat', (data) => {
            if (typeof data !== 'string') return;

            if (data.length > 100) {
                socket.emit('chat', {author: null, message: "Message is too long!"});
                return;
            }
            if (data.length === 0) return; // no empty messages
            if (this.getIfFocused(player.connected_world)) this.serverLog(`<${username}> ${data}`);
            this.io.to(player.connected_world).emit('chat', {author: username, message: data});
        });
        
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
                        this.io.to(player.connected_world).emit('chat', {author: null, message: username + ' has joined the world!'});
                        
                        if (this.getIfFocused(data)) this.serverLog(`${player.name} joined world (${data})`);
    
                        player.loaded = true;
                    } else {
                        this.worlds[data] = world;

                        // check if the player is allowed to join the world (whitelist or owner)
                        this.saveManager.getOwner(world.id).then(link_data => {
                            if (link_data.whitelist != null) {
                                const whitelist_on = link_data.whitelist_on;
                                const whitelist = link_data.whitelist.split(',');
                                if (player.name !== data && (whitelist.indexOf(player.name) === -1 && whitelist_on)) {
                                    socket.emit('error', 'You are not whitelisted for this world');
                                    return;
                                }
                            }

                            socket.emit('world', this.worlds[data].toPacket());
        
                            player.connected_world = data;
                            socket.join(player.connected_world);
                            this.io.to(player.connected_world).emit('chat', {author: null, message: username + ' has joined the world!'});
                            if (this.getIfFocused(data)) this.serverLog(`${player.name} joined world (${data})`);
        
                            player.loaded = true;
                        });

                    }
                });
            } else {
                // check if the player is allowed to join the world (whitelist or owner)
                this.saveManager.getOwner(this.worlds[data].id).then(link_data => {
                    if (link_data.whitelist != null) {
                        const whitelist_on = link_data.whitelist_on;
                        const whitelist = link_data.whitelist.split(',');
                        if (player.name !== data && (whitelist.indexOf(player.name) === -1 && whitelist_on)) {
                            socket.emit('error', 'You are not whitelisted for this world');
                            return;
                        }
                    }

                    socket.emit('world', this.worlds[data].toPacket());

                    player.connected_world = data;
                    socket.join(player.connected_world);
                    this.io.to(player.connected_world).emit('chat', {author: null, message: username + ' has joined the world!'});

                    if (this.getIfFocused(data)) this.serverLog(`${player.name} joined world (${data})`);

                    player.loaded = true;
                });
            }
        });

        socket.on('disconnect', () => {
            if (this.worlds[player.connected_world] != null) this.saveManager.saveWorld(this.worlds[player.connected_world], player.connected_world);
            this.io.to(player.connected_world).emit('chat', {author: null, message: username + ' has left the world!'});
            if (this.getIfFocused(player.connected_world)) this.serverLog(`${player.name} disconnected`);
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