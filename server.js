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

        // Gérer la création de salle et l'adhésion
        if (data.type === 'join') {
            roomId = data.roomId;
            console.log('Player joined room:', roomId);

            if (!rooms[roomId]) {
                rooms[roomId] = [];
            }

            // Vérifier si la salle est pleine (2 joueurs max)
            if (rooms[roomId].length < 2) {
                rooms[roomId].push(ws); // Add the player to the room
                ws.roomId = roomId;
                ws.playerColor = rooms[roomId].length === 0 ? 'white' : rooms[roomId][0].playerColor === 'white' ? 'black' : 'white'; // Assign colors based on player order and existing players
                ws.send(JSON.stringify({ type: 'joined', color: ws.playerColor })); // Send the assigned color to the player
            }
            else {
                ws.send(JSON.stringify({ type: 'error', message: 'Room is full' })); // Notify the player that the room is full
            }
        }

        // Gérer le démarrage du jeu
        if (data.type === 'start') {
            ws.ready = true; // Mark the player as ready
            if (rooms[roomId].length === 2) {
                if (rooms[roomId].every(player => player.ready)) {
                    rooms[roomId].forEach((player) => {
                        if (player.readyState === WebSocket.OPEN) { 
                            player.send(JSON.stringify({ type: 'start' })); // Notify all players to start the game
                        }
                    });
                }
            }
        }

        // Gérer les mouvements de pièces
        if (data.type === 'move') {
            rooms[roomId].forEach((player) => {
                if (player !== ws && player.readyState === WebSocket.OPEN) {
                    player.send(JSON.stringify(data)); // Send the move to the other player
                }
            });
        }

        if (data.type === 'changeColor') {
            rooms[roomId].forEach((player) => {
                if (player.readyState === WebSocket.OPEN) {
                    player.playerColor = player.playerColor === 'white' ? "black" : 'white'; // Change the player's color
                    player.send(JSON.stringify({ type: 'colorChanged', color: player.playerColor })); // Notify the other player of the color change
                }
            });
        }
    });

    // Gérer la déconnexion
    ws.on('close', () => {
        // Retirer le joueur déconnecté de la liste
        rooms[roomId] = rooms[roomId].filter(player => player !== ws);

        // Si la salle est vide, la supprimer
        if (rooms[roomId].length === 0) {
            delete rooms[roomId];
        }
        else {
            // Informer l'autre joueur de la déconnexion
            rooms[roomId].forEach((player) => {
                if (player.readyState === WebSocket.OPEN) {
                    player.ready = false; // Mark the other player as not ready
                    player.send(JSON.stringify({ type: 'disconnected' }));
                }
            });
        }

        console.log('A player disconnected.');
    });
});

// Démarrer le serveur HTTP
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/pages/chess.html`);
});