import Piece from './Piece.js';

/**
 * Initializes the chess board with pieces in their starting positions.
 * @param {Array} board - The 2D array representing the chess board.
 */
function initBoard(board) {
    const piecesList = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];

    for (let x = 0; x < 8; x++) {
        board[x] = [];

        for (let y = 0; y < 8; y++) {
            if (x === 6) {
                board[x][y] = new Piece(x, y, "white", 'Pawn');
            } else if (x === 1) {
                board[x][y] = new Piece(x, y, "black", 'Pawn');
            } else if (x === 7) {
                board[x][y] = new Piece(x, y, "white", piecesList[y]);
            } else if (x === 0) {
                board[x][y] = new Piece(x, y, "black", piecesList[y]);
            }
        }
    }
}

/**
 * Updates the HTML representation of the chess board.
 * @param {Array} board - The 2D array representing the chess board.
 */
function updateGridHTML(board) {
    let divGrid = document.getElementById("gameGrid");
    divGrid.innerHTML = "";

    for (let x = 0; x < board.length; x++) {
        let divRow = document.createElement("div");
        divRow.setAttribute("class", "row");

        for (let y = 0; y < board.length; y++) {
            let divSquare = document.createElement("div");
            divSquare.setAttribute("id", `${x},${y}`);
            divSquare.setAttribute("class", "square");
            if (board[x][y] !== undefined) {
                divSquare.textContent = board[x][y].display();
            }

            if ((x + y) % 2) {
                divSquare.classList.add("dark");
            }
            else {
                divSquare.classList.add("light");
            }
            divRow.appendChild(divSquare);
        }

        divGrid.appendChild(divRow);
    }
}

/**
 * Adds click event listeners to each square on the chess board to handle piece movement.
 * @param {Array} board - The 2D array representing the chess board.
 */
function updateBoard(board) {
    let lastClick = undefined;
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            let divSquare = document.getElementById(`${x},${y}`);

            divSquare.addEventListener("click", () => {
                let temp = divSquare.getAttribute("id");
                let currentClick = { x: parseInt(temp[0]), y: parseInt(temp[2]) };

                if (lastClick !== undefined) {
                    if (currentClick.x === lastClick.x && currentClick.y === lastClick.y) {
                        lastClick = undefined;
                        divSquare.style.border = "";
                    }
                    else {
                        if (board[lastClick.x][lastClick.y].movementVerification(board, currentClick.x, currentClick.y)) {
                            board[lastClick.x][lastClick.y].setAlreadyMoved();
                            board[lastClick.x][lastClick.y].setX(currentClick.x);
                            board[lastClick.x][lastClick.y].setY(currentClick.y);
                            board[currentClick.x][currentClick.y] = board[lastClick.x][lastClick.y];
                            board[lastClick.x][lastClick.y] = undefined
                            lastClick = { x: parseInt(temp[0]), y: parseInt(temp[2]) };
                        }

                        updateGridHTML(board);
                        updateBoard(board);
                    }
                }
                else if (board[currentClick.x][currentClick.y] !== undefined) {
                    lastClick = { x: parseInt(temp[0]), y: parseInt(temp[2]) };
                    divSquare.style.border = "solid black 2px";

                    for (let i = 0; i < board.length; i++) {
                        for (let j = 0; j < board.length; j++) {
                            if (board[lastClick.x][lastClick.y].movementVerification(board, i, j)) {
                                document.getElementById(`${i},${j}`).style.border = "solid red 2px";
                            }
                        }
                    }
                }
            });
        }
    }
}


let board = [];
initBoard(board);
updateGridHTML(board);
updateBoard(board);
