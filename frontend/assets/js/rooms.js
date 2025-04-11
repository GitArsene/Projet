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
