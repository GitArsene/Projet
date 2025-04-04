import { getHorseTable } from "../../../backend/horses.js";

let players = ["red", "yellow", "blue", "green"];
let current = 0;

function setPlayer() {
  let playerText = document.getElementById("player");
  playerText.innerHTML = players[current];
}

setPlayer();

function diceRoll() {
  let randomNumber = Math.floor(Math.random() * 6) + 1;
  let dice = document.getElementById("dice");

  // Ajout de la classe pour l'animation
  dice.classList.add("rolling");

  // Retirer l'animation après 1 seconde pour revenir à la taille d'origine
  setTimeout(() => {
    dice.classList.remove("rolling");
    dice.innerHTML = randomNumber;
  }, 1000);

  console.log("Current player: " + players[current]);

  // Mettre à jour le joueur actuel
  if (current != 3) current++;
  else current = 0;

  setPlayer();
  return randomNumber;
}

function initHorsesTableInstance() {
  const response = getHorseTable(); // Appel de la fonction getHorseTable

  return response;
}

document.addEventListener("DOMContentLoaded", function () {
  let tableInstance = initHorsesTableInstance();
  let table = document.getElementById("table");
  let boardSize = tableInstance.length / 4;
  let board = Array.from({ length: boardSize }, () =>
    Array(boardSize).fill(null)
  );
  let center = Math.floor(boardSize / 2);
  let padding = 1; // Ajoutons un espace autour du "+"

  // Variables pour numéroter les cases
  let colorCounters = { blue: 1, green: 1, yellow: 1, red: 1 }; // Compteurs pour chaque couleur

  // Fonction pour récupérer la couleur de la case en fonction de la position (i, j)
  function getColorForCell(i, j) {
    if ((j === center - 1 && i < center) || (i === center - 1 && j < center)) {
      return "blue"; // Quart en haut à gauche
    } else if ((i === 6 && j > center) || (j === center + 1 && i > center)) {
      return "yellow"; // Quart en bas à droite
    } else if (
      (j === 4 && i > center + 1) ||
      (i === center + 1 && j < center)
    ) {
      return "red"; // Quart en bas à gauche
    } else if ((j === 6 && i < center) || (i === center - 1 && j > center)) {
      return "green"; // Quart en haut à droite
    } else if (i === center - 5 && j === center) {
      return "blue"; // Case gauche de la croix
    } else if (i === center + 5 && j === center) {
      return "yellow"; // Case droite de la croix
    } else if (i === center && j === center - 5) {
      return "red"; // Case haut de la croix
    } else if (i === center && j === center + 5) {
      return "green"; // Case bas de la croix
    }

    if (i === center && j < center) {
      return "red_light"; // Ligne centrale horizontale
    }
    if (j === center && i < center) {
      return "blue_light"; // Colonne centrale verticale
    }
    if (i === center && j > center) {
      return "green_light"; // Ligne centrale horizontale
    }
    if (j === center && i > center) {
      return "yellow_light"; // Colonne centrale verticale
    }

    if (i > 0 && i < 3 && j < 3 && j > 0) return "blue"; // Coin haut gauche (6 cellules)
    if (i > 0 && i < 3 && j >= boardSize - 3 && j <= boardSize - 2)
      return "green"; // Coin haut droite (6 cellules)
    if (
      i >= boardSize - 3 &&
      i <= boardSize - 2 &&
      j >= boardSize - 3 &&
      j <= boardSize - 2
    )
      return "yellow"; // Coin bas droite (6 cellules)
    if (i >= boardSize - 3 && i <= boardSize - 2 && j < 3 && j > 0)
      return "red"; // Coin bas gauche (6 cellules)
    return "";
  }

  // Fonction pour remplir les cases de chaque couleur selon les spécifications
  function fillColorCells(color) {
    let cells = [];

    // Collecter toutes les cellules de chaque couleur
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        let cell = board[i][j];
        if (cell && cell.className === color) {
          cells.push(cell);
        }
      }
    }

    // Selon la couleur, on applique la numérotation dans l'ordre demandé
    switch (color) {
      case "blue":
        // Bleu : de gauche à haut, puis haut-droite
        cells.sort((a, b) => {
          let aI = parseInt(a.id.split("-")[0]);
          let aJ = parseInt(a.id.split("-")[1]);
          let bI = parseInt(b.id.split("-")[0]);
          let bJ = parseInt(b.id.split("-")[1]);

          return aJ - bJ || bI - aI; // Priorité à la gauche puis haut
        });
        break;
      case "green":
        // Vert : de haut à bas puis à droite
        cells.sort((a, b) => {
          let aI = parseInt(a.id.split("-")[0]);
          let aJ = parseInt(a.id.split("-")[1]);
          let bI = parseInt(b.id.split("-")[0]);
          let bJ = parseInt(b.id.split("-")[1]);

          return aI - bI || aJ - bJ; // Priorité à la colonne, puis ligne
        });
        break;
      case "yellow":
        // Jaune : de droite à gauche, vers le bas, puis à gauche
        cells.sort((a, b) => {
          let aI = parseInt(a.id.split("-")[0]);
          let aJ = parseInt(a.id.split("-")[1]);
          let bI = parseInt(b.id.split("-")[0]);
          let bJ = parseInt(b.id.split("-")[1]);

          return bJ - aJ || aI - bI; // Priorité à la droite, puis bas
        });
        break;
      case "red":
        // Rouge : de bas à haut, puis à gauche
        cells.sort((a, b) => {
          let aI = parseInt(a.id.split("-")[0]);
          let aJ = parseInt(a.id.split("-")[1]);
          let bI = parseInt(b.id.split("-")[0]);
          let bJ = parseInt(b.id.split("-")[1]);

          return bI - aI || aJ - bJ; // Priorité à la ligne, puis colonne
        });
        break;
    }

    // Appliquer les numéros dans l'ordre trié
    cells.forEach((cell) => {
      cell.innerHTML = colorCounters[color]++; // Afficher le numéro de la case
    });
  }

  // Remplir les cases colorées et les numéroter dans l'ordre correct
  for (let i = 0; i < boardSize; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < boardSize; j++) {
      let cell = document.createElement("td");

      // Appliquer la couleur à la case
      let color = getColorForCell(i, j);
      if (color) {
        cell.className = color;
        cell.dataset.nonTraversable = true;
        cell.id = `${i}-${j}`; // Ajouter un ID unique pour chaque case

        // Ajouter la case au tableau
        row.appendChild(cell);
        board[i][j] = cell;
      } else {
        cell.className = "center-empty";
        cell.dataset.nonTraversable = true;
        row.appendChild(cell);
      }
    }
    table.appendChild(row);
  }

  // Appliquer la numérotation après avoir construit le tableau
  // fillColorCells("blue");
  // fillColorCells("green");
  // fillColorCells("yellow");
  // fillColorCells("red");

  console.log(board); // Vérification de la structure du plateau
});

// Assignation des couleurs aux différentes zones
let redCells = document.querySelectorAll(".red");
let yellowCells = document.querySelectorAll(".yellow");
let blueCells = document.querySelectorAll(".blue");
let greenCells = document.querySelectorAll(".green");

// Assignation des IDs aux cellules des différentes couleurs
let count = 0;
Array.from(redCells).forEach((cell) => {
  cell.id = count; // Assignation d'un ID unique
  cell.innerHTML = count; // Assignation d'une valeur
  count++;
});

Array.from(greenCells).forEach((cell) => {
  cell.id = count;
  cell.innerHTML = count;
  count++;
});

Array.from(yellowCells)
  .reverse()
  .forEach((cell) => {
    cell.id = count;
    cell.innerHTML = count;
    count++;
  });

Array.from(blueCells)
  .reverse()
  .forEach((cell) => {
    cell.id = count;
    cell.innerHTML = count;
    count++;
  });
