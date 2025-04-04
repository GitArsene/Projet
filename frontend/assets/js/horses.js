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
  dice.innerHTML = randomNumber;

  console.log("Current player: " + players[current]);

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

  for (let i = 0; i < boardSize; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < boardSize; j++) {
      let cell = document.createElement("td");

      // Contour extérieur de "plus" sans toucher le bord
      if (
        // Haut et bas du "+"
        (i === center - padding && j < boardSize) ||
        (i === center + padding && j < boardSize) ||
        // Gauche et droite du "+"
        (j === center - padding && i < boardSize) ||
        (j === center + padding && i < boardSize)
      ) {
        cell.className = "path"; // Classe pour la zone de contour du "+"
      }
      // // Zone centrale du "+"
      // else if (i === center || j === center) {
      //   cell.className = "center"; // Zone centrale
      // }
      // // Zone vide autour du "+"
      // else {
      //   cell.className = "center-empty"; // Vide autour du "+"
      // }

      cell.classList.add("cell");
      row.appendChild(cell);
      board[i][j] = cell; // Stockage dans le tableau 2D
    }
    table.appendChild(row);
  }

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
