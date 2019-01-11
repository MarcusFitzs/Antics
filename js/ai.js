var path;
var followers;

function preload ()
{
    // Load in images and sprites
    this.load.image('ai1', 'assets/player.png');
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
    
    ai1 = this.physics.add.sprite(20, 60, 'ai1');

    //  Create the zig-zag path
    path = new Phaser.Curves.Path(-50, 60);

    path.lineTo(580, 60);
    path.lineTo(580, 300);
    path.lineTo(380, 300);
    path.lineTo(380, 140);
    path.lineTo(260, 140);
    path.lineTo(260, 300);
    path.lineTo(140, 300);
    path.lineTo(140, 140);
    path.lineTo(60, 140);
    path.lineTo(60, 400);

    
    //  Create the path followers
    followers = this.add.group();

    for (var i = 0; i < 12; i++)
    {
        var ai1 = followers.create(0, -50, 'ai1');

        ai1.setData('vector', new Phaser.Math.Vector2());

        this.tweens.add({
            targets: ai1,
            z: 1,
            ease: 'Linear',
            duration: 12000,
            repeat: -1,
            delay: i * 500
        });
    }
}

function update (time, delta)
{

    var ai1s = followers.getChildren();

    for (var i = 0; i < ai1s.length; i++)
    {
        var t = ai1s[i].z;
        var vec = ai1s[i].getData('vector');

        //  The vector is updated in-place
        path.getPoint(t, vec);
        
        ai1s[i].setPosition(vec.x, vec.y);

        ai1s[i].setDepth(ai1s[i].y);
    }
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