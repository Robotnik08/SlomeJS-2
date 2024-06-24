import { Game } from './game.mjs';
import { Client } from './client.mjs';
import { Time } from './time.mjs';
import { Chat } from './chat.mjs';

const instance = new Game();

const client = new Client(instance);

const chat = new Chat(document.getElementById('chat-messages'), document.getElementById('chat-input'), client);
instance.chat = chat;

instance.setTile = (position, type, background = false) => {
    client.sendChange(position, type, background);
};

instance.subscribeTimeEvent(() => {
    client.fixedUpdate();
}, Time.fixedUpdate);