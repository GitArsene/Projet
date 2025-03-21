import { initBoard, movePiece, isStalemate, isCheckmate } from "./board.js";

/**
 * Updates the HTML representation of the chess board.
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
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

            // Add a warning if the king is in check
            if (board[x][y] !== undefined && board[x][y].type === "King") {
                if (board[x][y].inCheck(board, x, y)) {
                    divSquare.style.border = "solid red 2px";
                }
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
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 */
function setUpBoardInteraction(board) {
    let lastClick = undefined; // Keeps track of the last clicked square
    // Iterate through each square on the chess board
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            // Get the div element corresponding to the current square
            let divSquare = document.getElementById(`${x},${y}`);
            // Add a click event listener to the square
            divSquare.addEventListener("click", async () => {
                let temp = divSquare.getAttribute("id"); // Get the current square's ID
                let currentClick = { x: parseInt(temp[0]), y: parseInt(temp[2]) }; // Get the current clicked square's coordinates
                lastClick = await handlePlayerClick(board, lastClick, currentClick); // Handle the square click and update the last clicked square
            });
        }
    }
}

/**
 * Highlights possible moves for a piece on the board.
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 * @param {number} x - The x-coordinate of the piece on the board.
 * @param {number} y - The y-coordinate of the piece on the board.
 */
function highlightPossibleMoves(board, x, y) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            // If the piece can move to a square, highlight that square
            if (board[x][y].movementVerification(board, i, j)) {
                document.getElementById(`${i},${j}`).style.border = "solid white 2px"; // Show possible moves
            }
        }
    }
}

/**
 * Selects a chess piece on the board, highlights it, and highlights all possible moves for the selected piece.
 *
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 * @param {Object} square - The square coordinate containing the piece to be selected.
 * @param {number} square.x - The x-coordinate of the square.
 * @param {number} square.y - The y-coordinate of the square.
 * @returns {Object} The selected square coordinate.
 */
function selectPiece(board, square) {
    // Select the piece and highlight it
    document.getElementById(`${square.x},${square.y}`).style.border = "solid black 2px"; // Highlight the selected piece

    // Highlight all possible moves for the selected piece
    highlightPossibleMoves(board, square.x, square.y);

    return square;
}

/**
 * Handles the logic for when a player clicks on a square on the chessboard.
 *
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 * @param {Object|undefined} lastClick - The coordinates of the last clicked square, or undefined if no square was previously selected.
 * @param {Object} currentClick - The coordinates of the currently clicked square.
 * @param {number} currentClick.x - The x-coordinate of the clicked square.
 * @param {number} currentClick.y - The y-coordinate of the clicked square.
 * @returns {Object|undefined} The updated lastClick object, or undefined if the selection was cleared.
 */
async function handlePlayerClick(board, lastClick, currentClick) {
    // If there was a previous click (piece was selected previously)
    if (lastClick !== undefined) {
        // If the same square is clicked again, deselect it
        if (currentClick.x === lastClick.x && currentClick.y === lastClick.y) {
            lastClick = undefined; // Deselect the piece
        }
        else {
            updateGridHTML(board);
            let opponentColor = board[lastClick.x][lastClick.y].color === "white" ? "black" : "white"
            movePiece(board, lastClick, currentClick);

            // check if a pawn has reached the end of the board
            for (let y = 0; y < board.length; y++) {
                let x = opponentColor === "white" ? 7 : 0;
                if ((board[x][y] !== undefined && board[x][y].type === "Pawn")) {
                    // Display the promotion screen
                    document.getElementById("promotionScreen").style.display = "flex";
                    // Promote the pawn
                    await promotePiece(board, x, y);
                    // Hide the promotion screen
                    document.getElementById("promotionScreen").style.display = "none";
                    break;
                }
            }

            // Check if the game has ended
            if (isCheckmate(board, opponentColor) || isStalemate(board, opponentColor)) {
                endgame();
                updateGridHTML(board);
                return;
            }
        }

        // Update the board and re-add event listeners
        updateGridHTML(board);
        setUpBoardInteraction(board);
    }
    // If no piece has been selected yet
    else if (board[currentClick.x][currentClick.y] !== undefined) {
        // Select the piece, highlight it and all possible moves it, and set it as the last clicked piece
        lastClick = selectPiece(board, currentClick);
    }

    return lastClick;
}

/**
 * Handles the promotion of pawns when they reach the end of the board.
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 * @param {number} x - The x-coordinate of the pawn to be promoted.
 * @param {number} y - The y-coordinate of the pawn to be promoted.
 */
async function promotePiece(board,x , y) {
    let buttons = document.querySelectorAll("#promotionScreen button");
    let pieceType = null;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            pieceType = button.id; // Assign the id of the clicked button to pieceType

            // Promote the pawns
            board[x][y].promote(pieceType);
        });
    });

    while (pieceType === null) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait until a button is clicked
    } 
    
    // Remove the event listeners from all buttons after one is clicked
    buttons.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
}

/**
 * Displays the endgame screen by setting the "winLoseScreen" element's display style to "flex".
 */
function endgame() {
    let winLoseScreen = document.getElementById("winLoseScreen");
    winLoseScreen.style.display = "flex";
}

/**
 * Initializes and starts the chess game by setting up the board, 
 * hiding unnecessary screens, and enabling board interactions.
 */
function play() {
    document.getElementById("winLoseScreen").style.display = "none";
    document.getElementById("promotionScreen").style.display = "none";

    let board = [];
    initBoard(board);
    updateGridHTML(board);
    setUpBoardInteraction(board);
}

play();

window.play = play;



// TODO: en passant
// TODO: tour par tour
// TODO: drag and drop
// TODO: separate frontend and backend