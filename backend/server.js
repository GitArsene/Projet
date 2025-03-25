const express = require('express');
const cors = require('cors'); // 🚀 Import du module cors
const { getHorseTable } = require('./horses'); // Import de la fonction getHorseTable

const app = express();
app.use(
  cors({
    origin: "http://localhost", // Remplace par l'URL de ton frontend
    methods: "GET,POST", // Autorise uniquement certaines méthodes
    allowedHeaders: "Content-Type,Authorization", // Autorise certains headers
  })
);

app.listen(3000, function () {
  console.log("Listening on port 3000 | Operational");
});

app.get("/api/getTableHorses", function (req, res) { // Endpoint to get the horse table
  let table = getHorseTable();
  res.json(table);
});
