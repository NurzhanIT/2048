import { Grid } from "./grid.js";
import { Tile } from "./tile.js";
const gameboard = document.getElementById("game-board");

const grid = new Grid(gameboard);
grid.getRandomEmptyCell().linkTile(new Tile(gameboard));
grid.getRandomEmptyCell().linkTile(new Tile(gameboard));
