let players = ["red", "yellow", "blue", "green"];
let current = 0;

function setPlayer(){
  let playerText = document.getElementById("player");
  playerText.innerHTML = players[current];
}

setPlayer();

function diceRoll(){
  let randomNumber = Math.floor(Math.random() * 6) + 1;
  let dice = document.getElementById("dice");
  dice.innerHTML = randomNumber;

  console.log("Current player: " + players[current]);

  if (current != 3) current++;
  else current = 0;

  setPlayer();
  return randomNumber;
}

async function initHorsesTableInstance() {
  const response = await fetch("http://localhost:3000/api/getTableHorses");
  const data = await response.json();

  return data;
}

document.addEventListener("DOMContentLoaded", async function () {
  let tableInstance = await initHorsesTableInstance();
  let table = document.getElementById("table");
  for (let i = 0; i < tableInstance.length / 4; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < tableInstance.length / 4; j++) {
      let cell = document.createElement("td");
      if (i == 0 && j != tableInstance.length/4 - 1) cell.className = "red";
      else if (i == tableInstance.length/4 - 1 && j != 0) cell.className = "yellow";
      else if (j == 0) cell.className = "blue";
      else if (j === tableInstance.length/4 - 1) cell.className = "green";
      cell.classList.add("cell");
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  // Iterate through colors
  let redCells = document.querySelectorAll(".red");
  let yellowCells = document.querySelectorAll(".yellow");
  let blueCells = document.querySelectorAll(".blue");
  let greenCells = document.querySelectorAll(".green");
  // Iterate through red cells
  let count = 0;
  Array.from(redCells).forEach((cell) => {
    cell.id = count; // Assign unique ID
    cell.innerHTML = count; // Assign value
    count++;
  });

  Array.from(greenCells).forEach((cell) => {
    cell.id = count; // Assign unique ID
    cell.innerHTML = count; // Assign value
    count++;
  });

  Array.from(yellowCells).reverse().forEach((cell) => {
    cell.id = count; // Assign unique ID
    cell.innerHTML = count; // Assign value
    count++;
  });

  Array.from(blueCells).reverse().forEach((cell) => {
    cell.id = count; // Assign unique ID
    cell.innerHTML = count; // Assign value
    count++;
  });
});
