import { ENEMY_SKINS } from '../assetConfig.js'

// Funções que CRIAM os objetos do jogo no nível:
// plataformas (fixas, móveis e que caem), moedas, inimigos e picos.
// São "coladas" à GameScene no fim do ficheiro GameScene.js.
export const EntityMixin = {
  createPlatform(x, y, width) {
    const colors  = [0x5cb85c, 0x7777bb, 0xcc5500, 0x4499cc, 0xaa2277]
    const topCol  = [0x6edd6e, 0x9999cc, 0xff7722, 0x66bbee, 0xcc44aa]
    const col     = colors[this.currentLevel]
    const top     = topCol[this.currentLevel]

    const g = this.add.graphics()
    g.fillStyle(col)
    g.fillRect(x - width / 2, y - 10, width, 20)
    g.fillStyle(top)
    g.fillRect(x - width / 2, y - 10, width, 7)
    g.lineStyle(1, 0x000000, 0.25)
    g.strokeRect(x - width / 2, y - 10, width, 20)
    g.setDepth(2)

    const plat = this.add.rectangle(x, y, width, 20, col)
    plat.setAlpha(0)
    this.physics.add.existing(plat, true)
    this.platforms.add(plat)
  },

  createMovingPlatform(mp) {
    const key = 'movplat_' + mp.x
    if (!this.textures.exists(key)) {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(0xdd6622)
      g.fillRect(0, 0, mp.w, 20)
      g.fillStyle(0xff8844)
      g.fillRect(0, 0, mp.w, 7)
      g.lineStyle(1, 0x000000, 0.4)
      g.strokeRect(0, 0, mp.w, 20)
      g.generateTexture(key, mp.w, 20)
      g.destroy()
    }
    const plat = this.physics.add.image(mp.x, mp.y, key)
    plat.setImmovable(true)
    plat.body.allowGravity = false
    plat.setDepth(2)
    plat.startX  = mp.x
    plat.range   = mp.range
    plat.movSpeed = mp.speed
    plat.moveDir  = 1
    this.movingPlatforms.add(plat)
    this.movingPlatformList.push(plat)
  },

  createCoin(x, y) {
    const coin = this.physics.add.staticSprite(x, y, 'coin')
    coin.setDepth(4)
    this.coins.add(coin)
    this.tweens.add({
      targets: coin, y: y - 8, duration: 700,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    })
  },

  createEnemy(cfg, speed) {
    const type   = cfg.type || 'walker'
    const skin   = ENEMY_SKINS[type]
    const useImg = skin && this.textures.exists(skin.key)
    // fall back to the procedurally drawn blobs if a skin image is missing
    const texKey = useImg
      ? skin.key
      : ({ flyer: 'enemy_flyer', jumper: 'enemy_jumper', chaser: 'enemy_chaser' }[type] || 'enemy')
    const enemy  = this.physics.add.sprite(cfg.x, cfg.y, texKey)

    if (useImg) {
      // scale uniformly to the target height; the Arcade body scales with it
      enemy.setScale(skin.dispH / enemy.height)
    }

    enemy.setCollideWorldBounds(true)
    enemy.setDepth(4)
    enemy.direction = 1
    enemy.speed     = speed
    enemy.startX    = cfg.x
    enemy.startY    = cfg.y
    enemy.patrol    = cfg.patrol
    enemy.type      = type
    enemy.nextJump  = 0

    if (type === 'flyer') enemy.body.setAllowGravity(false)

    // play the Koopa's walk cycle so it actually takes steps instead of sliding
    if (useImg && skin.sheet) {
      const animKey = `${skin.key}_walk`
      if (!this.anims.exists(animKey)) {
        this.anims.create({
          key: animKey,
          frames: this.anims.generateFrameNumbers(skin.key, { start: 0, end: skin.sheet.frames - 1 }),
          frameRate: skin.sheet.rate,
          repeat: -1,
        })
      }
      enemy.play(animKey)
    }

    enemy.body.setVelocityX(speed)

    if (type !== 'flyer') this.enemyGroup.add(enemy)
    this.enemies.push(enemy)
  },

  createSpikes(x, y, w) {
    const spikeW = 14
    const count  = Math.max(1, Math.floor(w / spikeW))
    const startX = x - (count * spikeW) / 2

    const g = this.add.graphics()
    g.setDepth(3)
    for (let i = 0; i < count; i++) {
      const sx = startX + i * spikeW
      g.fillStyle(0xcfd8dc)
      g.fillTriangle(sx, y, sx + spikeW, y, sx + spikeW / 2, y - 16)
      g.fillStyle(0xffffff, 0.6)
      g.fillTriangle(sx + spikeW / 2, y - 16, sx + spikeW / 2 - 2, y - 4, sx + spikeW / 2 + 1, y - 4)
    }
    g.lineStyle(1, 0x607d8b, 0.8)
    g.strokeRect(startX, y - 2, count * spikeW, 2)

    const zone = this.add.rectangle(x, y - 8, count * spikeW, 14)
    zone.setAlpha(0)
    this.physics.add.existing(zone, true)
    this.spikes.add(zone)
  },

  createFallingPlatform(x, y, w) {
    const plat = this.add.rectangle(x, y, w, 20, 0xc97b3c)
    this.physics.add.existing(plat, true)
    plat.setDepth(2)
    plat.fallState = 'idle'
    plat.origY     = y

    const top = this.add.rectangle(x, y - 6, w, 7, 0xe09b5c).setDepth(2)
    const crack = this.add.graphics().setDepth(2)
    crack.lineStyle(1, 0x000000, 0.35)
    crack.lineBetween(x - w / 4, y - 8, x - w / 4 + 6, y + 8)
    crack.lineBetween(x + w / 6, y - 8, x + w / 6 - 5, y + 8)
    plat.deco = [top, crack]

    this.fallingPlatforms.add(plat)
  },

  touchFallingPlatform(player, plat) {

    if (plat.fallState !== 'idle') return
    if (!player.body.blocked.down || player.y > plat.y) return

    plat.fallState = 'shaking'

    this.tweens.add({
      targets: [plat, ...plat.deco],
      x: '+=3', duration: 45, yoyo: true, repeat: 9
    })

    this.time.delayedCall(550, () => {

      plat.fallState = 'falling'
      plat.body.enable = false
      this.tweens.add({
        targets: [plat, ...plat.deco],
        y: '+=420', alpha: 0, duration: 700, ease: 'Quad.easeIn'
      })

      this.time.delayedCall(2800, () => {
        this.tweens.killTweensOf([plat, ...plat.deco])
        plat.y = plat.origY
        plat.setAlpha(1)
        plat.body.enable = true
        plat.body.updateFromGameObject()
        plat.deco[0].setPosition(plat.x, plat.origY - 6).setAlpha(1)
        plat.deco[1].setPosition(0, 0).setAlpha(1)
        plat.fallState = 'idle'
      })
    })
  },
}
