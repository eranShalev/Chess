const DIMENSIONS = 8;
const BLACK_PLAYER = "black";
const WHITE_PLAYER = "white";
let chess_board;

class Piece {
  constructor(row, col, color, type) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.type = type;
  }
}


window.onload = () => {
  let main_container = document.createElement("div");
  main_container.className = "table-container";

  document.body.appendChild(main_container);
  let play_board = document.createElement("table");

  main_container.appendChild(play_board);
  initializeBoard();

  generateHeaders(play_board);

  for (let i = DIMENSIONS - 1; i >= 0; i--) {
    let row = document.createElement("tr");
    play_board.appendChild(row);
    chessRow(row, i);
  }

  generateHeaders(play_board);

};

function initializeBoard() {
  const values = ["rook", "knight", "bishop", "queen", "king", "bishop","knight", "rook"];

  chess_board = Array(DIMENSIONS * DIMENSIONS).fill(null);

  for (let colIndex = 0; colIndex < DIMENSIONS; colIndex++)
   {
    chess_board[colIndex + DIMENSIONS] = new Piece(1, colIndex, WHITE_PLAYER, "pawn");

    chess_board[colIndex + (DIMENSIONS - 2) * DIMENSIONS] = new Piece(DIMENSIONS - 2, colIndex, BLACK_PLAYER, "pawn");

    chess_board[colIndex] = new Piece(0, colIndex, WHITE_PLAYER, values[colIndex]);

    chess_board[colIndex + DIMENSIONS * (DIMENSIONS - 1)] = new Piece(DIMENSIONS - 1, colIndex, BLACK_PLAYER, values[colIndex]);
  }
}

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
    let piece =chess_board[index * DIMENSIONS + i];
    
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

function pawnMoves(pawn)
{
  if (pawn.color === WHITE_PLAYER)
  {
    if (pawn.row < DIMENSIONS - 1 && chess_board[(pawn.row + 1) * DIMENSIONS + pawn.col] === null)
    {
      return String((pawn.row + 1) + "-" + pawn.col + ",");
    }
  }
  else
  {
    if (pawn.row > 0 && chess_board[(pawn.row - 1) * DIMENSIONS + pawn.col] === null)
    {
      return String ((pawn.row - 1) + "-" + pawn.col + ",");
    }
  }

  return "-1";
}

function rookMoves(rook)
{
  let cords = "";
  let col = rook.col;
  let row = rook.row;

  while (col > 0)
  {
    // if (chessRow[rook.row * DIMENSIONS + col - 1] === null)
    // {
      cords += String((rook.row) + "-"  +(col - 1) + ",");
    // }
    // else
    // {
    //   break;
    // }

    col--;
  }

  col = rook.col;
  while (col < DIMENSIONS - 1)
  {
    // if (chessRow[rook.row * DIMENSIONS + col + 1] === null)
    // {
      cords += String((rook.row) + "-" + (col + 1) + ",");
    // }
    // else
    // {
    //   break;
    // }

    col++;
  }

  while (row < DIMENSIONS - 1)
  {
    cords += String((row + 1) + "-" + (rook.col) + ",");
    row++;
  }

  row = rook.row;
  while (row > 0)
  {
    cords += String((row - 1) + "-" + (rook.col) + ",");
    row--;
  }

  if (cords === "")
  {
    cords = "-1";
  }
  return cords;
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

  if (cords === "")
  {
    cords = "-1";
  }

  return cords;
}

// function generateKnightCords(num1, num2, isOneCol)
// {
//   if (num1 + 2 < DIMENSIONS)
//   {

//   }
// }

function knightMoveHorizontal(row, col)
{
  
}

function knightMoves(knight)
{
  let cords = "";
  let row = knight.row;
  let col = knight.col;

  if (col + 2 < DIMENSIONS)
  {
    if (row + 1 < DIMENSIONS)
    {
      cords += String((row + 1) + "-" + (col + 2) + ",");
    }

    if (row - 1 >= 0)
    {
      cords += String((row - 1) + "-" + (col + 2) + ",");
    }
  }

  if (row + 2 < DIMENSIONS)
  {
    if (col + 1 < DIMENSIONS)
    {
      cords += String((row + 2) + "-" + (col + 1) + ",");
    }

    if (col - 1 >= 0)
    {
      cords += String((row + 2) + "-" + (col - 1) + ",");
    }
  }

  if (col - 2 >= 0)
  {
    if (row + 1 < DIMENSIONS)
    {
      cords += String((row + 1) + "-" + (col - 2) + ",");
    }

    if (row - 1 >= 0)
    {
      cords += String((row - 1) + "-" + (col - 2) + ",");
    }
  }

  if (row - 2 >= 0)
  {
    if (col + 1 < DIMENSIONS)
    {
      cords += String((row - 2) + "-" + (col + 1) + ",");
    }

    if (col - 1 >= 0)
    {
      cords += String((row - 2) + "-" + (col - 1) + ",");
    }
  }


  if (cords === "")
  {
    cords = "-1";
  }

  return cords;
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

  return cords;
}

function kingMoves(king)
{
  let cords = "";
  let row = king.row;
  let col = king.col;

  cords += kingRow(row, col);

  if (row + 1 < DIMENSIONS)
  {
    cords += kingRow(row + 1, col)
    cords += String((row + 1) + "-" + (col) + ",");
  }

  if (row - 1 >= 0)
  {
    cords += kingRow(row - 1, col);
    cords += String((row - 1) + "-" + (col) + ",");
  }

  if (cords === "")
  {
    cords = "-1";
  }

  return cords;
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

  let piece = chess_board[rowIndex * DIMENSIONS + columnIndex];
  
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
