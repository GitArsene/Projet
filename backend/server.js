const express = require('express');
const cors = require('cors'); // 🚀 Import du module cors

const app = express();
app.use(
  cors({
    origin: "http://localhost", // Remplace par l'URL de ton frontend
    methods: "GET,POST", // Autorise uniquement certaines méthodes
    allowedHeaders: "Content-Type,Authorization", // Autorise certains headers
  })
);

app.listen(3000, function () {
  console.log("Listening on port 3000 | Operationnal");
});

// * Création d'une route GET pour l'appui sur le bouton "horsesGET"
app.get("/api/horsesGET", function (req, res) {
    console.log("GET Request Received");
    res.send("I Love My GET, And My GET Loves Me");
});

app.post("/api/getTableHorses", function (req, res) {
    let table = getHorseTable(req.body);
    res.json(table);
});

