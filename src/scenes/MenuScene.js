import Phaser from 'phaser'
import pt from '../locales/pt.json'
import en from '../locales/en.json'

const langs = { pt, en }
let currentLang = 'pt'

export function getLang() { return langs[currentLang] }
export function setLang(l) { currentLang = l }

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene') }

  create() {
    const t  = getLang()
    const cx = this.scale.width / 2

    this.add.rectangle(0, 0, 800, 500, 0x1a1a2e).setOrigin(0)

    this.titleText = this.add.text(cx, 60, t.title, {
      fontSize: '46px', fill: '#FFD700', fontStyle: 'bold'
    }).setOrigin(0.5)

    // --- Iniciar jogo (começa no nível 1) ---
    this.startBtn = this.add.text(cx, 135, `▶  ${t.start}`, {
      fontSize: '28px', fill: '#ffffff',
      backgroundColor: '#e74c3c', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    this.startBtn.on('pointerover', () => this.startBtn.setStyle({ fill: '#FFD700' }))
    this.startBtn.on('pointerout',  () => this.startBtn.setStyle({ fill: '#ffffff' }))
    this.startBtn.on('pointerdown', () => this.scene.start('GameScene', { level: 0 }))

    // --- Selecionar nível ---
    const selectLabel = currentLang === 'pt' ? 'Escolher nível' : 'Select level'
    this.add.text(cx, 205, selectLabel, {
      fontSize: '18px', fill: '#aaaaaa'
    }).setOrigin(0.5)

    const xs = [cx - 150, cx, cx + 150]
    for (let i = 0; i < 3; i++) {
      this.makeLevelButton(xs[i], 258, i + 1)
    }

    // --- Controlos ---
    this.controlsText = this.add.text(cx, 322, t.controls, {
      fontSize: '14px', fill: '#aaaaaa'
    }).setOrigin(0.5)

    // --- Botões de idioma ---
    this.add.text(cx - 40, 378, '🇵🇹 PT', {
      fontSize: '18px', fill: currentLang === 'pt' ? '#FFD700' : '#888888'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { setLang('pt'); this.scene.restart() })

    this.add.text(cx + 40, 378, '🇬🇧 EN', {
      fontSize: '18px', fill: currentLang === 'en' ? '#FFD700' : '#888888'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { setLang('en'); this.scene.restart() })

    // --- Sair do jogo ---
    const quitLabel = currentLang === 'pt' ? '✕  Sair' : '✕  Quit'
    const quitBtn = this.add.text(cx, 440, quitLabel, {
      fontSize: '20px', fill: '#ffffff',
      backgroundColor: '#555555', padding: { x: 18, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    quitBtn.on('pointerover', () => quitBtn.setStyle({ fill: '#ff6666' }))
    quitBtn.on('pointerout',  () => quitBtn.setStyle({ fill: '#ffffff' }))
    quitBtn.on('pointerdown', () => this.quitGame())
  }

  // Cria um botão "Nível N" que arranca o jogo nesse nível
  makeLevelButton(x, y, levelNumber) {
    const t = getLang()
    const btn = this.add.text(x, y, `${t.level} ${levelNumber}`, {
      fontSize: '20px', fill: '#ffffff',
      backgroundColor: '#3a3a5e', padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    btn.on('pointerover', () => btn.setStyle({ fill: '#FFD700' }))
    btn.on('pointerout',  () => btn.setStyle({ fill: '#ffffff' }))
    // levelNumber 1..3  ->  índice de nível 0..2
    btn.on('pointerdown', () => this.scene.start('GameScene', { level: levelNumber - 1 }))

    return btn
  }

  // Sair definitivamente do jogo
  quitGame() {
    const msg = currentLang === 'pt'
      ? 'Obrigado por jogar! Já podes fechar este separador.'
      : 'Thanks for playing! You can close this tab now.'

    // Tenta fechar o separador. Só funciona se a página tiver sido aberta
    // por script (window.open); num separador normal o browser bloqueia.
    window.close()

    // Como na maioria dos casos o close é bloqueado, desligamos o jogo
    // e mostramos um ecrã de despedida.
    this.cameras.main.fadeOut(400)
    this.time.delayedCall(400, () => {
      this.game.destroy(true)
      document.body.innerHTML =
        `<div style="color:#FFD700;font-family:sans-serif;font-size:26px;` +
        `text-align:center;padding:0 20px;">${msg}</div>`
    })
  }
}