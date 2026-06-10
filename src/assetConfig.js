// ================================================================
// CONFIGURA AS TUAS IMAGENS AQUI
// ================================================================
// url: ''              → usa o visual padrão gerado pelo jogo
// url: '/imagem.png'   → ficheiro em public/imagem.png (mais fiável)
// url: 'https://...'   → imagem da internet (requer CORS ativado)
//
// Fontes gratuitas (CC0 / sem restrições):
//   Fundos:      kenney.nl  →  "Nature Backgrounds" ou "Background Elements"
//   Personagens: kenney.nl  →  "Platformer Characters"
//                opengameart.org
//
// Como usar imagens locais:
//   1. Coloca o ficheiro PNG em public/  (ex: public/sky.png)
//   2. Escreve url: '/sky.png'
//
// Como usar imagens da internet (CORS):
//   1. Faz download do ficheiro e coloca em public/  (método mais seguro)
//   2. Ou usa um URL de raw.githubusercontent.com (suporta CORS)
// ================================================================

export const BG_LAYERS = [
  // Nível 1 — Dia / Floresta
  [
    { key: 'bg1_sky',   url: '', scrollFactor: 0.05 },
    { key: 'bg1_hills', url: '', scrollFactor: 0.2  },
    { key: 'bg1_trees', url: '', scrollFactor: 0.4  },
  ],
  // Nível 2 — Caverna
  [
    { key: 'bg2_dark',  url: '', scrollFactor: 0.05 },
    { key: 'bg2_rocks', url: '', scrollFactor: 0.2  },
  ],
  // Nível 3 — Vulcão
  [
    { key: 'bg3_dark',  url: '', scrollFactor: 0.05 },
    { key: 'bg3_lava',  url: '', scrollFactor: 0.2  },
  ],
  // Nível 4 — Glaciar
  [
    { key: 'bg4_sky',   url: '', scrollFactor: 0.05 },
    { key: 'bg4_ice',   url: '', scrollFactor: 0.2  },
  ],
  // Nível 5 — Espaço
  [
    { key: 'bg5_deep',  url: '', scrollFactor: 0.03 },
    { key: 'bg5_stars', url: '', scrollFactor: 0.12 },
  ],
]

// Skins do personagem — 4 slots
// Se url estiver vazio, usa o design procedural padrão do slot
export const SKINS = [
  { key: 'skin_img0', url: '/Mario.png',       label_pt: 'Mario',  label_en: 'Mario'   },
  { key: 'skin_img1', url: '/Small_Mario.png', label_pt: 'Mini',   label_en: 'Mini'    },
  { key: 'skin_img2', url: '',                 label_pt: 'Robô',   label_en: 'Robot'   },
  { key: 'skin_img3', url: '',                 label_pt: 'Mago',   label_en: 'Wizard'  },
]

// Frames extraídos das spritesheets (coordenadas em píxeis na imagem original)
// idle/walk/jump: { x, y, w, h } — coordenadas do frame na spritesheet
export const SPRITE_FRAMES = {
  'skin_img0': { // Mario.png (876x160) — medido em píxeis
    idle: { x: 0,   y: 36, w: 15, h: 28 },
    walk: [
      { x: 112, y: 36, w: 16, h: 28 },
      { x: 128, y: 36, w: 15, h: 28 },
      { x: 143, y: 36, w: 16, h: 28 },
    ],
    jump: { x: 32, y: 83, w: 21, h: 28 },
  },
  'skin_img1': { // Small_Mario.png (832x232) — medido em píxeis
    idle: { x: 16, y: 18, w: 17, h: 22 },
    walk: [
      { x: 16,  y: 18, w: 17, h: 22 },
      { x: 112, y: 18, w: 11, h: 22 },
      { x: 123, y: 18, w: 11, h: 22 },
    ],
    jump: { x: 17, y: 41, w: 14, h: 30 },
  },
}
