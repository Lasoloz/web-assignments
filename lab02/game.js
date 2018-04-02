/*
 * Heim László, hlim1626, 522-es csoport
 * 2.2.7-es feladat
 * tic-tac-toe játék
*/
"use strict";
// Helper functions:
/**
 * Get index position specifed by playing area thirds
 * @param {number} coord Coordinate value
 * @param {number} thirdSize Third size of the playing area
 */
function getThirdIndex(coord, thirdSize) {
    return Math.min(2, Math.max(0, Math.floor(coord / thirdSize)));
}

/**
 * Draw a line to the specified context
 * @param {Object} ctx The context where we draw line
 * @param {number} x0 X coordinate of the first point
 * @param {number} y0 Y coordinate of the first point
 * @param {number} x1 X coordinate of the second point
 * @param {number} y1 Y coordinate of the second point
 */
function drawLine(ctx, x0, y0, x1, y1) {
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
}


// Constants:
const PL_X = 'X';
const PL_O = 'O';


// Game class:
/**
 * Tic-Tac-Toe game class
 */
class Game {
    /**
     * Construct a new Tic-Tac-Toe Game object
     * @param {Object} ctx Context object to be used for drawing
     * @param {number} areaWidth Width of the canvas object used for drawing
     * @param {number} areaHeight Height of the canvas object used for drawing
     * @param {Object} msgBox Reference to message box for events
     */
    constructor(ctx, areaWidth, areaHeight, msgBox) {
        this.ctx = ctx;
        this.areaWidth = areaWidth;
        this.areaHeight = areaHeight;
        this.msgBox = msgBox;
        this.reset();
    }


    /**
     * Reset the game field (restart game)
     */
    reset() {
        this.playArea = new Array(new Array(3), new Array(3), new Array(3));
        this.won = false;
        this.player = PL_O;
        this.msgBox.innerHTML = "`O` starts the game!";
        this.count = 0;

        // Refill game area:
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.areaWidth, this.areaHeight);

        // Redraw black bars:
        const thirdX = this.areaWidth / 3;
        const thirdY = this.areaHeight / 3;
        this.ctx.fillStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        drawLine(this.ctx, thirdX, 0, thirdX, this.areaHeight);
        drawLine(this.ctx, 2 * thirdX, 0, 2 * thirdX, this.areaHeight);
        drawLine(this.ctx, 0, thirdY, this.areaWidth, thirdY);
        drawLine(this.ctx, 0, 2 * thirdY, this.areaWidth, 2 * thirdY);
        this.ctx.stroke();
        this.ctx.closePath();
    }


    /**
     * Choose next player
     */
    next() {
        if (this.player == PL_O) {
            this.player = PL_X;
            this.msgBox.innerHTML = "X's turn!";
        } else {
            this.player = PL_O;
            this.msgBox.innerHTML = "O's turn!";
        }
    }


    /**
     * Checks, if specified row has three pieces of the same
     * @param {number} row Row to be checked
     * @returns {boolean} True if somebody won
     */
    checkRow(row) {
        const first = this.playArea[0][row];
        if (first == undefined) {
            return false;
        }
        for (let i = 1; i < 3; ++i) {
            if (this.playArea[i][row] != first) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks, if specified column has three pieces of the same
     * @param {number} col Column to be checked
     * @returns {boolean} True if somebody won
     */
    checkCol(col) {
        const first = this.playArea[col][0];
        if (first == undefined) {
            return false;
        }
        for (let i = 1; i < 3; ++i) {
            if (this.playArea[col][i] != first) {
                return false;
            }
        }
        return true;
    }
    /**
     * Check diagonals for three pieces of the same
     * @returns {boolean} True if somebody won
     */
    checkDiags() {
        const first0 = this.playArea[0][0];
        const first1 = this.playArea[2][0];
        let good0 = true;
        let good1 = true;
        if (first0 == undefined) {
            good0 = false;
        }
        if (first1 == undefined) {
            good1 = false;
        }

        for (let i = 1; i < 3; ++i) {
            if (this.playArea[i][i] != first0) {
                good0 = false;
            }
            if (this.playArea[2-i][i] != first1) {
                good1 = false;
            }
        }

        return good0 || good1;
    }

    /**
     * Check, if game is already finished
     * @returns {boolean} The state specifying if game is finished
     */
    checkGame() {
        if (
            this.checkRow(0) || this.checkRow(1) || this.checkRow(2) ||
            this.checkCol(0) || this.checkCol(1) || this.checkCol(2) ||
            this.checkDiags()
        ) {
            this.won = true;
            this.msgBox.innerHTML = '`' + this.player + "` won the game!";

            return true;
        } else {
            return false;
        }
    }


    /**
     * Try to draw the current element to (x, y) coordinates
     * @param {number} x X position of the element
     * @param {number} y Y position of the element
     */
    draw(x, y) {
        this.ctx.lineWidth = 3;
        this.ctx.fillStyle = "black";

        const xThird = this.areaWidth / 3;
        const yThird = this.areaHeight / 3;

        const x0 = xThird * x + 10;
        const y0 = yThird * y + 10;
        const x1 = x0 + xThird - 20;
        const y1 = y0 + yThird - 20;

        this.ctx.beginPath();
        if (this.player == PL_O) {
            this.ctx.arc(
                (x0 + x1) / 2,
                (y0 + y1) / 2,
                (x1 - x0) / 2,
                0,
                2*Math.PI
            );
            this.ctx.stroke();
        } else {
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x1, y1);
            this.ctx.moveTo(x0, y1);
            this.ctx.lineTo(x1, y0);
            this.ctx.stroke();
        }
        this.ctx.closePath();
    }


    /**
     * Try to put down an element on the field to position (x, y)
     * @param {number} x X index of the game field matrix
     * @param {number} y Y index of the game field matrix
     */
    tryPut(x, y) {
        const areaVal = this.playArea[x][y];
        if (areaVal == PL_O || areaVal == PL_X) {
            return;
        }

        this.draw(x, y);
        this.playArea[x][y] = this.player;

        if (this.checkGame(x, y)) {
            return;
        }

        if (++this.count == 9) {
            this.msgBox.innerHTML = "Draw!";
            return;
        }

        this.next();
    }


    /**
     * Check the mouse click, and try to put `X` or `O` in.
     * @param {number} xPos X coordinate on the canvas
     * @param {number} yPos Y coordinate on the canvas
     */
    checkMousePosition(xPos, yPos) {
        if (this.count == 9 || this.won) {
            return;
        }

        const xThird = this.areaWidth / 3;
        const yThird = this.areaHeight / 3;

        const x = getThirdIndex(xPos, xThird);
        const y = getThirdIndex(yPos, yThird);

        console.log("x=", x, "y=", y);

        this.tryPut(x, y);
    }
}



// Initialization:
(() => {
    let c = document.getElementById("game_canvas");
    if (c == undefined) {
        console.error("Canvas is undefined!");
        return;
    }
    let ctx = c.getContext("2d");
    const boundingBox = c.getBoundingClientRect();

    let msgBox = document.getElementById("message_box");
    if (msgBox == undefined) {
        console.error("Message box is undefined!");
        return;
    }

    // Game object:
    let game = new Game(ctx, boundingBox.width, boundingBox.height, msgBox);

    // Add event listeners:
    c.addEventListener("mouseup", (event) => {
        game.checkMousePosition(
            event.clientX - boundingBox.x,
            event.clientY - boundingBox.y
        );
    });


    // Reset button:
    let resetButton = document.getElementById("reset_button");
    if (resetButton == undefined) {
        console.error("Reset button is undefined!");
        return;
    }
    resetButton.addEventListener("click", (_ev) => {
        game.reset();
    });
})();
