import { Grid } from "./grid.js";
const gameboard = document.getElementById("game-board");

const grid = new Grid(gameboard);
grid.getRandomEmptyCell().linkTile(new tile(gameboard));
