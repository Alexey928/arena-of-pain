import Phaser from 'phaser';
export const debugColiders =(layers:Phaser.Tilemaps.TilemapLayer[], scene:Phaser.Scene )=>{
    const debugGraphics = scene.add.graphics().setAlpha(0.4);
    layers.forEach((i)=>{
    i?.renderDebug(debugGraphics,{
            tileColor:null,
            collidingTileColor:new Phaser.Display.Color(100,39,37,255)
        })
    })

}
export const createWariorAnimation = (anims:Phaser.Animations.AnimationManager)=>{
    anims.create({
        key: "warior-run",
        frames: anims.generateFrameNames('warrior', {
            prefix: 'warrior_run_',
            start: 1,
            end: 8,
            zeroPad: 1,
        }),
        frameRate: 13,
        repeat: -1,

    })
}

export const createMonsterAnimation = (anims:Phaser.Animations.AnimationManager)=>{

}