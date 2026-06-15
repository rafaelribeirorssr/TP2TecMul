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
  { key: 'skin_img0', url: '/yi_mario.png',   label_pt: 'Mario',   label_en: 'Mario'   },
  { key: 'skin_img1', url: '/yi_luigi.png',   label_pt: 'Luigi',   label_en: 'Luigi'   },
  { key: 'skin_img2', url: '/yi_wario.png',   label_pt: 'Wario',   label_en: 'Wario'   },
  { key: 'skin_img3', url: '/yi_waluigi.png', label_pt: 'Waluigi', label_en: 'Waluigi' },
]

// Frames extraídos das spritesheets (coordenadas em píxeis na imagem original)
// idle/walk/jump: { x, y, w, h } — coordenadas do frame na spritesheet
//
// As folhas yi_*.png foram geradas a partir da imagem original
// "Mario, Luigi, Wario & Waluigi (Yoshi's Island-Style).png": fundo removido,
// frames todos virados para a esquerda, dispostos em 5 células de 27x33 px:
// [idle | walk0 | walk1 | walk2 | jump]
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

export const SPRITE_FRAMES = {
  'skin_img0': YI_FRAMES, // Mario
  'skin_img1': YI_FRAMES, // Luigi
  'skin_img2': YI_FRAMES, // Wario
  'skin_img3': YI_FRAMES, // Waluigi
}
