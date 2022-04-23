const DIMENSIONS = 8;
const BLACK_PLAYER = "black";
const WHITE_PLAYER = "white";
const NO_LEGAL_MOVES = "-1";

class Piece {
  constructor(row, col, color, type) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.type = type;
  }
}

class BoardData {
  constructor()
  {
    this.board = this.boardReset();
  }

  boardReset()
  {
    const values = ["rook", "knight", "bishop", "queen", "king", "bishop","knight", "rook"];

    let board = Array(DIMENSIONS * DIMENSIONS).fill(null);

    // Makes a starting chess board
    for (let colIndex = 0; colIndex < DIMENSIONS; colIndex++) 
    {
      board[colIndex + DIMENSIONS] = new Piece(1, colIndex, WHITE_PLAYER, "pawn");

      board[colIndex + (DIMENSIONS - 2) * DIMENSIONS] = new Piece(DIMENSIONS - 2, colIndex, BLACK_PLAYER, "pawn");

      board[colIndex] = new Piece(0, colIndex, WHITE_PLAYER, values[colIndex]);

      board[colIndex + DIMENSIONS * (DIMENSIONS - 1)] = new Piece(DIMENSIONS - 1, colIndex, BLACK_PLAYER, values[colIndex]);
    }
    return board;
  }

  getPiece(row, col)
  {
    if (row >= 0 && row <= DIMENSIONS - 1 && col >= 0 && col <= DIMENSIONS - 1)
    {
      return this.board[row * DIMENSIONS + col];
    }
    else
    {
      throw new UserException("Out of Bounds");
    }
  }
}

let chessBoard = new BoardData();

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
  for (let i = 0; i < DIMENSIONS+1; i++) {
    addHeader(board, (i === 0) ? "" : String.fromCharCode("a".charCodeAt(0) + i - 1));
  }
}

function getImageSrc(type, color)
{
  return "assets/" + color + "_" + type + ".png";
}

function addHeader(parentNode, content)
{
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

function forwardMove(row, col, color)
{
  if (color === WHITE_PLAYER) //White pawns move up and black pawns move down
  {
    if (row < DIMENSIONS - 1)
    {
      return String((row + 1) + "-" + col + ",");
    }
  }
  else
  {
    if (row > 0)
    {
      return String ((row - 1) + "-" + col + ",");
    }
  }
  return "";
}

function pawnMoves(pawn)
{
  let cords = forwardMove(pawn.row, pawn.col, pawn.color);

  if (cords !== "")
  {
    // Checks for double move at start of game
    if (pawn.color === WHITE_PLAYER && pawn.row === 1) 
    {
      cords += forwardMove(pawn.row + 1, pawn.col, pawn.color);
    }
    else if (pawn.color === BLACK_PLAYER && pawn.row === DIMENSIONS - 2)
    {
      cords += forwardMove(pawn.row - 1, pawn.col, pawn.color);
    }
  }
  else
  {
    return "-1";
  }

  return cords;
}

function rookMoves(rook)
{
  let cords = "";
  let col = rook.col;
  let row = rook.row;

  //We split the movement to 4 directions because it will be easier later to detect other pieces with this method
  while (col > 0) //scans to the left
  {
     cords += String((rook.row) + "-"  +(col - 1) + ",");
     col--;
  }

  col = rook.col;
  while (col < DIMENSIONS - 1) //scans to the right
  {
      cords += String((rook.row) + "-" + (col + 1) + ",");
      col++;
  }

  while (row < DIMENSIONS - 1) //scans upward
  {
      cords += String((row + 1) + "-" + (rook.col) + ",");
      row++;
  }

  row = rook.row;
  while (row > 0) //scans downward
  {
    cords += String((row - 1) + "-" + (rook.col) + ",");
    row--;
  }

  return checkCords(cords);
}

function bishopMoves(bishop)
{
  let cords = "";
  let col = bishop.col;
  let row = bishop.row;

  //We split the movement to 4 directions because it will be easier later to detect other pieces with this method
  while (col > 0 && row > 0)
  {
    col--;
    row--;
    cords += String(row + "-" + col + ",");
  }

  col = bishop.col;
  row = bishop.row;

  while (col < DIMENSIONS - 1 && row < DIMENSIONS - 1)
  {
    col++;
    row++;
    cords += String(row + "-" + col + ",");
  }

  col = bishop.col;
  row = bishop.row;

  while (col < DIMENSIONS - 1 && row > 0)
  {
    col++;
    row--;
    cords += String(row + "-" + col + ",");
  }

  col = bishop.col;
  row = bishop.row;

  while (col > 0 && row < DIMENSIONS - 1)
  {
    col--;
    row++;
    cords += String(row + "-" + col + ",");
  }

  return checkCords(cords);
}

function knightBranch(anchorNum, brnachNum, isBranchCol)
{
  let cords = "";  
  if (brnachNum + 1 < DIMENSIONS)
  {
    if (isBranchCol) //checks if we branch the movement on the columns or the rows
    {
      cords += String((anchorNum) + "-" + (brnachNum + 1) + ",");
    }
    else if (!isBranchCol)
    {
      cords += String((brnachNum + 1) + "-" + (anchorNum) + ",");
    }
  }

  if (brnachNum - 1 >= 0)
  {
    if (isBranchCol)
    {
      cords += String((anchorNum) + "-" + (brnachNum - 1) + ",");
    }
    else if (!isBranchCol)
    {
      cords += String((brnachNum - 1) + "-" + (anchorNum) + ",");
    }
  }
  return cords;
}

function knightMoves(knight)
{
  let cords = "";
  let row = knight.row;
  let col = knight.col;

  //The knight movement was implemented with 2 steps, 1: you would take it 2 tiles away on one of the x/y axis 2: move one tile to each side (knightBranch function)
  if (col + 2 < DIMENSIONS)
  {
    cords += knightBranch(col + 2, row, false);
  }

  if (row + 2 < DIMENSIONS)
  {
    cords += knightBranch(row + 2, col, true)
  }

  if (col - 2 >= 0)
  {
    cords += knightBranch(col - 2, row, false);
  }

  if (row - 2 >= 0)
  {
    cords += knightBranch(row - 2, col, true);
  }

  return checkCords(cords);
}

function kingRow(row, col)
{
  let cords = "";
  if (col - 1 >= 0)
  {
      cords += String((row) + "-" + (col - 1) + ",");
  }
  if (col + 1 < DIMENSIONS)
  {
    cords += String((row) + "-" + (col + 1) + ",");

  }

  return checkCords(cords);
}

function kingMoves(king)
{
  let cords = "";
  let row = king.row;
  let col = king.col;

  cords += kingRow(row, col);

  if (row + 1 < DIMENSIONS)
  {
      cords += String((row + 1) + "-" + (col) + ",");
      cords += kingRow(row + 1, col); 
  }

  if (row - 1 >= 0)
  {
    cords += kingRow(row - 1, col);
    cords += String((row - 1) + "-" + (col) + ",");
  }

  return checkCords(cords);
}

function checkCords(cords)
{
  return cords !== "" ? cords : NO_LEGAL_MOVES;
}

function availableMoves(chessPiece)
{
  if (chessPiece.type === "pawn")
  {
    return pawnMoves(chessPiece);
  }
  else if (chessPiece.type === "rook")
  {
    return rookMoves(chessPiece);
  }
  else if (chessPiece.type === "bishop")
  {
    return bishopMoves(chessPiece);
  }
  else if (chessPiece.type === "queen")
  {
    //Queen has the combined moves of bishop and rook
    return bishopMoves(chessPiece) + rookMoves(chessPiece); 
  }
  else if (chessPiece.type === "knight")
  {
    return knightMoves(chessPiece);
  }
  else {
    return kingMoves(chessPiece);
  }
}

function resetMarkers()
{
  for (let tile of document.getElementsByTagName("td"))
  {
    tile.classList.remove("optional-move");
  }
}

function tileClicked(rowIndex, columnIndex) {
  let selectedTile = document.getElementById(String(rowIndex + "-" + columnIndex));

  resetMarkers();
  let previousTile = document.getElementsByClassName("selected")[0];

  if (previousTile) {
    previousTile.classList.remove("selected");
  }

  selectedTile.classList.add("selected");
  let piece = chessBoard.getPiece(rowIndex, columnIndex);
  
  if (piece)
  {
    let tileCords = availableMoves(piece);

    if (tileCords !== NO_LEGAL_MOVES)
    {
      tileCords = tileCords.split(",");
      tileCords.pop();
      
      for (let cord of tileCords)
      {
        document.getElementById(cord).classList.add("optional-move");
      }
    }
  }
}