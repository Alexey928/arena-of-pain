import Phaser from "phaser";
export class Preloader extends Phaser.Scene{
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }
    preload(){
        console.log("preload scene");
        this.load.image("tiles","assets/0x72_DungeonTilesetII_v1.6.png");
        this.load.image("hart_full","assets/helth.png");
        const fire = this.load.image("fireBall","assets/faerBall.png");
        this.load.image("hart_empty","assets/broken.png");
        this.load.tilemapTiledJSON("test","assets/mySimpleMap.json");
        this.load.atlas("monster", "assets/monster_run.png", "assets/monster_run_atlas.json");
        this.load.atlas("warrior","assets/warrior.png", "assets/warior_atlas.json");
    }
    create(){
        this.scene.start("game" )
    }

}