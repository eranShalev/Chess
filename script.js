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

    for (let colIndex = 0; colIndex < DIMENSIONS; colIndex++)
    {
      board[colIndex + DIMENSIONS] = new Piece(1, colIndex, WHITE_PLAYER, "pawn");

      board[colIndex + (DIMENSIONS - 2) * DIMENSIONS] = new Piece(DIMENSIONS - 2, colIndex, BLACK_PLAYER, "pawn");

      board[colIndex] = new Piece(0, colIndex, WHITE_PLAYER, values[colIndex]);

      board[colIndex + DIMENSIONS * (DIMENSIONS - 1)] = new Piece(DIMENSIONS - 1, colIndex, BLACK_PLAYER, values[colIndex]);
    }

    board[5 + DIMENSIONS * 2] = new Piece(2, 5, BLACK_PLAYER, "king");

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

  MovePiece(piece, newRow, newCol)
  {
    let image = document.getElementById(String(piece.row + "-" + piece.col)).getElementsByTagName("img")[0];

    let newTile = document.getElementById(String(newRow + "-" + newCol));

    image.parentNode.removeChild(image);
    newTile.removeChild(newTile.getElementsByTagName("img")[0]);
    newTile.appendChild(image);


    this.board[newRow * DIMENSIONS + newCol] = new Piece(newRow, newCol, piece.color, piece.type);
    this.board[piece.row * DIMENSIONS + piece.row] = null;
  }
}

let chessBoard = new BoardData();

window.onload = () => {
  let main_container = document.createElement("div");
  main_container.className = "table-container";

  document.body.appendChild(main_container);
  let play_table = document.createElement("table");

  main_container.appendChild(play_table);
  generateHeaders(play_table);

  for (let i = DIMENSIONS - 1; i >= 0; i--) {
    let row = document.createElement("tr");
    play_table.appendChild(row);
    chessRow(row, i);
  }

  generateHeaders(play_table);

};

function generateHeaders(board) {
  for (let i = 0; i < DIMENSIONS; i++) {
    let header = document.createElement("th");

    header.textContent = String.fromCharCode("a".charCodeAt(0) + i - 1);
    if (i === 0) {
      header.textContent = "";
    }
    board.appendChild(header);
  }
}

function getImageSrc(type, color)
{
  return "assets/" + color + "_" + type + ".png";
}

function chessRow(row, index) {
  let row_header = document.createElement("th");
  row_header.textContent = index;
  row.appendChild(row_header);

  for (let i = 0; i < DIMENSIONS; i++) {
    let tile = document.createElement("td");
    let piece =chessBoard.board[index * DIMENSIONS + i];
    
    if (piece)
    {
      let image = document.createElement("img");
      image.src = getImageSrc(piece.type, piece.color);
      tile.appendChild(image);      
    }

    if (!(index % 2)) {
      tile.classList.add(i % 2 ? "black-tile" : "white-tile");
    } else {
      tile.classList.add(i % 2 ? "white-tile" : "black-tile");
    }

    tile.setAttribute("id", String(index + "-" + i));

    tile.addEventListener("click", () => {
      tileClicked(index, i);
    });

    row.appendChild(tile);
  }

  let end_header = document.createElement("th");
  end_header.textContent = index;
  row.appendChild(end_header);
}

function forwardMove(row, col, color)
{
  if (color === WHITE_PLAYER)
  {
    if (row < DIMENSIONS - 1 && chessBoard.getPiece(row + 1,  col) === null)
    {
      return String((row + 1) + "-" + col + ",");
    }
  }
  else
  {
    if (row > 0 && chessBoard.getPiece(row - 1, col) === null)
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

  while (col > 0)
  {
     if (chessBoard.getPiece(rook.row, col - 1) === null)
    {
      cords += String((rook.row) + "-"  +(col - 1) + ",");
    }
    else
    {
      break;
    }

    col--;
  }

  col = rook.col;
  while (col < DIMENSIONS - 1)
  {
    if (chessBoard.getPiece(rook.row, col + 1) === null)
    {
      cords += String((rook.row) + "-" + (col + 1) + ",");
    }
    else
    {
      break;
    }

    col++;
  }

  while (row < DIMENSIONS - 1)
  {
    if (chessBoard.getPiece(row + 1, rook.col) === null)
    {
      cords += String((row + 1) + "-" + (rook.col) + ",");
    }
    else
    {
      break;
    }
    row++;
  }

  row = rook.row;
  while (row > 0)
  {
    if (chessBoard.getPiece(row - 1, rook.col) === null)
    {
      cords += String((row - 1) + "-" + (rook.col) + ",");
    }
    else
    {
      break;
    }
    row--;
  }

  return checkCords(cords);
}

function bishopMoves(bishop)
{
  let cords = "";
  let col = bishop.col;
  let row = bishop.row;

  while (col > 0 && row > 0)
  {
    col--;
    row--;

    if (chessBoard.getPiece(row, col) === null)
    {
      cords += String(row + "-" + col + ",");
    }
    else
    {
      break;
    }
  }

  col = bishop.col;
  row = bishop.row;

  while (col < DIMENSIONS - 1 && row < DIMENSIONS - 1)
  {
    col++;
    row++;

    if (chessBoard.getPiece(row, col) === null)
    {
      cords += String(row + "-" + col + ",");
    }
    else
    {
      break;
    }
  }

  col = bishop.col;
  row = bishop.row;

  while (col < DIMENSIONS - 1 && row > 0)
  {
    col++;
    row--;

    if (chessBoard.getPiece(row, col) === null)
    {
      cords += String(row + "-" + col + ",");
    }
    else
    {
      break;
    }
  }

  col = bishop.col;
  row = bishop.row;

  while (col > 0 && row < DIMENSIONS - 1)
  {
    col--;
    row++;

    if (chessBoard.getPiece(row, col) === null)
    {
      cords += String(row + "-" + col + ",");
    }
    else
    {
      break;
    }
  }

  return checkCords(cords);
}

function knightBranch(anchorNum, brnachNum, isBranchCol)
{
  let cords = "";  
  if (brnachNum + 1 < DIMENSIONS)
  {
    if (isBranchCol && chessBoard.getPiece(anchorNum, brnachNum + 1) === null)
    {
      cords += String((anchorNum) + "-" + (brnachNum + 1) + ",");
    }
    else if (!isBranchCol && chessBoard.getPiece(brnachNum + 1, anchorNum) === null)
    {
      cords += String((brnachNum + 1) + "-" + (anchorNum) + ",");
    }
  }

  if (brnachNum - 1 >= 0)
  {
    if (isBranchCol && chessBoard.getPiece(anchorNum, brnachNum - 1) === null)
    {
      cords += String((anchorNum) + "-" + (brnachNum - 1) + ",");
    }
    else if (!isBranchCol && chessBoard.getPiece(brnachNum - 1, anchorNum) === null)
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
  if (col - 1 >= 0 && chessBoard.getPiece(row, col - 1) === null)
  {
      cords += String((row) + "-" + (col - 1) + ",");
  }
  if (col + 1 < DIMENSIONS && chessBoard.getPiece(row, col + 1) === null)
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
    if (chessBoard.getPiece(row + 1, col) === null)
    {
      cords += String((row + 1) + "-" + (col) + ",");
    }
    cords += kingRow(row + 1, col) 
  }

  if (row - 1 >= 0)
  {
    cords += kingRow(row - 1, col);

    if (chessBoard.getPiece(row - 1, col) === null)
    {
      cords += String((row - 1) + "-" + (col) + ",");
    }
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
  let selectedTile = document.getElementById(
    String(rowIndex + "-" + columnIndex)
  );

  resetMarkers();

  let previousTile = document.getElementsByClassName("selected")[0];

  if (previousTile) {
    previousTile.classList.remove("selected");
  }

  selectedTile.classList.add("selected");

  let piece = chessBoard.board[rowIndex * DIMENSIONS + columnIndex];
  
  if (piece)
  {
    let tileCords = availableMoves(piece);

    if (tileCords !== "-1")
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
