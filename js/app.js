// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
	this.reset_enemy();
	this.top_leftCorner = 50;
	this.top_rightCorner = 80;
}

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
	
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.reset_enemy = function () {
	var min_column = 0;
	var max_column = 2;
	var min_speed = 1;
	var max_speed = 8;
	this.row = (Math.floor(Math.random() * (max_column - min_column + 1)) + min_column);
	this.x = -83;	
	this.y = 60 + 83 * this.row;
	this.speed = Math.floor(Math.random()*(max_speed - min_speed + 1)) + min_speed;
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
	this.sprite = 'images/char-boy.png';
	this.reset_char();
	this.reset_myMovements();
	this.top_leftCorner = 0;
	this.top_rightCorner = 101;
}

Player.prototype.handleInput = function (key) {
	switch (key) {
		case 'up':
			if (0 < this.y) {
				this.movement_y = -83;
				this.row = this.row - 1;
			}
			break;
		
		case 'down':
			if (5 * 83 > this.y) {
				this.movement_y = 83;
				this.row = this.row + 1;
			}
			break;
		
		case 'right':
			if (4 * 101 > this.x) {
				this.movement_x = 101;
			}
			break;
		
		case 'left':
			if (0 < this.x) {
				this.movement_x = -101;
			}
			break;
		
		default:
			
	}
}
Player.prototype.update = function () {
	this.x = this.x +  this.movement_x;	
	this.y = this.y +  this.movement_y;	
	this.check_winOrDie();
	this.reset_myMovements();
}

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.reset_char = function () {
	this.row = 5;
	this.x = 2 * 101;
	this.y = this.row * 83;
}

Player.prototype.reset_myMovements = function () {
	this.movement_x = 0;
	this.movement_y = 0;
}

Player.prototype.check_winOrDie = function () {
	allEnemies.forEach(function(enemy) {
		player.check_row(
			enemy.row + 1, 
			enemy.x + enemy.top_leftCorner, 
			enemy.x + enemy.top_rightCorner );
	});
}

Player.prototype.check_row = function ( 
		enemy_row, 
		enemy_top_leftCorner,
	   	enemy_top_rightCorner) {
	if (enemy_row  == player.row ) {
		this.check_sides( 
				enemy_top_leftCorner, 
				enemy_top_rightCorner, 
				player.top_leftCorner);
		this.check_sides( 
				enemy_top_leftCorner, 
				enemy_top_rightCorner, 
				player.top_rightCorner);
	} else if(0 == player.row){
		setTimeout(function(){player.reset_char()}, 1000);	
	}	
}

Player.prototype.check_sides = function ( 
		enemy_leftSide, 
		enemy_rightSide, 
		player_sideAdjust ) {
	if ( (enemy_leftSide <=  (player.x + player_sideAdjust)) 
			&& ((player.x + player_sideAdjust) < (enemy_rightSide + player_sideAdjust))) {
		setTimeout(function(){player.reset_char()}, 200);	
	}
}
Player.prototype.check_rightSide = function ( enemy_rightSide ) {
	
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = new Array();
allEnemies[0] = new Enemy();
allEnemies[1] = new Enemy();
allEnemies[2] = new Enemy();

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
