// function createGame() {
//   let gameId = Math.random().toString(36).substr(2, 6);
//   alert("Partie créée ! Code: " + gameId);
//   window.location.href = "game.html?code=" + gameId;
// }

// function joinGame() {
//   let code = document.getElementById("gameCode").value;
//   if (code) {
//     window.location.href = "game.html?code=" + code;
//   } else {
//     alert("Veuillez entrer un code !");
//   }
// }

function toggleMode() {
  document.body.classList.toggle("dark-mode");
  let isDark = document.body.classList.contains("dark-mode");

  // Changer le texte du bouton
  let modeButton = document.querySelector(".btn-mode");
  if (isDark) {
    modeButton.textContent = "dark mode 🌙";
  } else {
    modeButton.textContent = "light mode ☀️";
  }

  // Sauvegarde dans localStorage
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}

// Vérifier le mode stocké et ajuster le texte au chargement
window.onload = function () {
  let modeButton = document.querySelector(".btn-mode");
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    modeButton.textContent = "dark mode 🌙";
  }
};
