class TitleScene extends Phaser.Scene{
    constructor(){
        super({key: 'TitleScene'});
    }
    
    preload() {
        this.load.image('titleBG', 'assets/titleBG.png');
    }
    
    create() {
        let background = this.add.sprite()
        background.setOrigin(0, 0);
    }
}

export default TitleScene;