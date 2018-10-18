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

function create_list(){
    const n1 = 9;
    const n2 = 9;
    let pool = [...Array(n1).keys()];
    var array = [];
    while (array.length < n2) {
    let index = Math.floor(Math.random() * pool.length);
    array = array.concat(pool.splice(index, 1));       
    }
    return array;
}

function computer(){
    index = array[1];
    remove_item(index);
    var type = (Math.floor(Math.random()*(100-0)) % 2 === 0) ? "X" : "O";
    document.game.opt[index].value = type;
    check(type, "Computer");
}

function remove_item(item){
    var index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function process(pos, event) {
    if (clicks == 0){
        array = create_list();
    }
    clicks++;
    if(clicks == 9) tied();
    if (event.button == 0) {
        document.game.opt[pos].value = "X";
    }
    if (event.button == 2) {
        document.game.opt[pos].value = "O";
    }
    remove_item(pos);
    check(document.game.opt[pos].value, "User");
    clicks++;
    computer();
    }


function check(type, player) {
    winCondition.forEach(function(value) {
        var count = 0;
        value.forEach(function(y) {
            if (document.game.opt[y] && document.game.opt[y].value === type) count++;
        });
        if (count == 3) {
            document.getElementById("result").innerHTML = "Winner: " + player;
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
        document.getElementById("result").innerHTML = '';
    }
    clicks = 0;
}