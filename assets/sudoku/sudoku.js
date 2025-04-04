//Generator for Sudoku puzzle
var difficulty = 40;

function generateSudoku() { // Returns an object with the board and solution
    let board = createEmptyBoard();
    fillBoard(board);
    let solution = JSON.parse(JSON.stringify(board)); // Deep copy of the board
    removeCells(board, difficulty); // Adjust the number of cells to remove for difficulty
    return { board, solution };
}

function createEmptyBoard() { // Returns a 9x9 2D array filled with zeros
    let board = [];
    for (let i = 0; i < 9; i++) {
        board.push(new Array(9).fill(0));
    }
    return board;
}

function fillBoard(board) { // Fills the board with a valid Sudoku solution
    fillDiagonal(board);
    fillRemaining(board, 0, 3);
}

function fillDiagonal(board) { // Fills the diagonal 3x3 boxes with random numbers
    for (let i = 0; i < 9; i += 3) {
        fillBox(board, i, i);
    }
}

function fillBox(board, row, col) { // Fills a 3x3 box with random numbers
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = randomNumber();
            } while (!isSafeInBox(board, row, col, num));
            board[row + i][col + j] = num;
        }
    }
}

function randomNumber() { // Returns a random number between 1 and 9
    return Math.floor(Math.random() * 9) + 1;
}

function isSafeInBox(board, row, col, num) { // Checks if a number is safe to place in a 3x3 box
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[row + i][col + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function fillRemaining(board, i, j) { // Recursive backtracking algorithm to fill the remaining cells
    if (j >= 9 && i < 8) {
        i++;
        j = 0;
    }
    if (i >= 9 && j >= 9) {
        return true;
    }
    if (i < 3) {
        if (j < 3) {
            j = 3;
        }
    } else if (i < 6) {
        if (j === Math.floor(i / 3) * 3) {
            j += 3;
        }
    } else {
        if (j === 6) {
            i++;
            j = 0;
            if (i >= 9) {
                return true;
            }
        }
    }
    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, i, j, num)) {
            board[i][j] = num;
            if (fillRemaining(board, i, j + 1)) {
                return true;
            }
            board[i][j] = 0;
        }
    }
    return false;
}

function isSafe(board, row, col, num) { // Checks if a number is safe to place in a cell
    return isSafeInRow(board, row, num) &&
           isSafeInCol(board, col, num) &&
           isSafeInBox(board, row - row % 3, col - col % 3, num);
}

function isSafeInRow(board, row, num) { // Checks if a number is safe to place in a row
    for (let col = 0; col < 9; col++) {
        if (board[row][col] === num) {
            return false;
        }
    }
    return true;
}

function isSafeInCol(board, col, num) { // Checks if a number is safe to place in a column
    for (let row = 0; row < 9; row++) {
        if (board[row][col] === num) {
            return false;
        }
    }
    return true;
}

function removeCells(board, count) { // Removes cells from the board to create the puzzle
    while (count > 0) {
        let cellId = randomCell();
        let i = Math.floor(cellId / 9);
        let j = cellId % 9;
        if (board[i][j] !== 0) {
            board[i][j] = 0;
            count--;
        }
    }
}

function randomCell() { // Returns a random cell index between 0 and 80
    return Math.floor(Math.random() * 81);
}

// Sudoku game
var numSelected = null;
var tileSelected = null;

var errors = 0;

// Load the game when the window is loaded
window.onload = function() {
    console.log("Script loaded and running");
    setGame();

    document.getElementById("reset").addEventListener("click", resetGame); // Reset button
}

function setGame() { // Sets up the Sudoku game
    let board, solution;

    // Check if there is a saved game in localStorage
    if (localStorage.getItem("board") && localStorage.getItem("solution")) {
        board = JSON.parse(localStorage.getItem("board"));
        solution = JSON.parse(localStorage.getItem("solution"));
    } else {
        // Generate a new Sudoku puzzle
        let generated = generateSudoku();
        board = generated.board;
        solution = generated.solution;

        // Save the generated board and solution to localStorage
        localStorage.setItem("board", JSON.stringify(board));
        localStorage.setItem("solution", JSON.stringify(solution));
    }

    // Digits 1-9
    for (var i = 1; i <= 9; i++) {
        var number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();

            if (board[r][c] != 0) {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }

            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }

            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }

            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function resetGame() {
    //clear board and digits
    document.getElementById("board").innerHTML = ""; // Clear the board
    document.getElementById("digits").innerHTML = ""; // Clear the digits

    //clear local storage
    localStorage.removeItem("board");
    localStorage.removeItem("solution");

    //reset errors
    errors = 0;
    updateErrors();

    //new game
    setGame();
}

function selectNumber() { // Selects a number from the digits
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }

    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() { // Selects a tile on the board
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }

        // "0-0" => ["0", "0"]
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        let solution = JSON.parse(localStorage.getItem("solution"));

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;

            // Update the board in localStorage
            let board = JSON.parse(localStorage.getItem("board"));
            board[r][c] = numSelected.id;
            localStorage.setItem("board", JSON.stringify(board));
        } else {
            errors += 1;
            updateErrors();
        }
    }
}

function updateErrors() { // Updates the number of errors displayed
    document.getElementById("errors").innerText = `Mistakes: ${errors}`;
}