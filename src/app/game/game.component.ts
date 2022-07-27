import { Component, OnInit } from '@angular/core';

const directions = [
  { x: 0, y: -1 }, //UP
  { x: 0, y: 1 }, //DOWN
  { x: -1, y: 0 }, //Left
  { x: 1, y: 0 }, //rigtht

  { x: -1, y: -1 }, //UP + Left
  { x: 1, y: -1 }, //UP + right
  { x: -11, y: 1 }, //DOWN + Left
  { x: 1, y: 1 }, //DOWN + Right
];

class Cell {
  mine: boolean;
  open: boolean;
  flag: boolean;

  neighbours: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  mCell: Cell = new Cell();

  matrix: any = [];

  rows = 10;
  cols = 8;
  cells = this.rows * this.cols;
  planted = 0;
  bombs = Math.floor(this.cells / 2);

  constructor() {
    this.createCellMatrix();
    this.putMines();
    this.calcNeighbours();
  }

  putMines() {
    const chance = this.bombs / this.cells;

    console.log('Chance', this.bombs, chance + 0.5);

    for (let i = 0; i < this.rows && this.planted < this.bombs; i++) {
      for (let j = 0; j < this.cols && this.planted < this.bombs; j++) {
        let putAMine: boolean = Math.random() < chance + 0.001;

        if (putAMine && this.planted < this.bombs) {
          let cell: Cell = this.getCell(i, j);
          if (!cell.mine) {
            cell.mine = true;
            this.planted++;
          }
        }
      }
    }
  }

  createCellMatrix() {
    for (let i = 0; i < this.rows; i++) {
      let row = [];

      for (let j = 0; j < this.cols; j++) {
        let cell = new Cell();
        cell.x = i;
        cell.y = j;

        if (j == 4) {
          // cell.mine = true;
        }

        row.push(cell);
      }
      this.matrix.push(row);
    }
  }

  calcNeighbours() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.calcNeighboursOfCell(i, j);
      }
    }
  }
  calcNeighboursOfCell(i, j) {
    let neighbour = 0;

    neighbour += this.hasMine(i + 1, j + 0); //DOWN
    neighbour += this.hasMine(i - 1, j + 0); //UP
    neighbour += this.hasMine(i + 0, j + 1); //Right
    neighbour += this.hasMine(i + 0, j - 1); //Left
    neighbour += this.hasMine(i + 1, j + 1); //Top right
    neighbour += this.hasMine(i + 1, j - 1); //Top Left
    neighbour += this.hasMine(i - 1, j + 1); //Bottom right
    neighbour += this.hasMine(i - 1, j - 1); //Bottom left

    let cell: Cell = this.getCell(i, j);
    if (!cell.mine) cell.neighbours = neighbour;
  }

  hasMine(i, j) {
    if (i < 0 || i >= this.rows || j < 0 || j >= this.cols) {
      return 0;
    }

    let cell: Cell = this.getCell(i, j);
    if (cell.mine) {
      return 1;
    } else {
      return 0;
    }
    return 0;
  }

  getCell(i, j) {
    return this.matrix[i][j];
  }

  onClick(i: number, j: number) {
    let cell: Cell = this.getCell(i, j);
    
    if (cell.mine) {
      alert('game-over');
      return;
    }

    this.tryOpen(i, j)



  }

  tryOpen(i, j) {
    if (i < 0 || i >= this.rows || j < 0 || j >= this.cols) {
      return 0;
    }
    let cell: Cell = this.getCell(i, j);
    
    cell.open = true;

    if (cell.neighbours == 0) {
      for (let d of directions) {
        this.tryOpen(i + d.x, j + d.y);
      }
    }
  }

  ngOnInit() {}
}
