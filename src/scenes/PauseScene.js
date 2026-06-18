import Phaser from 'phaser'
import { getLang } from './MenuScene.js'
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
    const w  = this.scale.width
    const h  = this.scale.height
    const cx = w / 2
    const cy = h / 2

    // dimmed, slightly blue-tinted backdrop to match the sky palette
    this.add.rectangle(0, 0, w, h, 0x0B1E3A, 0.62).setOrigin(0)

    this.drawPanel(cx, cy, 320, 400)

    this.add.text(cx, cy - 150, t.paused, {
      fontSize: '40px', fontStyle: 'bold', fill: '#FFE34D',
      stroke: '#C0392B', strokeThickness: 7
    }).setOrigin(0.5).setShadow(0, 4, 'rgba(0,0,0,0.35)', 5)

    this.makeButton(cx, cy - 78, `▶  ${t.resume}`, {
      color: 0x3CB043, hover: 0x57D85F, border: 0x1E7A2A,
      onClick: () => this.resumeGame()
    })

    this.makeButton(cx, cy - 18, `↻  ${t.restartLevel}`, {
      color: 0x2E86DE, hover: 0x54A0F0, border: 0x1B5FA8,
      onClick: () => {
        this.scene.stop('GameScene')
        this.scene.start('GameScene', {
          level: this.level,
          score: this.score,
          lives: this.lives,
          elapsed: this.elapsed
        })
      }
    })

    this.makeButton(cx, cy + 42, `⌂  ${t.backToMenu}`, {
      color: 0xF5A623, hover: 0xFFB733, border: 0xC77F12,
      onClick: () => {
        this.scene.stop('GameScene')
        this.scene.start('MenuScene')
      }
    })

    const soundBtn = this.makeButton(cx, cy + 102, this.soundLabel(), {
      color:  audio.muted ? 0x57606F : 0x9B59B6,
      hover:  audio.muted ? 0x747D8C : 0xB370CF,
      border: audio.muted ? 0x3C4453 : 0x6C3483,
      onClick: () => {
        audio.toggleMute()
        soundBtn.update(this.soundLabel(),
          audio.muted ? 0x57606F : 0x9B59B6,
          audio.muted ? 0x747D8C : 0xB370CF,
          audio.muted ? 0x3C4453 : 0x6C3483)
      }
    })

    this.input.keyboard.on('keydown-ESC', () => this.resumeGame())
  }

  resumeGame() {
    this.scene.resume('GameScene')
    this.scene.stop()
  }

  soundLabel() {
    const t = getLang()
    return audio.muted ? `🔇  ${t.soundOff}` : `🔊  ${t.soundOn}`
  }

  drawPanel(x, y, width, height) {
    const shadow = this.add.graphics()
    shadow.fillStyle(0x000000, 0.3)
    shadow.fillRoundedRect(x - width / 2, y - height / 2 + 8, width, height, 22)

    const g = this.add.graphics()
    // soft sky-gradient card to echo the menu background
    g.fillStyle(0x6FA8E8, 1)
    g.fillRoundedRect(x - width / 2, y - height / 2, width, height, 22)
    g.fillStyle(0x9BD0FF, 1)
    g.fillRoundedRect(x - width / 2, y - height / 2, width, height / 2, 22)
    // re-cover the lower seam so the top stays glossy
    g.fillStyle(0x6FA8E8, 1)
    g.fillRect(x - width / 2, y, width, 14)
    // bright border
    g.lineStyle(4, 0xFFE34D, 1)
    g.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 22)
    g.lineStyle(2, 0x1B5FA8, 0.5)
    g.strokeRoundedRect(x - width / 2 + 4, y - height / 2 + 4, width - 8, height - 8, 18)
  }

  makeButton(x, y, label, opts) {
    const { color, hover, border, onClick } = opts
    const minWidth = 230
    const height   = 48
    const container = this.add.container(x, y)

    const text = this.add.text(0, 0, label, {
      fontSize: '22px', fontStyle: 'bold', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5)

    let width = Math.max(minWidth, Math.ceil(text.width) + 36)

    const shadow = this.add.graphics()
    const bg     = this.add.graphics()

    const drawBg = (fillColor, brdColor, wdt) => {
      bg.clear()
      shadow.clear()
      shadow.fillStyle(0x000000, 0.22)
      shadow.fillRoundedRect(-wdt / 2, -height / 2 + 4, wdt, height, 12)
      bg.fillStyle(fillColor, 1)
      bg.fillRoundedRect(-wdt / 2, -height / 2, wdt, height, 12)
      bg.lineStyle(3, brdColor, 1)
      bg.strokeRoundedRect(-wdt / 2, -height / 2, wdt, height, 12)
      bg.fillStyle(0xffffff, 0.18)
      bg.fillRoundedRect(-wdt / 2 + 4, -height / 2 + 4, wdt - 8, height / 2 - 4, 8)
    }

    let curColor = color, curHover = hover, curBorder = border
    drawBg(curColor, curBorder, width)

    container.add([shadow, bg, text])
    container.setSize(width, height)
    container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains,
      { useHandCursor: true }
    )

    const scaleTo = (s) => {
      this.tweens.killTweensOf(container)
      this.tweens.add({ targets: container, scale: s, duration: 80, ease: 'Quad.out' })
    }

    container.on('pointerover', () => { drawBg(curHover, curBorder, width); scaleTo(1.06) })
    container.on('pointerout',  () => { drawBg(curColor, curBorder, width); scaleTo(1) })
    container.on('pointerdown', () => {
      this.tweens.killTweensOf(container)
      this.tweens.add({
        targets: container, scale: 0.94, duration: 70, yoyo: true,
        onComplete: () => onClick()
      })
    })

    // allow the sound button to swap its label/colours in place
    container.update = (newLabel, newColor, newHover, newBorder) => {
      text.setText(newLabel)
      curColor = newColor; curHover = newHover; curBorder = newBorder
      width = Math.max(minWidth, Math.ceil(text.width) + 36)
      drawBg(curColor, curBorder, width)
      container.setSize(width, height)
      container.input.hitArea.setTo(-width / 2, -height / 2, width, height)
    }

    return container
  }
}
