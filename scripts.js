import { Grid } from "./grid.js";
import { Tile } from "./tile.js";
const gameboard = document.getElementById("game-board");

const grid = new Grid(gameboard);
grid.getRandomEmptyCell().linkTile(new Tile(gameboard));
grid.getRandomEmptyCell().linkTile(new Tile(gameboard));

function setupInputOnce() {
  window.addEventListener("keydown", handleInput, { once: true });
}
setupInputOnce();
function handleInput(event) {
  switch (event.key) {
    case "ArrowUp":
      moveUp();
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
    default:
      setupInputOnce();
      return;
  }
  setupInputOnce();
}

function slideTilesInGroup(group) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }
    const cellWithTile = group[i];
    let targetCell;
    let j = i - 1;
    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }
    if (!targetCell) {
      console.log("!targetCell");
      continue;
    }
    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
      console.log("linkTileForMerge");
    }

    cellWithTile.unlinkTile();
  }
}
function slideTiles(groupedCells) {
  groupedCells.forEach((group) => slideTilesInGroup(group));
  grid.cells.forEach((cell) => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });
  //   console.log(groupedCells);
}
function moveUp() {
  slideTiles(grid.cellsGroupedByColumn);
}
