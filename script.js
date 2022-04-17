window.onload = () => {
  const dimensions = 8;
  let main_container = document.createElement("div");

  main_container.className = "table-container";

  document.body.appendChild(main_container);
  let play_board = document.createElement("table");

  main_container.appendChild(play_board);

  generateHeaders(play_board, dimensions + 1);

  for (let i = dimensions; i > 0; i--) {
    let row = document.createElement("tr");
    play_board.appendChild(row);
    chessRow(row, i, dimensions);
  }

  generateHeaders(play_board, dimensions + 1);
};

function generateHeaders(board, max_range) {
  for (let i = 0; i < max_range; i++) {
    let header = document.createElement("th");

    header.textContent = String.fromCharCode("a".charCodeAt(0) + i - 1);
    if (i === 0) {
      header.textContent = "";
    }
    board.appendChild(header);
  }
}

function piecePlacer(rowIndex, columnIndex) {
  if (rowIndex === 8) {
    if (columnIndex === 0 || columnIndex === 7) {
      return "url('black_rook.svg.png')";
    } else if (columnIndex === 1 || columnIndex === 6) {
      return "url('black_knight.svg.png')";
    } else if (columnIndex === 2 || columnIndex === 5) {
      return "url('black_bishop.svg.png')";
    } else if (columnIndex === 3) {
      return "url('black_queen.svg.png')";
    } else {
      return "url('black_king.svg.png')";
    }
  } else if (rowIndex === 7) {
    return "url('black_pawn.svg.png')";
  } else if (rowIndex === 2) {
    return "url('white_pawn.svg.png')";
  } else if (rowIndex === 1) {
    if (columnIndex === 0 || columnIndex === 7) {
      return "url('white_rook.svg.png')";
    } else if (columnIndex === 1 || columnIndex === 6) {
      return "url('white_knight.svg.png')";
    } else if (columnIndex === 2 || columnIndex === 5) {
      return "url('white_bishop.svg.png')";
    } else if (columnIndex === 3) {
      return "url('white_queen.svg.png')";
    } else {
      return "url('white_king.svg.png')";
    }
  }

  return "no_image";
}

function chessRow(row, index, dimensions) {
  let row_header = document.createElement("th");
  row_header.textContent = index;
  row.appendChild(row_header);

  for (let i = 0; i < dimensions; i++) {
    let tile = document.createElement("td");
    let image = piecePlacer(index, i);
    console.log(image);

    if (image !== "no_image") {
      tile.style.backgroundImage = image;
      tile.style.backgroundRepeat = "no-repeat";
      tile.style.backgroundSize = "100% 100%";
    }

    if (!(index % 2)) {
      tile.className = i % 2 ? "black-tile" : "white-tile";
    } else {
      tile.className = i % 2 ? "white-tile" : "black-tile";
    }

    row.appendChild(tile);
  }

  let end_header = document.createElement("th");
  end_header.textContent = index;
  row.appendChild(end_header);
}

/*function tileClicked() {
  for (let i = 0; i < 8; i++) {
    console.log(document.)
  }
}*/
