/* --- Selectors from Html --- */
// get the div for world grid
const world = document.querySelector('#world');
// get the button to start and stop simulation
const startStopButton = document.querySelector('#startStopBtn');
// get the button to reset the world
const resetButton = document.querySelector('.reset-btn');
// get the button to generate random cells
const randomButton = document.querySelector('.random-btn');
// get the h3 that displays the alive count
const aliveCount = document.querySelector('.alive-count');
// get the h3 that displays the time of simulation
const stopwatch = document.querySelector('.stopwatch');
// get the mPopup
const modalBox = document.querySelector('#modalBox');
// get the btn that will open the modal
const modalPopupButton = document.querySelector("#modal-popup-btn");
// get the close btn of modal
const closeButton = document.querySelector(".close-btn");
// modal footer for date
const modalFooter = document.querySelector("#modal-footer");

/* -- Variables -- */
//  we can also directly specifying no of rows and cols
const resolution = 10;
const width = 400;
const height = 400;
const rows = width / resolution;
const columns = height / resolution;
// const rows = 40;
// const columns = 40;
// ? We need to create 2d arrays from these 1D arrays 
let currentGeneration = [rows];
let nextGeneration = [rows];
// console.log('1D', currentGeneration);
// ? variables for start stop button
let hasGameStarted = false; //set it to true when game starts
let timer; //to control evolutions
let evolutionSpeed = 1000; //each generation will change in half second
// ? variables for stopwatch
let hours = 0;
let minutes = 0;
let seconds = 0;
let isTimeStopped = true;


/* -- Functions  --  */

// * functions for stopwatch
function startStopwatch() {
    if (isTimeStopped === true) {
        isTimeStopped = false;
        updateTime();
    }
}

function stopStopwatch() {
    if (isTimeStopped === false) {
        isTimeStopped = true;
    }
}

function updateTime() {
    if (isTimeStopped === false) {
        seconds = parseInt(seconds);
        minutes = parseInt(minutes);
        hours = parseInt(hours);

        seconds += 1;

        // convert to minutes
        if (seconds === 60) {
            minutes += 1;
            seconds = 0;
        }
        // convert to hours
        if (minutes === 60) {
            hours += 1;
            minutes = 0;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }

        stopwatch.innerText = `${hours}:${minutes}:${seconds}`;
        // update the time in every 1 seconds
        setTimeout(updateTime, 1000);
    }
}
// ? function to reset time
function resetTime() {
    hours = 0;
    minutes = 0;
    seconds = 0;
    isTimeStopped = true;
    stopwatch.innerText = `00:00:00`;
}



//? function to create the 2D array from the 1D array
function create2DGenerationArrays() {
    for (let i = 0; i < rows; i++) {
        // for creating 2D array each row will have array of columns
        currentGeneration[i] = new Array(columns);
        nextGeneration[i] = new Array(columns);
        // console.log(currentGeneration);
    }
}
// ? function to initialize the 2D array
function init2DGenerationArrays() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            currentGeneration[i][j] = 0;
            nextGeneration[i][j] = 0;
        }
    }
    // console.log(currentGeneration);
}

//? function to create the world grid
function createWorld() {
    //* we will create a table with rows and columns
    let table = document.createElement('table');
    table.setAttribute('id', 'worldgrid');
    // creating the rows and columns using for loop
    for (let i = 0; i < rows; i++) {
        //* create table row
        let table_row = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            //* create table cell and add its attribute
            let table_cell = document.createElement('td');
            table_cell.setAttribute('id', `${i}_${j}`);
            table_cell.setAttribute('class', 'dead');
            // table_cell.classList.add('dead');
            table_cell.addEventListener('click', toggleCellLife);
            table_row.appendChild(table_cell);
        }
        table.appendChild(table_row);
    }
    world.appendChild(table);
}

//? function to get no of alive cells
function getAliveCount() {
    let aliveCount = 0;
    for (row in currentGeneration) {
        for (column in currentGeneration[row]) {
            if (currentGeneration[row][column] === 1) {
                aliveCount++;
            }
        }
    }
    return aliveCount;
}


// ? function to togggle life of cell
function toggleCellLife() {
    // As the id for each cell is its position seperated by _ so by splitting it in _ we get the required location of cell in form of array i-e location = [row,column]
    let location = this.id.split("_");
    // getting the required row and column in form of number
    let row = Number(location[0]); //? get i position
    let column = Number(location[1]); //? get j position
    // console.log(row, column);
    // ? Toggle the cell for alive or dead
    //? if active change to dead
    let no_of_alive_cells;
    if (hasGameStarted === false) {
        if (this.className === 'alive') {
            this.setAttribute('class', 'dead');
            currentGeneration[row][column] = 0;
            console.log(`${this.id} Cell is dead`);
            no_of_alive_cells = getAliveCount();
            aliveCount.innerText = no_of_alive_cells;
        } else {
            this.setAttribute('class', 'alive');
            currentGeneration[row][column] = 1;
            console.log(`${this.id} Cell is Alive`);
            no_of_alive_cells = getAliveCount();
            aliveCount.innerText = no_of_alive_cells;
        }
    }
    

    // here setAttrribute is better than using classList.add as we need to manually remove the dead class again
    // this.classList.contains('alive') ? this.classList.remove('alive') : this.classList.add('alive');
}

//? function to get the neighbors count
function getNeighborCount(row, column) {
    let count = 0;
    let row_no = Number(row);
    let column_no = Number(column);
    // ? Here we need to make sure that element is not in first row, last row, first column or last column
    // make sure we are not at first row
    if (row_no - 1 >= 0) {
        // check the top neighbor
        if (currentGeneration[row_no - 1][column_no] === 1) {
            count++;
        }
    }
    // make sure we are not in first cell i-e upper left corner
    if (row_no - 1 >= 0 && column_no - 1 >= 0) {
        // check the upper left neighbor
        if (currentGeneration[row_no - 1][column_no - 1] === 1) {
            count++;
        }
    }

    // make sure we are not in the first row last column
    // upper right corner
    if (row_no - 1 >= 0 && column_no + 1 < columns) {
        // check the upper right neighbor
        if (currentGeneration[row_no - 1][column_no + 1] === 1) {
            count++;
        }
    }

    // make sure we are not in first column
    if (column_no - 1 >= 0) {
        // check the left neighbor
        if (currentGeneration[row_no][column_no - 1] === 1) {
            count++;
        }
    }
    // make sure we are not in last column
    if (column_no + 1 < columns) {
        // check right neighbor
        if (currentGeneration[row_no][column_no + 1] === 1) {
            count++;
        }
    }
    // make sure we are not on bottom left corner
    if (row_no + 1 < rows && column_no - 1 >= 0) {
        // check bottom left neighbor
        if (currentGeneration[row_no + 1][column_no - 1] === 1) {
            count++;
        }
    }
    // make sure we are not in bottom right
    if (row_no + 1 < rows && column_no + 1 < columns) {
        // check the bottom right neighbor
        if (currentGeneration[row_no + 1][column_no + 1] === 1) {
            count++;
        }
    }
    // make sure we are not in last row
    if (row_no + 1 < rows) {
        // check for the bottom neighbor
        if (currentGeneration[row_no + 1][column_no] === 1) {
            count++;
        }
    }
    return count;

}


// ? function to create next generation of cells using rules
function createNextGeneration() {
    // looping through the 2d array to create next gen
    for (row in currentGeneration) {
        for (column in currentGeneration[row]) {
            let neighbors_count = getNeighborCount(row, column);
            console.log(`Neighbours for ${row}_${column} = `, neighbors_count);
            // checking the rules for game of life
            // if alive
            if (currentGeneration[row][column] === 1) {
                if (neighbors_count < 2) {
                    // * underpopulation
                    nextGeneration[row][column] = 0;
                } else if (neighbors_count === 2 || neighbors_count === 3) {
                    // * nochange
                    nextGeneration[row][column] = 1;
                } else if (neighbors_count > 3) {
                    // * overpopulation
                    nextGeneration[row][column] = 0;
                }
                // if dead
            } else if (currentGeneration[row][column] === 0) {
                //* if dead or empty and have 3 neighbors reproduce
                if (neighbors_count == 3) {
                    nextGeneration[row][column] = 1;
                }
            }
        }
    }
}

// ? function to update the current generation
function updateCurrentGeneration() {
    for (row in currentGeneration) {
        for (column in currentGeneration[row]) {
            // update the current generation with the results of the next generation
            currentGeneration[row][column] = nextGeneration[row][column];
            // set the next generation back to empty
            nextGeneration[row][column] = 0;
        }
    }
}



//? function to update the world grid classes
function updateWorld() {
    let cell = '';
    let no_of_alive_cells = getAliveCount();
    aliveCount.innerText = no_of_alive_cells;
    if (no_of_alive_cells === 0) {
        changeGameState();

    }
    for (row in currentGeneration) {
        for (column in currentGeneration[row]) {
            cell = document.getElementById(row + '_' + column);
            if (currentGeneration[row][column] === 0) {
                cell.setAttribute('class', 'dead');
            } else {
                cell.setAttribute('class', 'alive');
            }
        }
    }
}




//? function to evolve each generation
function evolve() {
    createNextGeneration();
    updateCurrentGeneration();
    updateWorld();
    // here we will call the evolve function recursively in certain time determined by evolution speed using setTimeout
    if (hasGameStarted) {
        timer = setTimeout(evolve, evolutionSpeed);
        // console.log(`Timer: ${timer}`);
    }
}


//? function to start and stop the evolution process using timer
function changeGameState() {

    if (!hasGameStarted) {
        let aliveCellsResult = getAliveCount();
        // console.log(aliveCellsResult);
        if (aliveCellsResult < 1) {
            alert("No cells are currently alive!!\nAtleast make atleast one cell alive or generate random cells before starting");
            return;
        } else {
            hasGameStarted = true;
            if (startStopButton.classList.contains('start-btn')) {
                startStopButton.classList.replace('start-btn', 'stop-btn');
            }
            // startStopButton.classList.add('start-btn');
            startStopButton.innerHTML = '<span><i class="fa fa-stop"></i></span> Stop Simulation';
            randomButton.style.display = "none";
            resetTime();
            startStopwatch();
            evolve();
        }
    } else {
        hasGameStarted = false;
        if (startStopButton.classList.contains('stop-btn')) {
            startStopButton.classList.replace('stop-btn', 'start-btn');
        }
        // startStopButton.classList.add('stop-btn');
        startStopButton.innerHTML = '<span><i class="fa fa-play"></i></span> Start Simulation';
        randomButton.style.display = "block";
        clearTimeout(timer);
        stopStopwatch();
    }

}

// ? function to reset the world
//  we simply reload the page 
function resetWorld() {
    location.reload();
}

// ? function to generate random pattern
function generateRandomPattern(no_of_cells = 1) {
    for (let i = 0; i < no_of_cells; i++) {
        // getting the required row and column in form of number
        let row = Math.floor(Math.random() * rows); //? get i position
        let column = Math.floor(Math.random() * columns); //? get j position
        // console.log(row,column);
        let randomCell = document.getElementById(`${row}_${column}`);
        randomCell.setAttribute('class', 'alive');
        currentGeneration[row][column] = 1;
        console.log(`${row}_${column} cell is active`);
        let no_of_alive_cells = getAliveCount();
        aliveCount.innerText = no_of_alive_cells;
    }
}

//* functions for modal
function displayModal() {
    modalBox.style.display = "flex";
}

function closeModal() {
    modalBox.style.display = "none";
}

/* --  DOM functions --  */
window.onload = () => {
    createWorld();
    create2DGenerationArrays();
    init2DGenerationArrays();
    displayModal();
}

// * event listeners for the buttons
startStopButton.addEventListener("click", changeGameState);
resetButton.addEventListener("click", resetWorld);
randomButton.addEventListener("click", () => {
    generateRandomPattern(50);
});

// * event listeners for modal
// add date to modal
let currentDate = new Date();
modalFooter.innerHTML = `<span>&copy;</span><a href='https://anish-shilpakar.com.np/'>Anish_Shilpakar</a>${currentDate.getFullYear()}`;
// display the modal
modalPopupButton.addEventListener("click", () => {
    if (!hasGameStarted) {
            displayModal();
    } 
});
// close the modal
closeButton.addEventListener("click", closeModal);
// close when clicking outside of modal
window.addEventListener("click", (e) => {
    if (e.target == modalBox) {
        closeModal();
    }
});
