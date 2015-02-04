// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
	this.reset_enemy();
	// These two constant variables define the points
	// to measure the relative distance of Player to
	// the enemy. Not set to very far ends,i.e. 0 and 101, 
	// to allow some leeway
	this.TOP_LEFTCORNER = 50;
	this.TOP_RIGHTCORNER = 80;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	if (this.x <= 6*83) {
		this.x = this.x + dt * 100 * this.speed;
	} else {
		this.reset_enemy();
	}
	//console.log(dt);
	
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// start enemy of far left side of screen
// after they have moved across to the right side
Enemy.prototype.reset_enemy = function () {
	// Defines rock rows to place enemies
	var MIN_ROW = 0;
	var MAX_ROW = 2;
	// Defines difficulty level
	var MIN_SPEED = 1;
	var MAX_SPEED = 8;
	// Calculates random rock row to place enemy
	this.row = (Math.floor(Math.random() * (MAX_ROW - MIN_ROW + 1)) + MIN_ROW);
	this.x = -83;	
	this.y = 60 + 83 * this.row;
	// Calculates random speed between MIN and MAX_SPEED
	this.speed = Math.floor(Math.random()*(MAX_SPEED - MIN_SPEED + 1)) + MIN_SPEED;
};
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
	this.sprite = 'images/char-boy.png';
	this.reset_char();
	this.reset_myMovements();
	// Contant variables define the very outter edges of Player .png
	this.TOP_LEFTCORNER = 0;
	this.TOP_RIGHTCORNER = 101;
};

Player.prototype.handleInput = function (key) {
	switch (key) {
		case 'UP':
			if (0 < this.y) {
				this.movement_y = -83;
				this.row = this.row - 1;
			}
			break; 
		case 'DOWN':
			if (5 * 83 > this.y) {
				this.movement_y = 83;
				this.row = this.row + 1;
			}
			break;
		
		case 'RIGHT':
			if (4 * 101 > this.x) {
				this.movement_x = 101;
			}
			break;
		
		case 'LEFT':
			if (0 < this.x) {
				this.movement_x = -101;
			}
			break;
		
		default:
			
	}
};

// updates Player getting ready to re-render
Player.prototype.update = function () {
	this.x = this.x +  this.movement_x;	
	this.y = this.y +  this.movement_y;	
	this.check_winOrDie();
	this.reset_myMovements();
};

// Render or re-render Player
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Replaces character at starting point
Player.prototype.reset_char = function () {
	this.row = 5;
	this.x = 2 * 101;
	this.y = this.row * 83;
};

// Movements are used to redraw player and 
// know where he is on y-axis
Player.prototype.reset_myMovements = function () {
	this.movement_x = 0;
	this.movement_y = 0;
};

// Cycles thru all enemies to extract their attributes
Player.prototype.check_winOrDie = function () {
	allEnemies.forEach(function(enemy) {
		//console.log(this);
		player.check_row(
			enemy.row + 1, 
			enemy.x + enemy.TOP_LEFTCORNER, 
			enemy.x + enemy.TOP_RIGHTCORNER );
	});
};

// Determines very first condition, which row am I on?
Player.prototype.check_row = function ( 
		enemy_row, 
		enemy_top_leftCorner,
	   	enemy_top_rightCorner) {
	if (enemy_row  == player.row ) {
		this.check_sides( 
				enemy_top_leftCorner, 
				enemy_top_rightCorner, 
				this.TOP_LEFTCORNER);
		this.check_sides( 
				enemy_top_leftCorner, 
				enemy_top_rightCorner, 
				this.TOP_RIGHTCORNER);
	} else if(0 == player.row){
		setTimeout(function(){player.reset_char()}, 1000);	
	}	
};

// Determines relative position of Player to enemies
Player.prototype.check_sides = function ( 
		enemy_leftSide, 
		enemy_rightSide, 
		player_sideAdjust ) {
	if ( (enemy_leftSide <=  (this.x + player_sideAdjust)) 
			&& ((this.x + player_sideAdjust) < (enemy_rightSide + player_sideAdjust))) {
		setTimeout(function(){player.reset_char()}, 200);	
	}
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies[0] = new Enemy();
allEnemies[1] = new Enemy();
allEnemies[2] = new Enemy();

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
