// ? variables
// * canvas element and context
const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');
const resetBtn = document.querySelector('#reset-btn');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
// * defining height, width and resolution
const resolution = 10;
canvas.width = 800;
canvas.height = 800;
// * rows and columns
const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;
console.log(COLS, ROWS);
// ? functions
// * function to generate the grid as 2d matrix
const buildGrid = () =>
    new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(null)
            // ? randomly generate 1s which indicate living cells
            .map(() => Math.floor(Math.random() * 2) ));


const render = (grid) => {
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = cell ? 'green' : 'black';
            ctx.fill();
            ctx.stroke();
        }
        
    }
}

// ? here we will create copy of previous generation for next generation as the rules are applied to previous gen
const nextGen = (grid) => {
    const nextGen = grid.map(arr => [...arr]);
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            // ?these 2 for loops are used for finding all the neighbors of a cell
            // -1 and 2 is for getting the neighbors posn relative to cell
            let num_of_neighbors = 0;
            for (let i = -1; i < 2; i++){
                for (let j = -1; j < 2; j++){
                    // when both i and j  are 0 i-e for same cell doesn't count the cell
                    if (i == 0 && j == 0) {
                        continue;
                    }
                    const x_cell = col + i;
                    const y_cell = row + j;
                    // to solve the error of undefined property griu[col+i]
                    if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell<ROWS) {
                        const currentNeighbour = grid[col + i][row + j];
                        num_of_neighbors += currentNeighbour
                    }
                }
            }
            // we after getting the no of neighbours will apply the rules
            // i) underpopulation
            if (cell === 1 && num_of_neighbors < 2) {
                nextGen[col][row] = 0;
            //  ii) overpopulation
            } else if (cell === 1 && num_of_neighbors > 3) {
                nextGen[col][row] = 0;
            // iii) reproduction
            } else if (cell === 0 && num_of_neighbors === 3) {
                nextGen[col][row] = 1;
            // iv) no change
            } else {
                console.log("No change");
            }
        }
        
    }
    return nextGen;
}

const update = () => {
    grid = nextGen(grid)
    // console.log(grid);
    render(grid);
    // to update on change
    requestAnimationFrame(update);
}

const start = () => {
    // to update on start
    requestAnimationFrame(update);
}



let grid = buildGrid();
render(grid);
startBtn.addEventListener("click", start);
// stopBtn.addEventListener("click", stop);
// resetBtn.addEventListener("click", render(grid));
