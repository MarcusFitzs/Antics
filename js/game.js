// create a new scene
let gameScene = new Phaser.Scene('Game');

// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: 640,
    height: 360,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { n: 300 }
        }
    },
    scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);


var score = 0;
var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    // Fires a bullet from the player to the reticle
    fire: function (tower, player)
    {
        this.setPosition(tower.x, tower.y); // Initial position
        this.direction = Math.atan( (player.x-this.x) / (player.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (player.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = tower.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

gameScene.init = function() {
    this.playerSpeed = 5;
}


// load assets
gameScene.preload = function(){
  // load images
    this.load.image('background', 'assets/background3.png'); 
    this.load.image('background2', 'assets/background4.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('up', 'assets/up.png');
    this.load.image('tower', 'assets/down.png');
    this.load.image('left', 'assets/left.png');
    this.load.image('right', 'assets/right.png');
    this.load.image('bullet', 'assets/bullet.png');
};


// called once after the preload ends
gameScene.create = function() {
    // create bg sprite
    let bg = this.add.sprite(0, 0, 'background');
    let bg2 = this.add.sprite(0, 0, 'background2');

    // change the origin to the top-left corner
    bg.setOrigin(0,0);
    bg2.setOrigin(0,0);
    
    var player = this.physics.add.image(25, 50, 'player');
    var cursor = this.add.image(0, 0, 'up').setVisible(false);
    var tower = this.add.image(470,100, 'tower');
    

    this.input.on('pointermove', function (pointer)
    {
        cursor.setVisible(false).setPosition(pointer.x, pointer.y);

        this.physics.moveToObject(player, pointer, 80);
    }, this);
    
    towerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    
};


function towerFire(tower, player, time, gameObject)
{
    if ((time - tower.lastFired) > 1000)
    {
        tower.lastFired = time;

        // Get bullet from bullets group
        var bullet = towerBullets.get().setActive(true).setVisible(true);

        if (bullet)
        {
            bullet.fire(tower, player);
            // Add collider between bullet and player
            /*gameObject.physics.add.collider(player, bullet, playerHitCallback);*/
        }
    }
}

// this is called up to 60 times per second
function update() {
    // Rotates player to face towards reticle
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, cursor.x, cursor.y);
    
    // Make tower fire
    towerFire(tower, player, time, this);
}





// end the game
gameScene.gameOver = function() {
 
    // restart the scene
    this.scene.restart();
}


