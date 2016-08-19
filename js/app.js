/* VARIABLES */
var score = 0,
    difficulty = 0,
    c_width = 505, //Canvas Width
    c_height = 606, //Canvas Height
    t_width = [6, 7], //Width in Tiles
    t_height = [7, 8],//Height in Tiles
    d_lives = 3,//Default Lives
    score = 0,
    showLines = [],
    allEnemies = [],
    allGems = [],
    messageLines = {
    "blank": [""],
    "stopGame": ["GAME OVER!","Press Spacebar to Continue"],
    "wonGame": ["YOU WON!","Press Spacebar to Play Again"],
    "selectGame": ["Select Difficulty", "E - Easy Level", "H - Hard Level"]
    },
    colorLines = "none",//Message for Message Zone
    tile = {"width" : function(){return c_width/t_width[difficulty]},// Tile Width in Pixels
            "height" : function(){return c_height/t_height[difficulty]},// Tile Height in Pixels (Game Area)
            "y": function(y){
                return tile.height() + (y * tile.height()); //Convert Pixels to Tiles - Height
            },
            "x": function(x){
                return x * tile.width(); //Convert Pixels to Tiles - Width
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
    this.y = tile.y(y);
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
    ctx.fillStyle = "#fff";
    //ctx.fillRect(this.x, this.y, tile.width(), tile.height() * (170/83));
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - (tile.height()/(tile.height()/170))*.15/*- (tile.height() * (40/171))*/, tile.width(), tile.height()/(tile.height()/170)/* * (170/83)*/);
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
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, tile.width(), (tile.height()/(tile.height()/170)));
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
            if (this.y > tile.y(t_height[difficulty]-3)){this.y-= tile.height()}
            break;
        case "space":
            restartGame();
            break;
        case "e":
            difficulty = 0;
            startGame()
            break;
        case "h":
            difficulty = 1;
            startGame()
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
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, tile.width(), tile.height() * (171/tile.height()) * .73);
};


////////////////////////////////////////////////////////////////////////
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


function instantiateEntities(){

var enemy1 = new Enemy(1, Rnd(0,3), 0);
var enemy2 = new Enemy(1, Rnd(0,t_width[difficulty]), 1);
var enemy3 = new Enemy(1, Rnd(0,t_width[difficulty]), 2);
var enemy4 = new Enemy(1, Rnd(0,2), 3);
var enemy5 = new Enemy(1, Rnd(4,t_width[difficulty]), 0);
var enemy6 = new Enemy(1, Rnd(3,t_width[difficulty]), 3);

allEnemies = [
    enemy1,
    enemy2,
    enemy3,
    enemy4,
    enemy5,
    enemy6
];

var gem1 = new Gem(1, -1);
var gem2 = new Gem(t_width[difficulty]-2, -1);

allGems = [
    gem1,
    gem2
];

}

var player = new Player(1, 0, t_height[difficulty]-3);

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
            if (player.lives<3){player.lives+= 1}
            score += 50;
            resetGame();
//            modal("wonGame",1);
        }
        if ((gemY === playerY) && !(gemX === playerX)){
            resetGame();
        }

        if (player.lives===0){
            modal("stopGame",1);
        }
    });
}

//TODO Set Gems (Appear and Disappear)

//Show Modal
function modal(message,active){
    showLines = messageLines[message];
    colorLines = active;
    if (allEnemies.length !== 0){stopEntities()};
    }

//Clear Screem
function clearScreen() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c_width, c_height);
}

//Show a Message in the middle of the screen
function showMessage() {
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#4D4D4D";
    ctx.fillStyle = "#fff";
    ctx.fillRect(25, 200, (c_width-50)*colorLines, (c_height-350)*colorLines);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "none";
    ctx.fillStyle = "#000";
    ctx.font = 'bolder 30px Arial';
    ctx.textBaseline = 'bottom';
    for (var i = 0 ; i < showLines.length; ++i){
        ctx.fillText(showLines[i], (
            c_width - ctx.measureText(showLines[i]).width)/2,
            (c_height/2) + i*40
            );
    };
}

//Stop Game
function stopEntities(){
    allEnemies.forEach(function(enemy) {
        enemy.speed = 0;
        player.speed = 0;
    });
}


//Reset Game
function resetGame(){
    allEnemies.forEach(function(enemy) {
        enemy.speed = Rnd(3,6);
    });
    player.x = tile.x(0);
    player.y = tile.y(t_height[difficulty]-3)-10;
    player.speed = 1;
}

//Restart Game
function restartGame(){
    resetGame();
    showLines = messageLines["blank"];
    colorLines = 0;
    player.lives = d_lives;
}

//Start Game
function startGame(){
    instantiateEntities();
    resetGame();
    showLines = messageLines["blank"];
    colorLines = 0;
    player.lives = d_lives;
}

//Random integer number between x and y
function Rnd(x,y){
    return Math.floor((Math.random() * (y-x))) + x
}

//Lives
function showLives() {
    ctx.fillStyle = "#000";
    ctx.font = 'bolder ' + (tile.height()/(tile.height()/170)) * .20 +'px Arial';
    ctx.textBaseline = 'bottom';
    ctx.fillText("LIVES: ", 0, 50);
    for (var i = player.lives ; i > 0; i-=1){
        ctx.drawImage(Resources.get('images/Heart.png'),
            75 + tile.x(i)*.5, 0 -  tile.height()/(tile.height()/170) * .1,
            tile.width() * .5, tile.height()/(tile.height()/170) * .45//Where to Place
        );
    }
    ctx.fillStyle = "none";
}

//Lives
function showScore() {
    ctx.fillStyle = "#000";
    ctx.font = 'bolder ' + (tile.height()/(tile.height()/170)) * .20 +'px Arial';
    ctx.textBaseline = 'bottom';
    ctx.fillText("SCORE: "+score, c_width/2, 50);
    ctx.fillStyle = "#fff";
}
