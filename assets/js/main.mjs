import { Game } from './game.mjs';
import { Client } from './client.mjs';
import { Time } from './time.mjs';

const instance = new Game();

const client = new Client(instance);

instance.setTile = (position, type, background = false) => {
    client.sendChange(position, type, background);
};

instance.subscribeTimeEvent(() => {
    client.fixedUpdate();
}, Time.fixedUpdate);