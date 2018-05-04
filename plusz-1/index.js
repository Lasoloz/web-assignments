"use strict";

function hexPad(num) {
    const n = num.toString(16);
    if (num < 15) {
        return '0' + n;
    } else {
        return n;
    }
}

function randNum(bound) {
    return Math.floor(Math.random() * bound);
}

function randNumBtw(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}




class Rect {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;


        if (color == undefined) {
            this.fillColor = '#' + hexPad(randNum(256)) +
                hexPad(randNum(256)) + hexPad(randNum(256));
        } else {
            this.fillColor = color;
        }

        console.log("Generated rectangle with color:", this.fillColor);
    }


    moveTo(nx, ny) {
        this.x = nx;
        this.y = ny;
    }


    checkPoint(x, y) {
        const right = this.x + this.w;
        const bottom = this.y + this.h;
        return this.x <= x && this.y <= y && right >= x && bottom >= y;
    }


    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x + 1, this.y + 1, this.w - 2, this.h - 2);
        ctx.closePath();
    }
}



class Disk extends Rect {
    static get MIN_DISK_WIDTH() { return 50; }
    static get MAX_DISK_WIDTH() { return 200; }
    static get DISK_HEIGHT() { return 20; }

    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.startX = x;
        this.startY = y;
    }

    moveToStart() {
        this.x = this.startX;
        this.y = this.startY;
    }

    get holeLeft() {
        return this.x + this.w / 2 - 20;
    }

    get holeRight() {
        return this.x + this.w / 2 + 20;
    }

    checkHole(poleLeft, poleRight) {
        return poleLeft > this.holeLeft && poleRight < this.holeRight;
    }


    isCollidingWithPole(poleRect) {
        const poleLeft = poleRect.x;
        const poleTop = poleRect.y;
        const poleRight = poleLeft + poleRect.w;
        const poleBottom = poleTop + poleRect.h;
        const left = this.x;
        const right = left + this.w;
        const top = this.y;
        const bottom = top + this.h;

        if (
            left > poleRight || right < poleLeft ||
            top > poleBottom || bottom < poleTop
        ) {
            return false;
        }

        if (this.checkHole(poleLeft, poleRight)) {
            return false;
        }

        return true;
    }
}



class Game {
    static get DISK_POS_X_CENTER() { return 480; }
    static get GAME_BORDER() { return 30; }
    static get POLE_WIDTH() { return 20; }
    static get POLE_HEIGHT() { return 300; }
    static get POLE_BORDER() { return 100; }


    constructor(canvasId) {
        let c = document.getElementById(canvasId);

        this.ctx = c.getContext("2d");

        const boundingBox = c.getBoundingClientRect();

        this.boundingBox = boundingBox;
        this.width = boundingBox.width;
        this.height = boundingBox.height;

        // Event handlers:
        c.addEventListener("mousedown", (event) => {
            this.handleDragStarted(event);
        });

        c.addEventListener("mouseup", (event) => {
            this.handleDragEnded(event);
        });

        c.addEventListener("mousemove", (event) => {
            this.handleDrag(event);
        });

        this.poleRect = new Rect(
            Game.GAME_BORDER + Game.POLE_BORDER,
            this.height - Game.GAME_BORDER - Game.POLE_HEIGHT,
            Game.POLE_WIDTH,
            Game.POLE_HEIGHT,
            "#753d2b"
        );
        this.genGame();
    }


    updateCanvas() {
        // Clear old "stuff":
        this.ctx.beginPath();
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.closePath();


        // Draw pole:
        this.poleRect.render(this.ctx);


        // Draw stack:
        for (let disk of this.stack) {
            disk.render(this.ctx);
        }

        // Draw final stack:
        for (let disk of this.finalStack) {
            disk.render(this.ctx);
        }
    }


    genGame() {
        this.stack = new Array();
        this.finalStack = new Array();

        let y = this.height - Game.GAME_BORDER - Disk.DISK_HEIGHT;

        let diskNum = randNumBtw(2, 10);
        for (let i = 0; i < diskNum; ++i) {
            const w = randNumBtw(Disk.MIN_DISK_WIDTH, Disk.MAX_DISK_WIDTH);

            this.stack.push(new Disk(
                Game.DISK_POS_X_CENTER - w / 2,
                y,
                w,
                Disk.DISK_HEIGHT
            ));

            y -= Disk.DISK_HEIGHT + 2;
        }
    }

    checkFinalStack() {
        for (let i = 0; i < this.finalStack.length; ++i) {
            let disk = this.finalStack[i];
            if (disk.y < this.height - Game.GAME_BORDER -
                (i + 1) * Disk.DISK_HEIGHT - i * 1) {
                ++disk.y;
            }
        }
    }


    // checkOriginalStack() {
    //     let width = Disk.MAX_DISK_WIDTH + 1;
    //     if (this.stack.length == 0) {
    //         for (let disk of this.finalStack) {
    //             console.log(disk.w, width);
    //             if (disk.w <= width) {
    //                 width = disk.w;
    //             } else {
    //                 return 1;
    //             }
    //         }

    //         return 2;
    //     }

    //     return 0;
    // }


    calcRealX(event) {
        return event.clientX - this.boundingBox.x;
    }

    calcRealY(event) {
        return event.clientY - this.boundingBox.y;
    }

    moveBack() {
        // if (this.current) {
        this.current.moveToStart();
        // }
        this.current = undefined;
    }

    moveFromStack() {
        const poleLeft = this.poleRect.x;
        const poleRight = this.poleRect.y + this.poleRect.w;
        const min = this.height - Game.GAME_BORDER -
            Game.POLE_HEIGHT - Disk.DISK_HEIGHT;
        const max = min + Disk.DISK_HEIGHT * 2;


        let ok = true;
        const len = this.finalStack.length;
        if (len > 0) {
            if (this.finalStack[len - 1].w < this.current.w) {
                ok = false;
            }
        }

        if (
            this.current.isCollidingWithPole(poleLeft, poleRight) &&
            this.current.y > min &&
            this.current.y < max &&
            ok
        ) {
            this.finalStack.push(this.stack.splice(this.index, 1)[0]);
            console.log("Moved from base stack...");
            this.current = undefined;
        }
    }


    handleDrag(event) {
        if (this.current) {
            const x = this.calcRealX(event);
            const y = this.calcRealY(event);

            this.current.moveTo(x - this.deltaX, y - this.deltaY);

            if (this.current.isCollidingWithPole(this.poleRect)) {
                this.moveBack();
            }
        }
    }

    handleDragStarted(event) {
        console.log("Drag event!");
        const x = this.calcRealX(event);
        const y = this.calcRealY(event);

        for (let i = 0; i < this.stack.length; ++i) {
            const disk = this.stack[i];

            if (disk.checkPoint(x, y)) {
                this.current = disk;
                this.deltaX = x - disk.x;
                this.deltaY = y - disk.y;
                this.index = i;
                console.log(
                    "Started dragging object with color:",
                    disk.fillColor
                );
            }
        }

        // Move back from final stack:
        for (let i = 0; i < this.finalStack.length; ++i) {
            let disk = this.finalStack[i];
            if (disk.checkPoint(x, y)) {
                this.stack.push(this.finalStack.splice(i, 1)[0]);
                disk.moveToStart();
            }
        }
    }

    handleDragEnded(event) {
        console.log("Drag ended!");

        if (this.current) {
            this.moveFromStack();
        }
        if (this.current) {
            this.moveBack();
        }
    }
}



function gameLoop(game) {
    game.checkFinalStack();
    game.updateCanvas();

    setTimeout(() => gameLoop(game), 33);

    // const state = game.checkOriginalStack();
    // if (state == 0) {
    //     setTimeout(() => gameLoop(game), 33);
    // } else {
    //     let resultDiv = document.getElementById("resultDiv");
    //     if (!resultDiv) {
    //         console.error("No result div!");
    //         return;
    //     }

    //     if (state == 1) {
    //         resultDiv.innerHTML = "Wrong order!";
    //     } else {
    //         resultDiv.innerHTML = "You won!";
    //     }
    // }
}

(() => {
    let game = new Game("gameCanvas");

    gameLoop(game);
})();
