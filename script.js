window.onload = () => {

    let main_container = document.createElement("div");

    main_container.className = "table-container";

    document.body.appendChild(main_container);

    let play_board = document.createElement("table");

    main_container.appendChild(play_board);

    for (let i = 8; i > 0; i--)
    {
        let row = document.createElement("tr");
        play_board.appendChild(row);
        chessRow(row, i);
    }

    let empty_header = document.createElement("th");
    play_board.appendChild(empty_header);

    for (let i = 0; i < 8; i++)
    {
        let row_header = document.createElement("th");
        row_header.textContent = String.fromCharCode(('a'.charCodeAt(0) + i));
        play_board.appendChild(row_header);
    }

}

function chessRow(row, index)
{
    let row_header = document.createElement("th");
    row_header.textContent = index;
    row.appendChild(row_header);

    for (let i = 0; i < 8; i++)
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
}


