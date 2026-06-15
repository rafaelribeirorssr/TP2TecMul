import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene.js'
import { MenuScene } from './scenes/MenuScene.js'
import { CharacterScene } from './scenes/CharacterScene.js'
import { GameScene } from './scenes/GameScene.js'
import { GameOverScene } from './scenes/GameOverScene.js'
import { PauseScene } from './scenes/PauseScene.js'
 
const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,           // estica para preencher a janela, mantendo a proporção
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,                        // resolução interna do jogo (não mexer)
    height: 500
  },
  backgroundColor: '#5c94fc',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false }
  },
  scene: [BootScene, MenuScene, CharacterScene, GameScene, GameOverScene, PauseScene]
}
 
new Phaser.Game(config)