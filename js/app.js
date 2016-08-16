// Tile
var MessageText ="",
        c_width = 505,
        c_height = 606;

var tile = {"width" : c_width/5,//5
            "height" : (c_height-108)/6,//6
            "y": function(y){
                var tiley = tile.height + y * tile.height;
                return tiley;
            },
            "x": function(x){
                var tilex = x * (tile.width);
                return tilex;
            }
        };

//Random position
function tileRnd(x,y){
    return Math.floor((Math.random() * x) - y)
}

function showMessage(message) {
    ctx.fillStyle = "#000";
    ctx.font = 'bolder 40px Arial';
    ctx.textBaseline = 'bottom';
    ctx.fillText(message, (c_width - ctx.measureText(message).width)/2, c_height/2);
}

//Lives
function showLives() {
    ctx.fillStyle = "#fff";
    ctx.rect(0, 0, 200, 50);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.font = 'bolder 40px Arial';
    ctx.textBaseline = 'bottom';
    ctx.fillText("LIVES: " + player.lives, 0, 50);
}

// Enemies our player must avoid
var Enemy = function(dt, x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.dt = dt;
    this.x = tile.x(x);
    this.y = tile.y(y)-20;
    this.speed = 3;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x+= this.speed*this.dt;

    if (this.x > tile.x(5)){this.x = -tile.x(1)}
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, tile.width, tile.height * (170/83));
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(dt, x, y) {
    this.dt = dt;
    this.x = tile.x(x);
    this.y = tile.y(y)-10;
    this.sprite = 'images/char-cat-girl.png';
    this.lives = 3;
}

Player.prototype.update = function(dt) {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, tile.width, tile.height * (170/83));
    for (var i = player.lives ; i > 0; i-=1){
        ctx.drawImage(Resources.get('images/Heart.png'),
            tile.x(3-i+2) + (tile.width * .25), 0 - tile.height * (170/83) * .1,
            tile.width * .5, tile.height * (170/83) * .5//Where to Place
        );
    }
};

Player.prototype.handleInput = function(keypressed) {
    switch (keypressed){
        case "left":
            this.x-= tile.width;//'left'
            if (this.x <= -tile.width){this.x+= tile.width}
            break;
        case "up":
            this.y-= tile.height;//'up'
            if (this.y <= -tile.height){this.y+= tile.height}
            break;
        case "right":
            this.x+= tile.width;//'right'
            if (this.x > tile.x(4)){this.x-= tile.width}
            break;
        case "down":
            this.y+= tile.height;//'down'
            if (this.y > tile.y(4)){this.y-= tile.height}
            break;
        case "r":
            RestartGame();
            break;
        case "a":
            //tile.height-=1;
            break;
        case "z":
            //tile.height+=1;
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var enemy1 = new Enemy(1, tileRnd(5, 5), 0);
var enemy2 = new Enemy(1, tileRnd(5, 5), 1);
var enemy3 = new Enemy(1, tileRnd(5, 5), 2);
var enemy4 = new Enemy(1, tileRnd(5, 5), 3);

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
        40: 'down',
        82: 'r',
        65: 'a',
        90: 'z'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Collision Detection

function checkCollisions(){
    allEnemies.forEach(function(enemy) {
    var enemyX = Math.round(enemy.x/tile.width);
    var enemyY = Math.round(enemy.y/tile.height);
    var playerX = Math.round(player.x/tile.width);
    var playerY = Math.round(player.y/tile.height);
    if ((enemyY === playerY) && (enemyX === playerX)){
        //console.log("CRASH!!!");
        player.lives-= 1;
        ResetGame();
        if (player.lives===0){
            StopGame();
        }
    }
    });
}

//Restart Game
function StopGame(){
    allEnemies.forEach(function(enemy) {
        enemy.speed = 0;
    });
    MessageText = "GAME OVER!";
}

//Reset Game
function ResetGame(){
    allEnemies.forEach(function(enemy) {
        enemy.x = tile.x(tileRnd(5, 5));
        enemy.speed = 3;
    });
    player.x = tile.x(0);
    player.y = tile.y(4)-10;
}

//Restart Game
function RestartGame(){
    ResetGame();
    player.lives = 3;
    MessageText = "";
}
