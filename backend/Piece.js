/**
 * Represents a chess piece.
 */
export default class Piece {
    /** @type {number} The x-coordinate of the piece on the board. */
    x;

    /** @type {number} The y-coordinate of the piece on the board. */
    y;

    /** @type {string} The color of the piece ("white" or "black"). */
    color;

    /** @type {string} The type of the piece ("Pawn", "Knight", "Bishop", "Rook", "Queen", "King"). */
    type;

    /** @type {boolean} Indicates whether the piece has already moved. */
    alreadyMoved;

    /**
     * Creates a new Piece.
     * @param {number} x - The x-coordinate of the piece.
     * @param {number} y - The y-coordinate of the piece.
     * @param {string} color - The color of the piece.
     * @param {string} type - The type of the piece.
     */
    constructor(x, y, color, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
        this.alreadyMoved = false;
    }

    /**
     * Sets the x-coordinate of the piece.
     * @param {number} value - The new x-coordinate.
     */
    setX(value) {
        this.x = value;
    }

    /**
     * Sets the y-coordinate of the piece.
     * @param {number} value - The new y-coordinate.
     */
    setY(value) {
        this.y = value;
    }

    /**
     * Marks the piece as already moved.
     */
    setAlreadyMoved() {
        this.alreadyMoved = true;
    }

    /**
     * Verifies if a pawn's movement is valid.
     * @param {Array<Array<Piece|undefined>>} board - The current state of the board.
     * @param {number} x2 - The target x-coordinate.
     * @param {number} y2 - The target y-coordinate.
     * @returns {boolean} True if the movement is valid, false otherwise.
     */
    pawnMovementVerification(board, x2, y2) {
        let correct = false;

        // Check if the pawn moves one step or two steps forward (depends on its color)
        const isSingleMove = this.color === "white" ? this.x - x2 === 1 : x2 - this.x === 1;
        const isDoubleMove = this.color === "white" ? this.x - x2 === 2 : x2 - this.x === 2;

        // Moving forward (no capture)
        if (this.y === y2 && board[x2][y2] === undefined) {
            if (isSingleMove) {
                correct = true; // Single step forward is valid
            } else if (isDoubleMove && !this.alreadyMoved && board[(this.x + x2) / 2][y2] === undefined) {
                correct = true; // Double step forward is valid only if it's the first move and no piece is blocking
            }
        }
        // Capturing diagonally an enemy piece
        else if (Math.abs(this.y - y2) === 1 && isSingleMove && board[x2][y2] !== undefined) {
            correct = true; // Capture is valid only if moving diagonally by one step and an opponent's piece is there
        }

        return correct;
    }

    /**
     * Verifies if a knight's movement is valid.
     * @param {number} x2 - The target x-coordinate.
     * @param {number} y2 - The target y-coordinate.
     * @returns {boolean} True if the movement is valid, false otherwise.
     */
    knightMovementVerification(x2, y2) {
        let correct = false;

        // Moving two squares vertically and one horizontally
        if (Math.abs(this.x - x2) === 2) {
            if (Math.abs(this.y - y2) === 1) {
                correct = true;
            }
        }
        // Moving two squares horizontally and one vertically
        else if (Math.abs(this.y - y2) === 2) {
            if (Math.abs(this.x - x2) === 1) {
                correct = true;
            }
        }

        return correct;
    }

    /**
     * Verifies if a bishop's movement is valid.
     * @param {Array<Array<Piece|undefined>>} board - The current state of the board.
     * @param {number} x2 - The target x-coordinate.
     * @param {number} y2 - The target y-coordinate.
     * @returns {boolean} True if the movement is valid, false otherwise.
     */
    bishopMovementVerification(board, x2, y2) {
        let correct = false;

        // Calculate direction for the bishop's movement
        const direction = {
            x: (x2 - this.x) / Math.abs(x2 - this.x),
            y: (y2 - this.y) / Math.abs(y2 - this.y)
        };

        // Check if the movement is diagonal (x and y distance must be the same)
        if (Math.abs(this.x - x2) === Math.abs(this.y - y2)) {
            correct = true;

            // Check if the path is clear, there are no pieces between the start and target position
            for (let i = 1; i < Math.abs(this.x - x2); i++) {
                if (board[this.x + i * direction.x][this.y + i * direction.y] !== undefined) {
                    correct = false; // Path is blocked
                    break;
                }
            }
        }

        return correct;
    }

    /**
     * Verifies if a rook's movement is valid.
     * @param {Array<Array<Piece|undefined>>} board - The current state of the board.
     * @param {number} x2 - The target x-coordinate.
     * @param {number} y2 - The target y-coordinate.
     * @returns {boolean} True if the movement is valid, false otherwise.
     */
    rookMovementVerification(board, x2, y2) {
        let correct = false;

        // Calculate direction for the rook's movement, based on whether it's a horizontal or vertical move
        const direction = {
            x: this.x === x2 ? 0 : (x2 - this.x) / Math.abs(x2 - this.x), // Vertical move if x is different
            y: this.y === y2 ? 0 : (y2 - this.y) / Math.abs(y2 - this.y) // Horizontal move if y is different
        };

        // Check if the move is either horizontal (same x) or vertical (same y)
        if (this.x === x2 || this.y === y2) {
            correct = true;

            // Check if the path is clear for the rook's movement
            for (let i = 1; i < Math.abs(this.x - x2 + this.y - y2); i++) {
                if (board[this.x + i * direction.x][this.y + i * direction.y] !== undefined) {
                    correct = false; // Path is blocked
                    break;
                }
            }
        }

        return correct;
    }

    /**
     * Verifies if a queen's movement is valid.
     * @param {Array<Array<Piece|undefined>>} board - The current state of the board.
     * @param {number} x2 - The target x-coordinate.
     * @param {number} y2 - The target y-coordinate.
     * @returns {boolean} True if the movement is valid, false otherwise.
     */
    queenMovementVerification(board, x2, y2) {
        // A queen's move is valid if it can move like a bishop or a rook
        let correct = this.bishopMovementVerification(board, x2, y2) || this.rookMovementVerification(board, x2, y2)

        return correct;
    }

    /**
     * Verifies if a king's movement is valid.
     * @param {number} x2 - The target x-coordinate.
     * @param {number} y2 - The target y-coordinate.
     * @returns {boolean} True if the movement is valid, false otherwise.
     */
    kingMovementVerification(x2, y2) {
        let correct = false;

        // The king can move one square in any direction (horizontally, vertically, or diagonally)
        if (Math.abs(this.x - x2) <= 1 && Math.abs(this.y - y2) <= 1) {
            correct = true;
        }

        return correct;
    }

    /**
     * Checks if the king is in check after a move.
     * @param {Array<Array<Piece|undefined>>} board - The current state of the board.
     * @param {number} x - The target x-coordinate.
     * @param {number} y - The target y-coordinate.
     * @returns {boolean} True if the king is in check, false otherwise.
     */
    inCheck(board, x, y) {
        let check = false;

        // Create a copy of the board to simulate the move
        let board_copy = board.slice();
        // for (let i = 0; i < board.length; i++) {
        //     board_copy[i] = board[i].slice(); // Deep copy of the board to avoid modifying the original
        // }

        board_copy[x][y] = board_copy[this.x][this.y]; // Move the king to the new position on the copied board
        board_copy[this.x][this.y] = undefined; // Clear the old position of the king

        // Check if any opponent's piece can attack the king's new position
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board_copy[i][j] !== undefined && board_copy[i][j].color !== this.color) {
                    // If the opponent's piece can move to the king's new position, the king is in check
                    if (board_copy[i][j].movementVerificationWithoutColor(board_copy, x, y)) {
                        check = true; // The king is in check
                        break;
                    }
                }
            }
        }

        return check;
    }

    /**
     * Verifies if a piece's movement is valid without considering the color.
     * @param {Array<Array<Piece|undefined>>} board - The current state of the board.
     * @param {number} x2 - The target x-coordinate.
     * @param {number} y2 - The target y-coordinate.
     * @returns {boolean} True if the movement is valid, false otherwise.
     */
    movementVerificationWithoutColor(board, x2, y2) {
        let correct = false;

        // Switch based on the piece type and verify if the movement is valid for the piece
        switch (this.type) {
            case "Pawn":
                correct = this.pawnMovementVerification(board, x2, y2);
                break;
            case "Knight":
                correct = this.knightMovementVerification(x2, y2);
                break;
            case "Bishop":
                correct = this.bishopMovementVerification(board, x2, y2);
                break;
            case "Rook":
                correct = this.rookMovementVerification(board, x2, y2);
                break;
            case "Queen":
                correct = this.queenMovementVerification(board, x2, y2);
                break;
            case "King":
                correct = this.kingMovementVerification(x2, y2);
                break;
            default:
                break;
        }

        return correct;
    }

    /**
     * Verifies if a piece's movement is valid.
     * @param {Array<Array<Piece|undefined>>} board - The current state of the board.
     * @param {number} x2 - The target x-coordinate.
     * @param {number} y2 - The target y-coordinate.
     * @returns {boolean} True if the movement is valid, false otherwise.
     */
    movementVerification(board, x2, y2) {
        let correct = false;

        // Check if the target square is either empty or occupied by an opponent's piece
        if (board[x2][y2] === undefined || board[x2][y2].color !== this.color) {
            // Verify movement
            correct = this.movementVerificationWithoutColor(board, x2, y2)
            // If the piece is a king, also check if the move places the king in check
            if (this.type === "King" && correct) {
                correct = !this.inCheck(board, x2, y2); // King cannot move into check
            }
        }

        return correct;
    }

    /**
     * Displays the piece.
     * @returns {string} The represention of the piece.
     */
    display() {
        switch (this.color) {
            case "white":
                // Return white piece symbols based on the type of piece
                switch (this.type) {
                    case "Pawn":
                        return "♙";
                    case "Knight":
                        return "♘";
                    case "Bishop":
                        return "♗";
                    case "Rook":
                        return "♖";
                    case "Queen":
                        return "♕";
                    case "King":
                        return "♔";
                    default:
                        return " ";
                }
            case "black":
                // Return black piece symbols based on the type of piece
                switch (this.type) {
                    case "Pawn":
                        return "♟";
                    case "Knight":
                        return "♞";
                    case "Bishop":
                        return "♝";
                    case "Rook":
                        return "♜";
                    case "Queen":
                        return "♛";
                    case "King":
                        return "♚";
                    default:
                        return " ";
                }
        }
    }
}

