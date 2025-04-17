function getHorseTable() {
  let table = new Array(44);
  table.fill(0);

  return table;
}

// === Définition des chemins pour chaque joueur === //
const redPath = [
  { i: 10, j: 4 },
  { i: 9, j: 4 },
  { i: 8, j: 4 },
  { i: 7, j: 4 },
  { i: 6, j: 4 },
  { i: 6, j: 3 },
  { i: 6, j: 2 },
  { i: 6, j: 1 },
  { i: 6, j: 0 },
  { i: 5, j: 0 },
  { i: 4, j: 0 },
  { i: 4, j: 1 },
  { i: 4, j: 2 },
  { i: 4, j: 3 },
  { i: 4, j: 4 },
  { i: 3, j: 4 },
  { i: 2, j: 4 },
  { i: 1, j: 4 },
  { i: 0, j: 4 },
  { i: 0, j: 5 },
  { i: 0, j: 6 },
  { i: 1, j: 6 },
  { i: 2, j: 6 },
  { i: 3, j: 6 },
  { i: 4, j: 6 },
  { i: 4, j: 7 },
  { i: 4, j: 8 },
  { i: 4, j: 9 },
  { i: 4, j: 10 },
  { i: 5, j: 10 },
  { i: 6, j: 10 },
  { i: 6, j: 9 },
  { i: 6, j: 8 },
  { i: 6, j: 7 },
  { i: 6, j: 6 },
  { i: 7, j: 6 },
  { i: 8, j: 6 },
  { i: 9, j: 6 },
  { i: 10, j: 6 },
  { i: 10, j: 5 },
  { i: 9, j: 5 },
  { i: 8, j: 5 },
  { i: 7, j: 5 },
  { i: 6, j: 5 },
  { i: 5, j: 5 },
];

const bluePath = [
  { i: 4, j: 0 },
  { i: 4, j: 1 },
  { i: 4, j: 2 },
  { i: 4, j: 3 },
  { i: 4, j: 4 },
  { i: 3, j: 4 },
  { i: 2, j: 4 },
  { i: 1, j: 4 },
  { i: 0, j: 4 },
  { i: 0, j: 5 },
  { i: 0, j: 6 },
  { i: 1, j: 6 },
  { i: 2, j: 6 },
  { i: 3, j: 6 },
  { i: 4, j: 6 },
  { i: 4, j: 7 },
  { i: 4, j: 8 },
  { i: 4, j: 9 },
  { i: 4, j: 10 },
  { i: 5, j: 10 },
  { i: 6, j: 10 },
  { i: 6, j: 9 },
  { i: 6, j: 8 },
  { i: 6, j: 7 },
  { i: 6, j: 6 },
  { i: 7, j: 6 },
  { i: 8, j: 6 },
  { i: 9, j: 6 },
  { i: 10, j: 6 },
  { i: 10, j: 5 },
  { i: 10, j: 4 },
  { i: 9, j: 4 },
  { i: 8, j: 4 },
  { i: 7, j: 4 },
  { i: 6, j: 4 },
  { i: 6, j: 3 },
  { i: 6, j: 2 },
  { i: 6, j: 1 },
  { i: 6, j: 0 },
  { i: 5, j: 0 },
  { i: 5, j: 1 },
  { i: 5, j: 2 },
  { i: 5, j: 3 },
  { i: 5, j: 4 },
  { i: 5, j: 5 },
];

const greenPath = [
  { i: 0, j: 6 },
  { i: 1, j: 6 },
  { i: 2, j: 6 },
  { i: 3, j: 6 },
  { i: 4, j: 6 },
  { i: 4, j: 7 },
  { i: 4, j: 8 },
  { i: 4, j: 9 },
  { i: 4, j: 10 },
  { i: 5, j: 10 },
  { i: 6, j: 10 },
  { i: 6, j: 9 },
  { i: 6, j: 8 },
  { i: 6, j: 7 },
  { i: 6, j: 6 },
  { i: 7, j: 6 },
  { i: 8, j: 6 },
  { i: 9, j: 6 },
  { i: 10, j: 6 },
  { i: 10, j: 5 },
  { i: 10, j: 4 },
  { i: 9, j: 4 },
  { i: 8, j: 4 },
  { i: 7, j: 4 },
  { i: 6, j: 4 },
  { i: 6, j: 3 },
  { i: 6, j: 2 },
  { i: 6, j: 1 },
  { i: 6, j: 0 },
  { i: 5, j: 0 },
  { i: 4, j: 0 },
  { i: 4, j: 1 },
  { i: 4, j: 2 },
  { i: 4, j: 3 },
  { i: 4, j: 4 },
  { i: 3, j: 4 },
  { i: 2, j: 4 },
  { i: 1, j: 4 },
  { i: 0, j: 4 },
  { i: 0, j: 5 },
  { i: 1, j: 5 },
  { i: 2, j: 5 },
  { i: 3, j: 5 },
  { i: 4, j: 5 },
  { i: 5, j: 5 },
];

const yellowPath = [
  { i: 6, j: 10 },
  { i: 6, j: 9 },
  { i: 6, j: 8 },
  { i: 6, j: 7 },
  { i: 6, j: 6 },
  { i: 7, j: 6 },
  { i: 8, j: 6 },
  { i: 9, j: 6 },
  { i: 10, j: 6 },
  { i: 10, j: 5 },
  { i: 10, j: 4 },
  { i: 9, j: 4 },
  { i: 8, j: 4 },
  { i: 7, j: 4 },
  { i: 6, j: 4 },
  { i: 6, j: 3 },
  { i: 6, j: 2 },
  { i: 6, j: 1 },
  { i: 6, j: 0 },
  { i: 5, j: 0 },
  { i: 4, j: 0 },
  { i: 4, j: 1 },
  { i: 4, j: 2 },
  { i: 4, j: 3 },
  { i: 4, j: 4 },
  { i: 3, j: 4 },
  { i: 2, j: 4 },
  { i: 1, j: 4 },
  { i: 0, j: 4 },
  { i: 0, j: 5 },
  { i: 0, j: 6 },
  { i: 1, j: 6 },
  { i: 2, j: 6 },
  { i: 3, j: 6 },
  { i: 4, j: 6 },
  { i: 4, j: 7 },
  { i: 4, j: 8 },
  { i: 4, j: 9 },
  { i: 4, j: 10 },
  { i: 5, j: 10 },
  { i: 5, j: 9 },
  { i: 5, j: 8 },
  { i: 5, j: 7 },
  { i: 5, j: 6 },
  { i: 5, j: 5 },
];

// Map générale
const playerPaths = {
  red: redPath,
  blue: bluePath,
  green: greenPath,
  yellow: yellowPath,
};

// let players = ["red", "blue", "green", "yellow"];
let players = ["red"]
let current = 0;
let lastDiceRoll = 0;
let canRoll = true;
let previous = null; // Variable pour stocker le joueur précédent

function setPlayer() {
  let playerName = players[current];
  document.getElementById("player").textContent =
    "Joueur actuel : " + playerName;
  console.log("Joueur actuel : " + playerName);
}

let hasRolled = false;

function diceRoll() {
  if (!canRoll || hasRolled) return;

  canRoll = false;
  hasRolled = true;

  let randomNumber = Math.floor(Math.random() * 6) + 1;
  lastDiceRoll = randomNumber;
  console.log("Lancer de dé : ", lastDiceRoll);

  const dice = document.getElementById("dice");
  dice.innerHTML = randomNumber;

  const diceResult = document.getElementById("dice-result");
  diceResult.textContent = "Tu as lancé : " + randomNumber;

  const playable = getPlayablePawns(players[current]);

  if (playable.length === 0) {
    setTimeout(() => {
      nextPlayer();
    }, 500);
  } else {
    alert("Déplace un de tes pions !");
  }
}

function nextPlayer() {
  console.log(
    `Passage au joueur suivant : ${players[current + 1]} -> ${
      (current + 1) % players.length
    }`
  );

  current = (current + 1) % players.length; // Passe au joueur suivant
  setPlayer();

  canRoll = true; // Permet au joueur suivant de lancer le dé
  hasRolled = false;
  lastDiceRoll = 0; // Réinitialiser après le passage au joueur suivant
}

// Fonction pour récupérer les pions jouables pour le joueur actuel
function getPlayablePawns(color) {
  // Nettoyage des anciens états
  document
    .querySelectorAll(".pawn")
    .forEach((p) => p.classList.remove("playable"));

  const pawns = document.querySelectorAll(`.${color}-pawn`);
  const path = getPath(color);
  const playable = [];

  pawns.forEach((pawn) => {
    const pos = parseInt(pawn.dataset.position); // Lire la position actuelle du pion
    if (pos === -1 && lastDiceRoll === 6) {
      pawn.classList.add("playable");
      playable.push(pawn); // Peut sortir de la base
    } else if (pos >= 0) {
      let nextStep = pos + lastDiceRoll;
      if (nextStep < path.length) {
        pawn.classList.add("playable");
        playable.push(pawn); // Peut avancer sur le chemin
      }
    }
  });

  return playable;
}

let playerPositions = {
  red: 0,
  blue: 0,
  green: 0,
  yellow: 0,
};

function getPath(color) {
  switch (color) {
    case "red":
      return redPath;
    case "blue":
      return bluePath;
    case "green":
      return greenPath;
    case "yellow":
      return yellowPath;
    default:
      return [];
  }
}

function movePawn(pawn) {
  if (!hasRolled || lastDiceRoll === 0) {
    alert("Tu dois d'abord lancer le dé !");
    return;
  }

  if (pawn.dataset.color !== players[current]) return;
  const playable = getPlayablePawns(players[current]);
  if (!playable.includes(pawn)) return;

  try {
    const table = document.querySelector("table");
    const color = pawn.dataset.color;
    const currentPosition = parseInt(pawn.dataset.position); // -1 si en base
    const path = playerPaths[color];

    const diceValue = lastDiceRoll;
    if (!diceValue) {
      console.log("Le dé n'a pas encore été lancé.");
      return;
    }

    let newIndex = currentPosition === -1 ? 0 : currentPosition + diceValue;

    const targetCoord = path[newIndex];
    const targetCell = table.rows[targetCoord.i].cells[targetCoord.j];

    // Vérifier les pions présents dans la case cible
    const otherPawns = Array.from(targetCell.querySelectorAll(".pawn"));

    for (let other of otherPawns) {
      const otherColor = other.dataset.color;

      if (otherColor === color) {
        console.log("Impossible : un pion allié est déjà sur cette case.");
        return;
      } else {
        console.log(`Le pion ${other.id} est mangé et retourne à la base.`);
        sendPawnToBase(other);
      }
    }

    // Déplacement autorisé
    targetCell.appendChild(pawn);
    pawn.dataset.position = newIndex;
    pawn.classList.remove("selected");
    pawn.classList.remove("in-base");

    // Condition de victoire : vérifier si le pion atteint la case (i = 5, j = 5)
    if (targetCoord.i === 5 && targetCoord.j === 5) {
      alert(`Le joueur ${color.toUpperCase()} a gagné ! 🎉`);

      // Désactiver tous les pions
      document.querySelectorAll(".pawn").forEach((p) => {
        p.onclick = null;
      });

      // Désactiver tous les boutons
      const buttons = document.querySelectorAll("button");
      buttons.forEach((button) => {
        button.disabled = true;
      });

      // Rediriger vers le menu principal après un délai (par exemple, 3 secondes)
      setTimeout(() => {
        window.location.href =
          "http://localhost:8081/frontend/horses/horsesRoom.html";
      }, 3000); // 3000 ms = 3 secondes

      return;
    }
  } catch (error) {
    console.error("Erreur dans movePawn:", error);
  }

  // Nettoie les surbrillances après le déplacement
  document
    .querySelectorAll(".pawn")
    .forEach((p) => p.classList.remove("playable"));
  canRoll = true;
  handlePostMove();
}

function handlePostMove() {
  console.log(`Joueur actuel avant handlePostMove: ${players[current]}`);
  const playable = getPlayablePawns(players[current]);

  if (lastDiceRoll === 6) {
    if (playable.length === 0) {
      setTimeout(() => {
        alert(
          "Tu as fait un 6, mais aucun pion ne peut être déplacé. Tour suivant."
        );
        nextPlayer();
      }, 500);
    } else if (playable.length > 0) {
      setTimeout(() => {
        alert("Tu as fait un 6 ! Tu peux rejouer.");
        canRoll = true;
        hasRolled = false;
        lastDiceRoll = 0;
      });
    }
  } else {
    // Passer au joueur suivant après un délai
    setTimeout(() => {
      console.log("Passage au joueur suivant.");
      nextPlayer();
    }, 500);
  }
}

const redbase = [
  { i: 8, j: 1 },
  { i: 8, j: 2 },
  { i: 9, j: 1 },
  { i: 9, j: 2 },
];
const bluebase = [
  { i: 1, j: 1 },
  { i: 1, j: 2 },
  { i: 2, j: 1 },
  { i: 2, j: 2 },
];
const greenbase = [
  { i: 1, j: 8 },
  { i: 1, j: 9 },
  { i: 2, j: 8 },
  { i: 2, j: 9 },
];
const yellowbase = [
  { i: 8, j: 8 },
  { i: 8, j: 9 },
  { i: 9, j: 8 },
  { i: 9, j: 9 },
];

const baseCoordinates = {
  red: redbase,
  blue: bluebase,
  green: greenbase,
  yellow: yellowbase,
};

function sendPawnToBase(pawn) {
  const table = document.querySelector("table");
  const color = pawn.dataset.color;
  const index = parseInt(pawn.dataset.index);

  const baseCoord = baseCoordinates[color][index];
  const targetCell = table.rows[baseCoord.i].cells[baseCoord.j];

  targetCell.appendChild(pawn);
  pawn.dataset.position = -1; // De retour à la base
  pawn.classList.add("in-base");
}

function placePawns(color, baseCoordinates) {
  const table = document.querySelector("table");

  baseCoordinates.forEach((coord, index) => {
    const row = table.rows[coord.i];
    const cell = row.cells[coord.j];

    const pawn = document.createElement("div");
    pawn.classList.add("pawn", `${color}-pawn`); // Ajoute les classes pour le style du pion
    pawn.id = `pawn-${color}-${index + 1}`; // ID unique pour chaque pion

    // Ajout des données personnalisées au pion
    pawn.dataset.position = -1; // Position initiale (peut-être pour indiquer que le pion n'est pas encore sur le plateau)
    pawn.dataset.color = color; // Couleur du pion (par exemple "blanc" ou "noir")
    pawn.dataset.index = index; // Index du pion pour l'identifier de manière unique

    pawn.classList.add("in-base"); // Ajoute la classe CSS pour le positionner dans la base

    cell.appendChild(pawn); // Ajoute le pion à la cellule
  });
}

function initHorsesTableInstance() {
  const table = document.getElementById("table");

  // Si la table n'existe pas encore, on la crée
  if (!table) {
    const container =
      document.getElementById("board-container") || document.body;
    const newTable = document.createElement("table");
    newTable.id = "table";
    newTable.classList.add("horse-table"); // optionnel : ajout d'une classe pour le style
    container.appendChild(newTable);
    console.log("Table créée dynamiquement.");
    return getHorseTable();
  }

  console.log("Table déjà existante.");
  return getHorseTable();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".pawn").forEach((pawn) => {
    pawn.addEventListener("click", () => movePawn(pawn));
    console.log(`Pion cliqué : ${pawn.id}`);
  });

  // Affichage du joueur actuel
  let playerName = players[current];
  let playerElement = document.getElementById("player");
  if (playerElement) {
    playerElement.textContent = "Joueur actuel : " + playerName;
  }

  // Lancer de dé
  const rollButton = document.getElementById("rollButton");
  if (rollButton) {
    rollButton.addEventListener("click", () => {
      diceRoll();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Initialisation du plateau de jeu
  const tableInstance = initHorsesTableInstance();
  const table = document.getElementById("table");

  if (!table) {
    console.error("Erreur critique : l'élément table est manquant.");
    return;
  }

  const boardSize = tableInstance.length / 4;
  const board = Array.from({ length: boardSize }, () =>
    Array(boardSize).fill(null)
  );

  const center = Math.floor(boardSize / 2);
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
      return "blue_light"; // Ligne centrale horizontale
    }
    if (j === center && i < center) {
      return "green_light"; // Colonne centrale verticale
    }
    if (i === center && j > center) {
      return "yellow_light"; // Ligne centrale horizontale
    }
    if (j === center && i > center) {
      return "red_light"; // Colonne centrale verticale
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

        // Ajouter les attributs data-i et data-j
        cell.setAttribute("data-i", i);
        cell.setAttribute("data-j", j);

        // Ajouter la case au tableau
        row.appendChild(cell);
        board[i][j] = cell;
      } else {
        cell.className = "center-empty";
        cell.dataset.nonTraversable = true;

        // Ajouter les attributs data-i et data-j
        cell.setAttribute("data-i", i);
        cell.setAttribute("data-j", j);

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

    // Sélectionner toutes les cellules du tableau (assurez-vous que les classes sont appliquées correctement)
    const cells = document.querySelectorAll("td");

    // Ajouter un écouteur d'événements pour chaque cellule
    cells.forEach((cell) => {
      cell.addEventListener("click", (event) => {
        // Vérifier les attributs data-i et data-j
        console.log(
          "Attributs data-i et data-j:",
          event.target.getAttribute("data-i"),
          event.target.getAttribute("data-j")
        );

        // Récupérer les coordonnées i et j à partir des attributs data-i et data-j
        const i = event.target.getAttribute("data-i");
        const j = event.target.getAttribute("data-j");

        // Afficher les coordonnées dans la console
        console.log(`Coordonnées de la cellule cliquée: i = ${i}, j = ${j}`);
      });
    });

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
  }

  console.log(boardSize); // Vérification de la taille du plateau
  console.log(board); // Vérification de la structure du plateau

  placeInitialPawns();
  // placePawnsAtBase(); // 🟢 Initialisation des pions à leurs bases
  placePawns("red", redbase);
  placePawns("blue", bluebase);
  placePawns("green", greenbase);
  placePawns("yellow", yellowbase);

  // Ajouter l'écouteur d'événements pour le déplacement des pions
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

      const playable = getPlayablePawns(color);
      if (!playable.includes(pawn)) {
        alert("Ce pion ne peut pas être déplacé !");
        return;
      }

      movePawn(pawn); // ← position doit être définie ici
      // Déplacer le pion
      //setTimeout(handlePostMove, 300); // Gérer la suite du tour après un petit délai
    }
  });
});
