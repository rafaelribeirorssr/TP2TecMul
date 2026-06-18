import Phaser from 'phaser'
import { getLang, getCurrentLang } from './MenuScene.js'
import { audio } from '../audio.js'

export class PauseScene extends Phaser.Scene {
  constructor() { super('PauseScene') }

  init(data) {

    this.level = data.level || 0
    this.score = data.score || 0
    this.lives = data.lives !== undefined ? data.lives : 3
    this.elapsed = data.elapsed || 0
  }

  create() {
    const t  = getLang()
    const cx = this.scale.width / 2
    const cy = this.scale.height / 2

    this.add.rectangle(0, 0, 800, 500, 0x000000, 0.65).setOrigin(0)

    this.add.text(cx, cy - 120, t.paused, {
      fontSize: '44px', fill: '#FFD700', fontStyle: 'bold'
    }).setOrigin(0.5)

    this.makeButton(cx, cy - 30, `▶  ${t.resume}`, () => this.resumeGame())

    this.makeButton(cx, cy + 40, `↻  ${t.restartLevel}`, () => {
      this.scene.stop('GameScene')
      this.scene.start('GameScene', {
        level: this.level,
        score: this.score,
        lives: this.lives,
        elapsed: this.elapsed
      })
    })

    this.makeButton(cx, cy + 110, `⌂  ${t.backToMenu}`, () => {
      this.scene.stop('GameScene')
      this.scene.start('MenuScene')
    })

    const soundBtn = this.makeButton(cx, cy + 180, this.soundLabel(), () => {
      audio.toggleMute()
      soundBtn.setText(this.soundLabel())
    })

    this.input.keyboard.on('keydown-ESC', () => this.resumeGame())
  }

  resumeGame() {
    this.scene.resume('GameScene')
    this.scene.stop()
  }

  soundLabel() {
    const pt = getCurrentLang() === 'pt'
    if (audio.muted) return pt ? '🔇  Som: Desligado' : '🔇  Sound: Off'
    return pt ? '🔊  Som: Ligado' : '🔊  Sound: On'
  }

  makeButton(x, y, label, onClick) {
    const btn = this.add.text(x, y, label, {
      fontSize: '24px', fill: '#ffffff',
      backgroundColor: '#e74c3c', padding: { x: 24, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    btn.on('pointerover', () => btn.setStyle({ fill: '#FFD700' }))
    btn.on('pointerout',  () => btn.setStyle({ fill: '#ffffff' }))
    btn.on('pointerdown', onClick)
    return btn
  }
}
