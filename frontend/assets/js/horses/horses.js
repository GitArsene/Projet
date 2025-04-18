// Se connecter au serveur WebSocket sur ws://localhost:8083
const ws = new WebSocket(`ws://${window.location.hostname}:8083`);

// Récupérer l'ID de salle depuis l'URL (ex: ?room=1234)
const urlParams = new URLSearchParams(window.location.search);
let roomId = urlParams.get("room");

if (!roomId) {
  alert("Aucune salle sélectionnée. Retour à la page de sélection.");
  window.location.href = "../../frontend/horses/horsesRoom.html";
}

console.log(roomId);

let playerColor;
let currentPlayerColor;
let players = [];
let board = [];
let lastDiceRoll = 0;
let canRoll = true;
let hasRolled = false;
let currentPlayerIndex = 0; // Index du joueur actuel

// Lors de l'ouverture de la connexion WebSocket
ws.onopen = () => {
  console.log("Connecté au serveur WebSocket.", roomId);
  ws.send(JSON.stringify({ type: "join", roomId: roomId }));
};

// Lors de la réception d'un message WebSocket
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Message reçu :", data); // Débogage

  if (data.type === "joined") {
    playerColor = data.color;
    players = data.players; // Récupérer la liste des joueurs

    if (!players || players.length === 0) {
      console.error("Erreur : la liste des joueurs est vide ou non définie.");
      alert("Erreur : impossible de récupérer la liste des joueurs. Veuillez réessayer.");
      return;
    }

    // Placez les pions uniquement si c'est la première fois
    if (document.querySelectorAll(".pawn").length === 0) {
      initHorsesTableInstance();
      placePawnsForAllPlayers();
    }

    setMenuScreen();
  } else if (data.type === "start") {
    resetMenuScreen(); // Masque le message "En attente d'autres joueurs"
    setPlayerTurn(players[0]); // Commence avec le premier joueur
    alert("Le jeu commence !");
  } else if (data.type === "nextTurn") {
    currentPlayerIndex = players.indexOf(data.color); // Met à jour l'index du joueur actuel
    setPlayerTurn(data.color); // Passe au joueur suivant
    lastDiceRoll = data.lastDiceRoll || 0; // Met à jour le dernier lancer de dé si inclus
  } else if (data.type === "move") {
    handleOpponentMove(data.color, data.pawnId, data.newPosition);
  } else if (data.type === "error") {
    alert("Erreur : " + data.message);
    window.location.href = "../../frontend/horses/horsesRoom.html";
  } else if (data.type === "disconnected") {
    setMenuScreen();
  } else if (data.type === "diceRoll") {
    if (data.color !== playerColor) {
      document.getElementById("dice").textContent = data.result;
      updateDiceMessage(
        `Le joueur ${data.color} a lancé un ${data.result}`,
        data.color
      );
    }
  } else if (data.type === "gameOver") {
    alert(data.message);
    setTimeout(() => {
      window.location.href = "../../frontend/horses/horsesRoom.html";
    }, 3000);
  } else if (data.type === "pawnTaken") {
    const pawn = document.getElementById(data.pawnId);
    if (pawn) {
      sendPawnToBase(pawn); // Renvoie le pion à la base
    }
  } else if (data.type === "pawnReachedCenter") {
    const pawn = document.getElementById(data.pawnId);
    if (pawn) {
      pawn.remove(); // Supprime le pion du DOM
    }
  }
};

// Définit le joueur actuel
function setPlayerTurn(color) {
  currentPlayerColor = color;

  // Traduire les couleurs en français
  const colorInFrench = {
    red: "Rouge",
    blue: "Bleu",
    green: "Vert",
    yellow: "Jaune",
  };

  document.getElementById("player").textContent = `Joueur actuel : ${colorInFrench[color]}`;
  canRoll = true;
  hasRolled = false;
  lastDiceRoll = 0;

  // Vérifie si c'est au tour du joueur local
  if (color === playerColor) {
    document.getElementById("turnIndicator").classList.remove("inactive");
  } else {
    document.getElementById("turnIndicator").classList.add("inactive");
  }
}

// Gère le lancer de dé
function diceRoll() {
  if (!canRoll || hasRolled || currentPlayerColor !== playerColor) {
    updateDiceMessage("Ce n'est pas votre tour !", playerColor);
    return;
  }

  canRoll = false;
  hasRolled = true;

  lastDiceRoll = Math.floor(Math.random() * 6) + 1;
  console.log("Lancer de dé : ", lastDiceRoll);

  document.getElementById("dice").textContent = lastDiceRoll;

  // Afficher le résultat dans la section des dés
  updateDiceMessage(`Vous avez lancé un ${lastDiceRoll}`, playerColor);

  // Envoyer le résultat du lancer de dé au serveur
  ws.send(
    JSON.stringify({
      type: "diceRoll",
      color: playerColor,
      result: lastDiceRoll,
    })
  );

  const playable = getPlayablePawns(playerColor);

  if (playable.length === 0) {
    document.getElementById("turnIndicator").classList.add("inactive");
    setTimeout(() => {
      endTurn();
    }, 500);
  } else {
    document.getElementById("turnIndicator").classList.remove("inactive");
    updateDiceMessage("Déplace un de vos pions !", playerColor);
  }
}

// Passe au joueur suivant
function nextPlayer() {
  const currentIndex = players.indexOf(currentPlayerColor);
  const nextIndex = (currentIndex + 1) % players.length;
  setPlayerTurn(players[nextIndex]);
}

// Gère les mouvements des pions
function movePawn(pawn) {
  if (!hasRolled || lastDiceRoll === 0 || pawn.dataset.color !== playerColor) {
    alert("Tu dois d'abord lancer le dé ou ce n'est pas ton tour !");
    return;
  }

  const playable = getPlayablePawns(playerColor);
  if (!playable.includes(pawn)) return;

  const currentPosition = parseInt(pawn.dataset.position);
  const path = playerPaths[playerColor];
  const newIndex = currentPosition === -1 ? 0 : currentPosition + lastDiceRoll;

  if (newIndex >= path.length) {
    alert("Ce pion ne peut pas être déplacé !");
    return;
  }

  const targetCoord = path[newIndex];
  const table = document.querySelector("table");
  const targetCell = table.rows[targetCoord.i].cells[targetCoord.j];

  // Vérifie les pions dans la case cible
  const otherPawns = Array.from(targetCell.querySelectorAll(".pawn"));
  for (let other of otherPawns) {
    if (other.dataset.color === playerColor) {
      alert("Un pion allié est déjà sur cette case !");
      return;
    } else {
      sendPawnToBase(other); // Renvoie uniquement les pions adverses
    }
  }

  // Déplace le pion
  targetCell.appendChild(pawn);
  pawn.dataset.position = newIndex;

  // Vérifie si le pion atteint le dernier emplacement
  if (newIndex === path.length - 1) {
    alert(`Le pion ${pawn.id} a atteint la fin du chemin !`);
    pawn.remove(); // Supprime le pion du DOM

    // Notifier le serveur qu'un pion a atteint le centre
    ws.send(
      JSON.stringify({
        type: "pawnReachedCenter",
        color: playerColor,
        pawnId: pawn.id,
      })
    );

    checkWinCondition(playerColor); // Vérifie si tous les pions de cette couleur ont terminé
  }

  // Envoie le mouvement au serveur
  ws.send(
    JSON.stringify({
      type: "move",
      color: playerColor,
      pawnId: pawn.id,
      newPosition: newIndex,
    })
  );

  handlePostMove();
}

// Gère les mouvements des adversaires
function handleOpponentMove(color, pawnId, newPosition) {
  const pawn = document.getElementById(pawnId);
  const path = playerPaths[color];
  const targetCoord = path[newPosition];
  const table = document.querySelector("table");
  const targetCell = table.rows[targetCoord.i].cells[targetCoord.j];

  // Déplace le pion
  targetCell.appendChild(pawn);
  pawn.dataset.position = newPosition;
}

// Place les pions pour tous les joueurs
function placePawnsForAllPlayers() {
  players.forEach((color) => {
    // Vérifiez si les pions de cette couleur existent déjà
    const existingPawns = document.querySelectorAll(`.${color}-pawn`);
    if (existingPawns.length > 0) {
      console.log(`Les pions pour ${color} existent déjà. Ignoré.`);
      return;
    }

    placePawns(color, baseCoordinates[color]);
  });
}

// Nettoie et passe au joueur suivant après un mouvement
function handlePostMove() {
  if (lastDiceRoll === 6) {
    alert("Tu as fait un 6 ! Tu peux rejouer.");
    canRoll = true;
    hasRolled = false;
    lastDiceRoll = 0;
  } else {
    setTimeout(() => {
      endTurn(); // Notifie le serveur que le tour est terminé
    }, 500);
  }
}

// Définit l'écran de menu
function setMenuScreen() {
  document.getElementById("waitingMessage").classList.remove("inactive");
  document.getElementById("turnIndicator").classList.add("inactive");
}

// Réinitialise l'écran de menu
function resetMenuScreen() {
  document.getElementById("waitingMessage").classList.add("inactive"); // Masque le message "En attente d'autres joueurs"
  document.getElementById("turnIndicator").classList.add("inactive"); // Masquer par défaut
}

// Ajoute les événements DOM
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("rollButton").addEventListener("click", diceRoll);

  document.querySelectorAll(".pawn").forEach((pawn) => {
    pawn.addEventListener("click", () => movePawn(pawn));
  });
});

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
  // Vérifie si le pion est déjà dans la base
  if (pawn.dataset.position === "-1") {
    console.log(`Le pion ${pawn.id} est déjà dans la base. Ignoré.`);
    return;
  }

  const table = document.querySelector("table");
  const color = pawn.dataset.color;
  const index = parseInt(pawn.dataset.index);

  const baseCoord = baseCoordinates[color][index];
  const targetCell = table.rows[baseCoord.i].cells[baseCoord.j];

  targetCell.appendChild(pawn);
  pawn.dataset.position = -1; // De retour à la base
  pawn.classList.add("in-base");

  // Notifier le serveur qu'un pion a été pris
  ws.send(
    JSON.stringify({
      type: "pawnTaken",
      color: color,
      pawnId: pawn.id,
    })
  );
}

function placePawns(color, baseCoordinates) {
  const existingPawns = document.querySelectorAll(`.${color}-pawn`);
  if (existingPawns.length > 0) {
    console.log(`Les pions pour ${color} existent déjà. Ignoré.`);
    return;
  }

  const table = document.querySelector("table");

  baseCoordinates.forEach((coord, index) => {
    const row = table.rows[coord.i];
    const cell = row.cells[coord.j];

    const pawn = document.createElement("div");
    pawn.classList.add("pawn", `${color}-pawn`); // Ajoute les classes pour le style du pion
    pawn.id = `pawn-${color}-${index + 1}`; // ID unique pour chaque pion

    // Ajout des données personnalisées au pion
    pawn.dataset.position = -1; // Position initiale
    pawn.dataset.color = color; // Couleur du pion
    pawn.dataset.index = index; // Index du pion

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
      if (players[currentPlayerIndex] !== color) {
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

      movePawn(pawn); // Déplace le pion
    }
  });
});

function endTurn() {
  ws.send(JSON.stringify({ type: "endTurn", color: playerColor }));
}

function updateDiceMessage(message, color) {
  const colorInFrench = {
    red: "Rouge",
    blue: "Bleu",
    green: "Vert",
    yellow: "Jaune",
  };

  const diceMessage = document.getElementById("diceMessage");
  diceMessage.textContent = `${message} (${colorInFrench[color]})`;
  diceMessage.className = `active ${color}`; // Ajoute les classes dynamiquement

  // Masquer le message après 3 secondes
  setTimeout(() => {
    diceMessage.className = "inactive";
  }, 3000);
}

function checkWinCondition(color) {
  const remainingPawns = document.querySelectorAll(`.${color}-pawn`);
  if (remainingPawns.length === 0) {
    alert(`Le joueur ${color} a gagné la partie !`);
    ws.send(
      JSON.stringify({
        type: "win",
        color: color,
      })
    );

    // Redirige tous les joueurs vers la page d'accueil
    setTimeout(() => {
      window.location.href = "../../frontend/horses/horsesRoom.html";
    }, 3000);
  }
}
