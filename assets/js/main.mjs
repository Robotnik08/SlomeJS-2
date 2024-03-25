import { Game } from './game.mjs';
import { Client } from './client.mjs';

const instance = new Game();

const client = new Client(instance);