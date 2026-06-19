import Phaser from 'phaser'

// Funções que DESENHAM o cenário de fundo de cada nível
// (nuvens, árvores, estalactites, lava, estrelas...).
// São "coladas" à GameScene no fim do ficheiro GameScene.js.
export const DrawingMixin = {
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
  },

  drawCloud(x, y) {
    const g = this.add.graphics()
    g.fillStyle(0xffffff, 0.95)
    g.fillCircle(x,      y,      20)
    g.fillCircle(x + 22, y - 10, 26)
    g.fillCircle(x + 50, y - 6,  22)
    g.fillCircle(x + 72, y,      17)
    g.fillRect(x, y, 72, 22)
  },

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
  },

  drawStalactite(x, y) {
    const g  = this.add.graphics()
    const h  = 40 + (x % 5) * 14
    g.fillStyle(0x444466, 0.9)
    g.fillTriangle(x - 12, y, x + 12, y, x, y + h)
    g.fillStyle(0x333355, 0.6)
    g.fillTriangle(x - 6, y, x + 6, y, x, y + h * 0.7)
  },

  drawIceStalactite(x, y) {
    const g = this.add.graphics()
    const h = 35 + (x % 5) * 12
    g.fillStyle(0x99ccee, 0.9)
    g.fillTriangle(x - 10, y, x + 10, y, x, y + h)
    g.fillStyle(0xddeeff, 0.6)
    g.fillTriangle(x - 5, y, x + 5, y, x, y + h * 0.6)
  },

  drawLavaDecor(x, y) {
    const g = this.add.graphics()
    g.fillStyle(0xff4400, 0.7)
    g.fillCircle(x + 20, y, 18)
    g.fillStyle(0xff6600, 0.5)
    g.fillCircle(x + 40, y - 8, 12)
    g.fillStyle(0xff2200, 0.8)
    g.fillRect(x, y - 5, 80, 25)
  },

  drawGroundTile(x, y, groundColor, grassColor) {

  },
}
