import Tile from './Tile';
import Cell from './Cell';
import * as styles from './styles/Board.css';

const pos: number[] = [-1, 0, 1];

enum Grid {
  column = "column",
  row = "row"
}

export default class Board {
  private tiles: Tile[][];
  private row: number;
  private column: number;
  private mines: number;
  private onFlag: (count: number) => void;
  private onFinish: (win: boolean) => void;
  public element: HTMLElement;

  constructor(cell: Cell, mines: number, onFlag: (count: number) => void, onFinish: (win: boolean) => void) {
    this.tiles = [];
    this.row = cell.row;
    this.column = cell.column;
    this.mines = mines;
    this.onFlag = onFlag;
    this.onFinish = onFinish;

    this.element = this.createBoard();
    document.body.appendChild(this.element);

    this.newGame(cell, mines);
  }

  public newGame(cell: Cell, mines: number) {
    this.row = cell.row;
    this.column = cell.column;
    this.mines = mines;

    this.clearBoard();
    this.generateMines();
    this.populateBoard();
  }

  private createBoard(): HTMLElement {
    let board = document.createElement('div');
    board.setAttribute('id', 'board');
    return board;
  }

  private clearBoard() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  private generateMines() {
    let tiles: Tile[][] = new Array(this.row);
    for (let index = 0; index < tiles.length; index++) {
      tiles[index] = new Array(this.column);
    }

    let count: number = 0;
    while (count < this.mines) {
      const row = this.randomBy(Grid.row);
      const column = this.randomBy(Grid.column);

      if (!tiles[row][column]) {
        tiles[row][column] = new Tile('x', () => this.clickCell({ row, column }), () => this.flagCell({ row, column }));
        count++;
      }
    }

    this.tiles = tiles;
  }

  private randomBy(type: Grid): number {
    return Math.floor(Math.random() * this[type]);
  }

  private populateBoard() {
    for (let row = 0; row < this.row; row++) {
      const container = document.createElement('div');
      container.classList.add(styles.container);
      for (let column = 0; column < this.column; column++) {
        const label = this.labelCell({ row, column });
        const tile = new Tile(label, () => this.clickCell({ row, column }), () => this.flagCell({ row, column }));
        this.tiles[row][column] = tile;
        container.appendChild(tile.element);
      }
      this.element.appendChild(container);
    }
  }

  private labelCell(cell: Cell): string {
    const { row, column } = cell;
    if (!!this.tiles[row][column] && this.tiles[row][column].isMines()) {
      return 'x';
    } else {
      let count = 0;
      for (let rIndex = 0; rIndex < pos.length; rIndex++) {
        for (let cIndex = 0; cIndex < pos.length; cIndex++) {
          const rowPos = row + pos[rIndex];
          const colPos = column + pos[cIndex];
          if (this.cellInRange({ row: rowPos, column: colPos }) && this.tiles[rowPos][colPos] && this.tiles[rowPos][colPos].isMines()) {
            count++;
          }
        }
      }
      return count.toString();
    }
  }

  private clickCell(cell: Cell) {
    const { row, column } = cell;
    const tile = this.tiles[row][column];
    if (!tile.flagged) {
      if (tile.isMines()) {
        this.onFinish(false);
        this.showMines();
      }
      if (tile.isBlank()) {
        this.showExpand(cell);
      } else {
        tile.showLabel();
      }
    }

    !tile.isMines() && this.checkWin();
  }

  private flagCell(cell: Cell) {
    const { row, column } = cell;
    const tile = this.tiles[row][column];
    if (tile.flagged) {
      this.onFlag(-1);
    } else {
      this.onFlag(1);
    }
  }

  private showMines() {
    for (let row = 0; row < this.row; row++) {
      for (let column = 0; column < this.column; column++) {
        const tile = this.tiles[row][column];
        if (tile.isMines()) {
          tile.showLabel();
        }
        tile.toggleDisable();
      }
    }
  }

  private showExpand(cell: Cell) {
    const { row, column } = cell;
    this.tiles[row][column].showLabel();

    for (let rIndex = 0; rIndex < pos.length; rIndex++) {
      for (let cIndex = 0; cIndex < pos.length; cIndex++) {
        const rowPos = row + pos[rIndex];
        const colPos = column + pos[cIndex];
        if (this.cellInRange({ row: rowPos, column: colPos })) {
          const tile = this.tiles[rowPos][colPos];
          if (!tile.revealed && !tile.flagged) {
            if (tile.isBlank()) {
              this.showExpand({ row: rowPos, column: colPos });
            } else {
              tile.showLabel();
            }
          }
        }
      }
    }
  }

  private cellInRange(cell: Cell): boolean {
    const { row, column } = cell;
    return row < this.row && row > -1 && column < this.column && column > -1;
  }

  private checkWin() {
    let count = 0;
    for (let row = 0; row < this.row; row++) {
      for (let column = 0; column < this.column; column++) {
        if (this.tiles[row][column].revealed) {
          count++
        }
      }
    }

    if (count === this.row * this.column - this.mines) {
      this.onFinish(true);
      this.flagMines();
      alert('You Win');
    }
  }

  private flagMines() {
    for (let row = 0; row < this.row; row++) {
      for (let column = 0; column < this.column; column++) {
        const tile = this.tiles[row][column];
        if (tile.isMines()) {
          tile.setFlag();
        }
        tile.toggleDisable();
      }
    }
  }
}