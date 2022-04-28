class Piece {
  constructor(row, col, color, type) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.type = type;
  }

  //the pawn captures pieces in a different direction of its movement which means we need a separate check from its movement.
  pawnAttack(row) {
    let cords = "";

    // checks right side of pawn
    if (chessBoard.isEnemy(row, this.col + 1, this.color)) {
      cords += String(row + "-" + (this.col + 1) + ",");
    }

    // checks left side of pawn
    if (chessBoard.isEnemy(row, this.col - 1, this.color)) {
      cords += String(row + "-" + (this.col - 1) + ",");
    }
    return cords;
  }

  forwardMove(row, direction) {
    let cords = "";
    if (row < DIMENSIONS - 1 && row > 0 && chessBoard.emptyTile(row + direction, this.col)) {
      cords = String((row + direction) + "-" + this.col + ",");
    }
    return cords;
  }

  pawnMoves() {
    let direction = (this.color === WHITE_PLAYER) ? 1 : -1;
    let cords = this.forwardMove(this.row, direction);

    if (cords !== "") {
      // Checks for double move at start of game
      if (this.row === 1 || this.row === 6) {
        cords += this.forwardMove(this.row + direction, direction);
      }
    }
    cords += this.pawnAttack(this.row + direction);
    return cords;
  }

  individualMoveInDirection(row, col) {
    let result = [true, ""]; //first cell of result determines if we keep moving or stopping and the second cell is the coordinate we add for possible moves 
    if (col < DIMENSIONS && col >= 0 && row >= 0 && row < DIMENSIONS) {
      if (chessBoard.emptyTile(row, col)) {
        result[1] = String(row + "-" + col + ",");
      }
      else {
        if (chessBoard.isEnemy(row, col, this.color)) {
          result[1] = String(row + "-" + col + ",");
        }
        result[0] = false;
      }
    }
    else {
      result[0] = false;
    }

    return result;
  }

  rookMoves() {
    let cords = "";
    let result = [];
    let direction = [0, 1, 0, -1, 1, 0, -1, 0]; //each 2 cells represent a direction first one for x axis and second one for y axis

    for (let i = 0; i < 4; i++) {
      let col = this.col;
      let row = this.row;
      while (true) {
        col += direction[i * 2];
        row += direction[i * 2 + 1];
        result = this.individualMoveInDirection(row, col);
        cords += result[1];
        if (!result[0]) {
          break;
        }
      }
    }
    return cords;
  }

  bishopMoves() {
    let cords = "";
    let result = [];
    let direction = [-1, -1, 1, 1, 1, -1, -1, 1] //each 2 cells represent a direction first one for x axis and second one for y axis

    for (let i = 0; i < 4; i++) {
      let col = this.col;
      let row = this.row;
      while (true) {
        col += direction[i * 2];
        row += direction[i * 2 + 1];
        result = this.individualMoveInDirection(row, col);
        cords += result[1];
        if (!result[0]) {
          break;
        }
      }
    }
    return cords;
  }

  knightMoves() {
    let cords = "";
    let direction = [2, 0, -2, 0, 0, 2, 0, -2];

    for (let i = 0; i < 4; i++) {
      if (direction[i * 2] === 0) {
        cords += this.individualMoveInDirection(this.row + 1, this.col + direction[i * 2 + 1], this.color)[1];
        cords += this.individualMoveInDirection(this.row - 1, this.col + direction[i * 2 + 1], this.color)[1];
      }
      else {
        cords += this.individualMoveInDirection(this.row + direction[i * 2], this.col + 1, this.color)[1];
        cords += this.individualMoveInDirection(this.row + direction[i * 2], this.col - 1, this.color)[1];
      }
    }
    return cords;
  }

  kingRow(row) {
    let cords = "";
    for (let offset = -1; offset <= 1; offset++) {
      if (this.col + offset < DIMENSIONS && this.col + offset >= 0) {
        if (!chessBoard.isTeam(row, this.col + offset, this.color)) {
          cords += String(row + "-" + (this.col + offset) + ",");
        }
      }
    }
    return cords;
  }

  kingMoves() {
    let cords = "";

    // the king's movement can be broken down to 3 rows of 3 cells each which the center is the king, this for loop represents each row
    for (let offset = -1; offset <= 1; offset++) {
      if (this.row + offset < DIMENSIONS && this.row + offset >= 0) {
        cords += this.kingRow(this.row + offset);
      }
    }
    return cords;
  }

  checkCords(cords) {
    if (cords !== "") {
      cords = cords.split(",");
      cords.pop();
      return cords;
    }
    return NO_LEGAL_MOVES;
  }

  availableMoves() {
    if (this.type === "pawn") {
      return this.checkCords(this.pawnMoves());
    }
    else if (this.type === "rook") {
      return this.checkCords(this.rookMoves());
    }
    else if (this.type === "bishop") {
      return this.checkCords(this.bishopMoves());
    }
    else if (this.type === "queen") {
      return this.checkCords(this.bishopMoves() + this.rookMoves());  //Queen has the combined moves of bishop and rook
    }
    else if (this.type === "knight") {
      return this.checkCords(this.knightMoves());
    }
    else {
      return this.checkCords(this.kingMoves());
    }
  }
}