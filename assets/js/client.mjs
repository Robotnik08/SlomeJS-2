import { io } from 'https://cdn.socket.io/4.3.0/socket.io.esm.min.js';
import { Vector2 } from './vector.mjs';
import { OtherPlayer } from './other-player.mjs';

const socket = io();

let tick = 0;

export class Client {
    constructor (game_instance) {
        this.game = game_instance;


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
                        found = true;
                    }
                });

                if (!found) this.game.entities.push(new OtherPlayer(new Vector2(player.position.x, player.position.y), 'slome', new Vector2(0.88, 0.88), player.id));
            });

            // remove players that are not in the list
            this.game.entities = this.game.entities.filter(entity => {
                if (!entity.multi_ghost) return true;

                for (const player of data) {
                    if (entity.id === player.id) return true;
                }
                return false;
            });
        });
        

        // ask for world
        socket.emit('world', window.location.pathname.split('/').pop());
    }

    fixedUpdate () {
        // 20 tps
        if (tick++ % 3 === 0) {
            socket.emit('move', this.game.entities[0].position);
        }
    }

    getWorld (data) {
        this.game.world.fromPacket(data);
        this.game.entities[0].position = this.game.world.getSpawn();
    }
}