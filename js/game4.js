//import PauseScene from 'pauseScene';

//var pauseScene = new PauseScene();
//game.scene.add('PauseScene', pauseScene)

//let gameScene = new Phaser.Scene('Game');

let Bullet = new Phaser.Class({

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
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
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

let Bomb = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bomb Constructor
    function Bomb (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bomb');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    // Fires a bomb from the player to the reticle
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of bomb to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bomb with shooters rotation
        this.born = 0; // Time since new bomb spawned
    },

    // Updates the position of the bomb each cycle
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


function preload ()
{
    // Load in images and sprites
    this.load.image('player', 'assets/player.png');
    this.load.image('tower', 'assets/CircleTower.png');
    this.load.image('tower2', 'assets/SquareTower.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('bomb', 'assets/Bomb.png');
    this.load.image('background', 'assets/background3.png');
    this.load.image('border', 'assets/border.png');
    this.load.image('range', 'assets/Range.png');
    this.load.image('archer', 'assets/ArcherFirePix.png');
}

function create ()
{
    // Set world bounds
    this.physics.world.setBounds(0, 0, 640, 360);
    
    borders = this.physics.add.staticGroup();
    
    // Add the background map and the borders (refreshBody for scale collision adjustment)
    var background = this.add.image(320, 180, 'background');
    borders.create(320, 20, 'border').setScale(16,1).refreshBody();
    borders.create(620, 180, 'border').setScale(1,7).refreshBody();
    borders.create(360, 340, 'border').setScale(14,1).refreshBody();
    borders.create(20, 240, 'border').setScale(1,6).refreshBody();
    borders.create(280, 100, 'border').setScale(14,1).refreshBody();
    borders.create(480, 200, 'border').setScale(4,4).refreshBody();
    borders.create(320, 240, 'border').setScale(2,4).refreshBody();
    borders.create(200, 200, 'border').setScale(2,4).refreshBody();
    borders.create(100, 240, 'border').setScale(1,4).refreshBody();

    // Add group for Bullet objects
    enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    tower2Bombs = this.physics.add.group({ classType: Bomb, runChildUpdate: true });

    // Add player, enemy, reticle, healthpoint sprites
    player = this.physics.add.sprite(20, 60, 'player');
    range = this.physics.add.sprite(500, 140, 'range').setVisible(false);
    tower = this.physics.add.sprite(500, 140, 'tower');
    tower2 = this.physics.add.sprite(460, 220, 'tower2');
    enemy = this.physics.add.sprite(500, 140, 'archer');
    reticle = this.physics.add.sprite(100, 60, 'target').setVisible(false);
    hp1 = this.add.image(-350, -250, 'target').setScrollFactor(0.5, 0.5);
    hp2 = this.add.image(-300, -250, 'target').setScrollFactor(0.5, 0.5);
    hp3 = this.add.image(-250, -250, 'target').setScrollFactor(0.5, 0.5);

    // Set image/sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(640, 360);
    player.setOrigin(0.5, 0.5).setCollideWorldBounds(true)//.setDrag(500, 500);
    tower.setOrigin(0.5, 0.5).setCollideWorldBounds(true);
    reticle.setOrigin(0.5, 0.5).setCollideWorldBounds(true);
    hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);

    // Set sprite variables
    player.health = 3;
    enemy.lastFired = 0;
    tower2.lastFired = 0;

    this.input.on('pointermove', function (pointer) {
        reticle.x = pointer.x;
        reticle.y = pointer.y;
    }, this);
    
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, borders);
    
    // start moving when pointer is down
    this.input.on('pointerdown', function (pointer)
    {
        console.log("pointer down");

        this.physics.moveToObject(player, pointer, 80);
    }, this);
    
    // stop moving when pointer is up
    this.input.on('pointerup', function (pointer)
    {
        console.log("pointer up");

        this.physics.moveToObject(player, pointer, 0);
    }, this);
    
    // udate the direction of movement when the mouse moves (cant get it to work only when pointer is down at the moment)
    this.input.on('pointermove', function (pointer)
    {
        this.physics.moveToObject(player, pointer, 80);
    }, this);
    
    // Creates object for input with WASD kets
    moveKeys = this.input.keyboard.addKeys({
        'esc': Phaser.Input.Keyboard.KeyCodes.ESC,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
    });
    
    this.input.keyboard.on('keydown_ESC', function (event) {
        console.log('ESC key pressed');
        //this.scene.launch('PauseScene')
        //this.scene.pause();
    });
    
}

function playerHitCallback(playerHit, bulletHit)
{
    // Reduce health of player\
    if (bulletHit.active === true && playerHit.active === true)
    {
        playerHit.health = playerHit.health - 1;
        //console.log("Player hp: ", playerHit.health);

        // Kill hp sprites and kill player if health <= 0
        if (playerHit.health == 2)
        {
            hp3.destroy();
        }
        else if (playerHit.health == 1)
        {
            hp2.destroy();
        }
        else
        {
            hp1.destroy();
            // player.destroy();
            // Game over state should execute here
        }

        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
    }
}

// arrow fire
function enemyFire(enemy, player, time, gameObject)
{
    if (enemy.active === false)
    {
        return;
    }

    // Tower fires if it hasn't fired in a certain ammount of time and if within range
    if ((time - enemy.lastFired) > 1000 && Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.range.getBounds()))
    {
        enemy.lastFired = time;

        // Get bullet from bullets group
        var bullet = enemyBullets.get().setActive(true).setVisible(true);

        if (bullet)
        {
            bullet.fire(enemy, player);
            // Add collider between bullet and player
            gameObject.physics.add.collider(player, bullet, playerHitCallback);
        }
    }
}
// bomb fire
function tower2Fire(tower2, player, time, gameObject)
{
    if (tower2.active === false)
    {
        return;
    }

    // Tower fires if it hasn't fired in a certain ammount of time and if within range
    if ((time - tower2.lastFired) > 3000)
    {
        tower2.lastFired = time;

        // Get bomb from bombs group
        var bomb = tower2Bombs.get().setActive(true).setVisible(true);

        if (bomb)
        {
            bomb.fire(tower2, player);
            // Add collider between bullet and player
            gameObject.physics.add.collider(player, bomb, playerHitCallback);
        }
    }
}
function update (time, delta)
{
    // Rotates player to face towards reticle
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);

    // Rotates enemy to face towards player
    enemy.rotation = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);

    // Make enemy fire
    enemyFire(enemy, player, time, this);
    tower2Fire(tower2, player, time, this);
}


let config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 360,
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            player: null,
            healthpoints: null,
            reticle: null,
            moveKeys: null,
            enemyBullets: null,
            tower2Bombs: null,
            time: 0,
        }
    }
};

let game = new Phaser.Game(config);