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
  { key: 'skin_img0', url: '/yi_mario.png',   label_pt: 'Mario',   label_en: 'Mario',
    role_pt: 'Equilibrado', role_en: 'Balanced',   jump: 470, speed: 230, lives: 3 },
  { key: 'skin_img1', url: '/yi_luigi.png',   label_pt: 'Luigi',   label_en: 'Luigi',
    role_pt: 'Saltador',    role_en: 'High Jumper', jump: 590, speed: 210, lives: 3 },
  { key: 'skin_img2', url: '/yi_wario.png',   label_pt: 'Wario',   label_en: 'Wario',
    role_pt: 'Resistente',  role_en: 'Tank',        jump: 470, speed: 190, lives: 6 },
  { key: 'skin_img3', url: '/yi_waluigi.png', label_pt: 'Waluigi', label_en: 'Waluigi',
    role_pt: 'Veloz',       role_en: 'Speedster',   jump: 450, speed: 310, lives: 2 },
]

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
