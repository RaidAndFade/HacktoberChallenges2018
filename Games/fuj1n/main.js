var States = Object.freeze({ GAME: 0, LOSE: 1 });
var D2D = Object.freeze({ NONE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4 });

Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

function Player(x, y) {
    this.createHead = function () {
        let hx = x;
        let hy = y;

        if (this.head.length > 0) {
            hx = this.head[this.head.length - 1].x;
            hy = this.head[this.head.length - 1].y;
        }

        this.head.push(new Head(hx, hy));
    }

    this.head = [];

    this.dir = D2D.NONE;
    this.dirBuffer = [];

    for (var i = 0; i < 5; i++)
        this.createHead();
}

function Head(x, y) {
    this.x = x;
    this.y = y;
    this.exited = false;

    this.hasIntersection = function () {
        for (head in game.player.head) {
            head = game.player.head[head];
            if (head === this)
                continue;

            if (head.x == this.x && head.y == this.y)
                return this.exited;
        }

        this.exited = true;
        return false;
    }
}

function Dot(x, y) {
    this.x = x;
    this.y = y;
    this.enabled = true;
    this.isInsidePlayer = function () {
        for (head in game.player.head) {
            head = game.player.head[head];
            if (head.x == this.x && head.y == this.y)
                return true;
        }
        return false;
    };
}

var game = {};

(function () {
    setupGame();

    var tickDraw = function () {
        draw(game.graphics);
        updateDisplay();

        requestAnimationFrame(tickDraw);
    };

    var tickUpdate = function () {
        if (game.state == States.GAME)
            update();

        setTimeout(tickUpdate, game.speed);
    }

    tickUpdate();
    requestAnimationFrame(tickDraw);
})();

function setupGame() {
    $(document).keydown(function (data) {
        // console.log(data.keyCode);
        switch (data.keyCode) {
            case 38: // UpArrow
            case 87: // W
                setDirection(D2D.UP);
                break;
            case 40: // DownArrow
            case 83: // S
                setDirection(D2D.DOWN);
                break;
            case 37: // LeftArrow
            case 65: // A
                setDirection(D2D.LEFT);
                break;
            case 39: // RightArrow
            case 68: //D
                setDirection(D2D.RIGHT);
                break;
            case 32: // SpaceBar
                resetGame();
                break;
        }
    });

    game.minSpeed = 500;
    game.speedOffsetHC = 20;

    game.canvas = gameCanvas;
    game.canvas.width = 960;
    game.canvas.height = 720;

    game.gridSize = 24;

    game.graphics = game.canvas.getContext("2d");
    game.width = game.canvas.width / game.gridSize;
    game.height = game.canvas.height / game.gridSize;

    game.graphics.scale(game.gridSize, game.gridSize);

    game.scoreDisplay = $("#score");
    game.speedDisplay = $("#gameSpeed");
    game.speedOffsetDisplay = $("#speedOffset");
    game.speedMultDisplay = $("#speedMult");

    game.speedIncrease = parseInt(speedSlider.value);

    speedSlider.oninput = function () {
        game.speedIncrease = parseInt(this.value);
    };

    game.speedOffset = parseInt(offsetSlider.value);

    offsetSlider.oninput = function () {
        game.speedOffset = parseInt(this.value);
    };

    resetGame();
}
//TODO fix turning too often
function resetGame() {
    game.speed = game.minSpeed;

    game.player = new Player(Math.round(game.width / 2), Math.round(game.height / 2));

    game.state = States.GAME;

    game.score = 0;

    game.dot = {};
    spawnDot();
}

// Called every animation frame
function draw(g) {
    g.clearRect(0, 0, game.width, game.height);

    g.fillStyle = 'rgb(0, 255, 0)';

    game.player.head.forEach(function (head) {
        g.fillRect(head.x, head.y, 1, 1);
    });

    if (game.dot.enabled) {
        g.fillStyle = 'rgb(255, 0, 0)';
        g.fillRect(game.dot.x + .25, game.dot.y + .25, .5, .5);
    }

    if (game.state == States.LOSE) {
        g.fillStyle = 'rgba(60, 0, 0, 0.6)';
        g.fillRect(0, 0, game.width, game.height);

        g.fillStyle = 'white';

        let title = "Game Over";
        let subtitle = "Press 'space' to try again";

        g.font = '5px sans-serif';
        g.fillText(title, game.width / 2 - g.measureText(title).width / 2, game.height / 2 - 2);
        g.font = '2px sans-serif';
        g.fillText(subtitle, game.width / 2 - g.measureText(subtitle).width / 2, game.height / 2 + 2);
    } else if (game.player.dir == D2D.NONE) {
        g.fillStyle = 'rgba(0, 0, 0, 0.6)'
        g.fillRect(0, 0, game.width, game.height);

        g.fillStyle = 'white';
        g.font = '2px sans-serif';
        let text = "Use WSAD or arrow keys to move";
        g.fillText(text, game.width / 2 - g.measureText(text).width / 2, game.height / 2);

        g.font = '1px sans-serif';
        text = "Collect red dots to earn points";
        g.fillText(text, game.width / 2 - g.measureText(text).width / 2, game.height / 2 + 2);
    }
}

// Called once per draw frame
function updateDisplay() {
    game.scoreDisplay.text(game.score);
    game.speedDisplay.text((game.minSpeed - (game.speed - game.speedOffsetHC)).clamp(0, game.minSpeed) + " / " + game.minSpeed);
    game.speedMultDisplay.text(game.speedIncrease);
    game.speedOffsetDisplay.text(game.speedOffset);
}

// Called once per update frame, which is equal to game speed
// Called only when in GAME state
function update() {
    game.speed = game.minSpeed - game.score * game.speedIncrease - game.speedOffset + game.speedOffsetHC;
    game.speed = Math.round(game.speed.clamp(game.speedOffsetHC, game.minSpeed + game.speedOffsetHC));

    if (game.player.dirBuffer.length != 0) {
        game.player.dir = game.player.dirBuffer.shift();
    }

    if (game.player.dir == D2D.NONE)
        return;

    oldX = game.player.head[0].x;
    oldY = game.player.head[0].y;

    switch (game.player.dir) {
        case D2D.UP:
            game.player.head[0].y = oldY - 1;
            break;
        case D2D.DOWN:
            game.player.head[0].y = oldY + 1;
            break;
        case D2D.LEFT:
            game.player.head[0].x = oldX - 1;
            break;
        case D2D.RIGHT:
            game.player.head[0].x = oldX + 1;
            break;
    }

    if (game.player.head[0].x < 0)
        game.player.head[0].x = game.width - 1;
    else if (game.player.head[0].x >= game.width)
        game.player.head[0].x = 0;
    else if (game.player.head[0].y < 0)
        game.player.head[0].y = game.height - 1;
    else if (game.player.head[0].y >= game.height)
        game.player.head[0].y = 0;

    for (var i = 1; i < game.player.head.length; i++) {
        let ooX = game.player.head[i].x;
        let ooY = game.player.head[i].y;

        game.player.head[i].x = oldX;
        game.player.head[i].y = oldY;

        oldX = ooX;
        oldY = ooY;
    }

    for (var head in game.player.head) {
        head = game.player.head[head];

        if (head.hasIntersection()) {
            game.state = States.LOSE;
            return;
        }
    }

    if (game.dot.isInsidePlayer()) {
        game.score++;
        game.player.createHead();
        spawnDot();
    }
}

function spawnDot() {
    game.dot = new Dot(Math.floor((Math.random() * game.width)), Math.floor((Math.random() * game.height)));

    if (game.dot.isInsidePlayer()) {
        game.dot.enabled = false;
        requestAnimationFrame(spawnDot);
    }
}

function setDirection(direction) {
    if (game.state != States.GAME || direction == game.player.dir)
        return;

    var currentDir = game.player.dir;
    if (game.player.dirBuffer.length != 0) {
        currentDir = game.player.dirBuffer[game.player.dirBuffer.length - 1];
    }

    if (game.player.dir != D2D.NONE)
        switch (direction) {
            case D2D.UP:
                if (currentDir == D2D.DOWN)
                    return;
                break;
            case D2D.DOWN:
                if (currentDir == D2D.UP)
                    return;
                break;
            case D2D.LEFT:
                if (currentDir == D2D.RIGHT)
                    return;
                break;
            case D2D.RIGHT:
                if (currentDir == D2D.LEFT)
                    return;
                break;
        }

    if (game.player.dirBuffer.length <= 3)
        game.player.dirBuffer.push(direction);
}