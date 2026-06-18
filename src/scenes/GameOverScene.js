import Phaser from 'phaser'
import { getLang, getCurrentLang, getActiveSkinIndex } from './MenuScene.js'
import { formatTime } from './GameScene.js'
import { SKINS, SPRITE_FRAMES } from '../assetConfig.js'
import { audio } from '../audio.js'

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene') }

  init(data) {
    this.finalScore = data.score || 0
    this.victory = data.victory || false
    this.finalTime = data.time || 0
  }

  create() {
    const t  = getLang()
    const w  = this.scale.width
    const h  = this.scale.height
    const cx = w / 2

    if (this.victory) audio.winJingle()
    else              audio.loseJingle()

    this.drawBackground(w, h, this.victory)

    this.drawCharacter(cx, 192)

    const title = this.add.text(cx, 96, this.victory ? t.victory : t.gameover, {
      fontSize: '58px', fontStyle: 'bold',
      fill:   this.victory ? '#FFE34D' : '#FF5A4D',
      stroke: this.victory ? '#C77F12' : '#7A1B14',
      strokeThickness: 9
    }).setOrigin(0.5).setShadow(0, 5, 'rgba(0,0,0,0.35)', 6)

    title.setScale(0.4)
    this.tweens.add({ targets: title, scale: 1, duration: 420, ease: 'Back.out' })

    const panelY = 270
    const panel = this.add.graphics()
    panel.fillStyle(0x000000, 0.28)
    panel.fillRoundedRect(cx - 170, panelY - 42, 340, this.victory ? 96 : 64, 14)
    panel.lineStyle(3, 0xffffff, 0.65)
    panel.strokeRoundedRect(cx - 170, panelY - 42, 340, this.victory ? 96 : 64, 14)

    this.add.text(cx, panelY - 14, `${t.finalScore}: ${this.finalScore}`, {
      fontSize: '26px', fontStyle: 'bold', fill: '#ffffff',
      stroke: '#1B3A6B', strokeThickness: 4
    }).setOrigin(0.5)

    if (this.victory) {
      this.add.text(cx, panelY + 22, `⏱ ${t.finalTime}: ${formatTime(this.finalTime)}`, {
        fontSize: '21px', fontStyle: 'bold', fill: '#FFE34D',
        stroke: '#7A5A00', strokeThickness: 4
      }).setOrigin(0.5)
    }

    const playLabel = getCurrentLang() === 'pt' ? '↻  Jogar de novo' : '↻  Play again'
    const menuLabel = t.backToMenu

    this.makeButton(cx, 362, playLabel, {
      width: 240, height: 46, fontSize: 20,
      color: 0x3CB043, hover: 0x57D85F, border: 0x1E7A2A,
      onClick: () => this.scene.start('GameScene', { level: 0 })
    })
    this.makeButton(cx, 416, `⌂  ${menuLabel}`, {
      width: 240, height: 46, fontSize: 20,
      color: 0x2E86DE, hover: 0x54A0F0, border: 0x1B5FA8,
      onClick: () => this.scene.start('MenuScene')
    })

    this.add.text(cx, 462, t.restart, {
      fontSize: '15px', fill: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0.85)

    this.input.keyboard.once('keydown-R', () => this.scene.start('MenuScene'))
  }

  drawCharacter(x, y) {
    const skin = SKINS[getActiveSkinIndex()]
    let img
    if (skin?.url && this.textures.exists(skin.key)) {
      const tex   = this.textures.get(skin.key)
      const idle  = SPRITE_FRAMES[skin.key]?.idle
      const fname = 'over_idle'
      if (idle && !tex.has(fname)) tex.add(fname, 0, idle.x, idle.y, idle.w, idle.h)
      img = tex.has(fname) ? this.add.image(x, y, skin.key, fname)
                           : this.add.image(x, y, skin.key)
      const s = Math.min(70 / img.width, 90 / img.height)
      img.setScale(s)
    } else {
      img = this.add.rectangle(x, y, 44, 60, 0x888888)
    }
    img.setOrigin(0.5)

    if (this.victory) {

      this.tweens.add({
        targets: img, y: y - 22, duration: 380,
        yoyo: true, repeat: -1, ease: 'Quad.inOut'
      })
    } else {

      img.setAngle(90).setTint(0x99889a).setY(y + 18)
    }
    return img
  }

  drawBackground(w, h, victory) {
    const g = this.add.graphics()
    if (victory) {
      g.fillGradientStyle(0x5DA9FF, 0x5DA9FF, 0x9BD0FF, 0x9BD0FF, 1)
      g.fillRect(0, 0, w, h)
    } else {
      g.fillGradientStyle(0x3A2A5A, 0x3A2A5A, 0xE8743B, 0xF2A65A, 1)
      g.fillRect(0, 0, w, h)
    }

    g.fillStyle(victory ? 0x6FCF5B : 0x4A5A3A, 1)
    g.fillEllipse(w * 0.78, h + 60, 360, 220)
    g.fillEllipse(w * 0.18, h + 80, 300, 200)

    g.fillStyle(victory ? 0x57B84A : 0x3E5236, 1)
    g.fillRect(0, h - 26, w, 26)
    g.fillStyle(victory ? 0x3E9135 : 0x2C3A26, 1)
    g.fillRect(0, h - 26, w, 6)

    const cloudAlpha = victory ? 0.95 : 0.5
    this.drawCloud(g, 120, 80, 1.0, cloudAlpha)
    this.drawCloud(g, 660, 60, 0.8, cloudAlpha)
    this.drawCloud(g, 700, 250, 1.1, cloudAlpha)
    this.drawCloud(g, 90, 300, 0.9, cloudAlpha)
  }

  drawCloud(g, x, y, s, alpha) {
    g.fillStyle(0xffffff, alpha)
    g.fillCircle(x, y, 22 * s)
    g.fillCircle(x + 24 * s, y + 6 * s, 28 * s)
    g.fillCircle(x + 52 * s, y, 22 * s)
    g.fillRect(x - 4 * s, y + 2 * s, 60 * s, 18 * s)
  }

  makeButton(x, y, label, opts) {
    const { height, fontSize, color, hover, border, onClick } = opts
    const container = this.add.container(x, y)

    const text = this.add.text(0, 0, label, {
      fontSize: `${fontSize}px`, fontStyle: 'bold', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5)

    const width = Math.max(opts.width, Math.ceil(text.width) + 36)

    const shadow = this.add.graphics()
    shadow.fillStyle(0x000000, 0.22)
    shadow.fillRoundedRect(-width / 2, -height / 2 + 4, width, height, 12)

    const bg = this.add.graphics()
    const draw = (fillColor) => {
      bg.clear()
      bg.fillStyle(fillColor, 1)
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, 12)
      bg.lineStyle(3, border, 1)
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 12)
      bg.fillStyle(0xffffff, 0.18)
      bg.fillRoundedRect(-width / 2 + 4, -height / 2 + 4, width - 8, height / 2 - 4, 8)
    }
    draw(color)

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

    container.on('pointerover', () => { draw(hover); scaleTo(1.06) })
    container.on('pointerout',  () => { draw(color); scaleTo(1) })
    container.on('pointerdown', () => {
      this.tweens.killTweensOf(container)
      this.tweens.add({
        targets: container, scale: 0.94, duration: 70, yoyo: true,
        onComplete: () => onClick()
      })
    })

    return container
  }
}
