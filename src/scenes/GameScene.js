import Phaser from 'phaser'
import { getLang, getActiveSkinIndex, getActiveCharacter } from './MenuScene.js'
import { SKINS, SPRITE_FRAMES } from '../assetConfig.js'
import { audio } from '../audio.js'
import { LEVELS } from '../data/levels.js'
import { formatTime } from '../utils/format.js'

// Grupos de funções da cena, separados por tema noutros ficheiros.
import { DrawingMixin } from '../game/drawing.js'
import { TextureMixin } from '../game/textures.js'
import { EntityMixin } from '../game/entities.js'
import { GameplayMixin } from '../game/gameplay.js'

export class GameScene extends Phaser.Scene {
  constructor() { super('GameScene') }

  init(data) {
    const char = getActiveCharacter()
    this.currentLevel = data.level || 0
    this.score        = data.score || 0

    this.lives        = data.lives !== undefined ? data.lives : (char?.lives ?? 3)

    this.charJump  = char?.jump  ?? 450
    this.charSpeed = char?.speed ?? 220

    this.baseElapsed = data.elapsed || 0
  }

  create() {
    const lvl = LEVELS[this.currentLevel]
    const t   = getLang()
    this.invincible          = false
    this.transitioning       = false
    this.movingPlatformList  = []
    this.coinsCollected      = 0
    this.elapsedMs           = this.baseElapsed

    const W = lvl.worldWidth
    const H = 500

    this.physics.world.setBounds(0, 0, W, H + 100)

    this.add.rectangle(W / 2, H / 2, W, H, lvl.bgColor).setScrollFactor(1)

    this.platforms = this.physics.add.staticGroup()

    if (lvl.lavaDeath) {
      const pitCol  = lvl.deathPitColor     || 0xff2200
      const pitGlow = lvl.deathPitGlowColor || 0xff6600
      const lavaVisual = this.add.rectangle(W / 2, H - 10, W, 60, pitCol)
      lavaVisual.setDepth(1)
      const lavaGlow = this.add.rectangle(W / 2, H - 35, W, 12, pitGlow)
      lavaGlow.setDepth(2)
      this.lavaGround = this.add.rectangle(W / 2, H - 10, W, 60, pitCol)
      this.lavaGround.setAlpha(0)
      this.physics.add.existing(this.lavaGround, true)
    } else {

      for (let x = 0; x < W; x += 50) {
        this.drawGroundTile(x, H - 40, lvl.groundColor, lvl.grassColor)
      }
    }

    lvl.platforms.forEach(p => this.createPlatform(p.x, p.y, p.w))

    this.movingPlatforms = this.physics.add.group()
    if (lvl.movingPlatforms) {
      lvl.movingPlatforms.forEach(mp => this.createMovingPlatform(mp))
    }

    this.drawBackground(lvl, W, H)

    this.parallaxLayers = []
    this.createParallaxLayers(W, H)

    this.createSkinTextures()
    this.createCoinTexture()
    this.createEnemyTexture()
    this.createDoorTexture()

    const startY  = lvl.lavaDeath ? 330 : 380
    const skinIdx = getActiveSkinIndex()
    const imgKey  = SKINS[skinIdx]?.key
    const playerKey = (imgKey && this.textures.exists(imgKey)) ? imgKey : `skin${skinIdx}`
    this.playerKey       = playerKey
    this.walkAnimKey     = `${playerKey}_walk`

    this.spriteFacesRight = !!SPRITE_FRAMES[playerKey]?.facesRight
    this.framesConfigured = this.setupSpriteFrames(playerKey)
    this.player = this.physics.add.sprite(100, startY, playerKey,
      this.framesConfigured ? 'idle' : undefined)

    const disp = SPRITE_FRAMES[playerKey]?.display || { w: 40, h: 50 }
    this.player.setDisplaySize(disp.w, disp.h)
    this.player.setBounce(0)
    this.player.setCollideWorldBounds(true)
    this.player.setDepth(5)
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.player, this.movingPlatforms)

    this.coins = this.physics.add.staticGroup()
    lvl.coins.forEach(c => this.createCoin(c.x, c.y))
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this)

    this.enemies    = []
    this.enemyGroup = this.physics.add.group()
    lvl.enemies.forEach(e => this.createEnemy(e, lvl.enemySpeed))
    this.physics.add.collider(this.enemyGroup, this.platforms)
    this.physics.add.collider(this.enemyGroup, this.movingPlatforms)

    this.spikes = this.physics.add.staticGroup()
    if (lvl.spikes) lvl.spikes.forEach(s => this.createSpikes(s.x, s.y, s.w))
    this.physics.add.overlap(this.player, this.spikes, this.hitHazard, null, this)

    this.fallingPlatforms = this.physics.add.staticGroup()
    if (lvl.fallingPlatforms) {
      lvl.fallingPlatforms.forEach(fp => this.createFallingPlatform(fp.x, fp.y, fp.w))
    }
    this.physics.add.collider(this.player, this.fallingPlatforms, this.touchFallingPlatform, null, this)
    this.physics.add.collider(this.enemyGroup, this.fallingPlatforms)

    const doorPlat = lvl.platforms.find(p => Math.abs(p.x - lvl.doorX) <= p.w / 2)
    // center the door on its platform so it sits squarely on top instead of
    // hanging off the edge; fall back to doorX if no platform is found
    const doorX    = doorPlat ? doorPlat.x : lvl.doorX
    const doorTop  = doorPlat ? doorPlat.y - 10 : (lvl.lavaDeath ? 250 : H - 48)
    const doorY    = doorTop - 45
    this.door = this.physics.add.staticSprite(doorX, doorY, 'door')
    this.door.setDepth(3)
    this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this)

    this.cameras.main.setBounds(0, 0, W, H)

    this.cameras.main.startFollow(this.player, false, 0.1, 0.1)
    this.cameras.main.fadeIn(600)

    if (lvl.lavaDeath && this.lavaGround) {
      this.physics.add.overlap(this.player, this.lavaGround, this.fallInLava, null, this)
    }

    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd    = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    })

    audio.init()
    audio.startMusic()
    this.input.keyboard.once('keydown', () => audio.init())
    this.input.once('pointerdown', () => audio.init())

    this.input.keyboard.on('keydown-M', () => audio.toggleMute())

    this.input.keyboard.on('keydown-ESC', () => {
      if (this.transitioning) return
      this.scene.pause()
      this.scene.launch('PauseScene', {
        level: this.currentLevel,
        score: this.score,
        lives: this.lives,
        elapsed: this.elapsedMs
      })
    })

    const lvlLabel = t.level || 'Nível'
    this.add.text(400, 14, `${lvlLabel} ${this.currentLevel + 1}`, {
      fontSize: '18px', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20)

    this.scoreText = this.add.text(16, 16, `${t.score}: ${this.score}`, {
      fontSize: '20px', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(20)

    this.livesText = this.add.text(16, 44, `${t.lives}: ${'❤️'.repeat(this.lives)}`, {
      fontSize: '20px', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(20)

    this.coinsText = this.add.text(16, 72, `🪙 ${this.coinsCollected}`, {
      fontSize: '18px', fill: '#FFD700',
      stroke: '#000000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(20)

    this.timerText = this.add.text(784, 14, `⏱ ${formatTime(this.elapsedMs)}`, {
      fontSize: '20px', fill: '#ffffff',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(20)
  }

  update(time, delta) {

    if (!this.transitioning) {
      this.elapsedMs += delta
      this.timerText.setText(`⏱ ${formatTime(this.elapsedMs)}`)
    }

    const left     = this.cursors.left.isDown  || this.wasd.left.isDown
    const right    = this.cursors.right.isDown || this.wasd.right.isDown
    const jump     = this.cursors.up.isDown || this.cursors.space.isDown || this.wasd.up.isDown
    const onGround = this.player.body.blocked.down

    if (this.parallaxLayers.length > 0) {
      const camX = this.cameras.main.scrollX
      this.parallaxLayers.forEach(l => { l.tilePositionX = camX * l.parallaxFactor })
    }

    const flipLeft  = this.spriteFacesRight ? true  : false
    const flipRight = this.spriteFacesRight ? false : true
    if (left)       { this.player.body.setVelocityX(-this.charSpeed); this.player.setFlipX(flipLeft) }
    else if (right) { this.player.body.setVelocityX(this.charSpeed);  this.player.setFlipX(flipRight) }

    else            { this.player.body.setVelocityX(0); this.player.setFlipX(flipRight) }

    if (jump && onGround) { this.player.body.setVelocityY(-this.charJump); audio.jump() }

    if (this.framesConfigured) {
      if (!onGround) {
        this.player.anims.stop()
        this.player.setFrame('jump')
      } else if (left || right) {
        if (this.anims.exists(this.walkAnimKey)) {
          this.player.play(this.walkAnimKey, true)
        }
      } else {
        this.player.anims.stop()
        this.player.setFrame('idle')
      }
    }

    this.movingPlatformList.forEach(plat => {
      if (plat.x > plat.startX + plat.range) plat.moveDir = -1
      if (plat.x < plat.startX - plat.range) plat.moveDir = 1
      plat.body.setVelocityX(plat.movSpeed * plat.moveDir)
    })

    this.enemies.forEach(enemy => {
      if (!enemy.active) return

      if (enemy.x > enemy.startX + enemy.patrol) enemy.direction = -1
      if (enemy.x < enemy.startX - enemy.patrol) enemy.direction = 1

      if (enemy.type === 'flyer') {

        enemy.body.setVelocityX(enemy.speed * enemy.direction)
        enemy.y = enemy.startY + Math.sin(this.time.now / 300 + enemy.startX) * 45

      } else if (enemy.type === 'chaser') {

        const dist = this.player.x - enemy.x
        if (Math.abs(dist) < 260) {
          enemy.direction = dist > 0 ? 1 : -1
          enemy.body.setVelocityX(enemy.speed * 1.5 * enemy.direction)
        } else {
          enemy.body.setVelocityX(enemy.speed * enemy.direction)
        }

      } else if (enemy.type === 'jumper') {

        enemy.body.setVelocityX(enemy.speed * enemy.direction)
        if (enemy.body.blocked.down && this.time.now > enemy.nextJump) {
          enemy.body.setVelocityY(-340)
          enemy.nextJump = this.time.now + 1100
        }

      } else {

        enemy.body.setVelocityX(enemy.speed * enemy.direction)
      }

      enemy.setFlipX(enemy.direction === -1)
    })

    this.checkEnemyCollisions()

    if (this.player.y > 520) this.fallInLava()
  }
}

// "Cola" os grupos de funções dos outros ficheiros à GameScene,
// para que possam ser usados como this.drawBackground(), this.createCoin(), etc.
Object.assign(
  GameScene.prototype,
  DrawingMixin,
  TextureMixin,
  EntityMixin,
  GameplayMixin
)
