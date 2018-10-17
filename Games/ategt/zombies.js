// This project was loosely based on the following kata
//
// https://github.com/ardalis/kata-catalog/blob/master/katas/Zombie%20Survivors.md
// 
// and this tutorial
//
// https://www.w3schools.com/graphics/game_intro.asp

// Visit https://github.com/ategt for more projects by the author and perhaps
// an updated version of this game.

Array.prototype.randomElement = function(){ return this[Math.floor(Math.random() * this.length)] }

var currentScore;
var myGamePiece;
var myObstacles;
var myObjects;
var supplyCreates;
var animations;
var zombies;
var activeZombies;
var scoreBoard;
var myStatus;
var collisionCounter;
var myStatus2;
var statusText;
var mydebug;
var debug_text;
var weaponHud;
var showClippingBounds;
var weaponsActions = null;

function setupGame() {
    currentScore = 0;
    myObstacles = [];
    myObjects = [];
    supplyCreates = [];
    animations = [];
    zombies = new Set();
    activeZombies = [];
    collisionCounter = 0;
    statusText = '';
    debug_text = '';
    showClippingBounds = false;

    myGamePiece = new Player();
    scoreBoard = new TextComponent("30px", "Consolas", "black", 280, 40);
    myStatus = new TextComponent("30px", "Consolas", "black", 200, 75);
    myStatus2 = new TextComponent("40px", "Consolas", "red", 200, 105);
    mydebug = new TextComponent("20px", "Consolas", "red", 200, 150);    
    weaponHud = new TextComponent("20px", "Consolas", "black", 10, 40);    
}

function startGame() {
    setupGame();
    myGameArea.start();
}

function triggerExplosion(ordanence) {
    var x = ordanence.x;
    var y = ordanence.y;
    var size = ordanence.size || 50;
    return new Explosion(x, y, size);
}

function _dropSupplyCreate() {
    var x = Math.floor(myGameArea.canvas.width * Math.random());
    return new SupplyCrate(x, -30);
}

function _spawnZombie(x, direction){
    return new Zombie(x, myGameArea.canvas.height, direction)
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function Player(){
    component.call(this, 20, 30, "red", 10, 120, 'player', {gravity: .5, gravitySpeed: -2, weaponClip: true, groundClip: true, wallClip: true});

    this.throwGrenade = function() {
        var center = this.adjustedCenter()
        let item = new Grenade(center.x, center.y, this.direction);
        myObjects.push(item);
        return item;
    }

    this.throwKnife = function() {
        var center = this.adjustedCenter()
        let item = new Knife(center.x, center.y, this.direction);
        myObjects.push(item);
        return item;
    }

    this.dropMine = function() {
        var center = this.adjustedCenter()
        let item = new LandMine(center.x, center.y, this.direction);
        myObjects.push(item);
        return item;
    }

    this.throwStar = function() {
        var center = this.adjustedCenter()
        let item = new ThrowingStar(center.x, center.y, this.direction);
        myObjects.push(item);
        return item;
    }

    this.shootLaser = function() {
        var center = this.adjustedCenter()
        let item = new Laser(center.x, center.y, this.direction);
        myObjects.push(item);
        return item;
    }

    this.fireMissle = function() {
        var center = this.adjustedCenter()
        var item = new Missle(center.x, center.y, this.direction);
        myObjects.push(item);
        return item;
    }

    this.weaponsActions = [{action:this.throwKnife,   name: 'Hand Gun'},
                           {action:this.throwGrenade, name: 'Grenades'},
                           {action:this.shootLaser,   name: 'Laser'},
                           {action:this.dropMine,     name: 'Land Mines'},
                           {action:this.throwStar,    name: 'Ninja Stars'},
                           {action:this.fireMissle,   name: 'Rockets' }];

    this.equipRandomWeapon = function() {
        let weaponObject = this.weaponsActions.randomElement();
        this.fireWeapon = weaponObject.action
        this.equiped = weaponObject.name
    }

    this.movedown = function() {
        this.speedY = 1; 
    }

    this.moveleft = function() {
        this.speedX = -3;
        this.direction = -1;
    }

    this.moveright = function() {
        this.speedX = 3;
        this.direction = 1;
    }

    this.clearmove = function() {
        this.speedX = 0; 
        this.speedY = 0; 
    }

    this.clearX = function() {
        this.speedX = 0; 
    }

    this.clearY = function() {
        this.speedY = 0; 
    }

    this.fireWeapon = function(){}
    this.equiped = ''

    this.update = function() {
        this.updateAge();
        ctx = myGameArea.context;

        if (showClippingBounds){
            // Clipping bounds
            ctx.fillStyle = 'gray';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        var center = this.adjustedCenter()
        var actingX = center.x
        var actingY = center.y;

        ctx.fillStyle = this.color;
        ctx.fillRect(actingX-5, actingY, 10, 20);
        ctx.beginPath();
        ctx.arc(actingX, actingY + 1, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'tan';
        ctx.fill();

        // Hat
        ctx.beginPath();
        if (this.direction == 1) {
            ctx.arc(actingX, actingY + 1, 8, 1 * Math.PI, 1.5 * Math.PI);
        } else {
            ctx.arc(actingX, actingY + 1, 8, 1.5 * Math.PI, 2 * Math.PI);
        }
        ctx.fillStyle = 'red';
        ctx.fill();

        // eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(actingX + 2 * this.direction, actingY - 1, 3, 2);
        ctx.fillStyle = 'black';
        ctx.fillRect(actingX + 4 * this.direction, actingY - 1, 2, 2);
    }
}

function Zombie(x, y, direction){
    component.call(this, 20, 30, "green", x, y - 30, 'zombie', {direction: direction});

    this.id = zombies.add(this).size
    activeZombies.push(this)
    myObstacles.push(this)

    this.update = function() {
        this.updateAge();
        ctx = myGameArea.context;

        if (showClippingBounds){
            // Clipping bounds
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        var center = this.adjustedCenter()
        var actingX = center.x
        var actingY = center.y;

        // Shirt
        ctx.fillStyle = this.color;
        ctx.fillRect(actingX-5, actingY, 10, 20);

        // Head
        ctx.beginPath();
        ctx.arc(actingX, actingY + 1, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'gray';
        ctx.fill();

        if (this.direction == 1) {

            // Hair
            ctx.beginPath();
            ctx.arc(actingX, actingY + 1, 8, 0, Math.PI, true);
            ctx.lineTo(actingX - 9, actingY - 5);
            ctx.lineTo(actingX - 8, actingY - 5);
            ctx.lineTo(actingX - 4, actingY - 4);
            ctx.lineTo(actingX - 2, actingY - 8);
            ctx.lineTo(actingX, actingY - 8);
            ctx.lineTo(actingX + 2, actingY - 4);
            ctx.lineTo(actingX + 4, actingY - 8);
            ctx.lineTo(actingX + 6, actingY - 6);
            ctx.lineTo(actingX + 8, actingY - 4);
            ctx.lineTo(actingX + 8, actingY);


            ctx.closePath();
            ctx.fillStyle = 'black';
            ctx.fill();

            // Inner Hair
            ctx.beginPath();
            ctx.arc(actingX, actingY + 1, 8, -0.1 * Math.PI, Math.PI, true);
            ctx.lineTo(actingX, actingY - 3)
            ctx.closePath();
            ctx.fillStyle = 'black';
            ctx.fill();
            
            // Blood Over Mouth
            ctx.beginPath();
            ctx.moveTo(actingX + 8, actingY + 5);
            ctx.arc(actingX + 4, actingY + 5, 3, 0.5 * Math.PI, Math.PI);
            ctx.lineTo(actingX + 8, actingY + 1)
            ctx.closePath();
            ctx.fillStyle = 'red';
            ctx.fill();

            // Mouth            
            ctx.beginPath();
            //ctx.moveTo(actingX + 8, actingY + 5);
            ctx.arc(actingX, actingY + 1, 8, 0.1 * Math.PI, 0.25 * Math.PI);
            ctx.lineTo(actingX + 3, actingY + 4)
            ctx.closePath();
            ctx.fillStyle = 'black';
            ctx.fill();

            // Sleeves         
            ctx.fillStyle = 'green';
            ctx.fillRect(actingX, actingY + 9, 9, 3);

            // Hands       
            ctx.beginPath();
            ctx.moveTo(actingX + 8, actingY + 9);
            ctx.arc(actingX + 8, actingY + 10, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'gray';
            ctx.fill();

        } else {

            // Hair
            ctx.beginPath();
            ctx.arc(actingX, actingY + 1, 8, Math.PI, 0, false);
            ctx.lineTo(actingX + 9, actingY - 5);
            ctx.lineTo(actingX + 8, actingY - 5);
            ctx.lineTo(actingX + 4, actingY - 4);
            ctx.lineTo(actingX + 2, actingY - 8);
            ctx.lineTo(actingX, actingY - 8);
            ctx.lineTo(actingX - 2, actingY - 4);
            ctx.lineTo(actingX - 4, actingY - 8);
            ctx.lineTo(actingX - 6, actingY - 6);
            ctx.lineTo(actingX - 8, actingY - 4);
            ctx.lineTo(actingX - 8, actingY);


            ctx.closePath();
            ctx.fillStyle = 'black';
            ctx.fill();

            // Inner Hair
            ctx.beginPath();
            ctx.arc(actingX, actingY + 1, 8, Math.PI + ( 0.1 * Math.PI ), 0, false);
            ctx.lineTo(actingX, actingY - 3)
            ctx.closePath();
            ctx.fillStyle = 'black';
            ctx.fill();
            
            // Blood Over Mouth
            ctx.beginPath();
            ctx.moveTo(actingX - 8, actingY + 5);
            ctx.arc(actingX - 4, actingY + 5, 3, 0.5 * Math.PI, Math.PI, true);
            ctx.lineTo(actingX - 8, actingY + 1)
            ctx.closePath();
            ctx.fillStyle = 'red';
            ctx.fill();

            // Mouth   
            ctx.beginPath();
            //ctx.moveTo(actingX + 8, actingY + 5);
            ctx.arc(actingX, actingY + 1, 8, Math.PI - 0.1 * Math.PI, Math.PI - (0.25 * Math.PI), true);
            ctx.lineTo(actingX - 1, actingY + 4)
            ctx.closePath();
            ctx.fillStyle = 'black';
            ctx.fill();

            // Sleeves         
            ctx.fillStyle = 'green';
            ctx.fillRect(actingX - 9, actingY + 9, 9, 3);

            // Hands       
            ctx.beginPath();
            ctx.moveTo(actingX - 8, actingY + 9);
            ctx.arc(actingX - 8, actingY + 10, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'gray';
            ctx.fill();

        }

        // eyes
        ctx.fillStyle = 'gray';
        ctx.fillRect(actingX + 2 * this.direction, actingY - 1, 3, 2);
        ctx.fillStyle = 'black';
        ctx.fillRect(actingX + 4 * this.direction, actingY - 1, 2, 2);
    }
}

function SupplyCrate(x, y){
    component.call(this, 30, 30, "brown", x, y, 'crate', {gravity: .2, gravitySpeed: 0, maxAge: 50, collectable: true, groundClip: true, weaponClip: true, itemName: "Item " + Math.floor(Math.random() * 5) });

    supplyCreates.push(this);
    myObstacles.push(this);
    this.size = 90;
    
    this.weaponHit = function(){ triggerExplosion(this) }

    this.update = function() {
        this.updateAge();
        ctx = myGameArea.context;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        var leftX = this.x + this.width / 4;
        var rightX = this.x + this.width * 3 / 4;

        var topY = this.y + this.height / 4;
        var bottomY = this.y + this.height * 3 / 4;

        var width = this.width * 2 / 4;
        var height = this.height * 2 / 4;

        ctx.lineWidth = 1;
        ctx.fillStyle = 'black';

        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(leftX, topY, width, height);

        ctx.beginPath();

        ctx.moveTo(leftX, topY);
        ctx.lineTo(rightX, bottomY);

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(rightX, topY);
        ctx.lineTo(leftX, bottomY);

        ctx.stroke();

    }
}

function TextComponent(width, height, color, x, y){
    component.call(this, width, height, color, x, y, 'text');

    this.update = function() {
        this.updateAge();
        ctx = myGameArea.context;

        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }
}

function Explosion(x, y, size){
    component.call(this, size, size, "orange", x, y, 'explosion', {direction: 1, maxAge: 2, persistantWeapon: true});
    animations.push(this)

    this.update = function() {
        this.updateAge();
        ctx = myGameArea.context;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function Weapon(width, height, color, x, y, type, options){
    component.call(this, width, height, color, x, y, type, options);

    this.name = type
}

function Knife(x, y, direction){
    Weapon.call(this, 5, 3, "black", x, y, 'knife', {speedX: 4 * direction, speedY: 0, groundClip: true, weaponClip: true, contactWeapon: true, direction: direction, maxAge: 100});
}

function Laser(x, y, direction){
    Weapon.call(this, myGameArea.canvas.width, 2, "red", x, y, 'laser', {contactWeapon: true, lethal:true, direction: direction, maxAge: 1});

    this.crashWith = function(otherobj) {
        var myleft = this.direction > 0 ? this.x : this.x - this.width;
        var myright = this.direction > 0 ? this.x + this.width : this.x;
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

    this.update = function() {
        this.updateAge();
        ctx = myGameArea.context;

        ctx.fillStyle = this.color;
        
        if (this.direction == 1) {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillRect(this.x, this.y, -this.width, this.height);
        }
    }
}

function Grenade(x, y, direction){
    Weapon.call(this, 5, 5, "orange", x, y, 'grenade', {gravity: .1, gravitySpeed: -3, bounce: 0.6, momentumSpeed: 2, acceleration: 0, drag: .005, groundClip: true, direction: direction, maxAge: 100});
}

function ThrowingStar(x, y, direction){
    Weapon.call(this, 5, 5, "darkgrey", x, y, 'throwingStars', {gravity: .02, gravitySpeed: -0.5, bounce: 0.0, momentumSpeed: 3, acceleration: 0, drag: .01, groundClip: true, direction: direction, maxAge: 50});

    this.richoet = function(collidingObstacle) {
        this.momentumSpeed = 0;
        this.gravitySpeed = 3;
    }
}

function LandMine(x, y, direction){
    Weapon.call(this, 5, 5, "darkgrey", x, y, 'mine', {gravity: 0.5, gravitySpeed: 0.5, bounce: 0.0, momentumSpeed: 0, acceleration: 0, drag: .01, groundClip: true, direction: direction, maxAge: 500});
    this.fuse = 20

    this.richoet = function(collidingObstacle) {
        this.momentumSpeed = 0;
        this.gravitySpeed = 3;
    }

    this.isExplosive = function() {
        return this.age > this.fuse
    }

    this.detonate = function() {
        triggerExplosion(this)
        this.age = this.maxAge + 1
        this.active = false
    }

    this.update = function() {
        this.updateAge();
        ctx = myGameArea.context;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 10, 3);

        ctx.fillStyle = this.isExplosive() ? 'red' : 'green';
        ctx.fillRect(this.x + 4, this.y - 1, 3, 3);
    }
}

function Missle(x, y, direction){
    Weapon.call(this, 5, 3, "black", x, y, 'missle', {speedX: .5 * direction, acceleration: 0.1 * direction, speedY: 0, direction: direction, maxAge: 200, contactWeapon: true, weaponClip: true});

    this.update = function() {
        this.updateAge();
        ctx = myGameArea.context;

        if (this.direction == 1) {
            ctx.beginPath();
            ctx.arc(this.x - this.width, this.y + this.height / 2, 5, -0.5 * Math.PI, .5 * Math.PI);
            ctx.lineTo(this.x - this.width + 2, this.y + this.height / 2 + 1)
            
            ctx.lineTo(this.x - this.width, this.y + this.height / 2)
            ctx.lineTo(this.x - this.width + 2, this.y + this.height / 2 - 1)

            ctx.closePath();
            ctx.fillStyle = 'orange';
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(this.x + this.width*2, this.y + this.height / 2, 5, 0.5 * Math.PI, -0.5 * Math.PI);
            ctx.lineTo(this.x + this.width*2 + 2, this.y + this.height / 2 + 1)
            
            ctx.lineTo(this.x + this.width*2, this.y + this.height / 2)
            ctx.lineTo(this.x + this.width*2 + 2, this.y + this.height / 2 - 1)

            ctx.closePath();
            ctx.fillStyle = 'orange';
            ctx.fill();                
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }
}

function component(width, height, color, x, y, type, options={}) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speedX = options.speedX || 0;
    this.speedY = options.speedY || 0;
    this.gravity = options.gravity || 0;
    this.gravitySpeed = options.gravitySpeed || 0;
    this.momentumSpeed = options.momentumSpeed || 0;
    this.acceleration = options.acceleration || 0;    
    this.drag = options.drag || 0;
    this.bounce = options.bounce || 0;
    this.collectable = options.collectable || false;
    this.groundClip = options.groundClip || false;
    this.wallClip = options.wallClip || false;
    this.weaponClip = options.weaponClip || false;
    this.contactWeapon = options.contactWeapon || false;
    this.persistantWeapon = options.persistantWeapon || false;
    this.weaponHit = options.weaponHit;
    this.lethal = this.contactWeapon || this.persistantWeapon;
    this.creationFrame = myGameArea.frameNo;
    this.age = 0;
    this.maxAge = options.maxAge || Number.POSITIVE_INFINITY;
    this.direction = options.direction || 1;
    this.active = options.active || true;
    this.adjustedCenter = function(){
        return { x: this.x + this.width / 2, y: this.y + 10 }
    }
    this.update = function() {
        this.updateAge();
        ctx = myGameArea.context;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.updateAge = function(){
        this.age = myGameArea.frameNo - this.creationFrame
    }
    this.newPos = function(clipping = false) {
        if (!showClippingBounds){
            temp_x = this.x
            temp_y = this.y
            this._newPos()
            if ( this.wallClip && this.wallHitX() && this.wallHitY()) {
                this.x = temp_x
                this.y = temp_y
            } else if ( this.wallClip && this.wallHitX() ) {            
                this.x = temp_x
            } else if ( this.groundClip && this.wallHitY() ) {
                this.hitBottom()
            }
        }
    }        
    this._newPos = function(clipping = false) {
        this.x += this.speedX + this.momentumSpeed * this.direction;
        this.y += this.speedY + this.gravitySpeed;

        this.gravitySpeed += this.gravity;
        this.momentumSpeed += this.acceleration * this.direction;

        if (this.drag != 0) {
            if (Math.abs(this.momentumSpeed) - (this.drag) < 0 ) {
                this.momentumSpeed = 0
            } else {
                this.momentumSpeed -= ( this.drag * this.direction )
            }
        }

        if (this.gravitySpeed > 0 && this.bounce > 0 ){                
            this.hitBottom();
        }
        if (this.momentumSpeed > 0 && this.bounce > 0 ){                
            this.hitSide();
        }        
    }
    this.richoet = function(collidingObstacle) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        
        var collidingObstacleLeft = collidingObstacle.x;
        var collidingObstacleRight = collidingObstacle.x + (collidingObstacle.width);
        
        if (myleft >= collidingObstacleRight) {
            this.momentumSpeed = Math.abs(this.momentumSpeed);
        } else {
            this.momentumSpeed = -(Math.abs(this.momentumSpeed));
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
    this.crashStr = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        return `ml:${myleft}, mr:${myright}, mt:${mytop}, mb:${mybottom}\nol:${otherleft}, or:${otherright}, ot:${othertop}, ob:${otherbottom}\ncrash:${((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright))}`
    }
    this.jump = function() {
        if ( this.jumpEligible() ){
            this.gravitySpeed = -8;
        }
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }
    this.hitSide = function() {
        var edge = myGameArea.canvas.width - this.width;
        if (this.y > edge) {
            this.y = edge;
            this.momentumSpeed = -(this.momentumSpeed * this.bounce);
        }
    }
    this.wallHit = function() {
        return ( this.bottomHit() || this.topHit() || this.rightHit() || this.leftHit() )
    }
    this.wallHitX = function() {
        return ( this.rightHit() || this.leftHit() )
    }
    this.wallHitY = function() {
        return ( this.bottomHit() || this.topHit() )
    }
    this.bottomHit = function() {
        var mybottom = this.y + (this.height);
        var wallbottom = myGameArea.canvas.height
        return (mybottom > wallbottom)
    }
    this.jumpEligible = function() {
        var mybottom = this.y + (this.height);
        var wallbottom = myGameArea.canvas.height
        return (mybottom + 3 > wallbottom)
    }
    this.topHit = function() {
        var mytop = this.y;
        var walltop = 0;
        return (mytop < walltop)
    }
    this.leftHit = function() {
        var wallleft = 0;
        var myleft = this.x;
        return (myleft < wallleft)
    }
    this.rightHit = function() {
        var myright = this.x + (this.width);
        var wallright = myGameArea.canvas.width;
        return (myright > wallright)
    }
}

function drawBackground() {
    ctx = myGameArea.context;
    ctx.fillStyle = "DeepSkyBlue";
    ctx.fillRect(0,0,myGameArea.canvas.width, myGameArea.canvas.height);
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap, colliding;

    var itemsPickedUp = new Set()

    myObjects = myObjects.filter((item, index) => item.active)

    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            if (myObstacles[i].collectable == true ) {
                itemsPickedUp.add(myObstacles[i])
            }
        }
    }

    currentScore += itemsPickedUp.size;

    if (itemsPickedUp.size > 0){
        myGamePiece.equipRandomWeapon();
    }

    myObstacles = myObstacles.filter((item, index) => item.collectable == false || ( item.collectable && !itemsPickedUp.has(item) ) )

    myGameArea.clear();
    myGameArea.frameNo += 1;

    drawBackground();

    if (everyinterval(250)) {
        _dropSupplyCreate();
    }    

    var zombieInterval = 150 - (Math.floor(myGameArea.frameNo / 400) / 100 * 150)

    if (zombieInterval < 1) {
        zombieInterval = 1;
    }

    if (myGameArea.frameNo == 1 || everyinterval(zombieInterval)) {
        if (myGameArea.frameNo > 600) {
            _spawnZombie(-10, 1);
        }

        _spawnZombie(myGameArea.canvas.width, -1);
    }

    var explosions = animations.filter((animation) => animation.type == 'explosion')

    for (i = 0; i < myObstacles.length; i += 1) {

        if (myObstacles[i].type == 'zombie') {
            
            if (myGameArea.frameNo == 1 || everyinterval(4)){
                myObstacles[i].speedX = 0 - Math.floor( Math.random() * 3)

                if ( everyinterval(80) ){
                        myObstacles[i].follow = Math.floor(Math.random() * 3 ) != 0
                        if (myObstacles[i].follow) { 
                            if (myGamePiece.adjustedCenter().x > myObstacles[i].adjustedCenter().x){
                                myObstacles[i].direction = 1
                            } else {
                                myObstacles[i].direction = -1
                            }
                        }
                }
            }

            if ( myObstacles[i].direction > 0) {
                myObstacles[i].speedX = Math.abs(myObstacles[i].speedX)
            } else {
                myObstacles[i].speedX = 0 - Math.abs(myObstacles[i].speedX)
            }
        }        

        var currentObstacle = myObstacles[i];

        if (currentObstacle.weaponClip){
            var lethalObstacles = myObjects.filter((item, index) => item.lethal && item.maxAge >= item.age)
            var collidingLethalObstacles = lethalObstacles.filter((item, index) => item.crashWith(currentObstacle))
            if (collidingLethalObstacles.length > 0 && currentObstacle.weaponHit){
                currentObstacle.weaponHit()
                myObstacles[i] = null;
            }

            var touchingExplosions = explosions.filter((explosion, index) => isExplosionTouching(explosion, currentObstacle) )
            if (touchingExplosions.length > 0) {
                currentObstacle.weaponHit()
                myObstacles[i] = null;
            }

        }

        currentObstacle.newPos(currentObstacle.groundClip);
        currentObstacle.update();
    }

    myObstacles = myObstacles.filter((item, index) => item != null )

    myObjects = myObjects.filter((item, index) => item.maxAge >= item.age )
    animations = animations.filter((item, index) => item.maxAge >= item.age )

    explosions.forEach((explosion, index) => {

        var myCenter = myGamePiece.adjustedCenter();

        if (isExplosionTouching(explosion, myCenter)) {
            endGame("Player dies in explosion.")
        }
    
        activeZombies.forEach((zombie, index) => {
            var zcenter = zombie.adjustedCenter();

            if (isExplosionTouching(explosion, zcenter)) {
                console.log("Zombie ", zombie.id, " hit with granade.")
                activeZombies = activeZombies.filter((activeZombie, index) => zombie.id != activeZombie.id)
                myObstacles = myObstacles.filter((obstacle, index) => ( obstacle.type != 'zombie' || ( obstacle.type == 'zombie' && zombie.id != obstacle.id )))
            }

        })

        myObjects.filter((item, index) => item.type == 'mine' && item.active).forEach((mine, index) => {
            if (isExplosionTouching(explosion, mine) && mine.active) {
                mine.detonate()
            }
        })

    })

    var overlappingZombies = activeZombies.filter((zombie, index) => myGamePiece.crashWith(zombie))

    for (i = 0; i < overlappingZombies.length; i += 1){
        if (myGamePiece.adjustedCenter().x > overlappingZombies[i].adjustedCenter().x){
            if (overlappingZombies[i].direction > 0) {
                logZombieBite(myGamePiece, overlappingZombies[i])
                endGame("Player Bitten by Zombie.")
            }
        } else {
            if (overlappingZombies[i].direction < 0) {
                logZombieBite(myGamePiece, overlappingZombies[i])
                endGame("Player Bitten by Zombie.")
            }
        }
    }

    for (i = 0; i < myObjects.length; i += 1) {
        var currentObject = myObjects[i];

        if (currentObject.type == 'grenade' && currentObject.maxAge == currentObject.age) {
            triggerExplosion(currentObject)
        }

        if (currentObject.type == 'mine' && currentObject.isExplosive()) {
            if (currentObject.crashWith(myGamePiece) || myObstacles.filter((item, index) => currentObject.crashWith(item)).length > 0) {
                triggerExplosion(currentObject)
                currentObject.active = false
            }
        }

        var collidingZombies = activeZombies.filter((zombie, index) => currentObject.crashWith(zombie))
        collidingZombies.forEach((collidedZombie, index) => {
            if (currentObject.type == 'knife'){
                activeZombies = activeZombies.filter((activeZombie, index) => collidedZombie.id != activeZombie.id)
                myObstacles = myObstacles.filter((obstacle, index) => ( obstacle.type != 'zombie' || ( obstacle.type == 'zombie' && collidedZombie.id != obstacle.id )))
                myObjects[i].active = false
            } else if (currentObject.type == 'laser') {
                activeZombies = activeZombies.filter((activeZombie, index) => collidedZombie.id != activeZombie.id)
                myObstacles = myObstacles.filter((obstacle, index) => ( obstacle.type != 'zombie' || ( obstacle.type == 'zombie' && collidedZombie.id != obstacle.id )))
                myObjects[i].active = false
            } else if (currentObject.type == 'throwingStars') {
                activeZombies = activeZombies.filter((activeZombie, index) => collidedZombie.id != activeZombie.id)
                myObstacles = myObstacles.filter((obstacle, index) => ( obstacle.type != 'zombie' || ( obstacle.type == 'zombie' && collidedZombie.id != obstacle.id )))
                myObjects[i].active = false
            } else if (currentObject.type == 'missle') {
                triggerExplosion(currentObject)
                myObjects[i].active = false
            } else if (currentObject.type == 'mine') {
                if (currentObject.isExplosive()){
                    triggerExplosion(currentObject)
                    myObjects[i].active = false
                }
            }
        })        

        var collidingObstacles = myObstacles.filter((obstacle, index) => currentObject.crashWith(obstacle))
        if (collidingObstacles.length > 0) {
            currentObject.richoet(collidingObstacles[0])
        }

        if ( currentObject.weaponClip ){
            var touchingExplosions = explosions.filter((explosion, index) => isExplosionTouching(explosion, currentObject) )

            if (touchingExplosions.length > 0) {
                myObjects[i].active = false
            }
        }

        currentObject.newPos(currentObject.groundClip);
        currentObject.update();
    }

    for (i = 0; i < animations.length; i += 1) {
        var animation = animations[i];
        animation.newPos();
        animation.update();
    }


    scoreBoard.text="Score: " + currentScore;
    scoreBoard.update();
    myStatus.text="  Duration: " + myGameArea.frameNo;
    myStatus.update();
    weaponHud.text = myGamePiece.equiped;
    weaponHud.update();
    myGamePiece.newPos(true);    
    myGamePiece.update();
}

function endGame(statusText){
    showClippingBounds = true;

    mydebug.text = statusText;
    mydebug.update();
    
    activeZombies.forEach((zombie, index) => {
        zombie.update();
    })

    myGameArea.stop()
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function isExplosionTouching(explosion, point){
    var xdiff = point.x - explosion.x;
    var ydiff = point.y - explosion.y;

    return (xdiff * xdiff + ydiff * ydiff < explosion.width * explosion.width)
}

function grenadeAction() {
    myGamePiece.throwGrenade();
}

function knifeAction() {
    myGamePiece.throwKnife();
}

function mineAction() {
    myGamePiece.dropMine();
}

function starAction() {
    myGamePiece.throwStar();
}

function missleAction() {
    myGamePiece.fireMissle();
}

function laserAction() {
    myGamePiece.shootLaser();
}

function moveup() {
    myGamePiece.jump();
}

function movedown() {
    myGamePiece.movedown();
}

function moveleft() {
    myGamePiece.moveleft();
}

function moveright() {
    myGamePiece.moveright();
}

function clearmove() {
    myGamePiece.clearmove();
}

function clearX() {
    myGamePiece.clearX();
}

function clearY() {
    myGamePiece.clearY();
}

function fireWeapon() {
    myGamePiece.fireWeapon();
}

function logZombieBite(player, zombie) {
    debug_text = player.crashStr(zombie);
    console.log(debug_text)
}

function restartGame() {
    myGameArea.stop();
    myGameArea.clear();
    startGame();
}

function getMyGamePiece() {
    return myGamePiece;
}

function getAllZombies() {
    return zombies;
}

function getActiveZombies() {
    return activeZombies;
}

function isGameRunning() {
    return !showClippingBounds;
}

function getStatusText() {
    return mydebug.text;
}

function getObjects() {
    return myObjects;
}

function getSpawnZombie() {
    return _spawnZombie;
}

function setSpawnZombie(spawnZombie) {
    _spawnZombie = spawnZombie;
}

function getDropSupplyCreate() {
    return _dropSupplyCreate;
}

function setDropSupplyCreate(dropSupplyCreate) {
    _dropSupplyCreate = dropSupplyCreate;
}

document.addEventListener('keydown',  (event) => {
    const keyName = event.key
    switch(keyName){
        case 'ArrowDown':
        case 's':
        case 'S':
            movedown()
            break
        case 'ArrowUp':
        case 'W':
        case 'w':
            moveup()
            break
        case 'ArrowRight':
        case 'd':
        case 'D':
            moveright()
            break
        case 'ArrowLeft':
        case 'a':
        case 'A':
            moveleft()
            break
        case ' ':
            fireWeapon()
            break
    }
})

document.addEventListener('keyup',  (event) => {
    const keyName = event.key
    switch(keyName){
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'ArrowUp':
        case 'W':
        case 'w':
            clearY()
            break
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'ArrowLeft':
        case 'a':
        case 'A':
            clearX()
            break
    }
})

window.onload = startGame