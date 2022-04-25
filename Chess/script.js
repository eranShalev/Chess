const DIMENSIONS = 8;
const BLACK_PLAYER = "black";
const WHITE_PLAYER = "white";
const NO_LEGAL_MOVES = "-1";
let previousCords = [-1, -1];
let whiteTurn = true;

class Piece {
  constructor(row, col, color, type) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.type = type;
  }
}

class BoardData {
  constructor() {
    this.board = this.boardReset();
  }

  boardReset() {
    const values = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

    let board = Array(DIMENSIONS * DIMENSIONS).fill(null);

    // Makes a starting chess board
    for (let colIndex = 0; colIndex < DIMENSIONS; colIndex++) {
      board[colIndex + DIMENSIONS] = new Piece(1, colIndex, WHITE_PLAYER, "pawn");

      board[colIndex + (DIMENSIONS - 2) * DIMENSIONS] = new Piece(DIMENSIONS - 2, colIndex, BLACK_PLAYER, "pawn");

      board[colIndex] = new Piece(0, colIndex, WHITE_PLAYER, values[colIndex]);

      board[colIndex + DIMENSIONS * (DIMENSIONS - 1)] = new Piece(DIMENSIONS - 1, colIndex, BLACK_PLAYER, values[colIndex]);
    }
    return board;
  }

  getPiece(row, col) {
    if (row >= 0 && row <= DIMENSIONS - 1 && col >= 0 && col <= DIMENSIONS - 1) {
      return this.board[row * DIMENSIONS + col];
    }
    else {
      return null;
    }
  }

  MovePiece(piece, newRow, newCol)
  {
    let image = document.getElementById(String(piece.row + "-" + piece.col)).getElementsByTagName("img")[0];
    let newTile = document.getElementById(String(newRow + "-" + newCol));
    if (this.getPiece(newRow, newCol))
    {
      newTile.removeChild(newTile.getElementsByTagName("img")[0]);
    }
    newTile.appendChild(image);
    this.board[newRow * DIMENSIONS + newCol] = new Piece(newRow, newCol, piece.color, piece.type);
    this.board[piece.row * DIMENSIONS + piece.col] = null;
  }

  emptyTile(row, col) {
    return this.getPiece(row, col) === null;
  }

  isEnemy(row, col, color) {
    let enemy = this.getPiece(row, col);
    return (enemy !== null && enemy.color !== color);
  }

  isTeam(row, col, color)
  {
    let piece = this.getPiece(row, col);
    return (piece !== null && piece.color === color);
  }
}

let chessBoard = new BoardData(); //this object contains the logic of the board and all the pieces

window.onload = () => {
  let main_container = document.createElement("div");
  main_container.className = "table-container";

  document.body.appendChild(main_container);
  let play_table = document.createElement("table");

  main_container.appendChild(play_table);
  generateHeaders(play_table); //The headers are used for coordinates 

  for (let i = DIMENSIONS - 1; i >= 0; i--) {
    let row = document.createElement("tr");
    play_table.appendChild(row);
    chessRow(row, i);
  }

  generateHeaders(play_table);
};

function generateHeaders(board) {
  for (let i = 0; i < DIMENSIONS + 1; i++) {
    addHeader(board, (i === 0) ? "" : String.fromCharCode("a".charCodeAt(0) + i - 1));
  }
}

function getImageSrc(type, color) {
  return "assets/" + color + "_" + type + ".png";
}

function addHeader(parentNode, content) {
  let row_header = document.createElement("th");
  row_header.textContent = content;
  parentNode.appendChild(row_header);
}

function chessRow(row, rowIndex) {
  addHeader(row, rowIndex);
  for (let col = 0; col < DIMENSIONS; col++) {
    let tile = document.createElement("td");
    let piece = chessBoard.board[rowIndex * DIMENSIONS + col];

    if (piece) // If a chess piece exists we need an image for it
    {
      let image = document.createElement("img");
      image.src = getImageSrc(piece.type, piece.color);
      tile.appendChild(image);
    }

    if (!(rowIndex % 2)) {
      tile.classList.add(col % 2 ? "black-tile" : "white-tile");
    } else {
      tile.classList.add(col % 2 ? "white-tile" : "black-tile");
    }

    tile.setAttribute("id", String(rowIndex + "-" + col));

    tile.addEventListener("click", () => {
      tileClicked(rowIndex, col);
    });

    row.appendChild(tile);
  }
  addHeader(row, rowIndex);
}

function pawnAttack(row, col, color) {
  let cords = "";
  if (chessBoard.isEnemy(row, col + 1, color)) {
    cords += String(row + "-" + (col + 1) + ",");
  }

  if (chessBoard.isEnemy(row, col - 1, color)) {
    cords += String(row + "-" + (col - 1) + ",");
  }
  return cords;
}

function forwardMove(row, col, color) {
  let cords = "";
  if (color === WHITE_PLAYER) //White pawns move up and black pawns move down
  {
    if (row < DIMENSIONS - 1 && chessBoard.emptyTile(row + 1, col)) {
      cords = String((row + 1) + "-" + col + ",");
    }
  }
  else {
    if (row > 0 && chessBoard.emptyTile(row - 1, col)) {
      cords = String((row - 1) + "-" + col + ",");
    }
  }
  return cords;
}

function pawnMoves(pawn)
 {
  let cords = forwardMove(pawn.row, pawn.col, pawn.color);
  if (cords !== "") {
    // Checks for double move at start of game
    if (pawn.color === WHITE_PLAYER && pawn.row === 1) {
      cords += forwardMove(pawn.row + 1, pawn.col, pawn.color);
    }
    else if (pawn.color === BLACK_PLAYER && pawn.row === DIMENSIONS - 2) {
      cords += forwardMove(pawn.row - 1, pawn.col, pawn.color);
    }
  }
  if (pawn.color === WHITE_PLAYER) {
    cords += pawnAttack(pawn.row + 1, pawn.col, pawn.color);
  }
  else {
    cords += pawnAttack(pawn.row - 1, pawn.col, pawn.color);
  }
  return cords;
}

function individualMoveInDirection(row, col, color) {
  let result = [true, ""];
  if (col < DIMENSIONS && col >= 0 && row >= 0 && row < DIMENSIONS)
  {
    if (chessBoard.emptyTile(row, col)) {
      result[1] = String(row + "-" + col + ",");
    }
    else {
      if (chessBoard.isEnemy(row, col, color)) {
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

function rookMoves(rook) {
  let cords = "";
  let col = rook.col;
  let row = rook.row;
  let result = [];
  let direction = [0, 1, 0, -1, 1, 0, -1, 0];

  for (let i = 0; i < 4; i++)
  {
    col = rook.col;
    row = rook.row;
    while (true)
    {
      col += direction[i * 2];
      row += direction[i * 2 + 1];
      result = individualMoveInDirection(row, col, rook.color);
      cords += result[1];
      if (!result[0])
      {
        break;
      }
    }
  }
  return checkCords(cords);
}

function bishopMoves(bishop) {
  let cords = "";
  let col = bishop.col;
  let row = bishop.row;
  let result = [];
  let direction = [-1, -1, 1, 1, 1, -1, -1, 1]

  for (let i = 0; i < 4; i++)
  {
    col = bishop.col;
    row = bishop.row;
    while (true)
    {
      col += direction[i * 2];
      row += direction[i * 2 + 1];
      result = individualMoveInDirection(row, col, bishop.color);
      cords += result[1];
      if (!result[0])
      {
        break;
      }
    }
  }

  return cords;
}

function knightMoves(knight) {
  let cords = "";
  let row = knight.row;
  let col = knight.col;
  let direction = [2, 0, -2, 0, 0, 2, 0, -2];

  for (let i = 0; i < 4; i++)
  {
    row = knight.row;
    col = knight.col;
    if (direction[i * 2] === 0)
    {
      cords += individualMoveInDirection(row + 1, col + direction[i * 2 + 1], knight.color)[1];
      cords += individualMoveInDirection(row - 1, col + direction[i * 2 + 1], knight.color)[1];
    }
    else
    {
      cords += individualMoveInDirection(row + direction[i * 2], col + 1, knight.color)[1];
      cords += individualMoveInDirection(row + direction[i * 2], col - 1, knight.color)[1];
    }
  }
  return cords;
}

function kingRow(row, col, color) {
  let cords = "";
  for (let offset = -1; offset <= 1; offset++)
  {
    if (col + offset < DIMENSIONS && col + offset >= 0)
    {
      if (!chessBoard.isTeam(row, col + offset, color))
      {
        cords += String(row + "-" + (col + offset) + ",");
      }
    }
  }
  return cords;
}

function kingMoves(king) {
  let cords = "";
  let row = king.row;
  let col = king.col;

  for (let offset = -1; offset <= 1; offset++)
  {
    if (row + offset < DIMENSIONS && row + offset >= 0)
    {
      cords += kingRow(row + offset, col, king.color);
    }
  }
  return cords;
}

function checkCords(cords) {
  return cords !== "" ? cords : NO_LEGAL_MOVES;
}

function availableMoves(chessPiece) {
  if (chessPiece.type === "pawn") {
    return checkCords(pawnMoves(chessPiece));
  }
  else if (chessPiece.type === "rook") {
    return checkCords(rookMoves(chessPiece));
  }
  else if (chessPiece.type === "bishop") {
    return checkCords(bishopMoves(chessPiece));
  }
  else if (chessPiece.type === "queen") {
    //Queen has the combined moves of bishop and rook
    return checkCords(bishopMoves(chessPiece) + rookMoves(chessPiece));
  }
  else if (chessPiece.type === "knight") {
    return checkCords(knightMoves(chessPiece));
  }
  else {
    return checkCords(kingMoves(chessPiece));
  }
}

function resetMarkers() {
  for (let tile of document.getElementsByTagName("td")) {
    tile.classList.remove("optional-move");
  }
  
}

function tileClicked(rowIndex, columnIndex) {
  let selectedTile = document.getElementById(String(rowIndex + "-" + columnIndex));

  let previousTile = document.getElementsByClassName("selected")[0];
  if (previousTile) {
    previousTile.classList.remove("selected");
  }

  if (selectedTile.classList.contains("optional-move"))
  {
    let previousPiece = chessBoard.getPiece(previousCords[0], previousCords[1]);
    if ((previousPiece.color === WHITE_PLAYER && whiteTurn) || (previousPiece.color === BLACK_PLAYER && !whiteTurn))
    {
      chessBoard.MovePiece(previousPiece, rowIndex, columnIndex);
      whiteTurn = !whiteTurn;
    }
    resetMarkers();
  }  
  else
  {
    resetMarkers();
    selectedTile.classList.add("selected");
    let piece = chessBoard.getPiece(rowIndex, columnIndex);
  
    if (piece !== null) {
      let tileCords = availableMoves(piece);
  
      if (tileCords !== NO_LEGAL_MOVES) {
        tileCords = tileCords.split(",");
        tileCords.pop();
  
        for (let cord of tileCords) {
          document.getElementById(cord).classList.add("optional-move");
        }
      }
    }
  }
  previousCords = [rowIndex, columnIndex];
}