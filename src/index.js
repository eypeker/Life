import Universe  from "./game-of-life.js";
//import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";
import fps from "./fps.js";

const CELL_SIZE = 4; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const UNIVERSE_SIZE = 100;

// Construct the universe, and get its width and height.
//const universe = Universe.new_spaceship(10,10); //x*y Bits Größe 
const universe = Universe.new_spaceship(UNIVERSE_SIZE, UNIVERSE_SIZE);
const width = universe.get_width();
const height = universe.get_height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
const playPauseButton = document.getElementById("play-pause");
const rangeInput = document.getElementById("inputrange");
const resetButton = document.getElementById("reset");
const randomButton = document.getElementById("random");
const nexttickButton = document.getElementById("nexttick");


canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');
let animationId = null;
let tickstoskip = 0;
let downKey = null;
//let fps = new fps();

const isPaused = () => {
    return animationId === null;
  };



const play = () =>  {
    playPauseButton.textContent = "⏸";
    resetButton.textContent ="🧹";
    randomButton.textContent = "🎲";
    nexttickButton.textContent = "->"
    renderLoop();
}

const pause = () => {
    playPauseButton.textContent = "▶";
    cancelAnimationFrame(animationId);
    animationId = null;
}
nexttickButton.addEventListener("click", event => {
    universe.tick();
    drawField();
})

playPauseButton.addEventListener("click", () => {
    if (isPaused()) {
        play();
    } else {
        pause();
    }
})


rangeInput.addEventListener("input", event => {
    tickstoskip = rangeInput.value;
})

resetButton.addEventListener("click", event => {
    universe.reset();
    drawField();
    pause();
    
})

randomButton.addEventListener("click", event => {
    universe.random();
    drawField();
})

canvas.addEventListener('contextmenu', event => {
    event.preventDefault()
    insertCells(event);
});
document.addEventListener("keydown", event => {
    downKey = event.ctrlKey ? "ctrl":event.shiftKey?"shift":null;
})

document.addEventListener("keyup", event => {
    downKey = event.ctrlKey || event.shiftKey ? downKey:null;
})

const insertCells =  event => {
    event.cancelBubble = true;
    const boundingRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;
    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min( Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);
    switch(downKey) {
        case "shift":
            universe.insert_pulsar(row,col);
            break;
        case "ctrl":
            universe.insert_glider(row, col);
            break;
        default:    
            universe.toggle_cell(row,col);
    }
    drawField();
    //console.log(universe.cells.fixedbitset);
}

canvas.addEventListener("click", event => insertCells(event));


const renderLoop = () => {
    fps.render();
    //console.log("vor tick " + universe.cells.fixedbitset);
    for ( let i = 0; i<=tickstoskip; i++){
        universe.tick();
    }
    //console.log("nach tick " + universe.cells.fixedbitset);
    drawField();
    animationId = requestAnimationFrame(renderLoop);
    //console.log(canvas);
}


const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};


const getIndex = (row, column) => {
    return row * width + column;
};

const bitIsSet = (n, arr) => {
    return arr[n];
};

const drawCells = () => {
    const cells = universe.get_cells().fixedbitset;
    //console.log(cells);
    // This is updated!
    //const cells = new Uint8Array(memory.buffer, cellsPtr, Math.ceil(width * height / 8));
    
    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);
            //console.log(bitIsSet(idx,cells));
            // This is updated!
            ctx.fillStyle = bitIsSet(idx, cells)
                ? ALIVE_COLOR
                : DEAD_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }
    ctx.stroke();
};

const drawField = () => {
    //console.log(universe.cells.fixedbitset.filter(value=> value));
    drawGrid();
    drawCells();

}

drawField();
play();