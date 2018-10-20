var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var aster_width = 50;
var aster_height = 50;
var ship_width = 35;
var ship_height = 48;

var by = 0;
var bx = 0;
var gravity = 1;

var score = 0;


document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
        // left arrow
        moveLeft();
    }
    else if (e.keyCode == '39') {
        // right arrow
        moveRight();
    }
}

function moveLeft() {
    if(ship.x != 0) {
        ship.x -= 10;
    } 
}
function moveRight() {
    if(ship.x+ship_width < canvas.width) {
        ship.x += 10;
    }
}

var asteroid = [];
var num_ast = 1;
for (var i = 0; i < 7; i++) {
    asteroid[i] = {
        x: Math.floor((Math.random() * (canvas.width - aster_width))),
        y: 70*-i
    }

}

var ship = {
    x: 100,
    y: canvas.height - 80
}

function draw() {
    //background
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // make the ship
    ctx.fillStyle = "black";
    ctx.fillRect(ship.x, ship.y, ship_width, ship_height);

    for(var i = 0; i < asteroid.length; i++) {
        ctx.fillStyle = "green";
        asteroid[i].y = asteroid[i].y + gravity
        ctx.fillRect(asteroid[i].x, asteroid[i].y, aster_width, aster_height);

        // check if asteroid is off screen
        if(asteroid[i].y == canvas.height) {
            asteroid[i].x = Math.floor((Math.random()*canvas.width)-aster_width),
            asteroid[i].y = 0;
            score++;
        }
        
        // bottom left corner
        if(asteroid[i].x <= ship.x+ship_width && asteroid[i].x >= ship.x && asteroid[i].y+aster_height >= ship.y && ship.y+ship_height >= asteroid[i].y) {
            location.reload();  // reload the page
        }
        //bottom right corner
        if (asteroid[i].x + aster_width <= ship.x + ship_width && asteroid[i].x + aster_width >= ship.x && asteroid[i].y + aster_height >= ship.y && ship.y + ship_height >= asteroid[i].y) {
            location.reload();  // reload the page
        }
        
    }
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdania";
    ctx.fillText("Score: " + score, 10, 20);
    
    by += gravity;

    requestAnimationFrame(draw);
}

draw();