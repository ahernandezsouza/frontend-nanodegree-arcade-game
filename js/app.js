// Tile
var tile = {"width" : 101,
            "height" : 63,
            "vpadding" : 10,
            "y": function(y,v){
                var tiley = tile.height + y * (tile.height + tile.vpadding * 2);
                return tiley;
            },
            "x": function(x){
                var tilex = x * (tile.width);
                return tilex;
            }
        };

function showFillText() {
    ctx.fillStyle = "#003300";
    ctx.font = 'bolder 40px Arial san-serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText('GAME OVER', 130, 606/2);
}

function showStrokeGrid() {
    ctx.fillStroke = "#003300";
    ctx.strokeRect(0,50,101,83);

}

// Enemies our player must avoid
var Enemy = function(dt, x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.dt = dt;
    this.x = tile.x(x);
    this.y = tile.y(y);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x+= 1;
    if (this.x > 560){this.x = -100}
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(dt, x, y) {
    this.dt = dt;
    this.x = tile.x(x);
    this.y = 81*5;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function(dt) {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keypressed) {
    switch (keypressed){
        case "left":
            this.x-= 101;//'left'
            if (this.x <= -101){this.x+= 101}
            break;
        case "up":
            this.y-= 83;//'up'
            if (this.y <= -20){this.y+= 83}
            break;
        case "right":
            this.x+= 101;//'right'
            if (this.x > 404){this.x-= 101}
            break;
        case "down":
            this.y+= 83;//'down'
            if (this.y > 470){this.y-= 83}
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var enemy1 = new Enemy(1, Math.floor((Math.random() * 5) - 5), 0);
var enemy2 = new Enemy(1, Math.floor((Math.random() * 5) - 5), 1);
var enemy3 = new Enemy(1, Math.floor((Math.random() * 5) - 5), 2);
var enemy4 = new Enemy(1, Math.floor((Math.random() * 5) - 5), 3);

var allEnemies = [
    enemy1,
    enemy2,
    enemy3,
    enemy4
];

var player = new Player(1, 0, 4);

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
