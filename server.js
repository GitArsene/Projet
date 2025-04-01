const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app); // Crée un serveur HTTP pour Express
const wss = new WebSocket.Server({ server }); // Attache WebSocket au serveur HTTP

const PORT = 3000;

// Middleware pour gérer les JSON et les fichiers statiques
app.use(express.json());
app.use(express.static(__dirname));

// Route principale pour servir le fichier HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let players = [];

// Gérer les connexions WebSocket
wss.on('connection', (ws) => {
    console.log('A client connected.');
    if (players.length >= 2) {
        ws.close(1008, 'Game is full'); // Code 1008: Policy Violation
        console.log('Connection rejected: Game is full.');
        return;
    }
    players.push(ws);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Parsed data:', data);
    
        if (data.type === 'move') {
            players.forEach((player) => {
                if (player !== ws && player.readyState === WebSocket.OPEN) {
                    console.log('Sending move to player:', player);
                    player.send(JSON.stringify(data));
                }
            });
        }
    });

    // Gérer la déconnexion
    ws.on('close', () => {
        players.pop(ws); // Retire le joueur de la liste
        console.log('A client disconnected.');
    });
});

// Démarrer le serveur HTTP
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/pages/chess.html`);
});