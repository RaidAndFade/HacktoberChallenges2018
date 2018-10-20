// Global variables
let WINDOW_WIDTH = 640;
let WINDOW_HEIGHT = 480;

let PADDLE_WIDTH = 150;
let PADDLE_HEIGHT = 20;
let paddle_x = WINDOW_WIDTH / 2;
let PADDLE_Y = WINDOW_HEIGHT - (PADDLE_HEIGHT + 15);
let PADDLE_SPEED = 300;

let BALL_WIDTH = 10;
let BALL_HEIGHT = 10;
let ball_x = WINDOW_WIDTH / 2;
let ball_y = WINDOW_HEIGHT / 2;
let ball_speed = 250;
let ball_speed_increment = 25;

let score = 0;
let SCORE_COUNT_X = 50;
let SCORE_COUNT_Y = 50;


// Setup a blank game canvas
Crafty.init(WINDOW_WIDTH, WINDOW_HEIGHT, document.getElementById("game"));


// Set the canvas background
Crafty.background("#000000");


// RNG function (based on https://stackoverflow.com/questions/13455042/)
function randNum() {
    var num = Math.random();
    return num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
}


// Score count
let scoreCount = Crafty.e("2D, DOM, Text")
    .attr({
        x: SCORE_COUNT_X,
        y: SCORE_COUNT_Y
    })
    .textFont({
        size: '25px',
        weight: 'bold'
    })
    .textColor('white')
    .text(score);


// Setup the paddle
let paddle = Crafty.e("paddle, 2D, DOM, Collision, Color, Multiway")
    .attr({
        x: paddle_x,
        y: PADDLE_Y,
        w: PADDLE_WIDTH,
        h: PADDLE_HEIGHT
    })
    .color("#FFFF00")
    .multiway(PADDLE_SPEED, {
        A: 180,
        D: 0
    });


// Setup the ball
let ball = Crafty.e("2D, DOM, Collision, Color")
    .attr({
        x: ball_x,
        y: ball_y,
        w: BALL_WIDTH,
        h: BALL_HEIGHT
    })
    .color("white");
    
let ball_dx = randNum();
let ball_dy = randNum();
let ball_speed_initial = ball_speed;

ball.bind("UpdateFrame", function(eventData) {
    if (this.x >= WINDOW_WIDTH || this.x <= 0) {
        ball_dx *= -1;
    }

    if (this.y <= 0) {
        ball_dy *= -1;
    }

    if (this.y >= WINDOW_HEIGHT) {
        this.x = ball_x;
        this.y = ball_y;
        ball_speed = ball_speed_initial;

        paddle.x = paddle_x;
        paddle.y = PADDLE_Y;

        ball_dx = randNum();
        ball_dy = randNum();

        score = 0;
        scoreCount.text(score);
    }

    this.x += (ball_speed * ball_dx) * (eventData.dt / 1000);
    this.y += (ball_speed * ball_dy) * (eventData.dt / 1000);
});

ball.onHit("paddle", function(hitData) {
    ball_dy *= -1;
    ball_speed += ball_speed_increment;
    score++;
    scoreCount.text(score);
});
