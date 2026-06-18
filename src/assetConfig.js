export const BG_LAYERS = [

  [
    { key: 'bg1_sky',   url: '', scrollFactor: 0.05 },
    { key: 'bg1_hills', url: '', scrollFactor: 0.2  },
    { key: 'bg1_trees', url: '', scrollFactor: 0.4  },
  ],

  [
    { key: 'bg2_dark',  url: '', scrollFactor: 0.05 },
    { key: 'bg2_rocks', url: '', scrollFactor: 0.2  },
  ],

  [
    { key: 'bg3_dark',  url: '', scrollFactor: 0.05 },
    { key: 'bg3_lava',  url: '', scrollFactor: 0.2  },
  ],

  [
    { key: 'bg4_sky',   url: '', scrollFactor: 0.05 },
    { key: 'bg4_ice',   url: '', scrollFactor: 0.2  },
  ],

  [
    { key: 'bg5_deep',  url: '', scrollFactor: 0.03 },
    { key: 'bg5_stars', url: '', scrollFactor: 0.12 },
  ],
]

export const SKINS = [
  { key: 'skin_img0', url: '/yi_mario.png',   label_pt: 'Mario',   label_en: 'Mario',   label_zh: '马力欧',
    role_pt: 'Equilibrado', role_en: 'Balanced',   role_zh: '平衡',     jump: 470, speed: 230, lives: 3 },
  { key: 'skin_img1', url: '/yi_luigi.png',   label_pt: 'Luigi',   label_en: 'Luigi',   label_zh: '路易吉',
    role_pt: 'Saltador',    role_en: 'High Jumper', role_zh: '跳跃高手', jump: 590, speed: 210, lives: 3 },
  { key: 'skin_img2', url: '/yi_wario.png',   label_pt: 'Wario',   label_en: 'Wario',   label_zh: '瓦力欧',
    role_pt: 'Resistente',  role_en: 'Tank',        role_zh: '坦克',     jump: 470, speed: 190, lives: 6 },
  { key: 'skin_img3', url: '/yi_waluigi.png', label_pt: 'Waluigi', label_en: 'Waluigi', label_zh: '瓦路易吉',
    role_pt: 'Veloz',       role_en: 'Speedster',   role_zh: '速度型',   jump: 450, speed: 310, lives: 2 },
]

// Enemy skins cut from Dotshima's Mario enemy sheet
// (public/mario_enemies_sprites_by_dotshima_d1fv7zp-375w-2x.jpg).
// dispH is the target on-screen height in px; the sprite is scaled uniformly to it
// so the physics body scales too, keeping the original aspect ratio.
export const ENEMY_SKINS = {
  walker: { key: 'eskin_walker', url: '/enemy_walker.png', dispH: 36 }, // brown Goomba
  jumper: { key: 'eskin_jumper', url: '/enemy_jumper.png', dispH: 38 }, // black Bob-omb
  // yellow/green Koopa Troopa with a real walk cycle (6-frame sheet)
  chaser: { key: 'eskin_chaser', url: '/enemy_koopa_walk.png', dispH: 54,
            sheet: { frameW: 25, frameH: 37, frames: 6, rate: 10 } },
  flyer:  { key: 'eskin_flyer',  url: '/enemy_flyer.png',  dispH: 42 }, // propeller Shy Guy
}

export const STAT_RANGES = {
  jump:  { min: 400, max: 620 },
  speed: { min: 160, max: 340 },
  lives: { min: 1,   max: 7   },
}

const YI_FRAMES = {
  display: { w: 40, h: 50 },
  idle: { x: 0, y: 0, w: 27, h: 33 },
  walk: [
    { x: 27,  y: 0, w: 27, h: 33 },
    { x: 54,  y: 0, w: 27, h: 33 },
    { x: 81,  y: 0, w: 27, h: 33 },
  ],
  jump: { x: 108, y: 0, w: 27, h: 33 },
}

const WAL_FRAMES = {
  display: { w: 44, h: 48 },
  idle: { x: 0, y: 0, w: 36, h: 38 },
  walk: [
    { x: 36,  y: 0, w: 36, h: 38 },
    { x: 72,  y: 0, w: 36, h: 38 },
    { x: 108, y: 0, w: 36, h: 38 },
  ],
  jump: { x: 144, y: 0, w: 36, h: 38 },
}

export const SPRITE_FRAMES = {
  'skin_img0': YI_FRAMES,
  'skin_img1': YI_FRAMES,
  'skin_img2': YI_FRAMES,
  'skin_img3': WAL_FRAMES,
}
