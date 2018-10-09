/* Constants */

const CANVAS_BORDER_COLOR = 'black';
const CANVAS_BACKGROUND_COLOR = 'white';
const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;


/*  Main Game Global Variables */

let context;
let canvas;
let foodPositionX;
let foodPositionY;
let score = 0;
let scoreElement = document.querySelector('#score');
scoreElement.innerHTML = score.toString();
let changingDirection = false;
let hasGameStarted = false;
let gameMode = "";

let snake = [
	{x: 150, y: 150},
	{x: 140, y: 150},
	{x: 130, y: 150},
	{x: 120, y: 150},
	{x: 110, y: 150}
];

let dx = 10;
let dy = 0;

function init() {
	canvas = document.querySelector('#game');
	canvas.style.visibility = "visible";
	context = canvas.getContext('2d');

	context.fillStyle = CANVAS_BACKGROUND_COLOR;
	context.strokeStyle = CANVAS_BORDER_COLOR;

	context.fillRect(0, 0, canvas.width, canvas.height);
	context.strokeRect(0, 0, canvas.width, canvas.height);

	scoreElement.innerHTML = score.toString();
	drawWholeSnake();
}

function drawWholeSnake() {
	snake.forEach(drawSnake);
}

function drawSnake(snakeChain) {
	context.fillStyle = 'lightgreen';
	context.strokeStyle = 'darkgreen';

	context.fillRect(snakeChain.x, snakeChain.y, 10, 10);
	context.strokeRect(snakeChain.x, snakeChain.y, 10, 10);
}

function advanceSnake() {
	
	const snakeHead = {x: snake[0].x + dx, y: snake[0].y + dy};

	if (gameMode === 'adventure') {
		if (snakeHead.x >= canvas.width) {
			snakeHead.x = 0;
		} else if (snakeHead.x <= 0) {
			snakeHead.x = canvas.width;
		}
		
		if (snakeHead.y >= canvas.height) {
			snakeHead.y = 0;
		} else if (snakeHead.y <= 0) {
			snakeHead.y = canvas.height;
		}
	}

	snake.unshift(snakeHead);

	if (didSnakeEatFood(snakeHead)) {
		score += 5;
		scoreElement.innerHTML = score.toString();
		generateFood();
	} else {
		snake.pop();
	}
}

function resetSnake() {
	snake = [
		{x: 150, y: 150},
		{x: 140, y: 150},
		{x: 130, y: 150},
		{x: 120, y: 150},
		{x: 110, y: 150}
	];

	dx = 10;
	dy = 0;
	score = 0;
	scoreElement.innerHTML = score.toString();
	changingDirection = false;
	generateFood();
}

function clearCanvas() {
	context.fillStyle = CANVAS_BACKGROUND_COLOR;
	context.strokeStyle = CANVAS_BORDER_COLOR;

	context.fillRect(0, 0, canvas.width, canvas.height);
	context.strokeRect(0, 0, canvas.width, canvas.height);
}

function didSnakeHitSelf() {
	let snakeHead = snake[0];
	for(let i = 1; i < snake.length; i++) {
		if (snake[i].x === snakeHead.x && snake[i].y === snakeHead.y) {
			return true;
		}
	}

	return false;
}

function didSnakeHitWall() {
	if (snake[0].x >= canvas.width || 
		snake[0].x <= 0 ||
		snake[0].y + 5 >= canvas.height ||
		snake[0].y - 5 <= 0) {
			return true;
	} 

	return false;
}

function directionalKeyPressed(event) {

	if (changingDirection) {
		return;
	}

	changingDirection = true;

	switch(event.keyCode) {
		case LEFT_KEY: 
		{
			if (dx !== 10) {
				dx = -10;
				dy = 0;
			}
			break;
		}
		case RIGHT_KEY: 
		{
			if (dx !== -10) {
				dx = 10;
				dy = 0;
			}
			break;
		}
		case UP_KEY: 
			if (dy !== 10) {
				dx = 0;
				dy = -10;
			}
			break;
		case DOWN_KEY:
		{
			if (dy !== -10) {
				dx = 0;
				dy = 10;
			}
			break;
		}
	}
}

/* Food Related */

function generateFood() {
	foodPositionX = Math.round(Math.random() * (canvas.width - 10) / 10) * 10;
	foodPositionY = Math.round(Math.random() * (canvas.height - 10) / 10) * 10;

	snake.forEach(function wasFoodGeneratedInSnakePosition(snakeChain) {
		if (snakeChain.x === foodPositionX && snakeChain.y === foodPositionY) {
			generateFood();
		}
	});
}

function drawFood(x, y) {
	context.fillStyle = 'red';
 	context.strokestyle = 'darkred';
 	context.fillRect(x, y, 10, 10);
 	context.strokeRect(x, y, 10, 10);
}

function didSnakeEatFood(snakeHead) {
	return snakeHead.x == foodPositionX && snakeHead.y === foodPositionY;
}

function mainSnakeMovement() {
	setTimeout(function onTick() {
		changingDirection = false;
		if (didSnakeHitSelf()) {
			resetSnake();
		} else if (gameMode !== 'adventure' && didSnakeHitWall()) {
			resetSnake();
		} 

		clearCanvas();
		drawFood(foodPositionX, foodPositionY);
		advanceSnake();
		drawWholeSnake();

		mainSnakeMovement();
	}, 100);
}

/* Main Flow */

function startGame(mode) {
	gameMode = mode;
	if (hasGameStarted) {
		resetSnake();
		return;
	}

	hasGameStarted = true;
	init();
	mainSnakeMovement();
	document.addEventListener('keydown', directionalKeyPressed);
	generateFood();
}



