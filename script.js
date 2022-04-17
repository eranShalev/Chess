window.onload = () => {

    let dimensions = 8;
    let main_container = document.createElement("div");

    main_container.className = "table-container";

    document.body.appendChild(main_container);

    let play_board = document.createElement("table");

    main_container.appendChild(play_board);

    generateHeaders(play_board, dimensions + 1);

    for (let i = dimensions; i > 0; i--)
    {
        let row = document.createElement("tr");
        play_board.appendChild(row);
        chessRow(row, i, dimensions);
    }

    generateHeaders(play_board, dimensions + 1);
}

function generateHeaders(board, max_range)
{
    for (let i=0; i < max_range; i++)
    {
        let header = document.createElement("th");
      
        header.textContent = String.fromCharCode(('a'.charCodeAt(0) + i - 1));
        if (i === 0)
        {
            header.textContent = "";
        }
        board.appendChild(header);
    }
}

function chessRow(row, index, dimensions)
{
    let row_header = document.createElement("th");
    row_header.textContent = index;
    row.appendChild(row_header);

    for (let i = 0; i < dimensions; i++)
    {
        let tile = document.createElement("td");
        if (!(index%2))
        {
            tile.className = i%2 ? "white-tile" : "black-tile";
        }
        else
        {
            tile.className = i%2 ? "black-tile" : "white-tile";

        }

        row.appendChild(tile);
    }
    
    let end_header = document.createElement("th");
    end_header.textContent = index;
    row.appendChild(end_header);
}

