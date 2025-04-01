import { handleOpponentMove, board } from "./chess.js";

const ws = new WebSocket('ws://localhost:3000');

// When the connection is opened
ws.onopen = () => {
    console.log('Connected to the WebSocket server.');
};

// When a message is received
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Message from server:', data);

    handleOpponentMove(board, data.from, data.to, data.promoted, data.piece.type); // Call the function to handle the opponent's move
};

// Handle connection closure
ws.onclose = () => {
    console.log('Disconnected from the WebSocket server.');
};

/**
* Sends a move to the WebSocket server.
* @param {Object} piece - The piece being moved.
* @param {string} from - The starting position of the piece.
* @param {string} to - The destination position of the piece.
* @param {string} promoted - The type of piece the pawn is promoted to, if applicable.
*/
function sendMove(piece, from, to, promoted) {
    ws.send(JSON.stringify({ type: 'move', piece: piece, from: from, to: to, promoted: promoted }));
}

export { sendMove };

// TODO: when a player join is game is not in the same state as the other player, so we need to send the current state of the game to the new player
// TODO: max 2 player / room