/* VARIABLES */
var score = 0,
    difficulty = 1,
    c_width = 505, //Canvas Width
    c_height = 606, //Canvas Height
    t_width = [5, 6], //Width in Tiles
    t_height = [6, 7],//Height in Tiles
    d_lives = 5,//Default Lives
    messageLines = [""],//Message for Message Zone
    tile = {"width" : function(){return c_width/t_width[difficulty]},// Tile Width in Pixels
            "height" : function(){return (c_height-108)/t_height[difficulty]},// Tile Height in Pixels (Game Area)
            "y": function(y){
                var tiley = tile.height() + y * tile.height();
                return tiley; //Convert Pixels to Tiles - Height
            },
            "x": function(x){
                var tilex = x * tile.width();
                return tilex; //Convert Pixels to Tiles - Width
            }
        };

/* OBJECTS (Enemy and Player) */

/////////////////////////////////////////////////////////////////////

// Enemies our player must avoid
var Enemy = function(dt, x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.dt = dt;
    this.x = tile.x(x);
    this.y = tile.y(y)-20;
    this.speed = Rnd(3,6);
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

    if (this.x > tile.x(t_width[difficulty])){this.x = -tile.x(1)}
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, tile.width(), tile.height() * (170/83));
};

/////////////////////////////////////////////////////////////////////

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(dt, x, y) {
    this.dt = dt;
    this.x = tile.x(x);
    this.y = tile.y(y)-10;
    this.speed = 1;
    this.sprite = 'images/char-cat-girl.png';
    this.lives = d_lives;
}

Player.prototype.update = function(dt) {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, tile.width(), tile.height() * (170/83));
};

Player.prototype.handleInput = function(keypressed) {
    switch (keypressed){
        case "left":
            this.x-= tile.width()*player.speed;//'left'
            if (this.x <= -tile.width()){this.x+= tile.width()}
            break;
        case "up":
            this.y-= tile.height()*player.speed;//'up'
            if (this.y <= -tile.height()){this.y+= tile.height()}
            break;
        case "right":
            this.x+= tile.width()*player.speed;//'right'
            if (this.x > tile.x(t_width[difficulty])){this.x-= tile.width()}
            break;
        case "down":
            this.y+= tile.height()*player.speed;//'down'
            if (this.y > tile.y(t_height[difficulty]-2)){this.y-= tile.height()}
            break;
        case "space":
            restartGame();
            break;
        case "e":
            difficulty = 0;
            restartGame()
            break;
        case "h":
            difficulty = 1;
            restartGame()
            break;
    }
};

////////////////////////////////////////////////////////////////////////

var Gem = function(x, y) {
    this.x = tile.x(x);
    this.y = tile.y(y)+10;
    this.sprite = 'images/Gem-Orange.png';
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, tile.width(), tile.height() * (170/83) * .73);
};


////////////////////////////////////////////////////////////////////////
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var enemy1 = new Enemy(1, Rnd(0,3), 0);
var enemy2 = new Enemy(1, Rnd(0,t_width[difficulty]), 1);
var enemy3 = new Enemy(1, Rnd(0,t_width[difficulty]), 2);
var enemy4 = new Enemy(1, Rnd(0,2), 3);

var enemy5 = new Enemy(1, Rnd(4,t_width[difficulty]), 0);
var enemy6 = new Enemy(1, Rnd(3,t_width[difficulty]), 3);


var allEnemies = [
    enemy1,
    enemy2,
    enemy3,
    enemy4,
    enemy5,
    enemy6
];

var player = new Player(1, 0, t_height[difficulty]-2);

var gem1 = new Gem(1, -1);
var gem2 = new Gem(t_width[difficulty]-2, -1);

var allGems = [
    gem1,
    gem2
];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space',
        69: 'e',
        72: 'h'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

//Collision Detection

function checkCollisions(){
    var playerX = Math.round(player.x/tile.width());
    var playerY = Math.round(player.y/tile.height());
    allEnemies.forEach(function(enemy) {
        var enemyX = Math.round(enemy.x/tile.width());
        var enemyY = Math.round(enemy.y/tile.height());
        if ((enemyY === playerY) && (enemyX === playerX)){
            //console.log("CRASH!!!");
            player.lives-= 1;
            resetGame();
        }
    });
    allGems.forEach(function(gem) {
        var gemX = Math.round(gem.x/tile.width());
        var gemY = Math.round(gem.y/tile.height());
        if ((gemY === playerY) && (gemX === playerX)){
            player.lives+= 1;
            resetGame();
            wonGame();
        }
        else if ((gemY === playerY) && !(gemX === playerX)){
            player.lives-= 1;
            resetGame();
            stopGame();
        }

        if (player.lives===0){
            stopGame();
        }
    });
}

//Set Gems (Appear and Disappear)


//Stop Game
function stopEnemies(){
    allEnemies.forEach(function(enemy) {
        enemy.speed = 0;
        player.speed = 0;
    });
}

function stopGame(){
    stopEnemies();
    messageLines = ["GAME OVER!","Press Spacebar to Continue"];
}

//Won Game
function wonGame(){
    stopEnemies();
    messageLines = ["YOU WON!","Press Spacebar to Play Again"];
}

//Won Game
function selectGame(){
    stopEnemies();
    messageLines = ["Select Difficulty", "E - Easy Level", "H - Hard Level"];
}

//Reset Game
function resetGame(){
    allEnemies.forEach(function(enemy) {
        enemy.speed = Rnd(3,6);
    });
    player.x = tile.x(0);
    player.y = tile.y(t_height[difficulty]-2)-10;
    player.speed = 1;
}

//Restart Game
function restartGame(){
    resetGame();
    messageLines = [""];
    player.lives = d_lives;
}

//Random integer number between x and y
function Rnd(x,y){
    return Math.floor((Math.random() * (y-x))) + x
}

//Show a Message in the middle of the screen

function showMessage() {
    ctx.fillStyle = "#000";
    ctx.font = 'bolder 30px Arial';
    ctx.textBaseline = 'bottom';
    for (var i = 0 ; i < messageLines.length; ++i){
        ctx.fillText(messageLines[i], (c_width - ctx.measureText(messageLines[i]).width)/2, (c_height/2) + i*40);
    };
}

//Lives
function showLives() {
    ctx.fillStyle = "#fff";
    ctx.rect(0, 0, 400, tile.height() * .58);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.font = 'bolder ' + tile.height() * .5 +'px Arial';
    ctx.textBaseline = 'bottom';
    ctx.fillText("LIVES: ", 0, 50);
    for (var i = player.lives ; i > 0; i-=1){
        ctx.drawImage(Resources.get('images/Heart.png'),
            75 + tile.x(i)*.5, 0 - tile.height() * (170/83) * .1,
            tile.width() * .5, tile.height() * (170/83) * .5//Where to Place
        );
    }
}
