var para = document.getElementById('ballcounter');
var timer=document.getElementById('timecounter');
var count = 0;
var areyounotentertained=20;  // number of balls
// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var gltime=0;

function updateTimer(){
  gltime+=1;
  timer.textContent = "Time : " + gltime/100;
}

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// define shape constructor

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// define Ball constructor, inheriting from Shape

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);

  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// define ball update method

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// define ball collision detection

Ball.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if(!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size && balls[j].exists) {
        balls[j].color = this.color = 'rgb(' + random(200,255) + ',' + random(0,10) + ',' + random(0,100) +')';
      }
    }
  }
};




// define EvilCircle constructor, inheriting from Shape

function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);

  this.color = 'white';
  this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};


// define EvilCircle checkBounds method

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

// define EvilCircle setControls method

// EvilCircle.prototype.setControls1 = function() {
//   var _this = this;
//   window.onkeydown = function(e) {
//     if(e.keyCode === 65 ) { // a
//       _this.x -= _this.velX;
//     } else if(e.keyCode === 68) { // d
//       _this.x += _this.velX;
//     } else if(e.keyCode === 87) { // w
//       _this.y -= _this.velY;
//     } else if(e.keyCode === 83) { // s
//       _this.y += _this.velY;
//     }
//   };
// };

// EvilCircle.prototype.setControls2 = function(){
// 	var _this = this;
//   window.onkeydown = function(e) {
//     if(e.keyCode === 37) { // a
//       _this.x -= _this.velX;
//     } else if(e.keyCode === 39) { // d
//       _this.x += _this.velX;
//     } else if(e.keyCode === 38) { // w
//       _this.y -= _this.velY;
//     } else if(e.keyCode === 40) { // s
//       _this.y += _this.velY;
//     }
//   };
// };

// define EvilCircle collision detection

EvilCircle.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if( balls[j].exists ) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        para.textContent = 'Ball count: ' + count;
      }
    }
  }
};
var evil1 = new EvilCircle(random(0,width), random(0,height), true);
var evil2 = new EvilCircle(random(0,width), random(0,height), true);
window.onkeydown = function(e) {
	    if(e.keyCode === 37) { // a
	      evil1.x -= evil1.velX;
	    } else if(e.keyCode === 39) { // d
			evil1.x += evil1.velX;
	    } else if(e.keyCode === 38) { // w
			evil1.y -= evil1.velY;
	    } else if(e.keyCode === 40) { // s
			evil1.y += evil1.velY;
		} else if(e.keyCode === 65 ) { // a
		  evil2.x -= evil2.velX;
		} else if(e.keyCode === 68) { // d
			evil2.x += evil2.velX;
		} else if(e.keyCode === 87) { // w
			evil2.y -= evil2.velY;
		} else if(e.keyCode === 83) { // s
			evil2.y += evil2.velY;
		}
		
  };


var balls = [];

function loop() {
  if(count==0)
  {
    clearTimeout(updateTimer);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  if(count!=0)
    setTimeout(updateTimer,1000);
  while(balls.length < areyounotentertained) {
    var size = random(10,20);
    var ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the adge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
      true,
      'rgb(' + random(200,255) + ',' + random(0,10) + ',' + random(0,100) +')',
      size
    );
    balls.push(ball);
    count++;
    para.textContent = 'Ball count: ' + count;
  }

  for(var i = 0; i < balls.length; i++) {
    if(balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  evil1.draw();
  //evil2.draw();
  evil1.checkBounds();
  //evil2.checkBounds();
  evil1.collisionDetect();
  //evil2.collisionDetect();

  requestAnimationFrame(loop);
}



loop();
