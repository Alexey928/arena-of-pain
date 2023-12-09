import Phaser from 'phaser'
import Game from '../scenes/Game';
import {Preloader} from "../scenes/Preload";
import {HelthUi} from "../UI_Scenes/uiHelth";

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-root',
    backgroundColor: '#01021f',
    width: 900,
    height: 700,
    scene: [Preloader,Game,HelthUi],
    scale: {
        zoom: 1,
    },
    physics: {
        default: "arcade",//"arcade"
        arcade:{
            gravity: {y: 0},
            debug:true
        },
    },
};

