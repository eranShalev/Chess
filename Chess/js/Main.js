const DIMENSIONS = 8;
const BLACK_PLAYER = "black";
const WHITE_PLAYER = "white";
let previousPiece = null;
let whiteTurn = true;
let winner = undefined;
const CHESS_TABLE_ID = "chess-table-id";

let chessBoard = new BoardData(); //this object contains the logic of the board and all the pieces

window.onload = () => {
  let play_table = document.createElement("table");
  play_table.id = CHESS_TABLE_ID;

  document.body.appendChild(play_table);
  generateHeaders(play_table); //The headers are used for user - experience coordinates

  for (let i = DIMENSIONS - 1; i >= 0; i--) {
    const row = play_table.insertRow();
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
  addHeader(row, rowIndex + 1);
  for (let col = 0; col < DIMENSIONS; col++) {
    const tile = row.insertCell();
    let piece = chessBoard.getPiece(rowIndex, col);

    if (piece) // If a chess piece exists we need an image for it
    {
      let image = document.createElement("img");
      image.src = getImageSrc(piece.type, piece.color);
      image.draggable = false;
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
  }
  addHeader(row, rowIndex);
}

// Clears the CSS from the board
function resetMarkers() {
  for (let tile of document.getElementsByTagName("td")) {
    tile.classList.remove("optional-move");
    tile.classList.remove("selected");
  }
}

function tileClicked(rowIndex, columnIndex) {
  if (winner === undefined) {
    let selectedTile = document.getElementById(String(rowIndex + "-" + columnIndex));

    //checks if the tile was clicked for piece movement
    if (selectedTile.classList.contains("optional-move")) {
      if ((previousPiece.color === WHITE_PLAYER && whiteTurn) || (previousPiece.color === BLACK_PLAYER && !whiteTurn)) {
        let removedPiece = chessBoard.MovePiece(previousPiece, rowIndex, columnIndex);
        if (removedPiece !== null && removedPiece.type === "king") {
          winnerDecided();
        }
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
          for (let cord of tileCords) {
            document.getElementById(cord).classList.add("optional-move");
          }
        }
      }
      previousPiece = piece;
    }
  }
}

function winnerDecided() {
  let winnerPopup = document.createElement("div");

  winner = whiteTurn ? WHITE_PLAYER : BLACK_PLAYER;
  winnerPopup.innerText = winner + " player won!";
  winnerPopup.className = "winner-popup";
  document.getElementById(CHESS_TABLE_ID).appendChild(winnerPopup);
}