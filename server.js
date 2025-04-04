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


const rooms = {}; // { roomId: [player1, player2] }

// Gérer les connexions WebSocket
wss.on('connection', (ws) => {
    let roomId;

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Parsed data:', data);

        if (data.type === 'join') {
            roomId = data.roomId;
            console.log('Player joined room:', roomId);

            if (!rooms[roomId]) {
                rooms[roomId] = [];
            }

            if (rooms[roomId].length < 2) {
                rooms[roomId].push(ws);
                ws.roomId = roomId;
                ws.playerColor = rooms[roomId].length === 1 ? 'white' : 'black'; // Assign colors based on player order
                ws.send(JSON.stringify({ type: 'joined', color: ws.playerColor })); // Send the assigned color to the player
            }
            else {
                ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
            }
        }


        if (data.type === 'move' && rooms[roomId].length === 2) {
            rooms[roomId].forEach((player) => {
                if (player !== ws && player.readyState === WebSocket.OPEN) {
                    player.send(JSON.stringify(data));
                }
            });
        }
    });

    // Gérer la déconnexion
    ws.on('close', () => {
        rooms[roomId].pop(ws); // Retire le joueur de la liste
        console.log('A player disconnected.');
    });
});

// Démarrer le serveur HTTP
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/pages/chess.html`);
});