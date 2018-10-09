var myGamePiece;
var myObstacles = [];
var myScore;
var gameOver;

function startGame() {
    myObstacles = [];
    myGamePiece = new component(30, 10, "red", 10, 120);
    myGamePiece.gravity = 0.8;
    myScore = new component("20px", "Consolas", "white", 280, 30, "text");
    gameOver = new component("40px", "Consolas", "white", 100, 130, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        clearInterval(this.interval);
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap, interval, thickness, colourR, colourG, colourB;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            gameOver.text="GAME OVER";
            gameOver.update();
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    interval = 150;
    if (myGameArea.frameNo == 1 || everyinterval(interval)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 40;
        maxGap = 150;
        thickness = Math.floor((Math.random() * 48) +2);
        colourR = Math.floor((Math.random() * 255));
        colourG = Math.floor((Math.random() * 255));
        colourB = Math.floor((Math.random() * 255));
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(thickness, height, "rgba("+colourR+", "+colourG+", "+colourB+", 1)", x, 0));
        myObstacles.push(new component(thickness, x - height - gap, "rgba("+colourR+", "+colourG+", "+colourB+", 1)", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="DISTANCE: " + Math.floor(myGameArea.frameNo/10) + "m";
    myScore.update();
    myGamePiece.newPos();
    if ((myGameArea.frameNo / 200) % 1 == 0) {myGamePiece.width += 1;}
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}
