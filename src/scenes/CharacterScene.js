import Phaser from 'phaser'
import { SKINS, SPRITE_FRAMES, STAT_RANGES } from '../assetConfig.js'
import { getActiveSkinIndex, setActiveSkinIndex, getCurrentLang } from './MenuScene.js'

export class CharacterScene extends Phaser.Scene {
  constructor() { super('CharacterScene') }

  create() {
    const w  = this.scale.width
    const h  = this.scale.height
    const cx = w / 2
    const pt = getCurrentLang() === 'pt'

    this.drawBackground(w, h)

    // --- Título ---
    this.add.text(cx, 38, pt ? 'Escolher personagem' : 'Choose your character', {
      fontSize: '34px', fontStyle: 'bold', fill: '#FFE34D',
      stroke: '#C0392B', strokeThickness: 7
    }).setOrigin(0.5).setShadow(0, 4, 'rgba(0,0,0,0.35)', 5)

    this.add.text(cx, 70, pt
      ? 'Cada uma tem salto, velocidade e vidas diferentes — escolhe o teu estilo!'
      : 'Each one has different jump, speed and lives — pick your style!', {
      fontSize: '13px', fill: '#ffffff', stroke: '#1B3A6B', strokeThickness: 3
    }).setOrigin(0.5)

    // --- Cartas das personagens ---
    const centers = [cx - 276, cx - 92, cx + 92, cx + 276]
    SKINS.forEach((skin, i) => this.drawCard(skin, i, centers[i], pt))

    // --- Voltar ---
    this.makeButton(cx, 476, pt ? '◀  Voltar' : '◀  Back', {
      width: 150, height: 34, fontSize: 17,
      color: 0xE0392B, hover: 0xF0564A, border: 0xA81F14,
      onClick: () => this.scene.start('MenuScene')
    })
  }

  drawCard(skin, i, centerX, pt) {
    const T        = 92            // topo da carta
    const CW       = 168           // largura
    const CH       = 332           // altura
    const left     = centerX - CW / 2
    const selected = getActiveSkinIndex() === i

    // Fundo da carta
    const bg = this.add.graphics()
    const drawBg = (fill, borderCol) => {
      bg.clear()
      bg.fillStyle(fill, 0.95)
      bg.fillRoundedRect(left, T, CW, CH, 14)
      bg.lineStyle(selected ? 4 : 2, borderCol, 1)
      bg.strokeRoundedRect(left, T, CW, CH, 14)
    }
    drawBg(selected ? 0x2c3e66 : 0x223052, selected ? 0xFFD24A : 0x3f5488)

    // Selo "selecionado"
    if (selected) {
      this.add.text(centerX, T + 14, pt ? '★ SELECIONADO' : '★ SELECTED', {
        fontSize: '12px', fontStyle: 'bold', fill: '#FFD24A'
      }).setOrigin(0.5)
    }

    // Preview da personagem
    this.drawSkinPreview(i, centerX, T + 66)

    // Nome + função
    this.add.text(centerX, T + 108, pt ? skin.label_pt : skin.label_en, {
      fontSize: '20px', fontStyle: 'bold', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5)

    this.add.text(centerX, T + 130, pt ? skin.role_pt : skin.role_en, {
      fontSize: '14px', fontStyle: 'bold', fill: '#FFD24A'
    }).setOrigin(0.5)

    // Barras de estatísticas
    const barL = left + 14
    const barR = left + CW - 14
    this.drawStatBar(barL, barR, T + 168, pt ? 'Salto'      : 'Jump',  skin.jump,  STAT_RANGES.jump,  0x3CB043)
    this.drawStatBar(barL, barR, T + 210, pt ? 'Velocidade' : 'Speed', skin.speed, STAT_RANGES.speed, 0x2E86DE)
    this.drawStatBar(barL, barR, T + 252, pt ? 'Vidas'      : 'Lives', skin.lives, STAT_RANGES.lives, 0xE0556B)

    // Mostra o nº de vidas em texto (mais claro que a barra)
    this.add.text(barR, T + 252 - 14, `${skin.lives} ❤️`, {
      fontSize: '12px', fill: '#ffffff'
    }).setOrigin(1, 0.5)

    // Carta clicável: seleciona e volta ao menu
    const zone = this.add.rectangle(centerX, T + CH / 2, CW, CH, 0x000000, 0).setInteractive({ useHandCursor: true })
    zone.on('pointerover', () => { if (!selected) drawBg(0x32436e, 0x6f8ac0) })
    zone.on('pointerout',  () => { if (!selected) drawBg(0x223052, 0x3f5488) })
    zone.on('pointerdown', () => {
      setActiveSkinIndex(i)
      this.scene.start('MenuScene')
    })
  }

  drawStatBar(x1, x2, y, label, value, range, color) {
    this.add.text(x1, y - 14, label, {
      fontSize: '12px', fontStyle: 'bold', fill: '#cfe0ff'
    }).setOrigin(0, 0.5)

    const barW = x2 - x1
    const pct  = Phaser.Math.Clamp((value - range.min) / (range.max - range.min), 0, 1)

    const g = this.add.graphics()
    g.fillStyle(0x12203a, 1)
    g.fillRoundedRect(x1, y, barW, 12, 4)
    g.fillStyle(color, 1)
    g.fillRoundedRect(x1, y, Math.max(6, barW * pct), 12, 4)
    g.lineStyle(1, 0x000000, 0.4)
    g.strokeRoundedRect(x1, y, barW, 12, 4)
  }

  drawSkinPreview(i, x, y) {
    const skin = SKINS[i]
    const previewColors = [0xcc0000, 0x111111, 0x6677aa, 0x6600cc]
    if (skin.url && this.textures.exists(skin.key)) {
      const tex   = this.textures.get(skin.key)
      const idle  = SPRITE_FRAMES[skin.key]?.idle
      const fname = 'char_idle'
      if (idle && !tex.has(fname)) tex.add(fname, 0, idle.x, idle.y, idle.w, idle.h)
      const img = tex.has(fname)
        ? this.add.image(x, y, skin.key, fname)
        : this.add.image(x, y, skin.key)
      const s = Math.min(58 / img.width, 74 / img.height)
      return img.setScale(s).setOrigin(0.5)
    }
    const g = this.add.graphics()
    g.fillStyle(previewColors[i] ?? 0x888888, 1)
    g.fillRect(x - 22, y - 30, 44, 60)
    return g
  }

  drawBackground(w, h) {
    const g = this.add.graphics()
    g.fillGradientStyle(0x5DA9FF, 0x5DA9FF, 0x9BD0FF, 0x9BD0FF, 1)
    g.fillRect(0, 0, w, h)
    g.fillStyle(0x6FCF5B, 1)
    g.fillEllipse(w * 0.8, h + 60, 360, 220)
    g.fillEllipse(w * 0.15, h + 80, 300, 200)
    g.fillStyle(0x57B84A, 1)
    g.fillRect(0, h - 22, w, 22)
  }

  // Botão arredondado com hover (versão compacta do usado no menu)
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
    const draw = (fill) => {
      bg.clear()
      bg.fillStyle(fill, 1)
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
      Phaser.Geom.Rectangle.Contains, { useHandCursor: true }
    )

    const scaleTo = (s) => {
      this.tweens.killTweensOf(container)
      this.tweens.add({ targets: container, scale: s, duration: 80, ease: 'Quad.out' })
    }
    container.on('pointerover', () => { draw(hover); scaleTo(1.06) })
    container.on('pointerout',  () => { draw(color); scaleTo(1) })
    container.on('pointerdown', () => {
      this.tweens.killTweensOf(container)
      this.tweens.add({ targets: container, scale: 0.94, duration: 70, yoyo: true, onComplete: () => onClick() })
    })
    return container
  }
}

