import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';

import http from 'http';
import https from 'https';

import { Server as SocketServer } from 'socket.io';

import { server_config } from './config.js';

import { Server } from './assets/js/server/server.mjs';
import { DataBase } from './assets/js/server/database-connect.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = server_config.port || 2020;

const db = new DataBase();

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session middleware
const sessionConfig = session({
    secret: server_config.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: server_config.secure }
});
app.use(sessionConfig);

// Set up CORS middleware
app.use(cors());

// Middleware to protect routes
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}

function logout(req, res, next) {
    if (req.session.user) {
        req.session.destroy();
    } 
    next();
}

// Login route
app.get('/login', logout, (req, res) => {
    res.sendFile('login.html', { root: path.join(__dirname, 'public') });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query(`SELECT * FROM accounts WHERE name = '${username}' AND password = '${password}'`).then(results => {
        if (results.length > 0) {
            req.session.user = username;
            res.redirect('/');
        } else {
            res.send('Invalid username or password');
        }
    }).catch(err => {
        res.status(500).send('An error occurred');
        console.error(err);
    });
});

app.get('/register', logout, (req, res) => {
    res.sendFile('register.html', { root: path.join(__dirname, 'public') });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.query(`SELECT * FROM accounts WHERE name = '${username}'`).then(results => {
        if (results.length > 0) {
            res.send('Account already exists');
        } else {
            db.query(`INSERT INTO accounts (name, password) VALUES ('${username}', '${password}')`).then(() => {
                res.send('Account created! <a href="/login">Login</a>');
            }).catch(err => {
                res.status(500).send('An error occurred');
                console.error(err);
            });
        }
    });
});

// Logout route
app.get('/logout', logout, (req, res) => {
    res.redirect('/login');
});

app.get('/session', (req, res) => {
    res.json({username: req.session.user});
});

app.get('/kicked', (req, res) => {
    res.sendFile('kicked.html', { root: path.join(__dirname, 'public') });
});

app.get('/world-not-found', (req, res) => {
    res.sendFile('world-not-found.html', { root: path.join(__dirname, 'public') });
});

app.get('/not-whitelisted', (req, res) => {
    res.sendFile('not-whitelisted.html', { root: path.join(__dirname, 'public') });
});

// redirect to worlds/main
app.get(['/worlds/', '/'], (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

app.get('/worlds/:world', isAuthenticated, (req, res) => {
    res.sendFile('game.html', { root: path.join(__dirname, 'public') });
});

app.get('/socket.io.js', (req, res) => {
    res.sendFile('socket.io.esm.min.js', { root: path.join(__dirname, 'node_modules/socket.io/client-dist') });
});

// Route to prevent access to the server folder
app.use('/:any*/server', (req, res) => {
    // Respond with an access denied message
    res.status(403).send('Access denied');
});

// js folder
app.use('/:any*/js', isAuthenticated, express.static(path.join(__dirname, 'assets/js')));

// css folder
app.use('/:any*/css', isAuthenticated, express.static(path.join(__dirname, 'assets/css')));

// img folder
app.use('/:any*/img', express.static(path.join(__dirname, 'assets/img')));

// font folder
app.use('/:any*/font', isAuthenticated, express.static(path.join(__dirname, 'assets/font')));

// json folder
app.use('/:any*/json', isAuthenticated, express.static(path.join(__dirname, 'assets/json')));

const sessionMiddleware = sessionConfig;

// server instance
if (server_config.secure) {
    const privateKey = fs.readFileSync(server_config.ssl_key, 'utf8');
    const certificate = fs.readFileSync(server_config.ssl_cert, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    const httpsServer = https.createServer(credentials, app);
    const io = new SocketServer(httpsServer);
    io.engine.use(sessionMiddleware);
    const serverInstance = new Server(io);

    httpsServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} else {
    const server = http.createServer(app);
    const io = new SocketServer(server);
    io.engine.use(sessionMiddleware);
    const serverInstance = new Server(io);

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}