import React, {useEffect, useRef} from 'react';
import {config} from './config/phaser-game';
import Phaser from "phaser";


const Game: React.FC = () => {
    const phaserGameRef = useRef<Phaser.Game | null>(null);
    useEffect(() => {
        if (!phaserGameRef.current) {
            phaserGameRef.current = new Phaser.Game(config);
        }
        return () => { //clean up method
            if (phaserGameRef.current) {
                phaserGameRef.current?.destroy(true);
            }
        };
    }, []);
    return <div style={{backgroundColor:"darkgray",
                        height:"100vh",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center"}} id="game-root"></div>;//very interesting behavior of this block depending on id naming
};

export default Game;
