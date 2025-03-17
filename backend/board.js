import Piece from './Piece.js';

/**
 * Initializes the chess board with pieces in their starting positions.
 * @param {Array} board - The 2D array representing the chess board.
 */
function initBoard(board) {
    // List of chess pieces for the back row, from left to right
    const piecesList = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];

    // Loop through each row of the board
    for (let x = 0; x < 8; x++) {
        board[x] = []; // Initialize the row

        for (let y = 0; y < 8; y++) {
            // Set up the pawns
            if (x === 6) {
                board[x][y] = new Piece(x, y, "white", 'Pawn'); // White pawns on the 7th row
            } else if (x === 1) {
                board[x][y] = new Piece(x, y, "black", 'Pawn'); // Black pawns on the 2nd row
            } 
            // Set up the other pieces
            else if (x === 7) {
                board[x][y] = new Piece(x, y, "white", piecesList[y]); // White major pieces on the 8th row
            } else if (x === 0) {
                board[x][y] = new Piece(x, y, "black", piecesList[y]); // Black major pieces on the 1st row
            }
        }
    }
}

/**
 * Updates the HTML representation of the chess board.
 * @param {Array} board - The 2D array representing the chess board.
 */
function updateGridHTML(board) {
    // Get the HTML element that will contain the chess grid
    let divGrid = document.getElementById("gameGrid");
    // Clear any previous content of the grid to ensure a fresh update
    divGrid.innerHTML = "";

    // Iterate through each row of the board
    for (let x = 0; x < board.length; x++) {
        // Create a div element to represent the current row
        let divRow = document.createElement("div");
        divRow.setAttribute("class", "row");

        // Iterate through each square in the row
        for (let y = 0; y < board.length; y++) {
            // Create a div element for the current square
            let divSquare = document.createElement("div");
            divSquare.setAttribute("id", `${x},${y}`); // Set the id of the square for reference (x,y coordinates)
            divSquare.setAttribute("class", "square");
            // If the square is occupied by a piece, display its symbol
            if (board[x][y] !== undefined) {
                divSquare.textContent = board[x][y].display();
            }
            // Check if the square should be dark or light (alternating colors)
            if ((x + y) % 2) {
                divSquare.classList.add("dark");
            }
            else {
                divSquare.classList.add("light");
            }
            // Append the square to the current row
            divRow.appendChild(divSquare);
        }
        // Append the row to the grid
        divGrid.appendChild(divRow);
    }
}

/**
 * Adds click event listeners to each square on the chess board to handle piece movement.
 * @param {Array} board - The 2D array representing the chess board.
 */
function updateBoard(board) {
    let lastClick = undefined; // Keeps track of the last clicked square
    // Iterate through each square on the chess board
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            // Get the div element corresponding to the current square
            let divSquare = document.getElementById(`${x},${y}`);
            // Add a click event listener to the square
            divSquare.addEventListener("click", () => {
                let temp = divSquare.getAttribute("id"); // Get the current square's ID
                let currentClick = { x: parseInt(temp[0]), y: parseInt(temp[2]) }; // Get the current clicked square's coordinates

                // If there was a previous click (piece was selected previously)
                if (lastClick !== undefined) {
                    // If the same square is clicked again, deselect it
                    if (currentClick.x === lastClick.x && currentClick.y === lastClick.y) {
                        lastClick = undefined; // Deselect the piece
                        divSquare.style.border = ""; // Remove the border highlighting
                    }
                    else {
                        // Validate the movement of the piece
                        if (board[lastClick.x][lastClick.y].movementVerification(board, currentClick.x, currentClick.y)) {
                            // Move the piece to the new location
                            board[lastClick.x][lastClick.y].setAlreadyMoved();
                            board[lastClick.x][lastClick.y].setX(currentClick.x);
                            board[lastClick.x][lastClick.y].setY(currentClick.y);
                            board[currentClick.x][currentClick.y] = board[lastClick.x][lastClick.y];
                            board[lastClick.x][lastClick.y] = undefined

                            lastClick = { x: parseInt(temp[0]), y: parseInt(temp[2]) };
                        }

                        // Update the board and re-add event listeners after a valid move
                        updateGridHTML(board);
                        updateBoard(board);
                    }
                }
                // If no piece has been selected yet
                else if (board[currentClick.x][currentClick.y] !== undefined) {
                    // Select the piece and highlight it
                    lastClick = { x: parseInt(temp[0]), y: parseInt(temp[2]) };
                    divSquare.style.border = "solid black 2px"; // Highlight the selected piece

                    // Highlight all possible moves for the selected piece
                    for (let i = 0; i < board.length; i++) {
                        for (let j = 0; j < board.length; j++) {
                            // If the piece can move to a square, highlight that square
                            if (board[lastClick.x][lastClick.y].movementVerification(board, i, j)) {
                                document.getElementById(`${i},${j}`).style.border = "solid red 2px"; // Show possible moves
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
