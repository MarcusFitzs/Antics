var config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 360,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { n: 0 },
        debug: false
      }
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
                    playerBullets: null,
                    enemyBullets: null,
                    time: 0,
                }
    }
};

var game = new Phaser.Game(config);

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

function preload ()
{
    // Load in images and sprites
    this.load.image('player', 'assets/player.png');
    this.load.image('tower', 'assets/up.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('target', 'assets/reticle.png');
    this.load.image('background', 'assets/background3.png');
    this.load.image('border', 'assets/border.png');
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

    // Add player, enemy, reticle, healthpoint sprites
    player = this.physics.add.sprite(20, 60, 'player');
    enemy = this.physics.add.sprite(470, 100, 'tower');
    reticle = this.physics.add.sprite(800, 700, 'target');
    hp1 = this.add.image(-350, -250, 'target').setScrollFactor(0.5, 0.5);
    hp2 = this.add.image(-300, -250, 'target').setScrollFactor(0.5, 0.5);
    hp3 = this.add.image(-250, -250, 'target').setScrollFactor(0.5, 0.5);

    // Set image/sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(640, 360);
    player.setOrigin(0.5, 0.5).setCollideWorldBounds(true)//.setDrag(500, 500);
    enemy.setOrigin(0.5, 0.5).setCollideWorldBounds(true);
    reticle.setOrigin(0.5, 0.5).setCollideWorldBounds(true);
    hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);

    // Set sprite variables
    player.health = 3;
    enemy.lastFired = 0;

    // Creates object for input with WASD kets
    moveKeys = this.input.keyboard.addKeys({
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'right': Phaser.Input.Keyboard.KeyCodes.D
    });

    // Enables movement of player with WASD keys
    this.input.keyboard.on('keydown_W', function (event) {
        player.setAccelerationY(-800);
    });
    this.input.keyboard.on('keydown_S', function (event) {
        player.setAccelerationY(800);
    });
    this.input.keyboard.on('keydown_A', function (event) {
        player.setAccelerationX(-800);
    });
    this.input.keyboard.on('keydown_D', function (event) {
        player.setAccelerationX(800);
    });

    // Stops player acceleration on uppress of WASD keys
    this.input.keyboard.on('keyup_W', function (event) {
        if (moveKeys['down'].isUp)
            player.setAccelerationY(0);
    });
    this.input.keyboard.on('keyup_S', function (event) {
        if (moveKeys['up'].isUp)
            player.setAccelerationY(0);
    });
    this.input.keyboard.on('keyup_A', function (event) {
        if (moveKeys['right'].isUp)
            player.setAccelerationX(0);
    });
    this.input.keyboard.on('keyup_D', function (event) {
        if (moveKeys['left'].isUp)
            player.setAccelerationX(0);
    });

    // Pointer lock will only work after mousedown
    /*game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
    });

    // Exit pointer lock when Q or escape (by default) is pressed.
    this.input.keyboard.on('keydown_Q', function (event) {
        if (game.input.mouse.locked)
            game.input.mouse.releasePointerLock();
    }, 0, this);
*/
    // Move reticle upon locked pointer move
    this.input.on('pointermove', function (pointer) {
        /*if (this.input.mouse.locked)
        {*/
            reticle.x = pointer.x;
            reticle.y = pointer.y;
        //}
    }, this);
    
    //player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, borders);
    
    var cursor = this.add.image(0, 0, 'up').setVisible(false);
    
    this.input.on('pointerdown', function (pointer)
    {
        console.log("pointer down");
        //cursor.setVisible(false).setPosition(pointer.x, pointer.y);

        this.physics.moveToObject(player, pointer, 80);
    }, this);
    
    
    this.input.on('pointerup', function (pointer)
    {
        console.log("pointer up");
        //cursor.setVisible(false).setPosition(pointer.x, pointer.y);

        this.physics.moveToObject(player, pointer, 0);
    }, this);
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

function enemyFire(enemy, player, time, gameObject)
{
    if (enemy.active === false)
    {
        return;
    }

    if ((time - enemy.lastFired) > 1000)
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

// Ensures sprite speed doesnt exceed maxVelocity while update is called
function constrainVelocity(sprite, maxVelocity)
{
    if (!sprite || !sprite.body)
      return;

    var angle, currVelocitySqr, vx, vy;
    vx = sprite.body.velocity.x;
    vy = sprite.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity)
    {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;
        sprite.body.velocity.x = vx;
        sprite.body.velocity.y = vy;
    }
}

// Ensures reticle does not move offscreen
function constrainReticle(reticle)
{
    var distX = reticle.x-player.x; // X distance between player & reticle
    var distY = reticle.y-player.y; // Y distance between player & reticle

    // Ensures reticle cannot be moved offscreen (player follow)
    if (distX > 800)
        reticle.x = player.x+800;
    else if (distX < -800)
        reticle.x = player.x-800;

    if (distY > 600)
        reticle.y = player.y+600;
    else if (distY < -600)
        reticle.y = player.y-600;
}

function update (time, delta)
{
    // Rotates player to face towards reticle
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);

    // Rotates enemy to face towards player
    enemy.rotation = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);

    // Constrain velocity of player
    constrainVelocity(player, 500);

    // Constrain position of constrainReticle
    constrainReticle(reticle);

    // Make enemy fire
    enemyFire(enemy, player, time, this);
    
    
}
