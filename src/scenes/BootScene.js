import Phaser from 'phaser'
import { BG_LAYERS, SKINS } from '../assetConfig.js'

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene') }

  preload() {
    // Carrega imagens configuradas em assetConfig.js
    BG_LAYERS.forEach(levelLayers =>
      levelLayers.forEach(layer => {
        if (layer.url) this.load.image(layer.key, layer.url)
      })
    )
    SKINS.forEach(skin => {
      if (skin.url) this.load.image(skin.key, skin.url)
    })
  }

  create() {
    this.scene.start('MenuScene')
  }
}
