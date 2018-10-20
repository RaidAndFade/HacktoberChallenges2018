// create canvas and get context

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// background image

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function(){
	bgReady = true;
};
bgImage.src = "https://i.imgur.com/Neq8jzF.png";


// flyswatter
var flyswatterReady = false;
var flyswatterImage = new Image();
flyswatterImage.onload = function(){
	flyswatterReady = true
};
flyswatterImage.src = "https://i.imgur.com/uPdrgFi.gif";

// fly
var flyReady = false;
var flyImage = new Image();
flyImage.onload = function(){
		flyReady = true;
	};
flyImage.src = "https://i.imgur.com/L4j54AU.gif";

// setup game objects

var flyswatter = {
	speed:256,
	x: 0,
	y: 0
};
var fly = {
	x: 0,
	y: 0
};
var flysSwatted = 0;

// player movement

var keysDown = {};

addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
}, false);

// reset the game when the player swats a fly
var reset = function(){
	// player goes back to the middle
	flyswatter.x = canvas.width / 2;
	flyswatter.y = canvas.height / 2;

	//fly goes somewhere randomly
	fly.x = 32 + (Math.random() * (canvas.width - 64));
	fly.y = 32 + (Math.random() * (canvas.height - 64));
};

// update game based on user input
// modifier will pertain to how much time has passed, so the user's movement is consistent
// regardless of how fast the script is running
var update = function(modifier){
	if(38 in keysDown){
		// up key
		flyswatter.y -= flyswatter.speed * modifier;
	}
	if(40 in keysDown){
		// down key
		flyswatter.y += flyswatter.speed * modifier;
	}
	if(37 in keysDown){
		// left key
		flyswatter.x -= flyswatter.speed * modifier;
	}
	if(39 in keysDown){
		// right key
		flyswatter.x += flyswatter.speed * modifier;
	}

	// Collision detection
	if(
		flyswatter.x <= (fly.x + 32)
		&& fly.x <= (flyswatter.x + 32)
		&& flyswatter.y <= (fly.y + 32)
		&& fly.y <= (flyswatter.y + 32)
	){
		++flysSwatted;
		reset();
	}
};

// render everything
var render = function(){
	if(bgReady){
		context.drawImage(bgImage, 0, 0);
	}

	if(flyswatterReady){
		context.drawImage(flyswatterImage, flyswatter.x, flyswatter.y);
	}

	if(flyReady){
		context.drawImage(flyImage, fly.x, fly.y);
	}

	// render score
	context.fillStyle = "rgb(250,250,250)";
	context.font = "24px Helvetica";
	context.textAlign = "left";
	context.textBaseLine = "top";
	context.fillText("Interns Found: " + flysSwatted, 32, 32);
};



// main loop

var main = function(){
	var now = Date.now();
	var delta = now - then;
	
	update(delta/1000);
	render();

	then = now;

	requestAnimationFrame(main);

};



var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
reset();
main();
