import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';
import { Server as SocketServer } from 'socket.io';
import { server_config } from './config.js';

import { Server } from './assets/js/server/server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = server_config.port || 2020;

// Set up session middleware
app.use(session({
    secret: server_config.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: server_config.secure }
}));


// redirect to worlds/main
app.get(['/worlds/', '/'], (req, res) => {
    res.redirect('/worlds/main');
});

app.get('/worlds/:world', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile('socket.io.js', { root: path.join(__dirname, 'node_modules/socket.io/client-dist') });
});

// Route to prevent access to the server folder
app.use('/:any*/server', (req, res) => {
    // Respond with an access denied message
    res.status(403).send('Access denied');
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


// server instance
if (server_config.secure) {
    const privateKey = fs.readFileSync(server_config.ssl_key, 'utf8');
    const certificate = fs.readFileSync(server_config.ssl_cert, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    const httpsServer = https.createServer(credentials, app);
    const io = new SocketServer(httpsServer);
    const serverInstance = new Server(io);

    httpsServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} else {
    const server = http.createServer(app);
    const io = new SocketServer(server);
    const serverInstance = new Server(io);

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}