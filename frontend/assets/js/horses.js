document
  .getElementById("horsesGET")
  .addEventListener("click", async function () {
    let horsesGET = document.createElement("p");
    horsesGET.innerHTML = await fetchHorsesGET();
    document.getElementById("horsesGET").after(horsesGET);
  });

document.addEventListener("DOMContentLoaded", async function () {
  const horsesTableInstance = await initHorsesTableInstance();
});

async function fetchHorsesGET() {
  const response = await fetch("http://localhost:3000/api/horsesGET");
  const data = await response.text();

  return data;
}

async function initHorsesTable() {
  const response = await fetch("http://localhost:3000/api/getTableHorses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerAmount: 4}), // 4 for debugging purposes
  });
  const data = await response.json();

  return data;
}
