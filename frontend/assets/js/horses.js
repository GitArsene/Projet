import { getHorseTable } from "../../../backend/horses.js";
import { playerPaths } from "../js/board.js";

let players = ["red", "yellow", "blue", "green"];
let current = 0;
let lastDiceRoll = 0;

function setPlayer() {
  let playerName = players[current];
  document.getElementById("player").textContent =
    "Joueur actuel : " + playerName;
}

function diceRoll() {
  // Générer un nombre aléatoire entre 1 et 6
  let randomNumber = Math.floor(Math.random() * 6) + 1;

  // Récupérer l'élément du dé
  let dice = document.getElementById("dice");
  lastDiceRoll = randomNumber;

  // Ajouter une classe pour l'animation
  dice.classList.add("rolling");

  // Retirer l'animation après 1 seconde et afficher le résultat
  setTimeout(() => {
    dice.classList.remove("rolling");
    dice.innerHTML = randomNumber; // Afficher le résultat du dé

    // Mettre à jour le texte du résultat
    const diceResult = document.getElementById("dice-result");
    diceResult.textContent = "Tu as lancé : " + randomNumber;

    console.log("Le résultat du lancer de dé est : " + randomNumber);
  }, 1000);

  // Afficher dans la console le joueur actuel
  console.log("Current player: " + players[current]);

  // Mettre à jour le joueur actuel
  if (current !== 3) current++;
  else current = 0;

  // Mettre à jour l'affichage du joueur actuel
  setPlayer();

  // Retourner le résultat du lancer de dé
  return randomNumber;
}

let playerPositions = {
  red: 0,
  blue: 0,
  green: 0,
  yellow: 0,
};

function movePawn(pawn, color) {
  const path = playerPaths[color];
  let step = playerPositions[color]; // Position actuelle du pion sur son parcours

  // Si le joueur n'a pas encore sorti son pion (step === 0), on le place à la première case de son parcours
  if (step === 0 && lastDiceRoll === 6) {
    playerPositions[color] = 1; // Définir le pion à la première case de son parcours
    let startCell = path[1]; // Case de départ, juste après la base
    pawn.parentElement.removeChild(pawn); // Retirer le pion de sa case actuelle
    let targetCell = document.getElementById(`${startCell.i}-${startCell.j}`);
    targetCell.appendChild(pawn); // Placer le pion sur la première case du parcours
    return;
  }

  // Si le joueur a déjà sorti son pion, on avance
  if (step > 0) {
    let nextStep = step + lastDiceRoll;
    if (nextStep < path.length) {
      playerPositions[color] = nextStep; // Mettre à jour la position du joueur sur son parcours
      let nextCell = path[nextStep]; // Obtenir la prochaine case
      pawn.parentElement.removeChild(pawn); // Retirer le pion de sa case actuelle
      let targetCell = document.getElementById(`${nextCell.i}-${nextCell.j}`);
      targetCell.appendChild(pawn); // Placer le pion à la nouvelle case
    } else {
      console.log("Le pion a atteint la fin du parcours !");
    }
  }
}

function initHorsesTableInstance() {
  const response = getHorseTable(); // Appel de la fonction getHorseTable

  return response;
}


document.addEventListener("DOMContentLoaded", function () {
  let playerName = players[current];
  let playerElement = document.getElementById("player");
  if (playerElement) {
    playerElement.textContent = "Joueur actuel : " + playerName;
  } else {
    console.error('Element with ID "player" not found.');
  }
});


document.addEventListener("DOMContentLoaded", function () {
  let playerName = players[current];
  document.getElementById("player").textContent =
    "Joueur actuel : " + playerName;
});


document.addEventListener("DOMContentLoaded", function () {
  const rollButton = document.getElementById("rollButton");
  if (rollButton) {
    rollButton.addEventListener("click", diceRoll);
  } else {
    console.error('Bouton "rollButton" introuvable.');
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let tableInstance = initHorsesTableInstance();
  let table = document.getElementById("table");
  console.log(table);
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

  // Ajout des pions dans les zones de départ
  function placeInitialPawns() {
    const pawnPositions = {
      blue: [],
      green: [],
      yellow: [],
      red: [],
    };

    // Utiliser les conditions spécifiques pour chaque coin
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const cell = board[i][j];
        if (!cell) continue;

        if (i > 0 && i < 3 && j < 3 && j > 0) {
          pawnPositions["blue"].push(cell);
        } else if (i > 0 && i < 3 && j >= boardSize - 3 && j <= boardSize - 2) {
          pawnPositions["green"].push(cell);
        } else if (
          i >= boardSize - 3 &&
          i <= boardSize - 2 &&
          j >= boardSize - 3 &&
          j <= boardSize - 2
        ) {
          pawnPositions["yellow"].push(cell);
        } else if (i >= boardSize - 3 && i <= boardSize - 2 && j < 3 && j > 0) {
          pawnPositions["red"].push(cell);
        }
      }
    }

    // Création et placement des 4 pions pour chaque couleur
    Object.entries(pawnPositions).forEach(([color, cells]) => {
      for (let k = 0; k < 4; k++) {
        const pawn = document.createElement("div");
        pawn.className = `${color}-pawn`;
        pawn.dataset.color = color;
        pawn.dataset.position = -1; // -1 = pas encore sur la piste
        pawn.innerText = k + 1; // numéro du pion
        cells[k].appendChild(pawn);
      }
    });
  }
  console.log(boardSize); // Vérification de la taille du plateau
  console.log(board); // Vérification de la structure du plateau

  placeInitialPawns();
  document.addEventListener("click", function (e) {
    const target = e.target;

    if (target.classList.contains("pawn")) {
      const pawn = target;
      const color = pawn.dataset.color;

      // Ne pas autoriser un joueur à jouer un pion d'une autre couleur
      if (players[current] !== color) {
        alert("Ce n'est pas ton tour !");
        return;
      }

      if (lastDiceRoll === 0) {
        alert("Lance d'abord le dé !");
        return;
      }

      movePawn(pawn, color); // Déplacer le pion
      lastDiceRoll = 0; // Réinitialiser le dé après mouvement
      current = (current + 1) % players.length; // Passer au joueur suivant
      setPlayer(); // Mettre à jour le joueur actuel
    }
  });
});
