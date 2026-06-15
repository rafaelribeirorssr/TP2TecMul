import Phaser from 'phaser'
import pt from '../locales/pt.json'
import en from '../locales/en.json'
import { SKINS, SPRITE_FRAMES } from '../assetConfig.js'

const langs = { pt, en }
let currentLang = 'pt'
let activeSkinIndex = 0

export function getLang()           { return langs[currentLang] }
export function setLang(l)          { currentLang = l }
export function getActiveSkinIndex(){ return activeSkinIndex }

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene') }

  create() {
    const t  = getLang()
    const cx = this.scale.width / 2

    this.add.rectangle(0, 0, 800, 500, 0x1a1a2e).setOrigin(0)

    this.titleText = this.add.text(cx, 50, t.title, {
      fontSize: '44px', fill: '#FFD700', fontStyle: 'bold'
    }).setOrigin(0.5)

    // --- Iniciar jogo ---
    this.startBtn = this.add.text(cx, 110, `▶  ${t.start}`, {
      fontSize: '26px', fill: '#ffffff',
      backgroundColor: '#e74c3c', padding: { x: 20, y: 9 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    this.startBtn.on('pointerover', () => this.startBtn.setStyle({ fill: '#FFD700' }))
    this.startBtn.on('pointerout',  () => this.startBtn.setStyle({ fill: '#ffffff' }))
    this.startBtn.on('pointerdown', () => this.scene.start('GameScene', { level: 0 }))

    // --- Selecionar nível ---
    const selectLabel = currentLang === 'pt' ? 'Escolher nível' : 'Select level'
    this.add.text(cx, 172, selectLabel, {
      fontSize: '15px', fill: '#aaaaaa'
    }).setOrigin(0.5)

    const xs = [cx - 220, cx - 110, cx, cx + 110, cx + 220]
    for (let i = 0; i < 5; i++) {
      this.makeLevelButton(xs[i], 205, i + 1)
    }

    // --- Seletor de skin ---
    const skinLabel = currentLang === 'pt' ? 'Personagem' : 'Character'
    this.add.text(cx, 248, skinLabel, {
      fontSize: '15px', fill: '#aaaaaa'
    }).setOrigin(0.5)

    const skinXs = [cx - 165, cx - 55, cx + 55, cx + 165]
    SKINS.forEach((skin, i) => {
      const label = currentLang === 'pt' ? skin.label_pt : skin.label_en
      const selected = activeSkinIndex === i
      const btn = this.add.text(skinXs[i], 278, label, {
        fontSize: '15px', fill: selected ? '#FFD700' : '#ffffff',
        backgroundColor: selected ? '#2a5a2e' : '#3a3a5e',
        padding: { x: 10, y: 7 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true })

      btn.on('pointerover', () => { if (activeSkinIndex !== i) btn.setStyle({ fill: '#FFD700' }) })
      btn.on('pointerout',  () => { if (activeSkinIndex !== i) btn.setStyle({ fill: '#ffffff' }) })
      btn.on('pointerdown', () => { activeSkinIndex = i; this.scene.restart() })

      // Preview: recorta o frame "idle" da spritesheet (não a folha inteira)
      const previewColors = [0xcc0000, 0x111111, 0x6677aa, 0x6600cc]
      if (skin.url && this.textures.exists(skin.key)) {
        const tex   = this.textures.get(skin.key)
        const idle  = SPRITE_FRAMES[skin.key]?.idle
        const fname = 'menu_idle'
        if (idle && !tex.has(fname)) tex.add(fname, 0, idle.x, idle.y, idle.w, idle.h)

        const img = tex.has(fname)
          ? this.add.image(skinXs[i], 320, skin.key, fname)
          : this.add.image(skinXs[i], 320, skin.key)
        // Escala mantendo a proporção, dentro de uma caixa de ~32x42 px
        const s = Math.min(32 / img.width, 42 / img.height)
        img.setScale(s).setOrigin(0.5)
      } else {
        const g = this.add.graphics()
        g.fillStyle(previewColors[i], selected ? 1 : 0.5)
        g.fillRect(skinXs[i] - 14, 302, 28, 36)
        if (selected) {
          g.lineStyle(2, 0xFFD700)
          g.strokeRect(skinXs[i] - 15, 301, 30, 38)
        }
      }
    })

    // --- Controlos ---
    this.controlsText = this.add.text(cx, 360, t.controls, {
      fontSize: '13px', fill: '#aaaaaa'
    }).setOrigin(0.5)

    // --- Botões de idioma ---
    this.add.text(cx - 40, 400, '🇵🇹 PT', {
      fontSize: '17px', fill: currentLang === 'pt' ? '#FFD700' : '#888888'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { setLang('pt'); this.scene.restart() })

    this.add.text(cx + 40, 400, '🇬🇧 EN', {
      fontSize: '17px', fill: currentLang === 'en' ? '#FFD700' : '#888888'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { setLang('en'); this.scene.restart() })

    // --- Sair ---
    const quitLabel = currentLang === 'pt' ? '✕  Sair' : '✕  Quit'
    const quitBtn = this.add.text(cx, 448, quitLabel, {
      fontSize: '19px', fill: '#ffffff',
      backgroundColor: '#555555', padding: { x: 18, y: 7 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    quitBtn.on('pointerover', () => quitBtn.setStyle({ fill: '#ff6666' }))
    quitBtn.on('pointerout',  () => quitBtn.setStyle({ fill: '#ffffff' }))
    quitBtn.on('pointerdown', () => this.quitGame())
  }

  makeLevelButton(x, y, levelNumber) {
    const t = getLang()
    const btn = this.add.text(x, y, `${t.level} ${levelNumber}`, {
      fontSize: '18px', fill: '#ffffff',
      backgroundColor: '#3a3a5e', padding: { x: 12, y: 7 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    btn.on('pointerover', () => btn.setStyle({ fill: '#FFD700' }))
    btn.on('pointerout',  () => btn.setStyle({ fill: '#ffffff' }))
    // levelNumber 1..5  ->  índice de nível 0..4
    btn.on('pointerdown', () => this.scene.start('GameScene', { level: levelNumber - 1 }))

    return btn
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
