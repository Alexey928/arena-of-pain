import Phaser from "phaser";
import {SceneEvents} from "../eventEmiter/EventEmiter"

export class HelthUi extends Phaser.Scene {
    private _helth!: Phaser.GameObjects.Group;
    private _score!: Phaser.GameObjects.Text;
    constructor() {
        console.log("hartConstructor");
        super({key: "helthUi"});
    }
    getCurrentScore(){
        console.log(this._score.text);
    }
    getCurrentHelth() {
        return this._helth
    }

    changeCurentHelth(unitHelth: number) {
        this._helth.children.entries.forEach((e, i) => {
            const a = e as Phaser.GameObjects.Image
            (i > unitHelth - 1) && a.removeFromDisplayList()// can change texture here ! a.setTexture({key:"string"})
        })                                                  // important!! texture mast be loadet in preloader scene
    }

    create() {
       console.log("hartCreate")
       this._score =  this.add.text(750,20,"Score:",{
            fontSize:25,
            color:"red",
            fontStyle:"bold"
        })

        const harts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this._helth = harts
        harts.createMultiple({
            key: "hart_full",
            setXY: {
                x: 20,
                y: 25,
                stepX: 30,

            },
            quantity: 4,
            classType: Phaser.GameObjects.Image,
        });
        SceneEvents.on("warrior-boot-colliding", () => {
            console.log("events Colliding")
        }, this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            console.log(" Will Unmount ;)")  // cleanup fn -->
        })
    }
}