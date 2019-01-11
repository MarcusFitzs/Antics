class PauseScene extends Phaser.Scene {
    constructor() {
        super({key: 'PauseScene'});
    }
    
    preload () {
        this.load.image('PauseBackground', 'assets/PauseBackground.png')
    }
    
    create () {
        let background = this.add.sprite(0,0, 'PauseBackground');
        background.setOrigin(0,0);
    }
}

export default PauseScene;