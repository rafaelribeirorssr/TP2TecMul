import Phaser from 'phaser'
import pt from '../locales/pt.json'
import en from '../locales/en.json'
import { SKINS, SPRITE_FRAMES } from '../assetConfig.js'

const langs = { pt, en }
let currentLang = 'pt'
let activeSkinIndex = 0

export function getLang()             { return langs[currentLang] }
export function setLang(l)            { currentLang = l }
export function getActiveSkinIndex()  { return activeSkinIndex }
export function setActiveSkinIndex(i) { activeSkinIndex = i }
export function getActiveCharacter()  { return SKINS[activeSkinIndex] }
export function getCurrentLang()      { return currentLang }

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene') }

  create() {
    const t  = getLang()
    const w  = this.scale.width
    const h  = this.scale.height
    const cx = w / 2

    this.drawBackground(w, h)

    // --- Título ---
    this.add.text(cx, 52, t.title, {
      fontSize: '46px', fontStyle: 'bold', fill: '#FFE34D',
      stroke: '#C0392B', strokeThickness: 8
    }).setOrigin(0.5).setShadow(0, 5, 'rgba(0,0,0,0.35)', 6)

    // --- Iniciar jogo ---
    this.makeButton(cx, 116, `▶  ${t.start}`, {
      width: 230, height: 50, fontSize: 26,
      color: 0x3CB043, hover: 0x57D85F, border: 0x1E7A2A,
      onClick: () => this.scene.start('GameScene', { level: 0 })
    })

    // --- Selecionar nível ---
    const selectLabel = currentLang === 'pt' ? 'Escolher nível' : 'Select level'
    this.add.text(cx, 168, selectLabel, {
      fontSize: '15px', fontStyle: 'bold', fill: '#ffffff',
      stroke: '#1B3A6B', strokeThickness: 3
    }).setOrigin(0.5)

    const xs = [cx - 220, cx - 110, cx, cx + 110, cx + 220]
    for (let i = 0; i < 5; i++) {
      this.makeButton(xs[i], 205, `${t.level} ${i + 1}`, {
        width: 96, height: 40, fontSize: 18,
        color: 0x2E86DE, hover: 0x54A0F0, border: 0x1B5FA8,
        onClick: () => this.scene.start('GameScene', { level: i })
      })
    }

    // --- Botão: escolher personagem (abre o ecrã de seleção) ---
    const skinLabel = currentLang === 'pt' ? 'Personagem' : 'Character'
    this.add.text(cx, 250, skinLabel, {
      fontSize: '15px', fontStyle: 'bold', fill: '#ffffff',
      stroke: '#1B3A6B', strokeThickness: 3
    }).setOrigin(0.5)

    const ch     = SKINS[activeSkinIndex]
    const chName = currentLang === 'pt' ? ch.label_pt : ch.label_en
    const chRole = currentLang === 'pt' ? ch.role_pt  : ch.role_en
    this.makeButton(cx, 286, `👤  ${chName} — ${chRole}`, {
      width: 250, height: 40, fontSize: 18,
      color: 0xF5A623, hover: 0xFFB733, border: 0xC77F12,
      onClick: () => this.scene.start('CharacterScene')
    })

    // Mini-preview da personagem atualmente selecionada
    this.drawSkinPreview(activeSkinIndex, cx, 330)

    // --- Controlos ---
    this.add.text(cx, 366, t.controls, {
      fontSize: '13px', fill: '#ffffff',
      stroke: '#1B3A6B', strokeThickness: 3
    }).setOrigin(0.5)

    // --- Botões de idioma ---
    this.makeButton(cx - 52, 402, '🇵🇹 PT', {
      width: 80, height: 32, fontSize: 16,
      color:  currentLang === 'pt' ? 0xF5A623 : 0x57606F,
      hover:  currentLang === 'pt' ? 0xFFB733 : 0x747D8C,
      border: currentLang === 'pt' ? 0xC77F12 : 0x3C4453,
      onClick: () => { setLang('pt'); this.scene.restart() }
    })
    this.makeButton(cx + 52, 402, '🇬🇧 EN', {
      width: 80, height: 32, fontSize: 16,
      color:  currentLang === 'en' ? 0xF5A623 : 0x57606F,
      hover:  currentLang === 'en' ? 0xFFB733 : 0x747D8C,
      border: currentLang === 'en' ? 0xC77F12 : 0x3C4453,
      onClick: () => { setLang('en'); this.scene.restart() }
    })

    // --- Sair ---
    const quitLabel = currentLang === 'pt' ? '✕  Sair' : '✕  Quit'
    this.makeButton(cx, 450, quitLabel, {
      width: 130, height: 38, fontSize: 19,
      color: 0xE0392B, hover: 0xF0564A, border: 0xA81F14,
      onClick: () => this.quitGame()
    })
  }

  // Desenha o sprite "idle" de uma personagem centrado em (x, y)
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

  // Fundo estilo Mario: céu azul em degradé + nuvens + colina + chão
  drawBackground(w, h) {
    const g = this.add.graphics()
    g.fillGradientStyle(0x5DA9FF, 0x5DA9FF, 0x9BD0FF, 0x9BD0FF, 1)
    g.fillRect(0, 0, w, h)

    // Colina ao fundo
    g.fillStyle(0x6FCF5B, 1)
    g.fillEllipse(w * 0.78, h + 60, 360, 220)
    g.fillEllipse(w * 0.18, h + 80, 300, 200)

    // Chão
    g.fillStyle(0x57B84A, 1)
    g.fillRect(0, h - 26, w, 26)
    g.fillStyle(0x3E9135, 1)
    g.fillRect(0, h - 26, w, 6)

    // Nuvens
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

  // Botão arredondado, colorido, com borda, sombra e animação de hover
  makeButton(x, y, label, opts) {
    const { height, fontSize, color, hover, border, onClick } = opts
    const container = this.add.container(x, y)

    // Texto primeiro, para a largura do botão se ajustar a ele
    const text = this.add.text(0, 0, label, {
      fontSize: `${fontSize}px`, fontStyle: 'bold', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5)

    // Largura = mínimo pedido, mas sempre com folga suficiente para o texto
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
      // brilho no topo
      bg.fillStyle(0xffffff, 0.18)
      bg.fillRoundedRect(-width / 2 + 4, -height / 2 + 4, width - 8, height / 2 - 4, 8)
    }
    draw(color)

    // Ordem: sombra, fundo e texto por cima
    container.add([shadow, bg, text])
    container.setSize(width, height)
    container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains,
      { useHandCursor: true }
    )

    // Animação de escala fiável: matar tweens antigos antes de criar novos
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
    const msg = currentLang === 'pt'
      ? 'Obrigado por jogar! Já podes fechar este separador.'
      : 'Thanks for playing! You can close this tab now.'

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
