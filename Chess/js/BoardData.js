//the chess board is represented by a 1 dimensional array of 64 cells, null cells are empty tiles and cells with pieces are tiles with chess pieces

const NO_LEGAL_MOVES = "-1";
class BoardData {
    constructor() {
      this.board = this.boardReset();
    }
  
    // Makes a starting chess board
    boardReset() {
      const values = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
  
      let board = Array(DIMENSIONS * DIMENSIONS).fill(null);
  
      for (let colIndex = 0; colIndex < DIMENSIONS; colIndex++) {
        board[colIndex + DIMENSIONS] = new Piece(1, colIndex, WHITE_PLAYER, "pawn");
  
        board[colIndex + (DIMENSIONS - 2) * DIMENSIONS] = new Piece(DIMENSIONS - 2, colIndex, BLACK_PLAYER, "pawn");
  
        board[colIndex] = new Piece(0, colIndex, WHITE_PLAYER, values[colIndex]);
  
        board[colIndex + DIMENSIONS * (DIMENSIONS - 1)] = new Piece(DIMENSIONS - 1, colIndex, BLACK_PLAYER, values[colIndex]);
      }
      return board;
    }
    
    // Returns a piece in the table array in the appropriate coordinations
    getPiece(row, col) {
      if (row >= 0 && row <= DIMENSIONS - 1 && col >= 0 && col <= DIMENSIONS - 1) {
        return this.board[row * DIMENSIONS + col];
      }
      else {
        return null;
      }
    }
  
    // Moves the piece to the new location and updates the array, then returns the captured piece
    MovePiece(piece, newRow, newCol) {
      let image = document.getElementById(String(piece.row + "-" + piece.col)).getElementsByTagName("img")[0];
      let newTile = document.getElementById(String(newRow + "-" + newCol));
      let removedPiece = this.getPiece(newRow, newCol);
      if (removedPiece !== null) {
        newTile.removeChild(newTile.getElementsByTagName("img")[0]);
      }
      newTile.appendChild(image); // No need to remove the image from the old tile because appendChild works by reference
      this.board[newRow * DIMENSIONS + newCol] = new Piece(newRow, newCol, piece.color, piece.type);
      this.board[piece.row * DIMENSIONS + piece.col] = null;
      return removedPiece;
    }
  
    emptyTile(row, col) {
      return this.getPiece(row, col) === null;
    }
  
    isEnemy(row, col, color) {
      let enemy = this.getPiece(row, col);
      return (enemy !== null && enemy.color !== color);
    }
  
    isTeam(row, col, color) {
      let piece = this.getPiece(row, col);
      return (piece !== null && piece.color === color);
    }
  }