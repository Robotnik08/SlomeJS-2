import { io } from '/socket.io.js';
import { Vector2 } from './vector.mjs';
import { OtherPlayer } from './other-player.mjs';
import { ChatMessage } from './chat.mjs';

const socket = io();

let tick = 0;

export class Client {
    constructor (game_instance) {
        this.game = game_instance;

        // send to /kicked if disconnected
        socket.on('disconnect', () => {
            window.location.href = '/kicked';
        });

        socket.on('error', (data) => {
            switch (data) {
                case 'World not found':
                    window.location.href = '/world-not-found';
                    break;
                case 'You are not whitelisted for this world':
                    window.location.href = '/not-whitelisted';
                    break;
                default:
                    console.error(data);
                    break;
            }
        });

        socket.on('chat', (data) => {
            this.game.chat.addMessage(new ChatMessage(data.author, data.message));
        });

        // init receive
        socket.on('world', this.getWorld.bind(this));

        // add playerdata to entity list if not already there
        socket.on('playerdata', (data) => {
            data = JSON.parse(data);
            data.forEach(player => {
                let found = false;
                this.game.entities.forEach(entity => {
                    if (entity.id === player.id) {
                        entity.position = new Vector2(player.position.x, player.position.y);
                        entity.angle = player.angle;
                        entity.selectedType = player.selectedType;
                        found = true;
                    }
                });

                if (!found) this.game.entities.push(new OtherPlayer(new Vector2(player.position.x, player.position.y), 'slome', new Vector2(0.88, 0.88), player.id));
            });

            // remove players that are not in the list
            this.game.entities = this.game.entities.filter(entity => {
                if (!entity.IS_OTHER_PLAYER) return true;

                for (const player of data) {
                    if (entity.id === player.id) return true;
                }
                return false;
            });
        });

        socket.on('change', (data) => {
            this.game.world.setTile(new Vector2(data.x, data.y), data.type, data.background);
        });
        

        // ask for world
        socket.emit('world', window.location.pathname.split('/').pop());
    }

    sendChat (message) {
        socket.emit('chat', message);
    }

    fixedUpdate () {
        // 20 tps
        if (tick++ % 3 === 0) {
            socket.emit('move', {
                pos: this.game.player.position,
                angle: this.game.player.angle,
                selectedType: this.game.player.selectedType
            });
        }
    }

    getWorld (data) {
        this.game.world.fromPacket(data);
        this.game.player.position = this.game.world.getSpawn();
    }

    sendChange (position, type, background = false) {
        socket.emit('change', { x: position.x, y: position.y, type: type, background: background });
    }
}