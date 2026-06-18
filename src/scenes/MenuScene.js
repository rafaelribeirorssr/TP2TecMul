import Phaser from 'phaser'
import pt from '../locales/pt.json'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import { SKINS, SPRITE_FRAMES } from '../assetConfig.js'
import { audio } from '../audio.js'

const langs = { pt, en, zh }
let currentLang = 'pt'
let activeSkinIndex = 0

export function getLang()             { return langs[currentLang] }
export function setLang(l)            { currentLang = l }
export function getActiveSkinIndex()  { return activeSkinIndex }
export function setActiveSkinIndex(i) { activeSkinIndex = i }
export function getActiveCharacter()  { return SKINS[activeSkinIndex] }
export function getCurrentLang()      { return currentLang }
// localized character field (e.g. 'label' / 'role'); falls back to English
export function charText(skin, base)  { return skin[`${base}_${currentLang}`] ?? skin[`${base}_en`] }

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene') }

  create() {
    const t  = getLang()
    const w  = this.scale.width
    const h  = this.scale.height
    const cx = w / 2

    this.drawBackground(w, h)

    audio.init()
    audio.startMusic()
    this.input.once('pointerdown', () => audio.init())
    this.input.keyboard.once('keydown', () => audio.init())

    this.makeSoundButton(w - 36, 36)

    this.add.text(cx, 52, t.title, {
      fontSize: '46px', fontStyle: 'bold', fill: '#FFE34D',
      stroke: '#C0392B', strokeThickness: 8
    }).setOrigin(0.5).setShadow(0, 5, 'rgba(0,0,0,0.35)', 6)

    this.makeButton(cx, 116, `▶  ${t.start}`, {
      width: 230, height: 50, fontSize: 26,
      color: 0x3CB043, hover: 0x57D85F, border: 0x1E7A2A,
      onClick: () => this.scene.start('GameScene', { level: 0 })
    })

    this.add.text(cx, 168, t.selectLevel, {
      fontSize: '15px', fontStyle: 'bold', fill: '#ffffff',
      stroke: '#1B3A6B', strokeThickness: 3
    }).setOrigin(0.5)

    const xs = [cx - 256, cx - 128, cx, cx + 128, cx + 256]
    for (let i = 0; i < 5; i++) {
      this.makeButton(xs[i], 205, `${t.level} ${i + 1}`, {
        width: 96, height: 40, fontSize: 18,
        color: 0x2E86DE, hover: 0x54A0F0, border: 0x1B5FA8,
        onClick: () => this.scene.start('GameScene', { level: i })
      })
    }

    this.add.text(cx, 250, t.character, {
      fontSize: '15px', fontStyle: 'bold', fill: '#ffffff',
      stroke: '#1B3A6B', strokeThickness: 3
    }).setOrigin(0.5)

    const ch     = SKINS[activeSkinIndex]
    const chName = charText(ch, 'label')
    const chRole = charText(ch, 'role')
    this.makeButton(cx, 286, `👤  ${chName} — ${chRole}`, {
      width: 250, height: 40, fontSize: 18,
      color: 0xF5A623, hover: 0xFFB733, border: 0xC77F12,
      onClick: () => this.scene.start('CharacterScene')
    })

    this.drawSkinPreview(activeSkinIndex, cx, 330)

    this.add.text(cx, 366, t.controls, {
      fontSize: '13px', fill: '#ffffff',
      stroke: '#1B3A6B', strokeThickness: 3
    }).setOrigin(0.5)

    const langButtons = [
      { code: 'pt', label: '🇵🇹 PT' },
      { code: 'en', label: '🇬🇧 EN' },
      { code: 'zh', label: '🇨🇳 中文' },
    ]
    const langW = 92, langGap = 8, step = langW + langGap
    const startX = cx - step * (langButtons.length - 1) / 2
    langButtons.forEach(({ code, label }, idx) => {
      const active = currentLang === code
      this.makeButton(startX + idx * step, 402, label, {
        width: langW, fixedWidth: true, height: 32, fontSize: 16,
        color:  active ? 0xF5A623 : 0x57606F,
        hover:  active ? 0xFFB733 : 0x747D8C,
        border: active ? 0xC77F12 : 0x3C4453,
        onClick: () => { setLang(code); this.scene.restart() }
      })
    })

    this.makeButton(cx, 450, `✕  ${t.quit}`, {
      width: 130, height: 38, fontSize: 19,
      color: 0xE0392B, hover: 0xF0564A, border: 0xA81F14,
      onClick: () => this.quitGame()
    })
  }

  drawSkinPreview(i, x, y) {
    const skin = SKINS[i]
    const previewColors = [0xcc0000, 0x111111, 0x6677aa, 0x6600cc]
    if (skin.url && this.textures.exists(skin.key)) {
      const tex   = this.textures.get(skin.key)
      const idle  = SPRITE_FRAMES[skin.key]?.idle
      const fname = 'menu_idle'
      if (idle && !tex.has(fname)) tex.add(fname, 0, idle.x, idle.y, idle.w, idle.h)
      const img = tex.has(fname)
        ? this.add.image(x, y, skin.key, fname)
        : this.add.image(x, y, skin.key)
      const s = Math.min(40 / img.width, 52 / img.height)
      return img.setScale(s).setOrigin(0.5)
    }
    const g = this.add.graphics()
    g.fillStyle(previewColors[i] ?? 0x888888, 1)
    g.fillRect(x - 16, y - 22, 32, 44)
    return g
  }

  drawBackground(w, h) {
    const g = this.add.graphics()
    g.fillGradientStyle(0x5DA9FF, 0x5DA9FF, 0x9BD0FF, 0x9BD0FF, 1)
    g.fillRect(0, 0, w, h)

    g.fillStyle(0x6FCF5B, 1)
    g.fillEllipse(w * 0.78, h + 60, 360, 220)
    g.fillEllipse(w * 0.18, h + 80, 300, 200)

    g.fillStyle(0x57B84A, 1)
    g.fillRect(0, h - 26, w, 26)
    g.fillStyle(0x3E9135, 1)
    g.fillRect(0, h - 26, w, 6)

    this.drawCloud(g, 120, 90, 1.0)
    this.drawCloud(g, 640, 70, 0.8)
    this.drawCloud(g, 700, 250, 1.1)
    this.drawCloud(g, 90, 300, 0.9)
  }

  drawCloud(g, x, y, s) {
    g.fillStyle(0xffffff, 0.95)
    g.fillCircle(x, y, 22 * s)
    g.fillCircle(x + 24 * s, y + 6 * s, 28 * s)
    g.fillCircle(x + 52 * s, y, 22 * s)
    g.fillRect(x - 4 * s, y + 2 * s, 60 * s, 18 * s)
  }

  makeSoundButton(x, y) {
    const r = 24
    const container = this.add.container(x, y)

    const palette = {
      on:  { fill: 0xF5A623, hover: 0xFFB733, border: 0xC77F12 },
      off: { fill: 0x57606F, hover: 0x747D8C, border: 0x3C4453 }
    }

    const shadow = this.add.graphics()
    shadow.fillStyle(0x000000, 0.22)
    shadow.fillCircle(0, 4, r)

    const bg = this.add.graphics()
    const icon = this.add.text(0, 0, audio.muted ? '🔇' : '🔊', {
      fontSize: '22px'
    }).setOrigin(0.5)

    const draw = (hovered) => {
      const c = audio.muted ? palette.off : palette.on
      bg.clear()
      bg.fillStyle(hovered ? c.hover : c.fill, 1)
      bg.fillCircle(0, 0, r)
      bg.lineStyle(3, c.border, 1)
      bg.strokeCircle(0, 0, r)
      // glossy highlight on the top half
      bg.fillStyle(0xffffff, 0.22)
      bg.slice(0, 0, r - 3, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340), false)
      bg.fillPath()
    }
    draw(false)

    container.add([shadow, bg, icon])
    container.setSize(r * 2, r * 2)
    container.setInteractive(
      new Phaser.Geom.Circle(0, 0, r),
      Phaser.Geom.Circle.Contains,
      { useHandCursor: true }
    )

    const scaleTo = (s) => {
      this.tweens.killTweensOf(container)
      this.tweens.add({ targets: container, scale: s, duration: 80, ease: 'Quad.out' })
    }

    container.on('pointerover', () => { draw(true);  scaleTo(1.08) })
    container.on('pointerout',  () => { draw(false); scaleTo(1) })
    container.on('pointerdown', () => {
      const muted = audio.toggleMute()
      icon.setText(muted ? '🔇' : '🔊')
      draw(true)
      this.tweens.killTweensOf(container)
      this.tweens.add({ targets: container, scale: 0.9, duration: 70, yoyo: true })
    })

    return container
  }

  makeButton(x, y, label, opts) {
    const { height, fontSize, color, hover, border, onClick } = opts
    const container = this.add.container(x, y)

    const text = this.add.text(0, 0, label, {
      fontSize: `${fontSize}px`, fontStyle: 'bold', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5)

    // fixedWidth keeps every button the same size (no auto-grow to fit the label)
    const width = opts.fixedWidth ? opts.width : Math.max(opts.width, Math.ceil(text.width) + 36)

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

  quitGame() {
    const msg = getLang().quitMessage

    window.close()

    this.cameras.main.fadeOut(400)
    this.time.delayedCall(400, () => {
      this.game.destroy(true)
      document.body.innerHTML =
        `<div style="color:#FFD700;font-family:sans-serif;font-size:26px;` +
        `text-align:center;padding:0 20px;">${msg}</div>`
    })
  }
}
