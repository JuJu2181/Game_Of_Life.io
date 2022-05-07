# Project Description
- This JS project is going to be a simple simulation of Conway's Game Of Life 
- I will be implementing it using HTML, CSS and Vanilla JS 

#Live Link:
Check it out live here: (Conway's Game of Life)[https://juju2181.github.io/Game_Of_Life.io/]

# What is Conway's Game Of Life 
- Conway's Game Of Life is a cellular automation devised by British mathematican John Horton Conway.
- It is zero player game, meaning that it needs a single input to trigger the start of game and then it requires no further input
- It is Turing Complete. 

## Rules for Conway's Game of life
- The universe of the Game of life is infinite, two-dimensional orthogonal grid of square cells, each of which can be in either of two states, live or dead. Every cell will interact with its eight neighbours which are the cells that are horizontal,vertical and diagonally adjacent. 
- Any live cell with less than two live neighbours will die due to underpopulation.
- Any live cell with two or three live neighbour will live on to next generation.
- Any live cell with more than three live neighbour dies,as if by overpopulation
- Any dead cell with exactly three live neighbours becomes a live cell as if by reproduction

### Summary of rules 
- Alive with 2 or 3 live neighbours = alive 
- Dead with 3 live neighbours = live 
- All other cases live or dead both die 
