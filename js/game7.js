var Title = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Title ()
    {
        Phaser.Scene.call(this, { key: 'Title' });
    },

    preload: function ()
    {
        this.load.image('titleBG', 'assets/titleBG.png');
        this.load.image('ButtonBG', 'assets/ButtonBG.png');
        this.load.image('target', 'assets/target.png');
    },

    create: function ()
    {
        this.add.sprite(320, 180, 'titleBG').setAlpha(1);
        ButtonBG = this.physics.add.sprite(320, 180, 'ButtonBG');
        reticle = this.physics.add.sprite(100, 60, 'target');
        
        this.input.on('pointermove', function (pointer) {
            reticle.x = pointer.x;
            reticle.y = pointer.y;
        }, this);
        
        this.input.once('pointerdown', function (event) {

            console.log('From Title to Pause');

            this.scene.start('Pause');

        }, this);
        
        /*if (Phaser.Geom.Intersects.RectangleToRectangle(this.ButtonBG.getBounds(), this.reticle.getBounds())){
        this.input.once('pointerdown', function () {

            console.log('From Title to Pause');

            this.scene.start('Payse');

        }, this);*/
    }

});

var Pause = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Pause ()
    {
        Phaser.Scene.call(this, { key: 'Pause' });
    },

    preload: function ()
    {
        this.load.image('arrow', 'assets/sprites/longarrow.png');
    },

    create: function ()
    {
        this.arrow = this.add.sprite(400, 300, 'arrow').setOrigin(0, 0.5);

        this.input.once('pointerdown', function (event) {

            console.log('From Pause to Level1');

            this.scene.start('Level1');

        }, this);
    },

    update: function (time, delta)
    {
        this.arrow.rotation += 0.01;
    }

});

var Level1 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Level1 ()
    {
        Phaser.Scene.call(this, { key: 'Level1' });
    },

    preload: function ()
    {
        this.load.image('player', 'assets/player.png');
        this.load.image('tower', 'assets/CircleTower.png');
        this.load.image('tower2', 'assets/SquareTower.png');
        this.load.image('background', 'assets/background3.png');
        this.load.image('border', 'assets/border.png');
        this.load.image('archer', 'assets/ArcherFirePix.png');
        this.load.image('cannon', 'assets/Cannon.png');
        this.load.image('strawberry', 'assets/strawberry.png');
    },

    create: function ()
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
        
        // Add player, enemy, reticle, healthpoint sprites
        var player = this.physics.add.sprite(20, 60, 'player');
        tower = this.physics.add.sprite(500, 140, 'tower');
        tower2 = this.physics.add.sprite(460, 220, 'tower2');
        cannon = this.physics.add.sprite(460, 220, 'cannon');
        enemy = this.physics.add.sprite(500, 140, 'archer');
        strawberry = this.physics.add.sprite(60, 340, 'strawberry');
        var reticle = this.physics.add.sprite(100, 60, 'target').setVisible(false);
        
        
        // Set image/sprite properties
        background.setOrigin(0.5, 0.5).setDisplaySize(640, 360);
        player.setOrigin(0.5, 0.5).setCollideWorldBounds(true)//.setDrag(500, 500);
        tower.setOrigin(0.5, 0.5).setCollideWorldBounds(true);
        
        this.input.on('pointermove', function (pointer) {
            reticle.x = pointer.x;
            reticle.y = pointer.y;
        }, this);
        
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, borders);
        
        this.input.on('pointermove', function (pointer)
        {
            this.physics.moveToObject(player, pointer, 200);
        }, this);

        this.input.once('pointerdown', function (event) {

            console.log('From Level1 to Title');

            this.scene.start('Title');

        }, this);
    }
    
    update: function (time, delta)
    {
        player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);
    
    }
    

});

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
    },
    scene: [ Title, Pause, Level1 ]
};

var game = new Phaser.Game(config);
