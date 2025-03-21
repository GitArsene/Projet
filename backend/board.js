import Piece from './Piece.js';

/**
 * Initializes the chess board with pieces in their starting positions.
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
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
 * Moves a piece on the board from one position to another.
 *
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 * @param {Object} from - The starting position of the piece.
 * @param {number} from.x - The x-coordinate of the starting position.
 * @param {number} from.y - The y-coordinate of the starting position.
 * @param {Object} to - The target position of the piece.
 * @param {number} to.x - The x-coordinate of the target position.
 * @param {number} to.y - The y-coordinate of the target position.
 */
function movePiece(board, from, to) {
    let movingPiece = board[from.x][from.y];

    if (!movingPiece.movementVerification(board, to.x, to.y)) return; // Invalid move

    // Handle castling
    if (movingPiece.type === "King" && movingPiece.castlingVerification(board, to.x, to.y)) {
        let rookY = to.y < from.y ? 0 : 7; // Determine the rook's column
        let rook = board[from.x][rookY];
        let rookNewY = (from.y + to.y) / 2; // New rook position

        // Move the rook
        rook.setY(rookNewY);
        rook.setAlreadyMoved();
        board[to.x][rookNewY] = rook;
        board[from.x][rookY] = undefined;
    }

    // Create a copy of the board to simulate the move
    let board_copy = [];
    for (let i = 0; i < board.length; i++) {
        board_copy[i] = board[i].slice(); // Deep copy of the board to avoid modifying the original
    }
    let movingPiece_copy = Object.assign(Object.create(Object.getPrototypeOf(board_copy[from.x][from.y])), board_copy[from.x][from.y]);

    // Move the selected piece
    movingPiece_copy.setAlreadyMoved();
    movingPiece_copy.setX(to.x);
    movingPiece_copy.setY(to.y);
    board_copy[to.x][to.y] = movingPiece_copy;
    board_copy[from.x][from.y] = undefined;

    // Check if the player is in check after the move
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            if (board_copy[x][y] !== undefined && board_copy[x][y].type === "King" && board_copy[x][y].color === movingPiece.color) {
                if (board_copy[x][y].inCheck(board_copy, x, y)) {
                    return; // Invalid move
                }
            }
        }
    }

    // If the move is valid, update the board
    // Move the selected piece
    movingPiece.setAlreadyMoved();
    movingPiece.setX(to.x);
    movingPiece.setY(to.y);
    board[to.x][to.y] = movingPiece;
    board[from.x][from.y] = undefined;
}

/**
 * Determines if the current board state is a stalemate for the given king's color.
 * A stalemate occurs when the player whose turn it is has no legal moves but is not in check.
 *
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 * @param {string} kingColor - The color of the king to check for stalemate ("white" or "black").
 * @returns {boolean} - Returns `true` if it is a stalemate, otherwise `false`.
 */
function isStalemate(board, kingColor) {
    let stalemate = true;
    // Check if any piece of the same color can move
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            let piece = board[x][y];
            if (piece !== undefined && piece.color === kingColor) {
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board.length; j++) {
                        if (piece.movementVerification(board, i, j)) {
                            stalemate = false; // There is a valid move
                            return stalemate;
                        }
                    }
                }
            }
        }
    }


    return stalemate;
}

/**
 * Determines if a king of a given color is in checkmate on the chessboard.
 *
 * @param {Array<Array<Piece|undefined>>} board - The 2D array representing the chess board.
 * @param {string} kingColor - The color of the king to check for checkmate ("white" or "black").
 * @returns {boolean} - Returns true if the king is in checkmate, otherwise false.
 */
function isCheckmate(board, kingColor) {
    let xk, yk;
    let checkmate = false;

    // find the king
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            if (board[x][y] !== undefined && board[x][y].type === "King" && board[x][y].color === kingColor) {
                xk = x;
                yk = y;
            }
        }
    }

    // Check if the king is in check
    if (board[xk][yk].inCheck(board, xk, yk)) {
        checkmate = true;
        // Check if any piece of the same color can move to block the check or if the king can move out of check
        for (let x = 0; x < board.length; x++) {
            for (let y = 0; y < board.length; y++) {
                let piece = board[x][y];
                if (piece !== undefined && piece.color === kingColor) {
                    for (let i = 0; i < board.length; i++) {
                        for (let j = 0; j < board.length; j++) {
                            if (piece.movementVerification(board, i, j)) {
                                // Simulate the move
                                let board_copy = [];
                                for (let k = 0; k < board.length; k++) {
                                    board_copy[k] = board[k].slice();
                                }
                                let piece_copy = Object.assign(Object.create(Object.getPrototypeOf(piece)), piece);
                                piece_copy.setX(i);
                                piece_copy.setY(j);
                                board_copy[i][j] = piece_copy;
                                board_copy[x][y] = undefined;

                                // Update king's position if the piece is the king
                                let newXk = xk, newYk = yk;
                                if (piece.type === "King") {
                                    newXk = i;
                                    newYk = j;
                                }

                                // Check if the king is still in check after the move
                                if (!board_copy[newXk][newYk].inCheck(board_copy, newXk, newYk)) {
                                    checkmate = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return checkmate;
}



export { initBoard, movePiece, isStalemate, isCheckmate };
