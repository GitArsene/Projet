const express = require('express');
const http = require('http'); // Nécessaire pour créer un serveur HTTP
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
    players.push(ws);

    // Gérer les messages reçus
    // ws.on('message', (message) => {
    //     console.log('Received:', message);

    //     // Diffuser le message à tous les clients connectés
    //     wss.clients.forEach((client) => {
    //         if (client.readyState === WebSocket.OPEN) {
    //             client.send(message);
    //         }
    //     });
    // });

    ws.on('message', (message) => {
        console.log('Received:', message);
        const data = JSON.parse(message);
        console.log('Parsed data:', data);
    
        if (data.type === 'move') {
            players.forEach((player) => {
                if (player !== ws && player.readyState === WebSocket.OPEN) {
                    console.log('Sending move to player:', player);
                    console.log('Data to send:', JSON.stringify(data));
                    player.send(JSON.stringify(data));
                }
            });
        }
    });

    // Gérer la déconnexion
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});

// Démarrer le serveur HTTP
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/pages/chess.html`);
});