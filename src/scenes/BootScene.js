import Phaser from 'phaser'
export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene') }

  preload() {
    // assets serão carregados aqui futuramente
  }

  create() {
    this.scene.start('MenuScene')
  }
}