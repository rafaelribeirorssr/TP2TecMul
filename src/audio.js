const N = {
  C2: 65.41,  E2: 82.41,  F2: 87.31,  G2: 98.00,  A2: 110.00,
  C3: 130.81, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50, E6: 1318.51,
}

const MELODY = [
  'G4','C5','E5','G5','E5','C5','D5', null,
  'F4','A4','C5','F5','C5','A4','G4', null,
  'E5','D5','C5','D5','E5','G5','E5', null,
  'C5','G4','E4','G4','C5', null, 'C5', null,
]

const BASS = [
  'C3', null,'C3', null,'G2', null,'G2', null,
  'F2', null,'F2', null,'C3', null,'C3', null,
  'C3', null,'C3', null,'G2', null,'G2', null,
  'F2', null,'G2', null,'C3', null,'C3', null,
]

const STEP_DUR = 0.16

class AudioManager {
  constructor() {
    this.ctx     = null
    this.master  = null
    this.muted   = false
    this.musicOn = false
    this.timer   = null
    this.step    = 0
    this.nextTime = 0
  }

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      this.ctx = new AC()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.35
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
  }

  _tone(freq, start, dur, type = 'square', vol = 0.3) {
    if (!this.ctx || this.muted) return
    const osc  = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    gain.gain.setValueAtTime(vol, start)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(start)
    osc.stop(start + dur + 0.02)
  }

  coin() {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this._tone(N.B5, t,        0.07, 'square', 0.28)
    this._tone(N.E6, t + 0.07, 0.30, 'square', 0.28)
  }

  stomp() {
    if (!this.ctx || this.muted) return
    const t = this.ctx.currentTime
    const osc  = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(420, t)
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.18)
    gain.gain.setValueAtTime(0.35, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
    osc.connect(gain); gain.connect(this.master)
    osc.start(t); osc.stop(t + 0.22)
  }

  jump() {
    if (!this.ctx || this.muted) return
    const t = this.ctx.currentTime
    const osc  = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(300, t)
    osc.frequency.exponentialRampToValueAtTime(760, t + 0.12)
    gain.gain.setValueAtTime(0.22, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
    osc.connect(gain); gain.connect(this.master)
    osc.start(t); osc.stop(t + 0.17)
  }

  hurt() {
    if (!this.ctx || this.muted) return
    const t = this.ctx.currentTime
    const osc  = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(360, t)
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.4)
    gain.gain.setValueAtTime(0.3, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
    osc.connect(gain); gain.connect(this.master)
    osc.start(t); osc.stop(t + 0.47)
  }

  winJingle() {
    if (!this.ctx) return
    this.stopMusic()
    const t = this.ctx.currentTime
    const seq = [N.C5, N.E5, N.G5, N.C6, N.G5, N.C6]
    seq.forEach((f, i) => this._tone(f, t + i * 0.12, 0.16, 'square', 0.3))
  }

  loseJingle() {
    if (!this.ctx) return
    this.stopMusic()
    const t = this.ctx.currentTime
    const seq = [N.C5, N.G4, N.E4, N.C4]
    seq.forEach((f, i) => this._tone(f, t + i * 0.18, 0.22, 'triangle', 0.3))
  }

  startMusic() {
    if (!this.ctx || this.musicOn) return
    this.musicOn  = true
    this.step     = 0
    this.nextTime = this.ctx.currentTime + 0.1
    this._scheduler()
  }

  _scheduler() {
    if (!this.musicOn) return

    while (this.nextTime < this.ctx.currentTime + 0.2) {
      const lead = MELODY[this.step % MELODY.length]
      const bass = BASS[this.step % BASS.length]
      if (lead) this._tone(N[lead], this.nextTime, STEP_DUR * 0.9, 'square',   0.18)
      if (bass) this._tone(N[bass], this.nextTime, STEP_DUR * 1.8, 'triangle', 0.22)
      this.nextTime += STEP_DUR
      this.step++
    }
    this.timer = setTimeout(() => this._scheduler(), 40)
  }

  stopMusic() {
    this.musicOn = false
    if (this.timer) { clearTimeout(this.timer); this.timer = null }
  }

  pauseMusic()      { this.stopMusic() }
  resumeMusicLoop() { this.startMusic() }

  toggleMute() {
    this.muted = !this.muted
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.35
    return this.muted
  }
}

export const audio = new AudioManager()
