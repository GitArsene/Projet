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

const rooms = {}; // { roomId: [player1, player2, player3, player4] }
const colors = ["red", "blue", "green", "yellow"]; // Les couleurs disponibles

wss.on("connection", (ws) => {
  let roomId;

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("Parsed data:", data);

    if (data.type === "join") {
      roomId = data.roomId;
      console.log("Player joined room:", roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      if (rooms[roomId].length < 4) {
        rooms[roomId].push(ws);
        ws.roomId = roomId;
        ws.playerColor = colors[rooms[roomId].length - 1]; // Attribuer une couleur unique

        ws.send(JSON.stringify({ type: "joined", color: ws.playerColor }));
      } else {
        ws.send(JSON.stringify({ type: "error", message: "Room is full" }));
      }
    }

    if (data.type === "start") {
      ws.ready = true;
      if (rooms[roomId].length === 4 && rooms[roomId].every((p) => p.ready)) {
        rooms[roomId].forEach((p) => {
          if (p.readyState === ws.OPEN) {
            p.send(JSON.stringify({ type: "start" }));
          }
        });
      }
    }

    if (data.type === "move") {
      rooms[roomId].forEach((player) => {
        if (player !== ws && player.readyState === ws.OPEN) {
          player.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on("close", () => {
    rooms[roomId] = rooms[roomId]?.filter((player) => player !== ws) || [];

    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    } else {
      rooms[roomId].forEach((player) => {
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
  roomsID = roomsID.filter((element) => rooms[element].length < 4);
  res.send(JSON.stringify(roomsID));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
