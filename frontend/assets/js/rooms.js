document
  .getElementById("joinRoomFormChess")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Utilisez l'id correct de l'input
    const roomId = document.getElementById("roomIdChess").value;
    // Redirige directement vers la page de jeu avec l'ID de salle
    window.location.href = `/frontend/chess/chess.html?room=${encodeURIComponent(
      roomId
    )}`;
  });

document.addEventListener("DOMContentLoaded", async function () {
  let response = await fetch("/api/chess/rooms");
  if (response.ok) {
    let data = await response.json();
    console.log(data);
    let c = 0;
    for (let i = 0; i < data.length; i++) {
      let roomId = data[i];
      let roomButton = document.createElement("button");
      roomButton.textContent = "Rejoindre la salle " + roomId;
      roomButton.classList.add("room-button");
      roomButton.addEventListener("click", function () {
        // Redirige vers la page de jeu avec l'ID de salle
        window.location.href = `/frontend/chess/chess.html?room=${encodeURIComponent(
          roomId
        )}`;
      });
      document.getElementById("roomList").appendChild(roomButton);
    }
  } else {
    console.error(
      "Erreur lors de la récupération des salles :",
      response.status
    );
  }
});