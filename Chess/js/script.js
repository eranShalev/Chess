const DIMENSIONS = 8;
const BLACK_PLAYER = "black";
const WHITE_PLAYER = "white";
const NO_LEGAL_MOVES = "-1";
let previousCords = [-1, -1];
let whiteTurn = true;

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
    let piece = chessBoard.getPiece(rowIndex, col);

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

  if (selectedTile.classList.contains("optional-move")) {
    let previousPiece = chessBoard.getPiece(previousCords[0], previousCords[1]);
    if ((previousPiece.color === WHITE_PLAYER && whiteTurn) || (previousPiece.color === BLACK_PLAYER && !whiteTurn)) {
      chessBoard.MovePiece(previousPiece, rowIndex, columnIndex);
      whiteTurn = !whiteTurn;
    }
    resetMarkers();
  }
  else {
    resetMarkers();
    selectedTile.classList.add("selected");
    let piece = chessBoard.getPiece(rowIndex, columnIndex);

    if (piece !== null) {
      let tileCords = piece.availableMoves(piece);

      if (tileCords !== NO_LEGAL_MOVES) {
        tileCords.pop();
        for (let cord of tileCords) {
          document.getElementById(cord).classList.add("optional-move");
        }
      }
    }
  }
  previousCords = [rowIndex, columnIndex];
}