// === Définition des chemins pour chaque joueur === //
export const redPath = [
  { i: 3, j: 10 },
  { i: 3, j: 9 },
  { i: 3, j: 8 },
  { i: 3, j: 7 },
  { i: 3, j: 6 },
  { i: 4, j: 6 },
  { i: 5, j: 6 },
  { i: 6, j: 6 },
  { i: 6, j: 5 },
  { i: 6, j: 4 },
  { i: 6, j: 3 },
  { i: 7, j: 3 },
  { i: 8, j: 3 },
  { i: 9, j: 3 },
  { i: 10, j: 3 },
  { i: 10, j: 4 },
  { i: 10, j: 5 },
  { i: 10, j: 6 },
  { i: 9, j: 6 },
  { i: 8, j: 6 },
  { i: 7, j: 6 },
  { i: 6, j: 6 },
  { i: 6, j: 7 },
  { i: 6, j: 8 },
  { i: 6, j: 9 },
  { i: 6, j: 10 },
  { i: 5, j: 10 },
  { i: 4, j: 10 },
];

export const bluePath = [
  { i: 3, j: 0 },
  { i: 3, j: 1 },
  { i: 3, j: 2 },
  { i: 3, j: 3 },
  { i: 3, j: 4 },
  { i: 4, j: 4 },
  { i: 5, j: 4 },
  { i: 6, j: 4 },
  { i: 6, j: 5 },
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
  { i: 3, j: 0 },
];

export const greenPath = [
  { i: 10, j: 10 },
  { i: 9, j: 10 },
  { i: 8, j: 10 },
  { i: 7, j: 10 },
  { i: 6, j: 10 },
  { i: 6, j: 9 },
  { i: 6, j: 8 },
  { i: 6, j: 7 },
  { i: 6, j: 6 },
  { i: 5, j: 6 },
  { i: 4, j: 6 },
  { i: 3, j: 6 },
  { i: 3, j: 7 },
  { i: 3, j: 8 },
  { i: 3, j: 9 },
  { i: 3, j: 10 },
  { i: 4, j: 10 },
  { i: 5, j: 10 },
  { i: 6, j: 10 },
  { i: 7, j: 10 },
  { i: 8, j: 10 },
  { i: 9, j: 10 },
  { i: 10, j: 10 },
];

export const yellowPath = [
  { i: 10, j: 3 },
  { i: 9, j: 3 },
  { i: 8, j: 3 },
  { i: 7, j: 3 },
  { i: 6, j: 3 },
  { i: 6, j: 2 },
  { i: 6, j: 1 },
  { i: 6, j: 0 },
  { i: 5, j: 0 },
  { i: 4, j: 0 },
  { i: 3, j: 0 },
  { i: 3, j: 1 },
  { i: 3, j: 2 },
  { i: 3, j: 3 },
  { i: 3, j: 4 },
  { i: 4, j: 4 },
  { i: 5, j: 4 },
  { i: 6, j: 4 },
  { i: 6, j: 5 },
  { i: 6, j: 6 },
  { i: 7, j: 6 },
  { i: 8, j: 6 },
  { i: 9, j: 6 },
  { i: 10, j: 6 },
];

// Map générale
export const playerPaths = {
  red: redPath,
  blue: bluePath,
  green: greenPath,
  yellow: yellowPath,
};
