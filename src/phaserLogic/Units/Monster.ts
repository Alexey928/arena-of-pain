import Phaser from "phaser";
//   по сути можете это воспринемать как расширение базового интерфейса полем которе сгенерит register()
declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            monster(x: number, y: number, texture: string, frame?: string | number): Monster
        }
    }
}
// концепция в том, что мы имеем некое сосотояние this.helthState оно говорит о том получаем мы сейчас повреждение или нет
// если да то в свиче приопдейта делаем коунтинг this.damageTime чтоб можно было как то показать  момент попадания(animation !)
enum Derection{
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
enum Sepeds{
    UNIT=100,
    FIRE_BALL=400
}
enum HelthState {//шаблон состояний this.helthState
    NORMALL,
    DAMAGE,
    //DEAD,
}
export class Monster extends Phaser.Physics.Arcade.Sprite {

    private derection:Derection = Derection.LEFT
    private helthState = HelthState.NORMALL;
    private damageTime!: number;
    private _vallOfHelth: number = 4;
    private fireBals?:Phaser.Physics.Arcade.Group;


    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        console.log(HelthState["DAMAGE"]);
    }
    getVallOfHelth() {
        return this._vallOfHelth
    }
    private fire(){
        if(!this.fireBals) return;
        console.log("FIRE!!!!");
        const vec = new Phaser.Math.Vector2(0,0)//{x:0,y:0,someMethods...}
        switch (this.derection) {
            case Derection.UP:
                vec.y=-1;
                break
            case Derection.DOWN:
                vec.y = 1;
                break
            case Derection.LEFT:
                vec.x = -1;
                break
            case Derection.RIGHT:
                vec.x = 1;
                break
            default:
        }
        const angle = vec.angle();
        const fireBall = this.fireBals.get(this.x,this.y,"fireBall") as Phaser.Physics.Arcade.Image;
        fireBall.setRotation(angle);
        fireBall.setVelocity(vec.x * Sepeds.FIRE_BALL,vec.y * Sepeds.FIRE_BALL);
        fireBall.scale = 0.8;
        fireBall.setActive(true);
        fireBall.setVisible(true);
        fireBall.body?.setSize(25,25,true)// fireBall collider size
    }
    setFierBalls(fireBalls:Phaser.Physics.Arcade.Group){
        this.fireBals =fireBalls
    }
    damageHandle(direction: Phaser.Math.Vector2, atackVall: number) {
        if (this.helthState === HelthState.DAMAGE) return// limited unnecessary triggering
        this.setVelocity(direction.x, direction.y);
        this.setTint(0xff0000);
        this.helthState = HelthState.DAMAGE;
        this._vallOfHelth -= atackVall;
        this.damageTime = 0//??
    }
    protected preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        switch (this.helthState) {
            case HelthState.NORMALL:
                break;
            case HelthState.DAMAGE:
                this.damageTime += delta;//paused damage, can run animation of damage here
                if (this.damageTime > 250) {
                    this.setTint(0xffffff);
                    this.helthState = HelthState.NORMALL;
                    this.damageTime = 0;
                    break;
                }
        }
    }
    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (this.helthState === HelthState.DAMAGE) return;
        if (this._vallOfHelth <= 0) {
            this.setTint(0xff0000);
            this.anims.stop();//
            this.setVelocity(0, 0);
            return;
        }
        if (!cursors) return;
        if(Phaser.Input.Keyboard.JustDown(cursors.space)){//we can't move monster, if we did that like --> if (cursors.spase?.isDown)
            this.fire()
        }
        const speed = Sepeds.UNIT;
        if (cursors.left?.isDown) {
            this.derection = Derection.LEFT;
            this.setVelocity(-speed, 0);
            this.anims.play("walk_anim", true);
            this.scaleX = -1;
            this.body?.offset.set(25, 0)
        } else if (cursors.right?.isDown) {
            this.derection = Derection.RIGHT;
            this.anims.play("walk_anim", true)
            this.setVelocity(speed, 0);
            this.body?.offset.set(8, 5);
            this.scaleX = 1;
        } else if (cursors.up?.isDown) {
            this.derection = Derection.UP;
            this.anims.play("walk_anim", true);
            this.setVelocity(0, -speed);
        } else if (cursors.down?.isDown) {
            this.derection = Derection.DOWN
            this.anims.play("walk_anim", true);
            this.setVelocity(0, speed);
        } else {
            this.anims.stop()
            this.setVelocity(0, 0);
        }
    }
}
//встроенный метод для добавления в инстанс сцены , поля с фабрикой ,для создания нашего монстра. Т.е.  у любого инстанса который
//наследуется от Phaser.Scene он доступен как this.add.monster(x,y,textureKey,frame): GameObjectFactory
Phaser.GameObjects.GameObjectFactory.register("monster",
    function (this: Phaser.GameObjects.GameObjectFactory,
              x: number, y: number, texture: string,
              frame?: string | number) {
        console.log("factory of monster")
        let sprite = new Monster(this.scene, x, y, texture, frame);
        //some sprite decorations method
        sprite.preFX?.addShine(10);
        sprite.postFX?.addShine(10);
        this.displayList.add(sprite);
        this.updateList.add(sprite);
        this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
        sprite.body?.setSize(sprite.width * 0.5, sprite.height * 0.8)
        return sprite
    })