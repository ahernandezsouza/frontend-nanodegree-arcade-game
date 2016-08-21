/* VARIABLES */
//"use strict";

var score = 0,
    C_WIDTH = 505, //Canvas Width
    C_HEIGHT = 606, //Canvas Height
    D_LIVES = 3,//Default Lives
    t_width = [6, 7], //Width in Tiles
    t_height = [7, 8],//Height in Tiles
    difficulty = 0,
    score = 0,// Points
    textLines = [], // Placeholder for Modal
    allEnemies = [], // Placeholder for Enemy Objects
    allGems = [], // Placeholder for Gems
    showLines = "none",//Message for Message Zone
    messageLines = {
    "blank": [""],
    "stopGame": ["GAME OVER!","Press Spacebar to Continue"],
    "wonGame": ["YOU WON!","Press Spacebar to Play Again"],
    "selectGame": ["Select Difficulty", "E - Easy Level", "H - Hard Level"] // Messages for Modal
    },
    tile = {"width" : function(){return C_WIDTH/t_width[difficulty];},// Tile Width in Pixels, divide canvas width by tile width (by difficulty)
            "height" : function(){return C_HEIGHT/t_height[difficulty];},// Tile Height in Pixels (Game Area), divide canvas height by tile height (by difficulty)
            "y": function(y){
                return (1 + y) * tile.height(); //Convert Pixels to Tiles - Height
            },
            "x": function(x){
                return x * tile.width(); //Convert Pixels to Tiles - Width
            }
        };

/* OBJECTS (Enemy, Player and Gem) */

/////////////////////////////////////////////////////////////////////

// Enemies our player must avoid
var Enemy = function(dt, x, y) {
    this.dt = dt;
    this.x = tile.x(x); //convert tile x # to pixels
    this.y = tile.y(y); //convert tile y # to pixels
    this.speed = Rnd(3,6); //set speed between 3 and 6 (random)
    this.sprite = 'images/enemy-bug.png'; // select image for the sprite
};

Enemy.prototype.update = function() {
    this.x+= this.speed*this.dt; //regulates speed accordng to dt
    if (this.x > tile.x(t_width[difficulty])){this.x = -tile.x(1);} //
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.fillStyle = "#fff";
    ctx.drawImage(Resources.get(this.sprite), // get Enemy sprite
        this.x, this.y - (tile.height()/(tile.height()/170))*0.15, // set at x pixels, adjusting height by 15% to center in tile
        tile.width(), tile.height()/(tile.height()/170) // scale at tile width and scale tile height by difficulty level
    );
};

/////////////////////////////////////////////////////////////////////

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = tile.x(x); // set pixels by x tile
    this.y = tile.y(y)-10; // set pixels by y tile
    this.speed = 1; // set Player speed to control if the player moves or not
    this.sprite = 'images/char-cat-girl.png'; //set Player image
    this.lives = D_LIVES; // set initial default number of lives
}

Player.prototype.update = function() {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),
        this.x, this.y, tile.width(), (tile.height()/(tile.height()/170))); //adjust scale to difficulty
};

Player.prototype.handleInput = function(keypressed) {
    switch (keypressed){
        case "left":
            this.x-= tile.width()*this.speed;//'left'
            if (this.x <= -tile.width()){this.x+= tile.width();}
            break;
        case "up":
            this.y-= tile.height()*this.speed;//'up'
            if (this.y <= -tile.height()){this.y+= tile.height();}
            break;
        case "right":
            this.x+= tile.width()*this.speed;//'right'
            if (this.x > tile.x(t_width[difficulty])){this.x-= tile.width();}
            break;
        case "down":
            this.y+= tile.height()*this.speed;//'down'
            if (this.y > tile.y(t_height[difficulty]-3)){this.y-= tile.height();}
            break;
        case "space":
            restartGame(); // restart game
            break;
        case "e":
            difficulty = 0;
            startGame(); // set to easy
            break;
        case "h":
            difficulty = 1; // set to hard
            startGame();
            break;
    }
};


////////////////////////////////////////////////////////////////////////

var Gem = function(x, y) {
    this.x = tile.x(x); // set x for Gem
    this.y = tile.y(y)+10; // set y for Gem
    this.sprite = 'images/Gem-Orange.png'; // set sprite for Gem
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),
        this.x, this.y, //set gem position
        tile.width(), tile.height() * (171/tile.height()) * 0.73); //scale gem to difficulty level
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

// Instantiate Enemy Objects

allEnemies = [
    enemy1,
    enemy2,
    enemy3,
    enemy4,
    enemy5,
    enemy6
];

// Place enemies in Array

var gem1 = new Gem(1, -1);
var gem2 = new Gem(t_width[difficulty]-2, -1);

// Instantiate Gems

allGems = [
    gem1,
    gem2
];

// Place gems in Array

}

var player = new Player(1, 0, t_height[difficulty]-3);

// Instantiate Player

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
    allEnemies.forEach(function(enemy) { //Collision between Enemies
        var enemyX = Math.round(enemy.x/tile.width());
        var enemyY = Math.round(enemy.y/tile.height());
        if ((enemyY === playerY) && (enemyX === playerX)){
           player.lives-= 1;
            resetGame();
        }
    });
    allGems.forEach(function(gem) {
        var gemX = Math.round(gem.x/tile.width());
        var gemY = Math.round(gem.y/tile.height());
        if ((gemY === playerY) && (gemX === playerX)){ //Collision between Gems
            if (player.lives<3){player.lives+= 1;} // You touch a gem you get an additional life
            score += 50;// Add points
            if (score === 350) {modal("wonGame",1)};  //You get to 350, you win the game
            resetGame(); //want to play again?
        }
        if ((gemY === playerY) && (gemX !== playerX)){
            resetGame(); // Touch water restart run for gems
        }
    });

    if (player.lives===0){
        modal("stopGame",1); // No lives you are out of luck
    }
}

//Show Modal
function modal(message,active){
    textLines = messageLines[message]; //set text to show
    showLines = active; //turn on modal
    if (allEnemies.length !== 0){stopEntities();} // stop everything to show the message
    }

//Clear Screen
function clearScreen() {
    ctx.fillStyle = "#fff"; // clear screen on each rendering, so we don't leave trash behind
    ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);
}

//Show a Message in the middle of the screen
function showMessage() {
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#4D4D4D";
    ctx.fillStyle = "#fff";
    ctx.fillRect(25, 200, (C_WIDTH-50)*showLines, (C_HEIGHT-350)*showLines); //Define Modal rectangle with shadow
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "none";//erease definition so it doesn't break anything
    ctx.fillStyle = "#000";
    ctx.font = 'bolder 30px Arial';
    ctx.textBaseline = 'bottom'; // Definition for the text
    for (var i = 0 ; i < textLines.length; ++i){
        ctx.fillText(textLines[i], ( //draw message text
            C_WIDTH - ctx.measureText(textLines[i]).width)/2, // set line by line
            (C_HEIGHT/2) + i*40 //
            );
    }
}

//Stop Game
function stopEntities(){
    allEnemies.forEach(function(enemy) {
        enemy.speed = 0;
        player.speed = 0;
    }); //Stop Entity movement
}


//Reset Game
function resetGame(){
    allEnemies.forEach(function(enemy) {
        enemy.speed = Rnd(3,6);
    });
    player.x = tile.x(0);
    player.y = tile.y(t_height[difficulty]-3)-10;
    player.speed = 1; // Reset Position each time the player dies
}

//Restart Game
function restartGame(){
    resetGame();
    textLines = messageLines.blank;
    showLines = 0;
    player.lives = D_LIVES;
    score = 0; // Setup for new game
}

//Start Game
function startGame(){
    instantiateEntities();
    resetGame();
    textLines = messageLines.blank;
    showLines = 0;
    player.lives = D_LIVES; // Start Game, first run
}

//Random integer number between x and y
function Rnd(x,y){
    return Math.floor((Math.random() * (y-x))) + x;
}

//Lives
function showLives() { //Display Lives
    ctx.fillStyle = "#000";
    ctx.font = 'bolder ' + (tile.height()/(tile.height()/170)) * 0.20 +'px Arial';
    ctx.textBaseline = 'bottom';
    ctx.fillText("LIVES: ", 0, 50);
    for (var i = player.lives ; i > 0; i-=1){ //Display Hearts representing Lives
        ctx.drawImage(Resources.get('images/Heart.png'),
            75 + tile.x(i)*0.5, 0 -  tile.height()/(tile.height()/170) * 0.1,
            tile.width() * 0.5, tile.height()/(tile.height()/170) * 0.45//Where to Place
        );
    }
    ctx.fillStyle = "none";
}

//Score
function showScore() { //Display Score
    ctx.fillStyle = "#000";
    ctx.font = 'bolder ' + (tile.height()/(tile.height()/170)) * 0.20 +'px Arial';
    ctx.textBaseline = 'bottom';
    ctx.fillText("SCORE: "+score, C_WIDTH/2, 50);
    ctx.fillStyle = "#fff";
}
