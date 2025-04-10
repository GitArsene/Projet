document
  .getElementById("joinRoomFormHorses")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    let roomId = document.getElementById("roomIdHorses").value;

    // Appel de la fonction joinRoom avec les valeurs du formulaire
    joinRoom(roomId, playerName, playerColor);
  });
