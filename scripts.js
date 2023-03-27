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
function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index == 0) {
      return false;
    }
    if (cell.isEmpty()) {
      return false;
    }
    const targetCell = group[index - 1];
    return targetCell.canAccept(cell.linkedTile);
  });
}
function canMove(groupedCells) {
  return groupedCells.some((group) => canMoveInGroup(group));
}
function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}
function canMoveDown() {
  return canMove(grid.cellsGroupedByReversedColumn);
}
function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}
function canMoveRight() {
  return canMove(grid.cellsGroupedByReversedRow);
}
async function handleInput(event) {
  switch (event.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      await moveRight();
      break;
    default:
      setupInputOnce();
      return;
  }
  const newTile = new Tile(gameboard);
  grid.getRandomEmptyCell().linkTile(new Tile(gameboard));

  if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
    await newTile.waitForAnimationEnd();
    alert("Try again!!!");
  }
  setupInputOnce();
}

function slideTilesInGroup(group, promises) {
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
    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());
    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
      console.log("linkTileForMerge");
    }

    cellWithTile.unlinkTile();
  }
}
async function slideTiles(groupedCells) {
  const promises = [];
  groupedCells.forEach((group) => slideTilesInGroup(group, promises));
  await Promise.all(promises);
  grid.cells.forEach((cell) => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });
  //   console.log(groupedCells);
}
async function moveUp() {
  await slideTiles(grid.cellsGroupedByColumn);
}
async function moveDown() {
  await slideTiles(grid.cellsGroupedByReversedColumn);
}
async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow);
}
async function moveRight() {
  await slideTiles(grid.cellsGroupedByReversedRow);
}
