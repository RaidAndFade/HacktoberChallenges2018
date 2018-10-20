var myCanvas = document.querySelector("#myCanvas")
var config = {
	deep:{
		x:200,
		y:260,
		width:0,
		height:0,
		radius:10,
		speed:0.47,
	},
	gameText:{
		score:{
			x:95,
			y:45
		},
		gameName:{
			x:myCanvas.width / 2,
			y:100
		},
		instruction:{
			x:myCanvas.width / 2,
			y:130
		},
		gameOver:{
			x:myCanvas.width / 2,
			y:150
		}
	},
	walls:{
		leftWall:{
			x:0,
			y:0,
			width:20,
			height:myCanvas.height
		},
		topWall:{
			x:0,
			y:0,
			width:myCanvas.width,
			height:20
		},
		bottomWall:{
			x:0,
			y:myCanvas.height - 20,
			width:myCanvas.width,
			height:20
		}
	},
	obstacle:{
		maxWidth:25,
		minWidth:15,
		speed:0.66,
	},
	frame:{
		maxFrameLimit:90,
		minFrameLimit:70,
	},
	enemy:{
		width:21,
		height:21,
		speed:0.66,
		forEvery:5,
		bulletSpeed:0.75
	},
	bullet:{
		width:20,
		height:7,
		speed:0.35
	},
	closeness:4,

}

// game variables
var playerDeep;
var myWalls = [];
var myObstacles = [];
var myEnemies = [];
var myBullets = [];
var enemyBullets = [];
var GameName, displayInstruction, displayScore, gameOver;
var loseSound, themeMusic,fireSound,boomSound;
var scoreCounter = 0;

// creating walls and obstacles and starting game
function startGame() {
	// initialising playerDeep as a circle
	playerDeep = new Item(config.deep.x, config.deep.y,config.deep.width,config.deep.height, "#76FF03", "player");

	// initialising the texts to display on screen
	displayScore = new Item(config.gameText.score.x, config.gameText.score.y, "17px", "Verdana", "#f5df65", "text");
	gameName = new Item(config.gameText.gameName.x,	config.gameText.gameName.y,"bold 34px","Courier New","#FF3D00","text");
	displayInstruction = new Item(config.gameText.instruction.x,config.gameText.instruction.y,"12px","Arial","#E1F5FE","text");
	gameOver = new Item(config.gameText.gameOver.x,config.gameText.gameOver.y,"38px","Times New Roman","#FBC02D","text");

	// initialising permanent walls
	myWalls.push(new Item(config.walls.leftWall.x, config.walls.leftWall.y, config.walls.leftWall.width, config.walls.leftWall.height, "#E91E63")); // left wall
	myWalls.push(new Item(config.walls.topWall.x, config.walls.topWall.y, config.walls.topWall.width, config.walls.topWall.height, "#E91E63")); // top wall
	myWalls.push(new Item(config.walls.bottomWall.x, config.walls.bottomWall.y, config.walls.bottomWall.width, config.walls.bottomWall.height,"#E91E63")); // bottom wall

	//  initialising sounds for game
	loseSound = new Sound("sounds/lose.mp3");
	themeMusic = new Sound("sounds/theme.mp3");
	fireSound = new Sound("sounds/fire.mp3");
	boomSound = new Sound("sounds/boom.mp3")

	gameArena.start();
}

// canvas related info bundled as game arena
var gameArena = {
	canvas: document.querySelector("#myCanvas"),
	stopGame: false,
	state:"standby",
	start: function() {
		this.context = this.canvas.getContext("2d");
		this.frameCounter = 0;
		this.framesPerObstacle = 150;
		requestAnimationFrame(gameLoop);
		//hit spacebar to start playing
		window.addEventListener("keypress", function(e) {
			if (e.key == " ") {
				gameArena.state = "playing";
				themeMusic.play();
			}
		});
		// move mouse to move Deep
		window.addEventListener("mousemove", function(e) {
			gameArena.x = e.pageX;
			gameArena.y = e.pageY;
		});
		// click to fire
		window.addEventListener("click" ,function(e){
			if(gameArena.state == "playing"){
				fireSound.play();
				fireSound.sound.currentTime = 0;
				myBullets.push( new Item(playerDeep.x,playerDeep.y,config.bullet.width,config.bullet.height,"#76FF03"))
			}
		});
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop: function() {
		this.stopGame = true;
	}
};

// contructor for components like walls , obstacles , enemies
function Item(x, y, width, height, color, type) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.type = type || "obstacle";
	this.draw = function() {
		let cx = gameArena.context;
		if (this.type == "player") {
			cx.beginPath();
			cx.save();
			cx.fillStyle = color;
			cx.translate(this.x, this.y);
			cx.arc(0, 0, config.deep.radius, 0, 7); // 7 > 2*PI therefore making a full circle
			cx.fill();
			cx.restore();
			cx.closePath();
		} else if (this.type == "text") {
			cx.font = this.width + " " + this.height;
			cx.fillStyle = color;
			cx.textAlign = "center";
			cx.fillText(this.text, this.x, this.y);
		} else {
			cx.fillStyle = color;
			cx.fillRect(this.x, this.y, this.width, this.height);
		}
	};
	this.checkCrashWith = function(otherItem) {
		let myLeft = this.x - config.deep.radius; //  centre -  (radius) = leftend
		let myRight = this.x + config.deep.radius;
		let myTop = this.y - config.deep.radius;
		let myBottom = this.y + config.deep.radius;
		let otherItemLeft = otherItem.x;
		let otherItemRight = otherItem.x + otherItem.width;
		let otherItemTop = otherItem.y;
		let otherItemBottom = otherItem.y + otherItem.height;
		let crash = true;
		if ( myLeft > otherItemRight || myRight < otherItemLeft || myBottom < otherItemTop || myTop > otherItemBottom ) {
			crash = false;
		}
		return crash;
	};
	this.isBlock = function(otherItem){
		let myLeft = this.x - config.deep.radius; //  centre - (10 (radius) +3) = leftend
		let myRight = this.x + config.deep.radius;
		let myTop = this.y - config.deep.radius;
		let myBottom = this.y + config.deep.radius;
		let otherItemLeft = otherItem.x;
		let otherItemRight = otherItem.x + otherItem.width;
		let otherItemTop = otherItem.y;
		let otherItemBottom = otherItem.y + otherItem.height;
		let block = false;
		if ( (myBottom > otherItemTop && myBottom < otherItemBottom )|| (myTop > otherItemTop && myTop < otherItemBottom ) || (myTop < otherItemTop && myBottom > otherItemBottom )) {
			if(myRight >= otherItemLeft && myLeft <= otherItemRight){
				block = true;
			}
		}
		return block;
	};
}
//constructor for sounds
function Sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function() {
		this.sound.play();
	};
	this.stop = function() {
		this.sound.pause();
	};
}
//diplay game over
function displayGameOver(){
	gameArena.stop();
	themeMusic.stop();
	loseSound.play();
	gameOver.text = "GAME OVER !";
	gameOver.draw();
	controlItems.className = "show";

}

// obstacle is created per a randomly computed frame
function frameInterval(n) {
	if ((gameArena.frameCounter / n) % 1 === 0) {
		return true;
	}
	return false;
}

// logic variables
var vx, vy, dx, dy, angle,dt = 16;
let obstacleCounter = 0;

// update Deep, obstacles ,enemies,bullets,check various collisions and display them.
function updateLogic(dt){
	gameArena.frameCounter++;
	if (gameArena.x && gameArena.y) {
		dx = gameArena.x - gameArena.canvas.offsetLeft - playerDeep.x;
		dy = gameArena.y - gameArena.canvas.offsetTop - playerDeep.y;
		if(playerDeep.x != gameArena.x -gameArena.canvas.offsetLeft && playerDeep.y != gameArena.y - gameArena.canvas.offsetTop){
			if(Math.floor(Math.abs(dx)) <= config.closeness && Math.floor(Math.abs(dy)) <= config.closeness){
				playerDeep.x = gameArena.x - gameArena.canvas.offsetLeft;
				playerDeep.y = gameArena.y - gameArena.canvas.offsetTop;
			}else {
				angle = Math.atan2(dy, dx);
				vx = Math.cos(angle) * config.deep.speed;
				vy = Math.sin(angle) * config.deep.speed;
				playerDeep.x += vx*dt;
				playerDeep.y += vy*dt;
			}
		}
	}
	if (gameArena.state == "playing") {
		scoreCounter++;
		if (frameInterval(gameArena.framesPerObstacle)) {
			obstacleCounter++;
			if((obstacleCounter % config.enemy.forEvery) === 0){
				let availableHeight = gameArena.canvas.height - (config.walls.topWall.height + 2*config.walls.bottomWall.height);
				let enemyX = gameArena.canvas.width;
				let enemyY = Math.floor(Math.random()*availableHeight)
				myEnemies.push( new Item(enemyX+100,enemyY,config.enemy.width,config.enemy.height,"#fd0000"));
				enemyBullets.push( new Item(enemyX,enemyY + 9,config.bullet.width,config.bullet.height,"#fd0000"))
				enemyBullets.push( new Item(enemyX+60,enemyY + 9,config.bullet.width,config.bullet.height,"#fd0000"))
				gameArena.framesPerObstacle = Math.floor(Math.random() * (config.frame.maxFrameLimit - config.frame.minFrameLimit + 1) + config.frame.minFrameLimit); //one obstacle per a randomly computed frame
				gameArena.frameCounter = 2; //reset frame counter

			}else{
				let availableHeight = gameArena.canvas.height - (config.walls.topWall.height + config.walls.bottomWall.height);
				let maxObstacleHeight = availableHeight - 3*config.deep.radius;
				let obstacleHeight = Math.floor(Math.random() * (maxObstacleHeight + 1));
				let remainingHeight = availableHeight - obstacleHeight;
				let obstacleWidth = Math.floor(Math.random() * (config.obstacle.maxWidth - config.obstacle.minWidth + 1) + config.obstacle.minWidth);
				let obstacleX, obstacleY;
				if (obstacleHeight == maxObstacleHeight) {
					obstacleY = Math.floor(Math.random() * 2) ? config.walls.topWall.height : config.walls.topWall.height + remainingHeight;
				} else if (
						obstacleHeight > maxObstacleHeight - 3*config.deep.radius &&
						obstacleHeight < maxObstacleHeight
					) {
						obstacleY = Math.floor(Math.random() * 2)	? config.walls.topWall.height : config.walls.topWall.height + availableHeight - obstacleHeight;
				} else {
						obstacleY = Math.floor(Math.random() * (remainingHeight + 1));
				}
				obstacleX = gameArena.canvas.width;
				myObstacles.push(	new Item(obstacleX, obstacleY, obstacleWidth, obstacleHeight, "#558ad8"));
				gameArena.framesPerObstacle = Math.floor(Math.random() * (config.frame.maxFrameLimit - config.frame.minFrameLimit + 1) + config.frame.minFrameLimit); //one obstacle per a randomly computed frame
				gameArena.frameCounter = 2;	//reset frame counter
			}
			config.frame.maxFrameLimit *= 0.9995;
			config.frame.minFrameLimit *= 0.9995

		}
		myWalls.forEach(wall => {
			if (playerDeep.checkCrashWith(wall)) {
				gameArena.state = "quit";
			}
		});
		myObstacles.forEach(obstacle => {
			if (playerDeep.isBlock(obstacle)) {
				playerDeep.x -= (config.obstacle.speed + vx)*dt;
			}
			if(playerDeep.checkCrashWith(obstacle)){
				playerDeep.y -= vy*dt;
			}
		});
		myEnemies.forEach(enemy => {
			if (playerDeep.checkCrashWith(enemy)) {
				gameArena.state = "quit";
			}
		})
		enemyBullets.forEach(bullet =>{
			if(playerDeep.checkCrashWith(bullet)){
				gameArena.state = "quit"
			}
		})
		myBullets.forEach(bullet =>{
			myEnemies.forEach(enemy =>{
				if(bullet.checkCrashWith(enemy)){
					fireSound.stop();
					boomSound.play();
					scoreCounter+=1000
					myBullets.splice(myBullets.indexOf(bullet),1);
					myEnemies.splice(myEnemies.indexOf(enemy),1);
				}
			})
		})
		// Update and draw obstacles
		myObstacles.forEach(obstacle => {
			obstacle.x -= config.obstacle.speed*dt;
			obstacle.draw();
		});
		//Update & draw enemies
		myEnemies.forEach(enemy => {
			enemy.x -= config.enemy.speed*dt;
			enemy.draw();
		});
		//Update & draw mybullets
		myBullets.forEach(bullet =>{
			bullet.x += config.bullet.speed*dt;
			bullet.draw();
		});
		// update and draw enemy bullets
		enemyBullets.forEach(bullet =>{
			bullet.x -= config.enemy.bulletSpeed*dt
			bullet.draw()
		})
		if(gameArena.state == "quit"){
			displayGameOver();
		}
	} else if( gameArena.state == "standby"){
		gameName.text = "OBSTACLE COURSE";
		displayInstruction.text = "( press SPACEBAR to play & CLICK to fire )";
		gameName.draw();
		displayInstruction.draw();
	}
}
// render Deep, Walls and score on canvas
function render(){
	myWalls.forEach(wall => wall.draw()); // draw walls
	playerDeep.draw(); // draw deep
	displayScore.text = "SCORE : " + scoreCounter;
	displayScore.draw();// display score

}

// Game Loop
function gameLoop(time) {
	dt = time - dt;
	gameArena.clear();
	updateLogic(dt);
	render();
	if (!gameArena.stopGame) {
		dt = time;
		requestAnimationFrame(gameLoop);
	}
}

// Restart button
const controlItems = document.querySelector("#control-items");
const redo = document.querySelector(".fa-redo");
controlItems.addEventListener("click", function(e) {
	if (e.target == redo) {
		document.location.reload(true);
	}
});
