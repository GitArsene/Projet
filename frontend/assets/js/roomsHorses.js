document
  .getElementById("joinRoomFormHorses")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page
    // Utilisez l'id correct de l'input
    const roomId = document.getElementById("roomIdHorses").value;
    // Redirige directement vers la page de jeu avec l'ID de salle
    window.location.href = `/frontend/horses/horses.html?room=${encodeURIComponent(
      roomId
    )}`;
  });

document.addEventListener("DOMContentLoaded", async function () {
  let responseHorses = await fetch("/api/horses/rooms");
  if (responseHorses.ok) {
    let data = await responseHorses.json();
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      let roomId = data[i];
      let roomButton = document.createElement("button");
      roomButton.textContent = "Rejoindre la salle " + roomId;
      roomButton.classList.add("room-button");
      roomButton.addEventListener("click", function () {
        // Redirige vers la page de jeu avec l'ID de salle
        window.location.href = `/frontend/horses/horses.html?room=${encodeURIComponent(
          roomId
        )}`;
      });
      document.getElementById("roomList").appendChild(roomButton);
    }
  }
});
