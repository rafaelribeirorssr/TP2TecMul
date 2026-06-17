import Phaser from 'phaser'
import { getLang, getActiveSkinIndex, getActiveCharacter } from './MenuScene.js'
import { BG_LAYERS, SKINS, SPRITE_FRAMES } from '../assetConfig.js'
import { audio } from '../audio.js'

export function formatTime(ms) {
  const totalCs  = Math.floor(ms / 10)
  const cs       = totalCs % 100
  const totalSec = Math.floor(totalCs / 100)
  const sec      = totalSec % 60
  const min      = Math.floor(totalSec / 60)
  const p2 = n => String(n).padStart(2, '0')
  return `${p2(min)}:${p2(sec)}.${p2(cs)}`
}

const SKIN_CONFIGS = [
  { hat: 0xcc0000, hatBrim: 0xcc0000, face: 0xffcc99, eyes: 0x000000, detail: 0x6b3a2a, body: 0x1a3ccc, buttons: 0xffcc00, shoes: 0x4a2800 },
  { hat: 0x111111, hatBrim: 0x222222, face: 0x222222, eyes: 0xeeeeff, detail: 0x111111, body: 0x1a1a1a, buttons: 0xcccccc, shoes: 0x111111 },
  { hat: 0x556677, hatBrim: 0x445566, face: 0x8899aa, eyes: 0x00ccff, detail: 0x445566, body: 0x6677aa, buttons: 0xff4400, shoes: 0x334455 },
  { hat: 0x6600cc, hatBrim: 0x5500aa, face: 0xffcc99, eyes: 0x000000, detail: 0x4400aa, body: 0x440088, buttons: 0xffee00, shoes: 0x220055 },
]

const LEVELS = [
  {
    name: 'level1',
    worldWidth: 3000,
    bgColor: 0x87CEEB,
    groundColor: 0x8B4513,
    grassColor: 0x5ca832,
    enemySpeed: 110,
    lavaDeath: false,
    platforms: [
      { x: 400,  y: 380, w: 180 },
      { x: 700,  y: 300, w: 160 },
      { x: 1000, y: 360, w: 180 },
      { x: 1300, y: 280, w: 160 },
      { x: 1600, y: 340, w: 180 },
      { x: 1900, y: 260, w: 160 },
      { x: 2200, y: 320, w: 180 },
      { x: 2500, y: 240, w: 160 },
      { x: 2800, y: 300, w: 150 },
    ],
    coins: [
      { x: 400,  y: 340 }, { x: 460,  y: 340 },
      { x: 700,  y: 260 }, { x: 760,  y: 260 },
      { x: 1000, y: 320 }, { x: 1300, y: 240 },
      { x: 1360, y: 240 }, { x: 1600, y: 300 },
      { x: 1900, y: 220 }, { x: 2200, y: 280 },
    ],
    enemies: [
      { x: 600,  y: 420, patrol: 200 },
      { x: 950,  y: 420, patrol: 220, type: 'chaser' },
      { x: 1200, y: 420, patrol: 200, type: 'jumper' },
      { x: 1800, y: 420, patrol: 200 },
      { x: 2400, y: 420, patrol: 200, type: 'jumper' },
      { x: 1500, y: 200, patrol: 250, type: 'flyer' },
      { x: 2300, y: 220, patrol: 300, type: 'flyer' },
    ],

    spikes: [
      { x: 850,  y: 451, w: 80 },
      { x: 1450, y: 451, w: 80 },
      { x: 2050, y: 451, w: 80 },
      { x: 2650, y: 451, w: 70 },
    ],
    doorX: 2850,
  },
  {
    name: 'level2',
    worldWidth: 4500,
    bgColor: 0x1a1a2e,
    groundColor: 0x3a3a3a,
    grassColor: 0x555555,
    enemySpeed: 165,
    lavaDeath: false,
    platforms: [
      { x: 300,  y: 370, w: 140 },
      { x: 550,  y: 300, w: 120 },
      { x: 800,  y: 360, w: 140 },
      { x: 1100, y: 260, w: 120 },
      { x: 1350, y: 340, w: 120 },
      { x: 1650, y: 280, w: 130 },
      { x: 1950, y: 350, w: 120 },
      { x: 2250, y: 260, w: 120 },
      { x: 2550, y: 320, w: 120 },
      { x: 2850, y: 240, w: 120 },
      { x: 3150, y: 310, w: 130 },
      { x: 3450, y: 250, w: 120 },
      { x: 3750, y: 300, w: 130 },
      { x: 4050, y: 230, w: 120 },
      { x: 4300, y: 290, w: 130 },
    ],
    coins: [
      { x: 300,  y: 330 }, { x: 550,  y: 260 },
      { x: 800,  y: 320 }, { x: 1100, y: 220 },
      { x: 1350, y: 300 }, { x: 1650, y: 240 },
      { x: 1950, y: 310 }, { x: 2250, y: 220 },
      { x: 2550, y: 280 }, { x: 2850, y: 200 },
      { x: 3150, y: 270 }, { x: 3450, y: 210 },
      { x: 3750, y: 260 }, { x: 4050, y: 190 },
      { x: 4300, y: 250 },
    ],
    enemies: [
      { x: 500,  y: 420, patrol: 150 },
      { x: 1000, y: 420, patrol: 150, type: 'chaser' },
      { x: 1500, y: 420, patrol: 150 },
      { x: 1900, y: 420, patrol: 160, type: 'jumper' },
      { x: 2200, y: 420, patrol: 150, type: 'jumper' },
      { x: 3000, y: 420, patrol: 150 },
      { x: 3500, y: 420, patrol: 170, type: 'chaser' },
      { x: 4000, y: 420, patrol: 150, type: 'chaser' },
      { x: 2600, y: 190, patrol: 300, type: 'flyer' },
      { x: 3800, y: 200, patrol: 350, type: 'flyer' },
    ],
    spikes: [
      { x: 950,  y: 451, w: 80 },
      { x: 1450, y: 451, w: 80 },
      { x: 1750, y: 451, w: 70 },
      { x: 2350, y: 451, w: 90 },
      { x: 2750, y: 451, w: 70 },
      { x: 3150, y: 451, w: 80 },
      { x: 3550, y: 451, w: 70 },
      { x: 4000, y: 451, w: 90 },
    ],
    movingPlatforms: [
      { x: 1800, y: 320, w: 120, range: 150, speed: 60 },
      { x: 2700, y: 280, w: 120, range: 120, speed: 80 },
      { x: 3600, y: 300, w: 120, range: 150, speed: 70 },
    ],
    doorX: 4350,
  },
  {
    name: 'level3',
    worldWidth: 6000,
    bgColor: 0x0d0d0d,
    groundColor: 0x8B0000,
    grassColor: 0xff4400,
    enemySpeed: 215,
    lavaDeath: true,
    deathPitColor: 0xff2200,
    deathPitGlowColor: 0xff6600,
    platforms: [
      { x: 100,  y: 380, w: 160 },
      { x: 300,  y: 380, w: 100 },
      { x: 520,  y: 320, w:  90 },
      { x: 750,  y: 370, w: 100 },
      { x: 980,  y: 290, w:  90 },
      { x: 1480, y: 270, w:  90 },
      { x: 1720, y: 330, w: 100 },
      { x: 2230, y: 320, w: 100 },
      { x: 2500, y: 250, w:  90 },
      { x: 3020, y: 240, w:  90 },
      { x: 3280, y: 300, w: 100 },
      { x: 3800, y: 290, w: 100 },
      { x: 4060, y: 220, w:  90 },
      { x: 4580, y: 210, w:  90 },
      { x: 4840, y: 270, w: 100 },
      { x: 5350, y: 260, w: 100 },
      { x: 5600, y: 190, w:  90 },
      { x: 5850, y: 250, w: 120 },
    ],
    coins: [
      { x: 300,  y: 340 }, { x: 520,  y: 280 },
      { x: 750,  y: 330 }, { x: 980,  y: 250 },
      { x: 1220, y: 310 }, { x: 1480, y: 230 },
      { x: 1720, y: 290 }, { x: 1980, y: 220 },
      { x: 2230, y: 280 }, { x: 2500, y: 210 },
      { x: 2760, y: 270 }, { x: 3020, y: 200 },
      { x: 3280, y: 260 }, { x: 3540, y: 190 },
      { x: 3800, y: 250 }, { x: 4060, y: 180 },
      { x: 4320, y: 240 }, { x: 4580, y: 170 },
      { x: 4840, y: 230 }, { x: 5100, y: 160 },
    ],
    enemies: [
      { x: 600,  y: 360, patrol: 120, type: 'chaser' },
      { x: 1100, y: 360, patrol: 120, type: 'jumper' },
      { x: 1700, y: 360, patrol: 120 },
      { x: 2400, y: 360, patrol: 120, type: 'jumper' },
      { x: 3100, y: 360, patrol: 120, type: 'chaser' },
      { x: 3800, y: 360, patrol: 120, type: 'jumper' },
      { x: 4500, y: 360, patrol: 120, type: 'chaser' },
      { x: 5200, y: 360, patrol: 120 },
      { x: 2000, y: 250, patrol: 400, type: 'flyer' },
      { x: 3000, y: 230, patrol: 450, type: 'flyer' },
      { x: 4000, y: 240, patrol: 400, type: 'flyer' },
      { x: 5000, y: 220, patrol: 350, type: 'flyer' },
    ],
    spikes: [
      { x: 150, y: 370, w: 40 },
    ],

    fallingPlatforms: [
      { x: 1220, y: 350, w: 100 },
      { x: 1980, y: 260, w:  90 },
      { x: 2760, y: 310, w: 100 },
      { x: 3540, y: 230, w:  90 },
      { x: 4320, y: 280, w: 100 },
      { x: 5100, y: 200, w:  90 },
    ],
    movingPlatforms: [
      { x: 1100, y: 310, w: 90, range: 120, speed:  90 },
      { x: 2100, y: 280, w: 90, range: 130, speed: 100 },
      { x: 3100, y: 260, w: 90, range: 140, speed: 110 },
      { x: 4100, y: 240, w: 90, range: 120, speed: 120 },
      { x: 5100, y: 220, w: 90, range: 130, speed: 130 },
    ],
    doorX: 5870,
  },
  {
    name: 'level4',
    worldWidth: 7500,
    bgColor: 0xb0d4f0,
    groundColor: 0x5599cc,
    grassColor: 0x88ccee,
    enemySpeed: 255,
    lavaDeath: true,
    deathPitColor: 0x1155aa,
    deathPitGlowColor: 0x3399dd,
    platforms: [
      { x: 100,  y: 380, w: 150 },
      { x: 370,  y: 350, w: 90 },
      { x: 640,  y: 310, w: 85 },
      { x: 900,  y: 360, w: 90 },
      { x: 1440, y: 340, w: 90 },
      { x: 1720, y: 260, w: 85 },
      { x: 2280, y: 240, w: 85 },
      { x: 2560, y: 300, w: 90 },
      { x: 3120, y: 280, w: 90 },
      { x: 3400, y: 210, w: 85 },
      { x: 3960, y: 200, w: 85 },
      { x: 4240, y: 260, w: 90 },
      { x: 4800, y: 250, w: 90 },
      { x: 5080, y: 180, w: 85 },
      { x: 5640, y: 270, w: 85 },
      { x: 5920, y: 210, w: 90 },
      { x: 6480, y: 290, w: 90 },
      { x: 6760, y: 260, w: 120 },
    ],
    coins: [
      { x: 370,  y: 310 }, { x: 640,  y: 270 },
      { x: 900,  y: 320 }, { x: 1160, y: 240 },
      { x: 1440, y: 300 }, { x: 1720, y: 220 },
      { x: 2000, y: 280 }, { x: 2280, y: 200 },
      { x: 2560, y: 260 }, { x: 2840, y: 180 },
      { x: 3120, y: 240 }, { x: 3400, y: 170 },
      { x: 3680, y: 230 }, { x: 3960, y: 160 },
      { x: 4240, y: 220 }, { x: 4520, y: 150 },
      { x: 4800, y: 210 }, { x: 5080, y: 140 },
      { x: 5360, y: 200 }, { x: 5640, y: 230 },
      { x: 5920, y: 170 }, { x: 6200, y: 220 },
      { x: 6480, y: 250 },
    ],
    enemies: [
      { x: 700,  y: 360, patrol: 110, type: 'chaser' },
      { x: 1100, y: 360, patrol: 110 },
      { x: 1700, y: 360, patrol: 110, type: 'jumper' },
      { x: 2300, y: 360, patrol: 110 },
      { x: 3000, y: 360, patrol: 110, type: 'chaser' },
      { x: 3700, y: 360, patrol: 110 },
      { x: 4400, y: 360, patrol: 110, type: 'jumper' },
      { x: 5100, y: 360, patrol: 110 },
      { x: 5800, y: 360, patrol: 110, type: 'chaser' },
      { x: 6400, y: 360, patrol: 110, type: 'jumper' },
      { x: 2500, y: 240, patrol: 500, type: 'flyer' },
      { x: 3700, y: 220, patrol: 450, type: 'flyer' },
      { x: 4800, y: 230, patrol: 500, type: 'flyer' },
      { x: 6000, y: 210, patrol: 400, type: 'flyer' },
    ],
    spikes: [
      { x: 150, y: 370, w: 40 },
    ],

    fallingPlatforms: [
      { x: 1160, y: 280, w: 85 },
      { x: 2000, y: 320, w: 90 },
      { x: 2840, y: 220, w: 85 },
      { x: 3680, y: 270, w: 90 },
      { x: 4520, y: 190, w: 85 },
      { x: 5360, y: 240, w: 90 },
      { x: 6200, y: 260, w: 85 },
    ],
    movingPlatforms: [
      { x: 520,  y: 340, w: 85, range: 130, speed: 100 },
      { x: 1300, y: 310, w: 85, range: 130, speed: 110 },
      { x: 2140, y: 280, w: 85, range: 140, speed: 120 },
      { x: 3000, y: 260, w: 85, range: 140, speed: 130 },
      { x: 3860, y: 240, w: 85, range: 140, speed: 140 },
      { x: 4680, y: 220, w: 85, range: 130, speed: 150 },
      { x: 5500, y: 210, w: 85, range: 140, speed: 140 },
    ],
    doorX: 6800,
  },
  {
    name: 'level5',
    worldWidth: 9500,
    bgColor: 0x000011,
    groundColor: 0x110022,
    grassColor: 0x220033,
    enemySpeed: 320,
    lavaDeath: true,
    deathPitColor: 0x110022,
    deathPitGlowColor: 0x440066,
    platforms: [
      { x: 100,  y: 380, w: 150 },
      { x: 360,  y: 350, w: 85 },
      { x: 620,  y: 300, w: 80 },
      { x: 880,  y: 360, w: 85 },
      { x: 1420, y: 340, w: 85 },
      { x: 1700, y: 260, w: 80 },
      { x: 2260, y: 240, w: 80 },
      { x: 2540, y: 300, w: 85 },
      { x: 3100, y: 280, w: 85 },
      { x: 3380, y: 205, w: 80 },
      { x: 3940, y: 195, w: 80 },
      { x: 4220, y: 255, w: 85 },
      { x: 4780, y: 245, w: 85 },
      { x: 5060, y: 175, w: 80 },
      { x: 5620, y: 165, w: 80 },
      { x: 5900, y: 225, w: 85 },
      { x: 6460, y: 200, w: 85 },
      { x: 6740, y: 260, w: 80 },
      { x: 7300, y: 250, w: 80 },
      { x: 7580, y: 180, w: 85 },
      { x: 8140, y: 270, w: 85 },
      { x: 8420, y: 290, w: 120 },
      { x: 8750, y: 270, w: 140 },
    ],
    coins: [
      { x: 360,  y: 310 }, { x: 620,  y: 260 },
      { x: 880,  y: 320 }, { x: 1140, y: 240 },
      { x: 1420, y: 300 }, { x: 1700, y: 220 },
      { x: 1980, y: 280 }, { x: 2260, y: 200 },
      { x: 2540, y: 260 }, { x: 2820, y: 180 },
      { x: 3100, y: 240 }, { x: 3380, y: 165 },
      { x: 3660, y: 225 }, { x: 3940, y: 155 },
      { x: 4220, y: 215 }, { x: 4500, y: 145 },
      { x: 4780, y: 205 }, { x: 5060, y: 135 },
      { x: 5340, y: 195 }, { x: 5620, y: 125 },
      { x: 5900, y: 185 }, { x: 6180, y: 230 },
      { x: 6460, y: 160 }, { x: 6740, y: 220 },
      { x: 7020, y: 150 }, { x: 7300, y: 210 },
      { x: 7580, y: 140 }, { x: 7860, y: 200 },
    ],
    enemies: [
      { x: 650,  y: 360, patrol: 100, type: 'chaser' },
      { x: 1100, y: 360, patrol: 100, type: 'jumper' },
      { x: 1650, y: 360, patrol: 100 },
      { x: 2200, y: 360, patrol: 100, type: 'chaser' },
      { x: 2750, y: 360, patrol: 100, type: 'jumper' },
      { x: 3350, y: 360, patrol: 100 },
      { x: 3950, y: 360, patrol: 100, type: 'chaser' },
      { x: 4550, y: 360, patrol: 100, type: 'jumper' },
      { x: 5150, y: 360, patrol: 100 },
      { x: 5750, y: 360, patrol: 100, type: 'chaser' },
      { x: 6350, y: 360, patrol: 100, type: 'jumper' },
      { x: 6950, y: 360, patrol: 100 },
      { x: 7550, y: 360, patrol: 100, type: 'chaser' },
      { x: 8150, y: 360, patrol: 100, type: 'jumper' },
      { x: 2000, y: 230, patrol: 500, type: 'flyer' },
      { x: 3200, y: 220, patrol: 450, type: 'flyer' },
      { x: 4400, y: 220, patrol: 500, type: 'flyer' },
      { x: 5600, y: 210, patrol: 450, type: 'flyer' },
      { x: 6800, y: 230, patrol: 500, type: 'flyer' },
      { x: 7900, y: 215, patrol: 400, type: 'flyer' },
    ],
    spikes: [
      { x: 150, y: 370, w: 40 },
    ],

    fallingPlatforms: [
      { x: 1140, y: 280, w: 80 },
      { x: 1980, y: 320, w: 85 },
      { x: 2820, y: 220, w: 80 },
      { x: 3660, y: 265, w: 85 },
      { x: 4500, y: 185, w: 80 },
      { x: 5340, y: 235, w: 85 },
      { x: 6180, y: 270, w: 80 },
      { x: 7020, y: 190, w: 85 },
      { x: 7860, y: 240, w: 80 },
    ],
    movingPlatforms: [
      { x: 490,  y: 330, w: 80, range: 120, speed: 120 },
      { x: 1280, y: 310, w: 80, range: 130, speed: 130 },
      { x: 2120, y: 270, w: 80, range: 130, speed: 140 },
      { x: 2960, y: 260, w: 80, range: 140, speed: 150 },
      { x: 3820, y: 235, w: 80, range: 130, speed: 160 },
      { x: 4660, y: 220, w: 80, range: 140, speed: 170 },
      { x: 5500, y: 200, w: 80, range: 140, speed: 160 },
      { x: 6320, y: 235, w: 80, range: 130, speed: 150 },
      { x: 7160, y: 220, w: 80, range: 130, speed: 160 },
    ],
    doorX: 8800,
  },
]

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
    const doorTop  = doorPlat ? doorPlat.y - 10 : (lvl.lavaDeath ? 250 : H - 48)
    const doorY    = doorTop - 45
    this.door = this.physics.add.staticSprite(lvl.doorX, doorY, 'door')
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

  drawBackground(lvl, W, H) {
    if (this.currentLevel === 0) {

      this.add.rectangle(W / 2, 120, W, 240, 0xaaddff)

      for (let x = 150; x < W; x += 500) {
        this.drawCloud(x, 55)
        this.drawCloud(x + 260, 85)
      }

      this.add.rectangle(W / 2, H - 10, W, 60, 0x8B4513)

      this.add.rectangle(W / 2, H - 40, W, 18, 0x4aaa22)

      this.add.rectangle(W / 2, H - 48, W, 6, 0x3a9918)

      for (let x = 0; x < W; x += 50) {
        const tile = this.add.rectangle(x + 25, H - 29, 50, 40, 0x8B4513)
        tile.setAlpha(0)
        this.physics.add.existing(tile, true)
        this.platforms.add(tile)
      }

      for (let x = 180; x < W; x += 380) {
        this.drawTree(x, H - 48)
      }

    } else if (this.currentLevel === 1) {

      for (let x = 80; x < W; x += 220) {
        this.drawStalactite(x + (x % 3) * 35, 0)
      }

      this.add.rectangle(W / 2, H - 10, W, 60, 0x333344)
      this.add.rectangle(W / 2, H - 40, W, 18, 0x555566)
      this.add.rectangle(W / 2, H - 48, W, 6, 0x666677)

      for (let x = 0; x < W; x += 50) {
        const tile = this.add.rectangle(x + 25, H - 29, 50, 40, 0x333344)
        tile.setAlpha(0)
        this.physics.add.existing(tile, true)
        this.platforms.add(tile)
      }

    } else if (this.currentLevel === 2) {

      this.add.rectangle(W / 2, H / 3, W, (H * 2) / 3, 0x1a0800)

      for (let x = 0; x < W; x += 100) {
        this.drawLavaDecor(x, H - 20)
      }

      for (let x = 50; x < W; x += 200) {
        const ember = this.add.circle(
          x + Phaser.Math.Between(0, 150),
          Phaser.Math.Between(50, 400),
          Phaser.Math.Between(2, 5),
          0xff6600, 0.7
        )
        this.tweens.add({
          targets: ember,
          y: ember.y - Phaser.Math.Between(80, 200),
          alpha: 0,
          duration: Phaser.Math.Between(2000, 4000),
          repeat: -1,
          delay: Phaser.Math.Between(0, 2000)
        })
      }

    } else if (this.currentLevel === 3) {

      this.add.rectangle(W / 2, 160, W, 320, 0x8ab8d8)

      for (let x = 60; x < W; x += 180) {
        this.drawIceStalactite(x + (x % 3) * 25, 0)
      }

      for (let x = 100; x < W; x += 300) {
        this.add.circle(
          x + Phaser.Math.Between(0, 200),
          Phaser.Math.Between(30, 350),
          Phaser.Math.Between(15, 40),
          0xffffff, 0.08
        )
      }

    } else {

      this.add.rectangle(W / 2, H / 2, W, H, 0x000011)

      for (let x = 30; x < W; x += 70) {
        this.add.circle(
          x + Phaser.Math.Between(0, 50),
          Phaser.Math.Between(10, H - 80),
          Phaser.Math.Between(1, 2),
          0xffffff
        )
      }

      for (let x = 300; x < W; x += 700) {
        this.add.circle(x,                          Phaser.Math.Between(60, 300), 90, 0x330066, 0.12)
        this.add.circle(x + 300, Phaser.Math.Between(60, 300), 70, 0x003366, 0.12)
      }
    }
  }

  drawCloud(x, y) {
    const g = this.add.graphics()
    g.fillStyle(0xffffff, 0.95)
    g.fillCircle(x,      y,      20)
    g.fillCircle(x + 22, y - 10, 26)
    g.fillCircle(x + 50, y - 6,  22)
    g.fillCircle(x + 72, y,      17)
    g.fillRect(x, y, 72, 22)
  }

  drawTree(x, y) {
    const g = this.add.graphics()

    g.fillStyle(0x5c3317)
    g.fillRect(x - 7, y - 50, 14, 50)

    g.fillStyle(0x1e7a1e)
    g.fillTriangle(x, y - 115, x - 42, y - 50, x + 42, y - 50)

    g.fillStyle(0x228B22)
    g.fillTriangle(x, y - 148, x - 30, y - 90, x + 30, y - 90)

    g.fillStyle(0x2db52d)
    g.fillTriangle(x, y - 172, x - 20, y - 125, x + 20, y - 125)
  }

  drawStalactite(x, y) {
    const g  = this.add.graphics()
    const h  = 40 + (x % 5) * 14
    g.fillStyle(0x444466, 0.9)
    g.fillTriangle(x - 12, y, x + 12, y, x, y + h)
    g.fillStyle(0x333355, 0.6)
    g.fillTriangle(x - 6, y, x + 6, y, x, y + h * 0.7)
  }

  drawIceStalactite(x, y) {
    const g = this.add.graphics()
    const h = 35 + (x % 5) * 12
    g.fillStyle(0x99ccee, 0.9)
    g.fillTriangle(x - 10, y, x + 10, y, x, y + h)
    g.fillStyle(0xddeeff, 0.6)
    g.fillTriangle(x - 5, y, x + 5, y, x, y + h * 0.6)
  }

  drawLavaDecor(x, y) {
    const g = this.add.graphics()
    g.fillStyle(0xff4400, 0.7)
    g.fillCircle(x + 20, y, 18)
    g.fillStyle(0xff6600, 0.5)
    g.fillCircle(x + 40, y - 8, 12)
    g.fillStyle(0xff2200, 0.8)
    g.fillRect(x, y - 5, 80, 25)
  }

  drawGroundTile(x, y, groundColor, grassColor) {

  }

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
  }

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
  }

  createPlayerTexture() {
    this.createSkinTextures()
  }

  createSkinTextures() {
    SKIN_CONFIGS.forEach((cfg, i) => this.createProceduralSkin(`skin${i}`, cfg))
  }

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
  }

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
  }

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
  }

  createCoinTexture() {
    if (this.textures.exists('coin')) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0xFFD700); g.fillCircle(10, 10, 10)
    g.fillStyle(0xFFA500); g.fillCircle(10, 10, 7)
    g.fillStyle(0xFFFF88); g.fillRect(7, 4, 6, 12)
    g.generateTexture('coin', 20, 20)
    g.destroy()
  }

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
  }

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
  }

  createCoin(x, y) {
    const coin = this.physics.add.staticSprite(x, y, 'coin')
    coin.setDepth(4)
    this.coins.add(coin)
    this.tweens.add({
      targets: coin, y: y - 8, duration: 700,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    })
  }

  createEnemy(cfg, speed) {
    const type   = cfg.type || 'walker'
    const texKey = { flyer: 'enemy_flyer', jumper: 'enemy_jumper', chaser: 'enemy_chaser' }[type] || 'enemy'
    const enemy  = this.physics.add.sprite(cfg.x, cfg.y, texKey)
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

    enemy.body.setVelocityX(speed)

    if (type !== 'flyer') this.enemyGroup.add(enemy)
    this.enemies.push(enemy)
  }

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
  }

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
  }

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
  }

  collectCoin(player, coin) {
    coin.destroy()
    audio.coin()
    this.score += 10
    this.coinsCollected += 1
    const t = getLang()
    this.scoreText.setText(`${t.score}: ${this.score}`)
    this.coinsText.setText(`🪙 ${this.coinsCollected}`)
  }

  enterDoor(player, door) {
    if (this.transitioning) return
    this.transitioning = true
    this.cameras.main.fadeOut(700)
    const nextLevel = this.currentLevel + 1
    this.time.delayedCall(700, () => {
      if (nextLevel >= LEVELS.length) {
        this.scene.start('GameOverScene', {
          score: this.score, victory: true, time: this.elapsedMs
        })
      } else {
        this.scene.start('GameScene', {
          level: nextLevel,
          score: this.score,
          lives: this.lives,
          elapsed: this.elapsedMs
        })
      }
    })
  }

  hitHazard() {
    this.fallInLava()
  }

  fallInLava() {
    if (this.invincible || this.transitioning) return
    this.lives--
    audio.hurt()
    this.updateLivesHUD()
    this.cameras.main.shake(300, 0.015)

    if (this.lives <= 0) {
      this.transitioning = true
      audio.stopMusic()
      this.cameras.main.fadeOut(600)
      this.time.delayedCall(600, () => {
        this.scene.start('GameOverScene', { score: this.score, victory: false })
      })
    } else {

      this.invincible = true
      this.cameras.main.fadeOut(400)
      this.time.delayedCall(400, () => {
        this.player.setPosition(100, 330)
        this.player.body.setVelocity(0, 0)
        this.cameras.main.fadeIn(400)
        this.time.delayedCall(1500, () => { this.invincible = false })
      })
    }
  }

  checkEnemyCollisions() {
    if (this.invincible || this.transitioning) return
    this.enemies.forEach(enemy => {
      if (!enemy.active) return
      const dx = Math.abs(this.player.x - enemy.x)
      const dy = Math.abs(this.player.y - enemy.y)
      if (dx < 35 && dy < 35) {
        const falling = this.player.body.velocity.y > 0
        const above   = this.player.y < enemy.y - 10
        if (falling && above) {
          enemy.destroy()
          this.enemies = this.enemies.filter(e => e !== enemy)
          audio.stomp()
          this.player.body.setVelocityY(-450)
          this.score += 20
          this.scoreText.setText(`${getLang().score}: ${this.score}`)
        } else {
          this.lives--
          audio.hurt()
          this.updateLivesHUD()
          this.invincible = true
          this.player.body.setVelocityX(-300)
          this.cameras.main.shake(200, 0.01)
          this.time.delayedCall(1000, () => { this.invincible = false })
          if (this.lives <= 0) {
            this.transitioning = true
            audio.stopMusic()
            this.cameras.main.fadeOut(600)
            this.time.delayedCall(600, () => {
              this.scene.start('GameOverScene', { score: this.score, victory: false })
            })
          }
        }
      }
    })
  }

  updateLivesHUD() {
    const t = getLang()
    this.livesText.setText(`${t.lives}: ${'❤️'.repeat(Math.max(0, this.lives))}`)
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
