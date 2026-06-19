import { SKIN_CONFIGS } from '../data/skins.js'
import { BG_LAYERS, SPRITE_FRAMES } from '../assetConfig.js'

// Funções que CRIAM as imagens/texturas do jogo a partir de código
// (personagens desenhadas, moedas, inimigos, porta) e as camadas de fundo.
// São "coladas" à GameScene no fim do ficheiro GameScene.js.
export const TextureMixin = {
  createPlayerTexture() {
    this.createSkinTextures()
  },

  createSkinTextures() {
    SKIN_CONFIGS.forEach((cfg, i) => this.createProceduralSkin(`skin${i}`, cfg))
  },

  createProceduralSkin(key, cfg) {
    if (this.textures.exists(key)) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(cfg.hat);     g.fillRect(4, 0, 32, 10)
    g.fillStyle(cfg.hatBrim); g.fillRect(8, 10, 24, 8)
    g.fillStyle(cfg.face);    g.fillRect(8, 18, 24, 16)
    g.fillStyle(cfg.eyes);    g.fillRect(13, 21, 5, 5); g.fillRect(23, 21, 5, 5)
    g.fillStyle(cfg.detail);  g.fillRect(10, 29, 20, 4)
    g.fillStyle(cfg.body);    g.fillRect(6, 34, 28, 16)
    g.fillStyle(cfg.buttons); g.fillRect(12, 36, 4, 4); g.fillRect(24, 36, 4, 4)
    g.fillStyle(cfg.shoes);   g.fillRect(4, 44, 14, 6); g.fillRect(22, 44, 14, 6)
    g.generateTexture(key, 40, 50)
    g.destroy()
  },

  createParallaxLayers(W, H) {
    const layers = BG_LAYERS[this.currentLevel]
    if (!layers) return
    layers.forEach(layer => {
      if (!this.textures.exists(layer.key)) return
      const ts = this.add.tileSprite(W / 2, H / 2, W, H, layer.key)
      ts.setScrollFactor(0).setDepth(0)
      ts.parallaxFactor = layer.scrollFactor
      this.parallaxLayers.push(ts)
    })
  },

  setupSpriteFrames(playerKey) {
    const cfg = SPRITE_FRAMES[playerKey]
    if (!cfg) return false
    const tex = this.textures.get(playerKey)
    if (!tex) return false

    const add = (name, f) => { if (f && !tex.has(name)) tex.add(name, 0, f.x, f.y, f.w, f.h) }

    add('idle', cfg.idle)
    add('jump', cfg.jump)
    cfg.walk?.forEach((f, i) => add(`walk${i}`, f))

    const animKey = this.walkAnimKey
    if (cfg.walk?.length && !this.anims.exists(animKey)) {
      this.anims.create({
        key: animKey,
        frames: cfg.walk.map((_, i) => ({ key: playerKey, frame: `walk${i}` })),
        frameRate: 8,
        repeat: -1,
      })
    }
    return true
  },

  createCoinTexture() {
    if (this.textures.exists('coin')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0xFFD700); g.fillCircle(10, 10, 10)
    g.fillStyle(0xFFA500); g.fillCircle(10, 10, 7)
    g.fillStyle(0xFFFF88); g.fillRect(7, 4, 6, 12)
    g.generateTexture('coin', 20, 20)
    g.destroy()
  },

  createEnemyTexture() {

    if (!this.textures.exists('enemy')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(0x8B4513); g.fillEllipse(18, 22, 36, 28)
      g.fillStyle(0xcc6600); g.fillEllipse(18, 20, 28, 22)
      g.fillStyle(0xffffff); g.fillRect(6, 12, 8, 6); g.fillRect(22, 12, 8, 6)
      g.fillStyle(0x000000); g.fillRect(9, 13, 4, 4);  g.fillRect(25, 13, 4, 4)
      g.fillStyle(0x000000); g.fillRect(5, 10, 10, 3); g.fillRect(21, 10, 10, 3)
      g.fillStyle(0x4a2800); g.fillEllipse(8, 34, 14, 8); g.fillEllipse(28, 34, 14, 8)
      g.generateTexture('enemy', 36, 38)
      g.destroy()
    }

    if (!this.textures.exists('enemy_flyer')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(0x2f80ed); g.fillTriangle(0, 6, 18, 2, 16, 22)
      g.fillStyle(0x2f80ed); g.fillTriangle(48, 6, 30, 2, 32, 22)
      g.fillStyle(0x56ccf2); g.fillEllipse(24, 16, 26, 24)
      g.fillStyle(0xffffff); g.fillCircle(19, 13, 4); g.fillCircle(29, 13, 4)
      g.fillStyle(0x000000); g.fillCircle(20, 13, 2); g.fillCircle(28, 13, 2)
      g.fillStyle(0xffffff); g.fillTriangle(21, 24, 24, 24, 22, 29)
      g.fillStyle(0xffffff); g.fillTriangle(24, 24, 27, 24, 26, 29)
      g.generateTexture('enemy_flyer', 48, 32)
      g.destroy()
    }

    if (!this.textures.exists('enemy_jumper')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(0x1e8449); g.fillEllipse(8, 33, 14, 8); g.fillEllipse(28, 33, 14, 8)
      g.fillStyle(0x2ecc40); g.fillEllipse(18, 20, 34, 26)
      g.fillStyle(0x82e0aa); g.fillEllipse(18, 26, 26, 14)
      g.fillStyle(0xffffff); g.fillCircle(11, 8, 6); g.fillCircle(25, 8, 6)
      g.fillStyle(0x000000); g.fillCircle(11, 9, 3); g.fillCircle(25, 9, 3)
      g.fillStyle(0x145a32); g.fillRect(10, 23, 16, 2)
      g.generateTexture('enemy_jumper', 36, 38)
      g.destroy()
    }

    if (!this.textures.exists('enemy_chaser')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(0x7b241c); g.fillTriangle(4, 8, 13, 1, 12, 13)
      g.fillStyle(0x7b241c); g.fillTriangle(34, 8, 25, 1, 26, 13)
      g.fillStyle(0xc0392b); g.fillEllipse(19, 22, 36, 28)
      g.fillStyle(0xe74c3c); g.fillEllipse(19, 20, 28, 22)
      g.fillStyle(0xffff00); g.fillTriangle(8, 14, 18, 12, 9, 20)
      g.fillStyle(0xffff00); g.fillTriangle(30, 14, 20, 12, 29, 20)
      g.fillStyle(0x000000); g.fillCircle(12, 16, 2); g.fillCircle(26, 16, 2)
      g.fillStyle(0xffffff); g.fillTriangle(11, 29, 15, 29, 13, 34)
      g.fillStyle(0xffffff); g.fillTriangle(23, 29, 27, 29, 25, 34)
      g.generateTexture('enemy_chaser', 38, 38)
      g.destroy()
    }
  },

  createDoorTexture() {
    if (this.textures.exists('door')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })

    g.fillStyle(0x8B4513); g.fillRect(0, 0, 60, 90)

    g.fillStyle(0x4169e1); g.fillRect(5, 5, 50, 85)

    g.fillStyle(0xFFD700); g.fillRect(20, 5, 20, 5)

    g.fillStyle(0xFFD700); g.fillCircle(42, 48, 5)

    g.fillStyle(0xFFD700); g.fillTriangle(30, 8, 22, 30, 38, 30)
    g.generateTexture('door', 60, 90)
    g.destroy()
  },
}
