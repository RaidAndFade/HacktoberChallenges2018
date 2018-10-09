const buttons = [[document.getElementById('tab-11'), document.getElementById('tab-12'), document.getElementById('tab-13')],
    [document.getElementById('tab-21'), document.getElementById('tab-22'), document.getElementById('tab-23')],
    [document.getElementById('tab-31'), document.getElementById('tab-32'), document.getElementById('tab-33')]];

const tab = document.getElementById('tabpad');
const title = document.getElementById('title');
const status = document.getElementById('status');

function updateStatus(est) {
    status.innerText = est;
}

(function () {
    'use-strict';
    var playerTurn = 'X';
    var board = [[-1, -2, -3],
                   [-3, -4, -5],
                   [-6, -7, -8]];
    var finished = false;
    tab.addEventListener('click', click, false);

    updateStatus('Your turn');

    function click(e) {
        if (e.target.id.startsWith('tab-')) {
            var clicked = e.target.id;
            var row = clicked[4] - 1;
            var col = clicked[5] - 1;

            buttonClicked(row, col);
        }
    }

    function  buttonClicked(row, col) {
        if (finished) {
            updateStatus('The game has finished or the board is full');
            return;
        }

        if (playerTurn === 'O') {
            updateStatus('Its not your turn yet');
            return;
        }

        if (!board[row][col].toString().startsWith('-')) {
            updateStatus('That position is already taken, try another one');
            return;
        }

        setBox(row, col);
        moveOpponent();
    }

    function moveOpponent() {
        if (finished)
            return;

        setTimeout(() => {
            for (var p = 0; p < board.length; p++) {
                var temp = checkRow(p);
                if (temp !== -1) {
                    setBox(p, temp);
                    return;
                }
                temp = checkColumn(p);
                if (temp !== -1) {
                    setBox(temp, p);
                    return;
                }
            }
            var temp = checkDiagonal1();
            if (temp !== -1) {
                setBox(temp, temp);
                return;
            }
            temp = checkDiagonal2();
            if (temp !== -1) {
                setBox(temp, board.length - 1 - temp);
                return;
            }

            for (var i = 0; i < board.length; i++) {
                for (var e = 0; e < board.length; e++) {
                    if (board[i][e] < 0) {
                        setBox(i, e);
                        return;
                    }
                }
            }
            updateStatus('The game has finished or the board is full');
        }, 1000);
    }

    function checkRow(row) {
        if (board[row][0] === board[row][1] && board[row][2] < 0) {
            return 2;
        } else if (board[row][0] === board[row][2] && board[row][1] < 0) {
            return 1;
        } else if (board[row][1] === board[row][2] && board[row][2] < 0) {
            return 0;
        }
        return -1;
    }

    function checkColumn(column) {
        if (board[0][column] === board[1][column] && board[2][column] < 0) {
            return 2;
        } else if (board[0][column] === board[2][column] && board[1][column] < 0) {
            return 1;
        } else if (board[1][column] === board[2][column] && board[0][column] < 0) {
            return 0;
        }
        return -1;
    }

    function checkDiagonal1() {
        if (board[0][0] === board[1][1] && board[2][2] < 0) {
            return 2;
        } else if (board[0][0] === board[2][2] && board[1][1] < 0) {
            return 1;
        } else if (board[1][1] === board[2][2] && board[0][0] < 0) {
            return 0;
        }
        return -1;
    }

    function checkDiagonal2() {
        if (board[0][2] === board[1][1] && board[2][0] < 0) {
            return 2;
        } else if (board[0][2] === board[2][0] && board[1][1] < 0) {
            return 1;
        } else if (board[1][1] === board[2][0] && board[0][2] < 0) {
            return 0;
        }
        return -1;
    }

    function checkWinner() {
        for (var i = 0; i < board.length; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i])
                return board[0][i];
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2])
                return board[i][0];
        }
        if ((board[0][0] === board[1][1] && board[1][1] === board[2][2])
            || (board[0][2] === board[1][1] && board[1][1] === board[2][0]))
            return board[1][1];
        return null;
    }

    function setBox(fil, col) {
        board[fil][col] = playerTurn;
        buttons[fil][col].innerText = playerTurn;

        var winner = checkWinner();
        if (winner != null) {
            finished = true;
            updateStatus('The game winner is the ' + winner + ' player!');
            return;
        }
        playerTurn = (playerTurn === 'X' ? 'O' : 'X');
        updateStatus('Player ' + playerTurn + 's turn');
    }
})();

