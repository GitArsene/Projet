import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

// Pour compatibilité ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 8080; // Le serveur écoute sur le port 8080 dans le conteneur

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/horses/hello", (req, res) => {
  res.json({ message: "Hello from horses backend!" });
});

const rooms = {}; // Les rooms seront créées dynamiquement lorsqu'un joueur rejoint
const colors = ["red", "blue", "green", "yellow"]; // Les couleurs disponibles

wss.on("connection", (ws) => {
  let roomId;

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("Parsed data:", data);

    if (data.type === "join") {
      roomId = data.roomId;

      if (!rooms[roomId]) {
        rooms[roomId] = { players: [], currentTurn: 0 };
      }

      // Vérifiez si le joueur est déjà dans la room
      if (rooms[roomId].players.includes(ws)) {
        console.log("Le joueur est déjà dans la room. Ignoré.");
        return;
      }

      // Ajoutez le joueur à la room
      rooms[roomId].players.push(ws);
      ws.roomId = roomId;
      ws.playerColor = colors[rooms[roomId].players.length - 1];

      // Envoyez les informations au joueur
      const playerColors = rooms[roomId].players.map((player) => player.playerColor);
      ws.send(JSON.stringify({ type: "joined", color: ws.playerColor, players: playerColors }));

      // Si la room est pleine, démarrez le jeu
      if (rooms[roomId].players.length === 4) {
        rooms[roomId].players.forEach((player) => {
          if (player.readyState === ws.OPEN) {
            player.send(JSON.stringify({ type: "start" }));
          }
        });
      }
    }

    if (data.type === "start") {
      ws.ready = true;
      if (rooms[roomId].players.length === 4 && rooms[roomId].players.every((p) => p.ready)) {
        rooms[roomId].players.forEach((p) => {
          if (p.readyState === ws.OPEN) {
            p.send(JSON.stringify({ type: "start" }));
          }
        });
      }
    }

    if (data.type === "move") {
      rooms[roomId].players.forEach((player) => {
        if (player !== ws && player.readyState === ws.OPEN) {
          player.send(JSON.stringify(data));
        }
      });
    }

    if (data.type === "endTurn") {
      const currentPlayerIndex = rooms[roomId].players.findIndex(
        (player) => player.playerColor === data.color
      );
      const nextPlayerIndex = (currentPlayerIndex + 1) % rooms[roomId].players.length;
      const nextPlayerColor = rooms[roomId].players[nextPlayerIndex].playerColor;

      // Envoyer les informations de changement de tour à tous les joueurs
      rooms[roomId].players.forEach((player) => {
        if (player.readyState === ws.OPEN) {
          player.send(
            JSON.stringify({
              type: "nextTurn",
              color: nextPlayerColor,
              lastDiceRoll: data.lastDiceRoll || 0, // Inclure le dernier lancer de dé si nécessaire
            })
          );
        }
      });
    }

    if (data.type === "diceRoll") {
      rooms[roomId].players.forEach((player) => {
        if (player.readyState === ws.OPEN) {
          player.send(
            JSON.stringify({
              type: "diceRoll",
              color: data.color,
              result: data.result,
            })
          );
        }
      });
    }

    if (data.type === "win") {
      const winningColor = data.color;

      // Notifie tous les joueurs de la victoire
      rooms[roomId].players.forEach((player) => {
        if (player.readyState === ws.OPEN) {
          player.send(
            JSON.stringify({
              type: "gameOver",
              message: `Le joueur ${winningColor} a gagné la partie !`,
            })
          );
        }
      });

      // Supprime la room après la fin de la partie
      delete rooms[roomId];
    }

    if (data.type === "pawnTaken") {
      console.log(`Pion pris : ${data.pawnId} de la couleur ${data.color}`);
      rooms[roomId].players.forEach((player) => {
        if (player.readyState === ws.OPEN) {
          player.send(
            JSON.stringify({
              type: "pawnTaken",
              color: data.color,
              pawnId: data.pawnId,
            })
          );
        }
      });
    }

    if (data.type === "pawnReachedCenter") {
      rooms[roomId].players.forEach((player) => {
        if (player.readyState === ws.OPEN) {
          player.send(
            JSON.stringify({
              type: "pawnReachedCenter",
              color: data.color,
              pawnId: data.pawnId,
            })
          );
        }
      });
    }
  });

  ws.on("close", () => {
    rooms[roomId].players = rooms[roomId]?.players.filter((player) => player !== ws) || [];

    if (rooms[roomId].players.length === 0) {
      delete rooms[roomId];
    } else {
      rooms[roomId].players.forEach((player) => {
        if (player.readyState === ws.OPEN) {
          player.ready = false;
          player.send(JSON.stringify({ type: "disconnected" }));
        }
      });
    }

    console.log("A player disconnected.");
  });
});

app.get("/api/horses/rooms", (req, res) => {
  let roomsID = Object.keys(rooms);
  roomsID = roomsID.filter((element) => rooms[element].players.length < 4);
  res.send(JSON.stringify(roomsID));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
