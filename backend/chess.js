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
        divRow.classList.add("row");

        // Iterate through each square in the row
        for (let y = 0; y < board.length; y++) {
            // Create a div element for the current square
            let divSquare = document.createElement("div");
            divSquare.setAttribute("id", `${x},${y}`); // Set the id of the square for reference (x,y coordinates)
            divSquare.classList.add("square"); // Add a class to style the square

            let divPiece = document.createElement("div"); // Create a div for the piece
            divPiece.classList.add("piece");

            if (board[x][y] !== undefined) {
                // If the square is occupied by a piece, display its symbol
                divPiece.textContent = board[x][y].display();
                // Add a warning if the king is in check
                if (board[x][y].type === "King" && board[x][y].inCheck(board, x, y)) {
                    divSquare.classList.add("check"); // Add a class to indicate the king is in check
                }
            }
            divSquare.appendChild(divPiece);

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
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 */
function setUpBoardInteraction(board) {
    let lastClick = undefined; // Keeps track of the last clicked square

    // Iterate through each square on the chess board
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            // Get the div element corresponding to the current square
            let divSquare = document.getElementById(`${x},${y}`).firstChild;
            let currentClick = { x: x, y: y }; // Get the current clicked square's coordinates
            // Variables to handle drag-and-drop functionality
            let isDragging = false;
            let times = 0; // Counter for mouse clicks

            // Add a mousedown event to start dragging
            if (board[x][y] !== undefined && board[x][y].color === currentPlayerColor) {
                divSquare.addEventListener("mousedown", () => {
                    isDragging = true;
                    unselectPiece(board); // Unselect the piece and remove highlights
                    lastClick = selectPiece(board, currentClick); // Select the piece and highlight it
                    // Add a class to the div to indicate it's being dragged
                    divSquare.classList.add("dragging");
                });
            }

            // Add a mousemove event to move the div while dragging
            document.addEventListener("mousemove", (event) => {
                if (isDragging) {
                    // Update the position of the div to follow the mouse cursor
                    divSquare.style.left = `${event.clientX - divSquare.offsetWidth / 2}px`;
                    divSquare.style.top = `${event.clientY - divSquare.offsetHeight / 2}px`;
                }
            });

            // Add a mouseup event to stop dragging
            document.addEventListener("mouseup", async (event) => {
                if (isDragging) {
                    // Stop dragging the div and remove the dragging class
                    divSquare.classList.remove("dragging");
                    divSquare.style.left = "";
                    divSquare.style.top = "";
                    times++;

                    // Get the element under the mouse pointer
                    const hoveredElementId = document.elementFromPoint(event.clientX, event.clientY)?.parentElement?.id;
                    if (hoveredElementId) {
                        // Handle the square click and update the last clicked square
                        if (hoveredElementId !== `${x},${y}`) {
                            let hoveredClick = { x: Number(hoveredElementId[0]), y: Number(hoveredElementId[2]) }; // Get the coordinates of the square under the mouse pointer
                            isDragging = false;
                            times = 0;
                            await handlePlayerMove(board, lastClick, hoveredClick);
                        }
                        else if (times > 1) {
                            // If the mouse is released outside the board, unselect the piece
                            unselectPiece(board);
                            lastClick = undefined;
                            isDragging = false;
                            times = 0;
                        }
                    }
                }
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
    let moves = board[x][y].getPossibleMoves(board); // Get the possible moves for the piece
    moves.forEach(move => {
        // Highlight the squares where the piece can move
        document.getElementById(`${move.x},${move.y}`).firstChild.classList.add("highlighted");
    });
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
    document.getElementById(`${square.x},${square.y}`).classList.add("selected");
    // Highlight all possible moves for the selected piece
    highlightPossibleMoves(board, square.x, square.y);

    return square;
}

/**
 * Unselects a chess piece on the board by removing highlights and borders from all possible moves.
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 */
function unselectPiece(board) {
    // Remove highlights and border from all possible moves
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            document.getElementById(`${i},${j}`).classList.remove("selected");
            document.getElementById(`${i},${j}`).firstChild.classList.remove("highlighted");
        }
    }
}

/**
 * Handles the logic for when a player clicks on a square on the chessboard.
 *
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 * @param {Object|undefined} lastClick - The coordinates of the last clicked square, or undefined if no square was previously selected.
 * @param {Object} currentClick - The coordinates of the currently clicked square.
 */
async function handlePlayerMove(board, lastClick, currentClick) {
    // If there was a previous click (piece was selected previously)
    if (lastClick !== undefined) {
        // If the clicked square is different from the last clicked square
        if (currentClick.x !== lastClick.x || currentClick.y !== lastClick.y) {
            updateGridHTML(board);
            let movingPiece = board[lastClick.x][lastClick.y];
            let opponentColor = movingPiece.color === "white" ? "black" : "white";

            // If the move is valid, move the piece and switch players
            if (movingPiece.movementVerification(board, currentClick.x, currentClick.y)) {
                if (movePiece(board, lastClick, currentClick)) {
                    currentPlayerColor = opponentColor;
                }
            }

            // check if a pawn has reached the end of the board
            for (let y = 0; y < board.length; y++) {
                let x = opponentColor === "white" ? 7 : 0;
                if ((board[x][y] !== undefined && board[x][y].type === "Pawn")) {
                    // Promote the pawn
                    await promotePiece(board, x, y);
                    break;
                }
            }

            // Check if the game has ended
            if (isCheckmate(board, opponentColor) || isStalemate(board, opponentColor)) {
                endgame();
                updateGridHTML(board);
                return;
            }

            // Update the board and re-add event listeners
            updateGridHTML(board);
            setUpBoardInteraction(board);
        }
    }
}

/**
 * Handles the promotion of pawns when they reach the end of the board.
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 * @param {number} x - The x-coordinate of the pawn to be promoted.
 * @param {number} y - The y-coordinate of the pawn to be promoted.
 */
async function promotePiece(board, x, y) {
    // Display the promotion screen
    document.getElementById("promotionScreen").classList.add("active");

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

    // Hide the promotion screen
    document.getElementById("promotionScreen").classList.remove("active");
}

/**
 * Displays the endgame screen by setting the "winLoseScreen" element's display style to "flex".
 */
function endgame() {
    let winLoseScreen = document.getElementById("winLoseScreen");
    winLoseScreen.classList.add("active"); // Show the endgame screen
}

/**
 * Initializes and starts the chess game by setting up the board, 
 * hiding unnecessary screens, and enabling board interactions.
 */
function play() {
    document.getElementById("winLoseScreen").classList.remove("active");
    document.getElementById("promotionScreen").classList.remove("active");
    currentPlayerColor = "white";

    let board = [];
    initBoard(board);
    updateGridHTML(board);
    setUpBoardInteraction(board);

    // Start bot moves
    //handleBotMoves(board, "black");
    //handleBotMoves(board, "white");
}

window.play = play;
window.lastMove; // Keep track of the last move made
let currentPlayerColor; // Keep track of the current player color
play(); // Start the game



// TODO: separate frontend and backend code
// TODO: websocket communication for multiplayer
// TODO: SCOOBY DOO BE DOO WHERE ARE YOU ? 


// Function to handle bot moves asynchronously
async function handleBotMoves(board, color) {
    let opponentColor = color === "white" ? "black" : "white";

    if (isCheckmate(board, color) || isStalemate(board, color) || isCheckmate(board, color) || isStalemate(board, opponentColor)) {
        endgame();
        updateGridHTML(board);
        return;
    }

    while (currentPlayerColor !== color) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait until a button is clicked
    }

    let pieces = board.flat().filter(piece => piece !== undefined && piece.color === color);
    let randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    let lastClickbot = { x: randomPiece.x, y: randomPiece.y }; // Get the last clicked square's coordinates

    // let possibleMoves = [];
    // pieces.forEach(piece => {
    //     for (let i = 0; i < board.length; i++) {
    //         for (let j = 0; j < board.length; j++) {
    //             if (piece.movementVerification(board, i, j)) {
    //                 possibleMoves.push({ from: { x: piece.x, y: piece.y }, to: { x: i, y: j } });
    //             }
    //         }
    //     }
    // });

    // // Assign values to pieces based on their type
    // const pieceValues = {
    //     "Pawn": 1,
    //     "Knight": 3,
    //     "Bishop": 3,
    //     "Rook": 5,
    //     "Queen": 9,
    //     "King": Infinity // King has the highest value, but it cannot be captured
    // };

    // let maxValue = -Infinity;
    // let bestMove = null;
    // possibleMoves.forEach(move => {

    //     // Evaluate the value of the move based on the piece being captured
    //     let targetPiece = board[move.to.x][move.to.y];
    //     let value = targetPiece ? pieceValues[targetPiece.type] : 0;
    //     if (value > maxValue) {
    //         maxValue = value;
    //         bestMove = move;
    //     }
    // });

    // await handlePlayerMove(board, bestMove.from, bestMove.to);

    let possibleMoves = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[randomPiece.x][randomPiece.y].movementVerification(board, i, j)) {
                possibleMoves.push({ x: i, y: j });
            }
        }
    }

    if (possibleMoves.length > 0) {
        let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];


        let currentClickbot = { x: randomMove.x, y: randomMove.y }; // Get the current clicked square's coordinates
        await handlePlayerMove(board, lastClickbot, currentClickbot);
    }

    handleBotMoves(board, color);
}

