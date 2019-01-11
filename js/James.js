let menuScene = new Phaser.Scene('Menu');
let gameScene = new Phaser.Scene('Game');
let winScene = new Phaser.Scene('Win');



var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
    scene: [menuScene, gameScene, winScene]
    
};

var game = new Phaser.Game(config);
var keysCollected = 0;
var switchOneOn = false;
var switchTwoOn = false;
var keyText;
var seconds = 0;
var frames = 0;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var mute = false;

winScene.preload = function ()
{
  this.load.image('win', 'assets/images/win.png');
  this.load.image('retryButton', 'assets/images/retryButton.png');
  this.load.audio('winMusic', 'assets/MP3/winMusic.mp3')
  this.load.spritesheet('muteButton','assets/images/muteSpriteSheet.png', {frameWidth: 32, frameHeight: 32});
  
}

winScene.create = function ()
{
  this.add.image(0, 0, 'win').setOrigin(0).setScrollFactor(1);
  this.anims.create({key:'mute',frames:[{key:'muteButton', frame: 1}],frameRate: 20});
  this.anims.create({key:'loud',frames:[{key:'muteButton', frame: 0}],frameRate: 20});
    
  this.muteButton = this.physics.add.sprite(1820, 100,'muteButton');
  this.muteButton.setScale(4);
    this.muteButton.setInteractive();
    this.muteButton.on('pointerup', function(){
        if(mute==false){
            this.winMusic.pause();
            this.muteButton.anims.play('mute');
            mute=true;
        }else if(mute==true){
            this.winMusic.resume();
            this.muteButton.anims.play('loud');
            mute=false;
        }
            }, this);
    
  this.winMusic = this.sound.add('winMusic');
  this.winMusic.play();
  this.winMusic.setLoop(true);
  this.button = this.add.image(1300, 900, 'retryButton');
  this.button.setInteractive();
  this.button.on('pointerdown', function(){
            this.winMusic.destroy();
            this.scene.start(menuScene);              
            }, this);
  
  
  timeText = this.add.text(850, 540, 'YOUR TIME WAS: '+seconds+'s', { fontSize: '80px', fill: '#FF0000' });

  //reset variables for next game
  keysCollected = 0;
  seconds = 0;
}

menuScene.preload = function ()
{
  this.load.image('menu', 'assets/images/menu.png');
  this.load.image('startButton', 'assets/images/startButton.png');
  this.load.audio('gameMusic', 'assets/MP3/gameMusic.mp3');
    
}

menuScene.create = function ()
{
  this.add.image(0, 0, 'menu').setOrigin(0).setScrollFactor(1);
  this.button = this.add.image(1920/2, 900, 'startButton');
  this.button.setInteractive();
  this.button.on('pointerdown', () => this.scene.start(gameScene));
  this.resize();
  
}

//resize for device
menuScene.resize = function () {
    var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
 
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
    }

gameScene.preload = function ()
{
    
    //load images and Animations 
    this.load.spritesheet('player','assets/images/goblinSpriteSheet.png', {frameWidth: 38, frameHeight: 38});
    this.load.spritesheet('muteButton','assets/images/muteSpriteSheet.png', {frameWidth: 32, frameHeight: 32});
    
    this.load.image('map', 'assets/images/PilferFullMapBG.png');
    //this.load.image('player', 'assets/images/tempGob.png');
    
    this.load.image('door', 'assets/images/gate.png');
    this.load.image('key', 'assets/images/key32.png');
    this.load.image('loot', 'assets/images/loots.png');
    this.load.image('brokenWall', 'assets/images/brokenWall.png');
    this.load.image('boulder', 'assets/images/boulder.png');
    this.load.image('switch', 'assets/images/switch.png');
    this.load.image('empty', 'assets/images/empty.png');
    this.load.image('emptyH', 'assets/images/emptyH.png');
    
    //UI Elements
    this.load.image('optionsButton', 'assets/images/optionsButton.png');
    this.load.image('leftButton', 'assets/images/leftButton.png');
    this.load.image('rightButton', 'assets/images/rightButton.png');
    this.load.image('upButton', 'assets/images/upButton.png');
    this.load.image('downButton', 'assets/images/downButton.png');
    
    //load sounds
    this.load.audio('doorUnlock', 'assets/MP3/doorUnlock.mp3');
    this.load.audio('takeDamage', 'assets/MP3/takeDamage.mp3');
    this.load.audio('keyCollect', 'assets/MP3/keyCollect.mp3');
    this.load.audio('gameMusic', 'assets/MP3/gameMusic.mp3');
    this.load.audio('winMusic', 'assets/MP3/winMusic.mp3');
    
   
    
    //loading all wall shapes
    this.load.image('1wall', 'assets/images/1wall.png');
    this.load.image('3wallH', 'assets/images/3wallH.png');
    this.load.image('5wallV', 'assets/images/5wallV.png');
    this.load.image('5wallH', 'assets/images/5wallH.png');
    this.load.image('4wallV', 'assets/images/4wallV.png');
    this.load.image('10wallV', 'assets/images/10wallV.png');
    this.load.image('18wallH', 'assets/images/18wallH.png');
    this.load.image('7wallH', 'assets/images/7wallH.png');
    this.load.image('7wallHGrass', 'assets/images/7wallHGrass.png');
    this.load.image('menu', 'assets/images/menu.png');
    //this.load.image('walls', 'assets/images/PilferFullMapWalls.png');
    
    
}

gameScene.create = function ()
{
        
    //create camera and background map
    this.cameras.main.setBounds(-1000, 0, 4000, 4000);
    this.add.image(0, 0, 'map').setOrigin(0).setScrollFactor(1);
    
        //define animation frames
        this.anims.create({key:'right',frames:[{key:'player', frame: 3}],frameRate: 20});
        this.anims.create({key:'down',frames:[{key:'player', frame: 0}],frameRate: 20});
        this.anims.create({key:'left',frames:[{key:'player', frame: 2}],frameRate: 20});
        this.anims.create({key:'up',frames:[{key:'player', frame: 1}],frameRate: 20});
    
        this.anims.create({key:'mute',frames:[{key:'muteButton', frame: 1}],frameRate: 20});
        this.anims.create({key:'loud',frames:[{key:'muteButton', frame: 0}],frameRate: 20});
    
    //this.walls = this.physics.add.image(0, 0, 'walls').setOrigin(0).setScrollFactor(1);
    //due to phaser arcade not having polygonal collision detection. the complex geometry of the walls must be broken down
  
    //hidden room
    this.roomWall = this.physics.add.image(2224, 640, '4wallV');
    this.roomWall2 = this.physics.add.image(2096, 640, '4wallV');
    this.roomWall3 = this.physics.add.image(2128, 688, '1wall');
    this.roomWall4 = this.physics.add.image(2192, 688, '1wall');
    this.roomWall5 = this.physics.add.image(2161, 560, '5wallH');
    
    
    //creating walls
    this.fiveWall = this.physics.add.image(1105, 1455, '5wallV');
    this.fiveWall2 = this.physics.add.image(1200, 1455, '5wallV');
    this.fiveWall3 = this.physics.add.image(1105, 1039, '5wallV');
    this.fiveWall4 = this.physics.add.image(1200, 1039, '5wallV');
    this.fourWall = this.physics.add.image(848, 1344, '4wallV');
    this.fourWall2 = this.physics.add.image(848, 1152, '4wallV');
    this.fourWall3 = this.physics.add.image(721, 1344, '4wallV');
    this.fourWall4 = this.physics.add.image(721, 1152, '4wallV');
    this.fourWall5 = this.physics.add.image(1584, 1344, '4wallV');
    this.fourWall6 = this.physics.add.image(1584, 1152, '4wallV');
    this.fourWall7 = this.physics.add.image(1457, 1344, '4wallV');
    this.fourWall8 = this.physics.add.image(1457, 1152, '4wallV');
    this.tenWall = this.physics.add.image(848, 1664, '10wallV');
    this.tenWall2 = this.physics.add.image(1457, 1664, '10wallV');
    this.tenWall3 = this.physics.add.image(848.25, 832, '10wallV');
    this.tenWall4 = this.physics.add.image(1456, 832, '10wallV');
    this.tenWall5 = this.physics.add.image(112, 1248, '10wallV');
    this.tenWall6 = this.physics.add.image(2192, 1248, '10wallV');
    this.eightWall = this.physics.add.image(1152.5, 1808, '18wallH');
    this.eightWall2 = this.physics.add.image(1152, 688, '18wallH');
    this.eightWall3 = this.physics.add.image(417, 1392, '18wallH');
    this.eightWall4 = this.physics.add.image(417, 1104, '18wallH');
    this.eightWall5 = this.physics.add.image(1888, 1392, '18wallH');
    this.eightWall6 = this.physics.add.image(1888, 1104, '18wallH');
    this.sevenGWall = this.physics.add.image(976, 1520, '7wallHGrass');
    this.sevenGWall2 = this.physics.add.image(1328, 1520, '7wallHGrass');
    this.sevenGWall3 = this.physics.add.image(976, 1103, '7wallHGrass');
    this.sevenGWall4 = this.physics.add.image(1328, 1103, '7wallHGrass');
    this.sevenWall = this.physics.add.image(976, 1392, '7wallH');
    this.sevenWall2 = this.physics.add.image(1328, 976, '7wallH');
    this.sevenWall3 = this.physics.add.image(976, 976, '7wallH');
    this.sevenWall4 = this.physics.add.image(1328, 1392, '7wallH');
    this.threeWall = this.physics.add.image(785, 1200, '3wallH');
    this.threeWall2 = this.physics.add.image(785, 1296, '3wallH');
    this.threeWall3 = this.physics.add.image(1520, 1200, '3wallH');
    this.threeWall4 = this.physics.add.image(1520, 1296, '3wallH');
    
    //adds cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();
  
    //physics objects   
    this.door = this.physics.add.image(1152, 1089, 'door');
    this.empty = this.physics.add.image(1152, 832, 'empty');
    this.empty2 = this.physics.add.image(1329, 944, 'empty');
    this.empty3 = this.physics.add.image(960, 944, 'empty');
    this.empty4 = this.physics.add.image(1329, 720, 'empty');
    this.empty5 = this.physics.add.image(960, 720, 'empty');
    this.empty6 = this.physics.add.image(1424, 832, 'emptyH');
    this.empty7 = this.physics.add.image(880, 832, 'emptyH');
    this.key1 = this.physics.add.image(0, 0, 'key');
    this.key2 = this.physics.add.image(2160, 600, 'key');
    this.key3 = this.physics.add.image(1152, 1160, 'key');
    this.loot = this.physics.add.image(1152, 740, 'loot');
    this.brokenWall = this.physics.add.image(2120, 1105, 'brokenWall');
    this.brokenWall2 = this.physics.add.image(2160, 720, 'brokenWall');
    this.loot.setScale(0.05);
    this.switch = this.physics.add.image(144, 1136, 'switch');
    this.switch.setScale(2);
    this.switch2 = this.physics.add.image(144, 1360, 'switch');
    this.switch2.setScale(2);
    this.switch3 = this.physics.add.image(672, 1246, 'switch');
    this.switch3.setScale(4);
    this.boulder = this.physics.add.image(500, 1236, 'boulder');
    this.boulder.setScale(2);
    this.boulder2 = this.physics.add.image(500, 1295, 'boulder');
    this.boulder2.setScale(2);
    keyText = this.add.text(1075, 1008, 'Keys:0', { fontSize: '32px', fill: '#FF0000' });
    
    //add UI elements
    this.muteButton = this.physics.add.sprite(1454, 1485,'muteButton');
    this.muteButton.setInteractive();
    this.muteButton.on('pointerup', function(){
        if(mute==false){
            this.gameMusic.pause();
            this.keyCollect.setMute(true);
            this.doorUnlock.setMute(true);
            this.takeDamage.setMute(true);
            this.muteButton.anims.play('mute');
            mute=true;
        }else if(mute==true){
            this.gameMusic.resume();
            this.keyCollect.setMute(false);
            this.doorUnlock.setMute(false);
            this.takeDamage.setMute(false);
            this.muteButton.anims.play('loud');
            mute=false;
        }
            }, this);

    this.optionsButton = this.physics.add.image(850, 1485, 'optionsButton');
    this.optionsButton.setInteractive();
    this.optionsButton.on('pointerdown', function(){
            this.gameMusic.destroy();
            this.scene.start(menuScene);               
            }, this);
    
    this.leftButton = this.physics.add.image(990, 1685, 'leftButton');
    this.leftButton.setScale(2.5);
    this.leftButton.setInteractive();
    
    this.rightButton = this.physics.add.image(1090, 1685, 'rightButton');
    this.rightButton.setScale(2.5);
    this.rightButton.setInteractive();
    
    this.upButton = this.physics.add.image(1040, 1735, 'upButton');
    this.upButton.setScale(2.5);
    this.upButton.setInteractive();
    
    this.downButton = this.physics.add.image(1040, 1635, 'downButton');
    this.downButton.setScale(2.5);
    this.downButton.setInteractive();
    

    
    //create player
    this.player = this.physics.add.sprite(1152, 1645,'player');
    this.player.setScale(0.88);
    
    //create sound
    this.doorUnlock = this.sound.add('doorUnlock');
    this.takeDamage = this.sound.add('takeDamage');
    this.keyCollect = this.sound.add('keyCollect');
    this.gameMusic = this.sound.add('gameMusic');
    this.gameMusic.play();
    this.gameMusic.setLoop(true);
    
    //camera settings
    this.cameras.main.startFollow(this.player, true, 0.80, 0.80);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setZoom(3);
    
    //collisions & immovables
    this.physics.add.collider(this.boulder, this.player);
    this.physics.add.collider(this.boulder, this.boulder2);
    this.physics.add.collider(this.boulder2, this.player);
    this.physics.add.collider(this.boulder2, this.boulder);
    this.physics.add.collider(this.boulder, this.eightWall3);
    this.physics.add.collider(this.boulder, this.eightWall4);
    this.physics.add.collider(this.boulder, this.tenWall5);
    this.physics.add.collider(this.boulder, this.fourWall3);
    this.physics.add.collider(this.boulder, this.fourWall4);
    this.physics.add.collider(this.boulder2, this.eightWall3);
    this.physics.add.collider(this.boulder2, this.eightWall4);
    this.physics.add.collider(this.boulder2, this.tenWall5);
    this.physics.add.collider(this.boulder2, this.fourWall3);
    this.physics.add.collider(this.boulder2, this.fourWall4);
    this.physics.add.collider(this.fiveWall, this.player);
    this.physics.add.collider(this.fiveWall2, this.player);
    this.physics.add.collider(this.fiveWall3, this.player);
    this.physics.add.collider(this.fiveWall4, this.player);
    this.physics.add.collider(this.fourWall, this.player);
    this.physics.add.collider(this.fourWall2, this.player);
    this.physics.add.collider(this.fourWall3, this.player);
    this.physics.add.collider(this.fourWall4, this.player);
    this.physics.add.collider(this.fourWall5, this.player);
    this.physics.add.collider(this.fourWall6, this.player);
    this.physics.add.collider(this.fourWall7, this.player);
    this.physics.add.collider(this.fourWall8, this.player);
    this.physics.add.collider(this.tenWall, this.player);
    this.physics.add.collider(this.tenWall2, this.player);
    this.physics.add.collider(this.tenWall3, this.player);
    this.physics.add.collider(this.tenWall4, this.player);
    this.physics.add.collider(this.tenWall5, this.player);
    this.physics.add.collider(this.tenWall6, this.player);
    this.physics.add.collider(this.eightWall, this.player);
    this.physics.add.collider(this.eightWall2, this.player);
    this.physics.add.collider(this.eightWall3, this.player);
    this.physics.add.collider(this.eightWall4, this.player);
    this.physics.add.collider(this.eightWall5, this.player);
    this.physics.add.collider(this.eightWall6, this.player);
    this.physics.add.collider(this.sevenGWall, this.player);
    this.physics.add.collider(this.sevenGWall2, this.player);
    this.physics.add.collider(this.sevenGWall3, this.player);
    this.physics.add.collider(this.sevenGWall4, this.player);
    this.physics.add.collider(this.sevenWall, this.player);
    this.physics.add.collider(this.sevenWall2, this.player);
    this.physics.add.collider(this.sevenWall3, this.player);
    this.physics.add.collider(this.sevenWall4, this.player);
    this.physics.add.collider(this.threeWall, this.player);
    this.physics.add.collider(this.threeWall2, this.player);
    this.physics.add.collider(this.threeWall3, this.player);
    this.physics.add.collider(this.threeWall4, this.player);
    this.physics.add.collider(this.roomWall, this.player);
    this.physics.add.collider(this.roomWall2, this.player);
    //this.physics.add.collider(this.roomWall3, this.player);
    //this.physics.add.collider(this.roomWall4, this.player);
    this.physics.add.collider(this.roomWall5, this.player);
    this.door.body.immovable = true;
    this.fiveWall.body.immovable = true;
    this.fiveWall2.body.immovable = true;
    this.fiveWall3.body.immovable = true;
    this.fiveWall4.body.immovable = true;
    this.fourWall.body.immovable = true;
    this.fourWall2.body.immovable = true;
    this.fourWall3.body.immovable = true;
    this.fourWall4.body.immovable = true;
    this.fourWall5.body.immovable = true;
    this.fourWall6.body.immovable = true;
    this.fourWall7.body.immovable = true;
    this.fourWall8.body.immovable = true;
    this.tenWall.body.immovable = true;
    this.tenWall2.body.immovable = true;
    this.tenWall3.body.immovable = true;
    this.tenWall4.body.immovable = true;
    this.tenWall5.body.immovable = true;
    this.tenWall6.body.immovable = true;
    this.eightWall.body.immovable = true;
    this.eightWall2.body.immovable = true;
    this.eightWall3.body.immovable = true;
    this.eightWall4.body.immovable = true;
    this.eightWall5.body.immovable = true;
    this.eightWall6.body.immovable = true;
    this.sevenGWall.body.immovable = true;
    this.sevenGWall2.body.immovable = true;
    this.sevenGWall3.body.immovable = true;
    this.sevenGWall4.body.immovable = true;
    this.sevenGWall3.body.immovable = true;
    this.sevenGWall4.body.immovable = true;
    this.sevenWall.body.immovable = true;
    this.sevenWall2.body.immovable = true;
    this.sevenWall3.body.immovable = true;
    this.sevenWall4.body.immovable = true;
    this.threeWall.body.immovable = true;
    this.threeWall2.body.immovable = true;
    this.threeWall3.body.immovable = true;
    this.threeWall4.body.immovable = true;
    this.roomWall.body.immovable = true;
    this.roomWall2.body.immovable = true;
    //this.roomWall3.body.immovable = true;
    //this.roomWall4.body.immovable = true;
    this.roomWall5.body.immovable = true;

    //overlaps
    this.physics.add.overlap(this.player, this.key1, this.keysCollect1, null, this);
    this.physics.add.overlap(this.player, this.key2, this.keysCollect2, null, this);
    this.physics.add.overlap(this.player, this.key3, this.keysCollect3, null, this);
    this.physics.add.collider(this.player, this.door, this.openDoor, null, this);
    this.physics.add.overlap(this.player, this.loot, this.win, null, this);
    this.physics.add.overlap(this.player, this.brokenWall, this.hiddenRoom, null, this);
    this.physics.add.overlap(this.player, this.brokenWall2, this.hiddenRoomReturn, null, this);
    this.physics.add.overlap(this.boulder, this.switch, this.puzzle1, null, this);
    this.physics.add.overlap(this.boulder2, this.switch2, this.puzzle2, null, this);
    this.physics.add.overlap(this.boulder, this.switch2, this.puzzle2, null, this);
    this.physics.add.overlap(this.boulder2, this.switch, this.puzzle1, null, this);
    this.physics.add.overlap(this.player, this.switch3, this.boulderReset, null, this);
    this.physics.add.overlap(this.player, this.empty, this.quickSand, null, this);
    this.physics.add.overlap(this.player, this.empty2, this.quickSand, null, this);
    this.physics.add.overlap(this.player, this.empty3, this.quickSand, null, this);
    this.physics.add.overlap(this.player, this.empty4, this.quickSand, null, this);
    this.physics.add.overlap(this.player, this.empty5, this.quickSand, null, this);
    this.physics.add.overlap(this.player, this.empty6, this.quickSand, null, this);
    this.physics.add.overlap(this.player, this.empty7, this.quickSand, null, this);
  
    //Arrow Keys Controls
    this.leftButton.on('pointerdown', function(){
            moveLeft = true;               
            }, this);
    this.rightButton.on('pointerdown', function(){
            moveRight= true;              
            }, this);
    this.upButton.on('pointerdown', function(){
            moveUp= true;                
            }, this);
    this.downButton.on('pointerdown', function(){
            moveDown= true;               
            }, this);
    
    this.input.on('pointerup', function(){
                moveLeft = false; 
                moveRight= false;
                moveUp = false; 
                moveDown= false;
            }, this);
    

};

gameScene.quickSand = function(){
    this.player.setPosition(1152, 1000);
    this.sound.play('takeDamage');
    //this.cameras.main.shake(0.05, 500);
};
gameScene.puzzle1 = function(){
    switchOneOn=true;
    if(switchOneOn==true && switchTwoOn==true){
    this.key1.setPosition(344, 1250);
    }
};
gameScene.puzzle2 = function(){
    switchTwoOn=true;
    if(switchOneOn==true && switchTwoOn==true){
    this.key1.setPosition(344, 1250);
    }
};
gameScene.boulderReset = function(){
    this.boulder.setPosition(500, 1236);
    this.boulder2.setPosition(500, 1295);
};
gameScene.hiddenRoom = function(){
    this.player.setPosition(2160, 685);
};
gameScene.hiddenRoomReturn = function(){
    this.player.setPosition(2120, 1145);
};

gameScene.win = function(){
    this.gameMusic.destroy();
    this.loot.disableBody(true, true);
    console.log('Loot pilfered! YOU WIN!')
    this.scene.start(winScene);
};

gameScene.keysCollect1 = function(){
    keysCollected++;
    this.key1.destroy();
    this.keyCollect.play();
    keyText.setText('Keys:'+keysCollected+'/3');
    console.log(keysCollected);
    if (keysCollected <3){
        console.log('find the remaining keys!');
    }
};
gameScene.keysCollect2 = function(){
    keysCollected++;
    this.key2.destroy();
    this.keyCollect.play();
    keyText.setText('Keys:'+keysCollected+'/3');
    console.log(keysCollected);
    if (keysCollected <3){
        console.log('find the remaining keys!');
    }
};
gameScene.keysCollect3 = function(){
    keysCollected++;
    this.key3.destroy();
    this.keyCollect.play();
    keyText.setText('Keys:'+keysCollected+'/3');
    console.log(keysCollected);
    if (keysCollected <3){
        console.log('find the remaining keys!');
    }
};

gameScene.openDoor = function(){
    if (keysCollected >=3){
       this.door.disableBody(true, true);
       keyText.destroy();
       this.sound.play('doorUnlock');
       console.log('To find your way through the sands seek the path of white flowers')
    } else {
       console.log('You must find both keys!');
    }
};


gameScene.update = function ()
{
    
    console.log(mute);
    
    //rough timer
    if(frames<=30){
        frames++;
    } else {
        seconds=seconds+0.5;
        frames=0;
    }
    
    //make UI stay on camera
    this.optionsButton.setPosition(this.player.x-280,this.player.y-165);
    this.leftButton.setPosition(this.player.x-245,this.player.y+70);
    this.rightButton.setPosition(this.player.x-75,this.player.y+70);
    this.upButton.setPosition(this.player.x-160,this.player.y+20);
    this.downButton.setPosition(this.player.x-160,this.player.y+120);
    this.muteButton.setPosition(this.player.x+300,this.player.y-160);
    
    //remove sliding from objects(velocity)
    this.boulder.setVelocity(0);
    this.boulder2.setVelocity(0);
    this.optionsButton.setVelocity(0);
    this.player.setVelocity(0);
    
    //cursors movement
    if (this.cursors.left.isDown)
    {
        this.player.setVelocityX(-500);
        this.player.anims.play('left');
    }
    else if (this.cursors.right.isDown)
    {
       this.player.setVelocityX(500);
       this.player.anims.play('right');
    }

    if (this.cursors.up.isDown)
    {
        this.player.setVelocityY(-500);
        this.player.anims.play('up');
    }
    else if (this.cursors.down.isDown)
    {
        this.player.setVelocityY(500);
        this.player.anims.play('down');
    }
    
    
    
    //on screen arrow movement
    if(moveLeft)
    {
        this.player.setVelocityX(-200);
        this.player.anims.play('left');
    }
   if(moveRight)
    {
       this.player.setVelocityX(200);
       this.player.anims.play('right');
    }
    if(moveUp)
    {
        this.player.setVelocityY(-200);
        this.player.anims.play('up');
    }
   if(moveDown)
    {
       this.player.setVelocityY(200);
       this.player.anims.play('down');
    }
    
    
    
    
    

    //touch input 1
      /*  if(this.input.activePointer.downX<window.innerHeight/2)
    {
        this.player.setVelocityX(-200);
        this.player.anims.play('left');
    }
    else if(this.input.activePointer.downX>window.innerHeight/2)
    {
       this.player.setVelocityX(200);
       this.player.anims.play('right');
    }

    if(this.input.activePointer.downX<window.innerWidth/2)
    {
        this.player.setVelocityY(-200);
        this.player.anims.play('up');
    }
    else if(this.input.activePointer.downX>window.innerWidth/2)
    {
        this.player.setVelocityY(200);
        this.player.anims.play('down');
    }*/
}
