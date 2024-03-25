import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

import { Server } from './assets/js/server/server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new SocketServer(server);
const serverInstance = new Server(io);

app.get('/worlds/:world', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile('socket.io.js', { root: path.join(__dirname, 'node_modules/socket.io/client-dist') });
});

// js folder
app.use('/:any*/js', express.static(path.join(__dirname, 'assets/js')));

// css folder
app.use('/:any*/css', express.static(path.join(__dirname, 'assets/css')));

// img folder
app.use('/:any*/img', express.static(path.join(__dirname, 'assets/img')));

// font folder
app.use('/:any*/font', express.static(path.join(__dirname, 'assets/font')));

// json folder
app.use('/:any*/json', express.static(path.join(__dirname, 'assets/json')));

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
