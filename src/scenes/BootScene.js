import Phaser from 'phaser'
import { BG_LAYERS, SKINS, ENEMY_SKINS } from '../assetConfig.js'

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene') }

  preload() {

    BG_LAYERS.forEach(levelLayers =>
      levelLayers.forEach(layer => {
        if (layer.url) this.load.image(layer.key, layer.url)
      })
    )
    SKINS.forEach(skin => {
      if (skin.url) this.load.image(skin.key, skin.url)
    })
    Object.values(ENEMY_SKINS).forEach(e => {
      if (!e.url) return
      if (e.sheet) {
        this.load.spritesheet(e.key, e.url, {
          frameWidth: e.sheet.frameW, frameHeight: e.sheet.frameH,
        })
      } else {
        this.load.image(e.key, e.url)
      }
    })
  }

  create() {
    this.scene.start('MenuScene')
  }
}
