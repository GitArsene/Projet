//Generator for Sudoku puzzle
var difficulty = 40; //Defaul difficulty 

// Sudoku game
var numSelected = null;
var tileSelected = null;

var errors = 0;

// Load the game when the window is loaded
window.onload = function () {
    console.log("Script loaded and running");
    loadErrors(); // Load the saved number of mistakes
    setGame();

    // Add event listeners to difficulty buttons
    document.getElementById("easy").addEventListener("click", function () {
        setDifficulty(30); // Easy: fewer cells removed
    });
    document.getElementById("medium").addEventListener("click", function () {
        setDifficulty(40); // Medium: default difficulty
    });
    document.getElementById("hard").addEventListener("click", function () {
        setDifficulty(60); // Hard: more cells removed
    });

    document.getElementById("reset").addEventListener("click", resetGame); // Reset button
};

function setDifficulty(level) {
    difficulty = level; // Update the difficulty level
    resetGame(); // Reset the game with the new difficulty
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
    // Clear board and digits
    document.getElementById("board").innerHTML = ""; // Clear the board
    document.getElementById("digits").innerHTML = ""; // Clear the digits

    // Clear local storage
    localStorage.removeItem("board");
    localStorage.removeItem("solution");
    localStorage.removeItem("errors"); // Reset the saved mistakes

    // Reset errors
    errors = 0;
    updateErrors();

    // Start a new game
    setGame();
}

function generateSudoku() { // Returns an object with the board and solution
    let board = createEmptyBoard();
    fillBoard(board);
    let solution = JSON.parse(JSON.stringify(board));
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
    // You can find this algorithm in many Sudoku solvers
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
    // If the cell is already filled, move to the next cell
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
           isSafeInBox(board, row - row % 3, col - col % 3, num); // Check row, column, and box
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
        // Randomly select a cell to remove
        let cellId = randomCell();
        let i = Math.floor(cellId / 9);
        let j = cellId % 9;
        if (board[i][j] !== 0) {
            board[i][j] = 0;
            count--;
        }
    }
}

function randomCell() { // Returns a random cell index between 0 and 80 (9x9 grid)
    return Math.floor(Math.random() * 81);
}

function selectNumber() { // Selects or unselects a number from the digits
    if (numSelected === this) {
        // If the clicked number is already selected, unselect it
        numSelected.classList.remove("number-selected");
        numSelected = null;
    } else {
        // If a different number is selected, unselect the previous one
        if (numSelected != null) {
            numSelected.classList.remove("number-selected");
        }
        // Select the clicked number
        numSelected = this;
        numSelected.classList.add("number-selected");
    }
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

        let solution = JSON.parse(localStorage.getItem("solution")); // Get the solution from localStorage

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;

            // Update the board in localStorage
            let board = JSON.parse(localStorage.getItem("board"));
            board[r][c] = parseInt(numSelected.id);
            localStorage.setItem("board", JSON.stringify(board));

            // Check for victory
            checkVictory();  
        } 
        else {
            errors += 1;
            localStorage.setItem("errors", errors); // Save the updated number of mistakes
            updateErrors();
        }
    }
}

function updateErrors() { // Updates the number of errors displayed
    document.getElementById("errors").innerText = `Mistakes: ${errors}`;
}

function loadErrors() { // Load the saved number of mistakes from localStorage
    if (localStorage.getItem("errors")) {
        errors = parseInt(localStorage.getItem("errors"));
    } 
    else {
        errors = 0; // Default to 0 if no saved value exists
    }
    updateErrors();
}

function checkVictory() {
    let board = JSON.parse(localStorage.getItem("board"));
    let solution = JSON.parse(localStorage.getItem("solution"));

    // Check if the board matches the solution
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] !== solution[r][c]) {
                return false; // Not solved yet
            }
        }
    }

    // If the board matches the solution, display the victory message
    displayVictoryMessage();
    return true;
}

function displayVictoryMessage() {
    // Create a victory message container
    const victoryContainer = document.createElement("div");
    victoryContainer.id = "victory-message";
    victoryContainer.style.position = "fixed";
    victoryContainer.style.top = "50%";
    victoryContainer.style.left = "50%";
    victoryContainer.style.transform = "translate(-50%, -50%)";
    victoryContainer.style.backgroundColor = "white";
    victoryContainer.style.border = "2px solid black";
    victoryContainer.style.padding = "20px";
    victoryContainer.style.textAlign = "center";
    victoryContainer.style.zIndex = "1000";

    // Add the victory message
    const message = document.createElement("p");
    message.innerText = `Congratulations! You solved the puzzle with ${errors} mistakes.`;
    victoryContainer.appendChild(message);

    // Add a restart button
    const restartButton = document.createElement("button");
    restartButton.innerText = "Restart";
    restartButton.style.marginTop = "10px";
    restartButton.addEventListener("click", function () {
        document.body.removeChild(victoryContainer); // Remove the victory message
        resetGame(); // Restart the game
    });
    victoryContainer.appendChild(restartButton);

    // Add the victory message to the body
    document.body.appendChild(victoryContainer);
}