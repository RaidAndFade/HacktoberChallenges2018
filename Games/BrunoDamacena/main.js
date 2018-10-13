var clicks = 0;

var winCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function process(pos) {
    clicks++;
    if(clicks == 9) tied();
    var type = (clicks % 2 === 0) ? "X" : "O";
    document.game.opt[pos].value = type;    
    check(type);
}

function check(type) {
    winCondition.forEach(function(value) {
        var count = 0;
        value.forEach(function(y) {
            if (document.game.opt[y] && document.game.opt[y].value === type) count++;
        });
        if (count == 3) {
            wins(value);
        }
    });
}

function wins(x) {    
    x.forEach(function(i) {
        document.game.opt[i].className = 'gameBtn wins';
    });
    $('.gameBtn').attr('disabled', true);
}

function tied() {
    $('.gameBtn').attr('disabled', true);
}

function reboot() {
    $('.gameBtn').attr('disabled', false);
    for (x = 0; x <= 8; x++) {
        document.game.opt[x].value = '';
        document.game.opt[x].className = 'gameBtn';
    }
    clicks = 0;
}