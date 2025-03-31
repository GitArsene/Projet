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
      else {
        if(i == j && i <= tableInstance.length/8 - 1) cell.className = "red-c";
        else if(i == j && i >= tableInstance.length/8) cell.className = "yellow-c";
        else if(i == parseInt(tableInstance.length/4 - 1) - j && i <= tableInstance.length/8 - 1) cell.className = "green-c";
        else if(i == parseInt(tableInstance.length/4 - 1) - j && i >= tableInstance.length/8) cell.className = "blue-c";
        else if(i == j) cell.className = "end-c";
      }
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
  let redCellsC = document.querySelectorAll(".red-c");
  let yellowCellsC = document.querySelectorAll(".yellow-c");
  let blueCellsC = document.querySelectorAll(".blue-c");
  let greenCellsC = document.querySelectorAll(".green-c");
  let endCells = document.querySelectorAll(".end-c");
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

  let centerCount = 0;
  Array.from(redCellsC).forEach((cell) => {
    cell.id = centerCount + "R"; // Assign unique ID
    cell.innerHTML = centerCount + "R"; // Assign value
    centerCount++;
  });

  centerCount = 0;
  Array.from(greenCellsC).forEach((cell) => {
    cell.id = centerCount + "G"; // Assign unique ID
    cell.innerHTML = centerCount + "G"; // Assign value
    centerCount++;
  });

  centerCount = 0;
  Array.from(yellowCellsC).reverse().forEach((cell) => {
    cell.id = centerCount + "Y"; // Assign unique ID
    cell.innerHTML = centerCount + "Y"; // Assign value
    centerCount++;
  });

  centerCount = 0;
  Array.from(blueCellsC).reverse().forEach((cell) => {
    cell.id = centerCount + "B"; // Assign unique ID
    cell.innerHTML = centerCount + "B"; // Assign value
    centerCount++;
  });

  centerCount = 0;
  Array.from(endCells).forEach((cell) => {
    cell.id = centerCount + "E"; // Assign unique ID
    cell.innerHTML = centerCount + "E"; // Assign value
    centerCount++;
  });
});
