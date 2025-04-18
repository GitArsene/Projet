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

app.get("/api/chess/hello", (req, res) => {
  res.json({ message: "Hello from chess backend!" });
});

const rooms = {}; // { roomId: [player1, player2] }

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

      if (rooms[roomId].length < 2) {
        rooms[roomId].push(ws);
        ws.roomId = roomId;
        ws.playerColor =
          rooms[roomId].length === 0
            ? "white"
            : rooms[roomId][0].playerColor === "white"
            ? "black"
            : "white";

        ws.send(JSON.stringify({ type: "joined", color: ws.playerColor }));
      } else {
        ws.send(JSON.stringify({ type: "error", message: "Room is full" }));
      }
    }

    if (data.type === "start") {
      ws.ready = true;
      if (rooms[roomId].length === 2 && rooms[roomId].every((p) => p.ready)) {
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

    if (data.type === "changeColor") {
      rooms[roomId].forEach((player) => {
        if (player.readyState === ws.OPEN) {
          player.playerColor =
            player.playerColor === "white" ? "black" : "white";
          player.send(
            JSON.stringify({ type: "colorChanged", color: player.playerColor })
          );
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

app.get("/api/chess/rooms", (req, res) => {
  let roomsID = Object.keys(rooms);
  roomsID = roomsID.filter((element) => rooms[element].length < 2);
  res.send(JSON.stringify(roomsID));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
