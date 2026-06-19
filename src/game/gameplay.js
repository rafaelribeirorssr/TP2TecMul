import { getLang } from '../scenes/MenuScene.js'
import { audio } from '../audio.js'
import { LEVELS } from '../data/levels.js'

// Funções da JOGABILIDADE: apanhar moedas, entrar na porta (mudar de nível),
// levar dano/perder vidas, colisões com inimigos e atualizar as vidas no ecrã.
// São "coladas" à GameScene no fim do ficheiro GameScene.js.
export const GameplayMixin = {
  collectCoin(player, coin) {
    coin.destroy()
    audio.coin()
    this.score += 10
    this.coinsCollected += 1
    const t = getLang()
    this.scoreText.setText(`${t.score}: ${this.score}`)
    this.coinsText.setText(`🪙 ${this.coinsCollected}`)
  },

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
  },

  hitHazard() {
    this.fallInLava()
  },

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
  },

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
  },

  updateLivesHUD() {
    const t = getLang()
    this.livesText.setText(`${t.lives}: ${'❤️'.repeat(Math.max(0, this.lives))}`)
  },
}
