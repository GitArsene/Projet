export default class Piece {
    x;
    y;
    color;
    type;
    alreadyMoved;

    constructor(x, y, color, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
        this.alreadyMoved = false;
    }

    setX(value) {
        this.x = value;
    }

    setY(value) {
        this.y = value;
    }

    setAlreadyMoved() {
        this.alreadyMoved = true;
    }

    pawnMovementVerification(board, x2, y2) {
        let correct = false;

        const isSingleMove = this.color === "white" ? this.x - x2 === 1 : x2 - this.x === 1;
        const isDoubleMove = this.color === "white" ? this.x - x2 === 2 : x2 - this.x === 2;

        if (this.y === y2 && board[x2][y2] === undefined) {
            if (isSingleMove) {
                correct = true;
            } else if (isDoubleMove && !this.alreadyMoved && board[(this.x + x2) / 2][y2] === undefined) {
                correct = true;
            }
        } else if (Math.abs(this.y - y2) === 1 && isSingleMove && board[x2][y2] !== undefined) {
            correct = true;
        }

        return correct;
    }

    knightMovementVerification(x2, y2) {
        let correct = false;

        if (Math.abs(this.x - x2) === 2) {
            if (Math.abs(this.y - y2) === 1) {
                correct = true;
            }
        } else if (Math.abs(this.y - y2) === 2) {
            if (Math.abs(this.x - x2) === 1) {
                correct = true;
            }
        }

        return correct;
    }

    bishopMovementVerification(board, x2, y2) {
        let correct = false;

        const direction = {
            x: (x2 - this.x) / Math.abs(x2 - this.x),
            y: (y2 - this.y) / Math.abs(y2 - this.y)
        };

        if (Math.abs(this.x - x2) === Math.abs(this.y - y2)) {
            correct = true;

            for (let i = 1; i < Math.abs(this.x - x2); i++) {
                if (board[this.x + i * direction.x][this.y + i * direction.y] !== undefined) {
                    correct = false;
                    break;
                }
            }
        }

        return correct;
    }

    rookMovementVerification(board, x2, y2) {
        let correct = false;

        const direction = {
            x: this.x === x2 ? 0 : (x2 - this.x) / Math.abs(x2 - this.x),
            y: this.y === y2 ? 0 : (y2 - this.y) / Math.abs(y2 - this.y)
        };

        if (this.x === x2 || this.y === y2) {
            correct = true;

            for (let i = 1; i < Math.abs(this.x - x2 + this.y - y2); i++) {
                if (board[this.x + i * direction.x][this.y + i * direction.y] !== undefined) {
                    correct = false;
                    break;
                }
            }
        }

        return correct;
    }

    queenMovementVerification(board, x2, y2) {
        let correct = this.bishopMovementVerification(board, x2, y2) || this.rookMovementVerification(board, x2, y2)

        return correct;
    }

    kingMovementVerification(x2, y2) {
        let correct = false;

        if (Math.abs(this.x - x2) <= 1 && Math.abs(this.y - y2) <= 1) {
            correct = true;
        }

        return correct;
    }

    inCheck(board, x, y) {
        let check = false;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] !== undefined && board[i][j].color !== this.color) {
                    if (board[i][j].movementVerificationWithoutColor(board, x, y)) {
                        check = true;
                        break;
                    }
                }
            }
        }

        return check;
    }

    movementVerificationWithoutColor(board, x2, y2) {
        let correct = false;

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
                correct = this.kingMovementVerification(x2, y2) && !this.inCheck(board, x2, y2);
                break;
            default:
                break;
        }

        return correct;
    }

    movementVerification(board, x2, y2) {
        let correct = false;

        if (board[x2][y2] === undefined || board[x2][y2].color !== this.color) {
            correct = this.movementVerificationWithoutColor(board, x2, y2)
        }

        return correct;
    }

    display() {
        switch (this.color) {
            case "white":
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



// TODO:  Maximum call stack size exceeded when InCheck by the other king
// TODO: verification for inCheck dont work with pawn
