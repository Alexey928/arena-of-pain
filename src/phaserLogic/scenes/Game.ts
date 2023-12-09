// It's a MAIN SCINE OF OUR GAME NOW !!!
import Phaser from 'phaser';
import {Warrior} from "../Units/Warrior";
import "../Units/Monster"
import Tile = Phaser.Tilemaps.Tile;
import {Monster} from "../Units/Monster";
import {HelthUi} from "../UI_Scenes/uiHelth";
import {debugColiders} from "../utils/utils";
import {SceneEvents} from "../eventEmiter/EventEmiter"

export default class Game extends Phaser.Scene {
    private hit: number = 0// indicator of hitting
    private monster!: Monster;
    private warrior!: Phaser.Physics.Arcade.Group;
    private cloneMonster!: Phaser.Physics.Arcade.Sprite
    private inputKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private helthUI?: HelthUi
    private wariorAndMonsterCollider?: Phaser.Physics.Arcade.Collider // its need becose wee must dectroy this colider in other method
    private fireBalls!: Phaser.Physics.Arcade.Group

    constructor() {
        super("game");
    }

    preload() {
        this.inputKeys = this.input.keyboard ? this.input.keyboard.createCursorKeys() : undefined;
    }

    create() {

        this.scene.run("helthUi");
        this.helthUI = this.scene.get("helthUi") as HelthUi;
        //creating our map from assets and addet layer from our scene
        const map = this.make.tilemap({key: "test"});
        const tileSet = map.addTilesetImage("tyleSet", "tiles");
        tileSet && map.createLayer("Floor", tileSet);
        const walls = tileSet && map.createLayer("Walls", tileSet);
        const columns = tileSet && map.createLayer("Columns", tileSet);
        const bonus = tileSet && map.createLayer("Bonus", tileSet);
        bonus?.setCollisionByProperty({collides: true});// in here we configorete, wot items of layer, must bee colliding
        walls?.setCollisionByProperty({collides: true});// in tile app wi direct this property "collides: true"
        columns?.setCollisionByProperty({collides: true});
        //________________________________________________________________
        debugColiders([walls!, columns!], this)//on graphics for debug
        this.monster = this.add.monster(500, 600, "monster", "big_demon_run_anim_f2")// <--creating width
                                                                      // help GameObjectFactory, watch in Monster class file.
        //this.cloneMonster = this.add.monster(390, 300, "monster");
        //Creating groups of some objects
        this.fireBalls = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image
        })
        this.warrior = this.physics.add.group({// when wee nidet multiply some game object, wee use groop
            classType: Warrior,
            createCallback: (go) => {
                const warriorGo = go as Warrior;
                warriorGo.body?.setSize(30, 30, true);

                if (warriorGo.body) {
                    warriorGo.body.onCollide = true;
                }
            },
        });
        this.monster.setFierBalls(this.fireBalls)
        console.log(this.warrior)
        this.warrior.get(400, 600, "warrior");
        this.warrior.get(400, 350, "warrior");

        this.anims.create({
            key: 'walk_anim',
            frames: this.anims.generateFrameNames('monster', {
                prefix: 'big_demon_run_anim_f',
                start: 0,
                end: 3,
                zeroPad: 1,
            }),
            frameRate: 12,
            repeat: -1,

        })
        this.cameras.main.startFollow(this.monster, false);
        // tune up our colliders
        this.physics.add.collider(this.monster, columns!);
        this.physics.add.collider(this.warrior, walls!);
        this.physics.add.collider(this.warrior, columns!);
        this.physics.add.collider(this.monster, bonus!);
        this.physics.add.collider(this.monster,walls!)
        this.physics.add.collider(this.fireBalls, walls!, this.handleWarriorAndWallsColliasion,undefined,this);
        this.physics.add.collider(this.fireBalls, this.warrior!, this.handleWariorAndKnifeCollision,undefined,this);
        this.wariorAndMonsterCollider = this.physics.add.collider(this.warrior, this.monster, this.handleWariorAndMonsterColision, undefined, this);
    }
    private initRespoun(){
        setTimeout(()=>{
            console.log("respoun our warior");
        })
    }

    logHelth() {
        console.log(this.helthUI?.getCurrentHelth());
    }
    handleWarriorAndWallsColliasion(object1:Phaser.GameObjects.GameObject|Tile,object2:Phaser.GameObjects.GameObject|Tile){
        console.log("hit tuu wall");
        this.fireBalls.killAndHide(object1 as Phaser.GameObjects.GameObject);
        this.fireBalls.clear(true,true);
    }
    handleWariorAndKnifeCollision(object1:Phaser.GameObjects.GameObject|Tile,object2:Phaser.GameObjects.GameObject|Tile){
        console.log("Hit!!");
        //this.fireBalls.killAndHide(object1 as Phaser.GameObjects.GameObject);
        object2.destroy(true);
        this.fireBalls.children.entries.forEach((e)=>{
            e.destroy(true)
        })
        //this.fireBalls.clear(true,true)

    }
    handleWariorAndMonsterColision(object1: Phaser.GameObjects.GameObject | Tile,
                                   object2: Phaser.GameObjects.GameObject | Tile,) {
        console.log("collision");
        const warrior = object2 as Warrior;
        const dx = this.monster.x - warrior.x;
        const dy = this.monster.y - warrior.y;
        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(150);//
        this.monster.damageHandle(dir, 1);
        this.logHelth()
        this.helthUI?.changeCurentHelth(this.monster.getVallOfHelth())
        console.log("helth ->", this.monster.getVallOfHelth());
        SceneEvents.emit("warrior-boot-colliding");
    }
    update(time: number, delta: number) {
        if (this.hit > 0) {
            this.hit += 1;
            if (this.hit > 10) {
                this.hit = 0
            }
            return;
        }
        if (this.monster) {
            this.monster.update(this.inputKeys!)
            //this.cloneMonster.update(this.inputKeys);// experement !!
        }
    }
}
