var obstacles = [];
var enemies = [];
var welcomeSound,playSound;
//sound constructor
function sound(src){
	this.sound = document.createElement('audio');
	this.sound.src = src;
	this.sound.setAttribute('preload','auto');
	this.sound.setAttribute('controls','none');
	this.sound.setAttribute('loop',true);
	this.sound.style.display = 'none';
	document.body.appendChild(this.sound);
	this.noloop = function(){
		this.sound.setAttribute('loop',false);//not working
	};
	this.play = function(){
		this.sound.play();
	};
	this.stop = function(){
		this.sound.pause();
	};
}

function obstacle(x,y,color,width,height){
	this.x = x,
	this.y = y,
	this.color = color,
	this.width = width,
	this.height = height,
	this.draw = function() {
		var ctx = myGameArea.context;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
	};
}

function enemy(x,y,color,width,height){
	this.x = x,
	this.y = y,
	this.color = color,
	this.width = width,
	this.height = height,
	this.draw = function() {
		var ctx = myGameArea.context;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
	};
}

var score = {
	x: screen.width - 300,
	y: 40,
	color: 'black',
	text: 'Score: 0',
	draw: function(){
		var ctx = myGameArea.context;
		ctx.font = '20px sans-serif';
		ctx.fillStyle = this.color;
		ctx.fillText(this.text,this.x,this.y);
	},
	update: function(currentScore){
		this.text = 'Score: '+currentScore;
	}
};

var distance = {
	x: screen.width - 300,
	y: 70,
	color: 'black',
	text: 'Distance: 0 m',
	draw: function(){
		var ctx = myGameArea.context;
		ctx.font = '20px sans-serif';
		ctx.fillStyle = this.color;
		ctx.fillText(this.text,this.x,this.y);
	},
	update: function(currentDist){
		this.text = 'Distance: '+currentDist+' m';
	}
};


var ball = {
  x: 1000,
  y: 100,
  vx: 0,
  vy: 0,
  radius: 15,
  color: 'red',
  draw: function() {
  	
    myGameArea.context.beginPath();
    myGameArea.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    myGameArea.context.closePath();
    myGameArea.context.fillStyle = this.color;
    myGameArea.context.fill();

  },
  
  crashwith: function(otherobj){
  
  	var left = this.x-this.radius;
  	var right = this.x + this.radius;
  	var top = this.y - this.radius;
  	var bottom = this.y + this.radius;
  	var otherleft = otherobj.x;
  	var otherright = otherobj.x + (otherobj.width);
  	var othertop = otherobj.y;
  	var otherbottom = otherobj.y + (otherobj.height);
  	var crash = true;
  	if ((bottom < othertop) || (top > otherbottom) || (right < otherleft) || (left > otherright)){
  		crash = false; }
  		return crash;
  	}
};



function playmusic(){//plays music on page load
	welcomeSound = new sound("welcome.mp3");
	welcomeSound.play();
}

function startGame() {
	welcomeSound.stop();
    myGameArea.start();
    ball.draw();
    score.draw();
    distance.draw();
    playSound = new sound("playing.mp3");
    playSound.play();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 0.95*screen.width ;
        this.canvas.height = 0.75*(screen.height);
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas,document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 10);
        this.frameNo = 0;
    },
    clear: function () {
  		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.context.fillStyle = '#1191EA';
  		this.context.fillRect(0,0,myGameArea.width,myGameArea.height);
	},
	stop: function(){
		clearInterval(this.interval);
		this.canvas.removeEventListener('mousemove',handler);
		document.getElementById('overlay').style.display = 'block';
		//alert('removed');
		playSound.stop();
	}
};

function updateGameArea(){
	myGameArea.clear();
	for(var i = 0; i < enemies.length; i++)
	{
		if(ball.crashwith(enemies[i]))
		{
			var killed = new sound("kill.mp3");
			killed.noloop();	
			killed.play();	
			myGameArea.stop();
			return;
		}
	}
	

	for(var i = 0; i < obstacles.length; i++)
	{
		if(ball.crashwith(obstacles[i])){
			//myGameArea.stop();
			if(obstacles[i].x>ball.x && ball.x-ball.radius <= 0)
			{	
				var struck = new sound("hit.mp3");
				struck.noloop();	
				struck.play();
				myGameArea.stop();
				return;
			}
			else if(obstacles[i].x > ball.x)
			ball.x = obstacles[i].x-ball.radius;
			else if (obstacles[i].x<0)
			{
				ball.x = 0;	
			}
			else
				ball.x = obstacles[i].x+ball.radius;
		}
	}

	myGameArea.frameNo+=1;
	if(myGameArea.frameNo == 1 || generateObstacleCondition(150)){
		var x = myGameArea.canvas.width;
		var y = myGameArea.canvas.height;
		//generate random obstacles and push them to array
		var gap,minGap,maxGap,height,maxHeight,minHeight;
		minHeight=50;
		maxHeight = y*0.85;
		minGap = 70;
		maxGap = 150;
		
		height = Math.floor(Math.random()*Math.random()*(maxHeight-minHeight+1)+minHeight);
		gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
		
		obstacles.push(new obstacle(x,0,'green',10,height));
		obstacles.push(new obstacle(x, height+gap, 'green',10,y-height-gap));
		//obstacles.push(new obstacle(0,0,'green',10,200));
	}

	//generate enemy randomly
	if(Math.floor(Math.random()*1000)%500 === 0)
	{
		var x = myGameArea.canvas.width;
		var y = myGameArea.canvas.height;
		var y1 = Math.floor(Math.random()*(y-120))+60;
		enemies.push(new enemy(x,y1,'black',25,25));
		//alert(enemies.length);
	}

	//update score board
	score.update(Math.floor((myGameArea.frameNo+23)/3));      //Just to make it look different....xD
	score.draw();
	
	distance.update(myGameArea.frameNo/10);
	distance.draw();

	//var dx,dy;
	//dx = e.clientX - ball.x;
	//dy = e.clientY - ball.y;
    //ball.x = ball.x + dx/10;
    //ball.y = ball.y +dy/10;
    ball.draw();

	for(i = 0; i< obstacles.length; i++){
		//alert('value of i '+i+'obstacles.length = '+obstacles.length);
		if( Math.floor((myGameArea.frameNo)/1500)<1)
			obstacles[i].x -= 1;
		else		
			obstacles[i].x -= Math.floor((myGameArea.frameNo)/1500);
		obstacles[i].draw(); 
	}
	for(var i = 0; i < enemies.length; i++){
		if( Math.floor((myGameArea.frameNo)/1500)<1)
			enemies[i].x -= 1;
		else		
			enemies[i].x -= Math.floor((myGameArea.frameNo)/1500);
		enemies[i].draw(); 	
	} 
}
function generateObstacleCondition(n){
	var l = obstacles.length;
	if (myGameArea.canvas.width - obstacles[l-1].x >= 150)
		return true;
	return false;
}

var handler = function(e){
	//alert('handler called');
	myGameArea.clear();
	var dx,dy;
	dx = e.clientX - ball.x;
	dy = e.clientY - ball.y;
    var crashed=false;

	for(var i = 0; i < obstacles.length; i++)
	{
		if(ball.crashwith(obstacles[i]))
		{
			crashed = true;
			//myGameArea.stop();
			if(obstacles[i].x > ball.x)
			{
				if(e.clientX > obstacles[i].x)
					ball.x = obstacles[i].x-ball.radius;
				else
					ball.x = ball.x + dx/10;		
			}
			else
			{
				if(e.clientX < obstacles[i].x)
					ball.x = obstacles[i].x+ball.radius;
				else
					ball.x = ball.x + dx/10;
			}
		}	
	}
	if(crashed === false)
	{
		ball.x = ball.x + dx/10;
	}
	ball.y = ball.y + dy/10;
    ball.draw();
    updateGameArea();
};
	

myGameArea.canvas.addEventListener('mousemove', handler);
