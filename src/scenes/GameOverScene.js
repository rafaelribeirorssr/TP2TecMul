import Phaser from 'phaser'
import { getLang } from './MenuScene.js'
import { formatTime } from './GameScene.js'

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene') }

  init(data) {
    this.finalScore = data.score || 0
    this.victory = data.victory || false
    this.finalTime = data.time || 0
  }

  create() {
    const t = getLang()
    const cx = this.scale.width / 2

    this.add.rectangle(0, 0, 800, 500, 0x1a1a2e).setOrigin(0)

    this.add.text(cx, 150, this.victory ? t.victory : t.gameover, {
      fontSize: '52px', fill: this.victory ? '#FFD700' : '#e74c3c', fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(cx, 250, `${t.finalScore}: ${this.finalScore}`, {
      fontSize: '28px', fill: '#ffffff'
    }).setOrigin(0.5)

    // Só na vitória se mostra o tempo total. Na derrota o cronómetro não aparece.
    if (this.victory) {
      this.add.text(cx, 292, `${t.finalTime}: ${formatTime(this.finalTime)}`, {
        fontSize: '24px', fill: '#FFD700'
      }).setOrigin(0.5)
    }

    this.add.text(cx, 330, t.restart, {
      fontSize: '20px', fill: '#aaaaaa'
    }).setOrigin(0.5)

    this.input.keyboard.once('keydown-R', () => this.scene.start('MenuScene'))
  }
}