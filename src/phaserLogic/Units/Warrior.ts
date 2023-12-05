import Phaser from "phaser";
import {createWariorAnimation} from "../utils/utils";

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

enum WEAPON{
    KNIFE_ATTACK=1,
    ARROW_ATTACK=2,
}

const randomeDerection = (exclude: Direction) => {
    let newDirection = Phaser.Math.Between(0, 3);
    while (newDirection === exclude) {
        newDirection = Phaser.Math.Between(0, 3);
    }
    return newDirection
}


export class Warrior extends Phaser.Physics.Arcade.Sprite {
    private direction = Direction.LEFT;
    private moveEvent!: Phaser.Time.TimerEvent;
    private helth!:number
    private speed = 100

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        createWariorAnimation(this.scene.anims);

        this.anims.play('warior-run', true);

        this.moveEvent = scene.time.addEvent({
            delay: 3000,
            callback: () => {
                this.direction = randomeDerection(this.direction);
            },
            loop: true
        })
        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);
    }
    private wariorWasHitt(){

    }
    setHeth(){

    }
    destroy(fromScene:boolean){
        this.moveEvent.destroy();
        super.destroy(fromScene)
    }

    protected handleTileCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        if (go !== this) {
            return
        }
        this.direction = randomeDerection(this.direction);
    }

    protected preUpdate(time: number, delta: number) {// starting faster then scene.update()
        super.preUpdate(time, delta);
        //console.log("preapdate");

        switch (this.direction) {
            case Direction.UP :
                this.setVelocity(0, -this.speed);
                break
            case Direction.DOWN:
                this.setVelocity(0, this.speed);
                break
            case Direction.RIGHT:
                this.setVelocity(this.speed, 0);
                this.body?.offset.set(5,10);
                this.scaleX = 1;
                break
            case Direction.LEFT:
                this.setVelocity(-this.speed, 0);
                this.scaleX = -1;
                this.body?.offset.set(40,10)
                break
            default:
                this.setVelocity(0, 0)
        }
    }
}
