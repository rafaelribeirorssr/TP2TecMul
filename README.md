# Super Aventura — Plataformas 2D (Phaser 3)

Trabalho Prático 2 — **Tecnologias Multimédia 2025/2026**

Jogo de plataformas 2D estilo *Mario*, desenvolvido em Phaser 3, com 5 níveis temáticos,
4 personagens jogáveis, vários tipos de inimigos, banda sonora gerada por código e
suporte a 3 línguas (PT / EN / ZH).

---

## Grupo

| Nome | Número |
|------|--------|
| Rafael Ribeiro | 33382 |
| Vasco Vasconcelos | 33394 |

---

## Versão de Phaser

- **Phaser 3** (estável, ≥ 3.80)
- Incluído via **npm** (`npm install phaser`), importado nos módulos ES6 com `import Phaser from 'phaser'`.

---

## Descrição do jogo

**Género:** Platformer 2D (visão lateral).

**Objetivo:** Atravessar cada um dos 5 níveis da esquerda para a direita, recolhendo moedas,
derrotando ou evitando inimigos, até chegar à porta no fim de cada nível. Completar os 5 níveis
resulta em **Vitória**; ficar sem vidas resulta em **Game Over**.

**Regras principais:**
- O jogador perde uma vida ao tocar num inimigo de lado ou ao cair num poço/lava.
- Saltar em cima de um inimigo elimina-o e dá pontos.
- Recolher moedas aumenta a pontuação.
- A câmara acompanha o jogador ao longo de níveis largos.

**Funcionalidades implementadas:**
- **5 níveis** com temas distintos (floresta, caverna, vulcão, gelo, espaço) e dificuldade crescente.
- **4 personagens jogáveis** com estatísticas diferentes (salto, velocidade, vidas):
  - Mario — Equilibrado
  - Luigi — Saltador (salto mais alto)
  - Wario — Resistente (mais vidas)
  - Waluigi — Veloz (mais rápido)
- **4 tipos de inimigos** com comportamentos diferentes (walker, jumper, koopa com ciclo de
  caminhada animado, flyer voador).
- **Estado de jogo** visível: pontuação, vidas, tempo (cronómetro) e nível atual.
- **Game Over** e **Vitória**, com reinício.
- **Cena de pausa** (ESC) com opções de continuar, reiniciar nível e voltar ao menu.
- **Seleção de personagem** em cena própria.
- **Banda sonora** (música de fundo) + efeitos sonoros distintos por evento (moeda, dano, stomp).
- **Suporte a 3 línguas** (Português, Inglês e Chinês) com seletor no menu.

---

## Jogabilidade / Controlos

| Tecla | Ação |
|-------|------|
| ◄ ► / A D | Mover esquerda/direita |
| ▲ / W / ESPAÇO | Saltar |
| ▼ / S | Baixar / agachar |
| ESC | Pausa |
| R | Reiniciar (no ecrã de Game Over) |
| M | Ligar/desligar som |

A personagem também pode derrotar inimigos saltando em cima deles.

---

## Como executar

O projeto usa **Vite** como servidor de desenvolvimento.

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

Depois abrir o endereço indicado no terminal (por defeito `http://localhost:5173`)
num navegador moderno (Chrome, Firefox ou Edge).

Para gerar a versão de produção:
```bash
npm run build
npm run preview
```

---

## Aspectos multimédia

### Imagens / Sprites
- **Formato:** PNG (sprites de personagens e inimigos) e JPG (folha de sprites de inimigos de referência).
- **Origem:** Sprites de personagens e inimigos obtidos de fontes externas de *sprite rips*
  (estilo *Yoshi's Island* / *The Spriters Resource*), recortados e ajustados para o jogo.
- **Resolução:** Sprites pequenos (≈ 27×33 px para personagens, ≈ 25–42 px para inimigos),
  proporcionais ao tamanho de utilização no ecrã. As folhas de sprites são fatiadas em frames
  individuais via configuração em `src/assetConfig.js`.
- **Animações:** Ciclos de caminhada por spritesheet (ex.: Koopa com 6 frames), animados com o
  sistema de animações do Phaser.

### Som
- **Formato:** Áudio sintetizado em tempo real através de **osciladores da Web Audio API**
  (`OscillatorNode`), sem ficheiros de áudio no repositório. A música de fundo e os efeitos
  sonoros são gerados nota a nota por código (`src/audio.js`).
- **Eventos com som:** recolha de moeda, dano ao jogador, derrota de inimigo (stomp), música
  contínua de fundo.
- **Justificação:** A síntese por osciladores mantém o tamanho dos assets praticamente nulo
  (sem WAV/MP3 volumosos), cumprindo o requisito de tempos de carregamento controlados, e
  garante um estilo sonoro *chiptune* coerente com a estética retro do jogo.

### Tamanho dos assets
- Total de imagens utilizadas mantido reduzido; sprites com resolução proporcional ao uso.
- Áudio sintetizado em runtime, evitando ficheiros de som grandes.

---

## Estrutura do projeto

```
TP2TecMul/
├── index.html
├── package.json
├── .gitignore
├── README.md
├── public/              # sprites (servidos estaticamente)
└── src/
    ├── main.js          # configuração do jogo e registo de cenas
    ├── audio.js         # gestor de áudio (Web Audio API)
    ├── assetConfig.js   # configuração de sprites, skins e inimigos
    ├── locales/         # traduções (pt.json, en.json, zh.json)
    └── scenes/
        ├── BootScene.js
        ├── MenuScene.js
        ├── CharacterScene.js
        ├── GameScene.js
        ├── GameOverScene.js
        └── PauseScene.js
```

---

## Funcionalidades extra (pontos de valorização)

- Múltiplas cenas (Boot, Menu, Seleção de Personagem, Jogo, Game Over, Pausa).
- 5 níveis com aumento progressivo de dificuldade.
- Diversidade de inimigos com padrões de movimento distintos.
- 4 personagens jogáveis com estatísticas diferentes.
- Banda sonora completa gerada por osciladores (música de fundo *chiptune* + efeitos distintos por evento).
- Animações com spritesheets, partículas e tweens.
- Câmara com follow e fade entre cenas.
- **3 línguas** suportadas (vai além do mínimo de 2): PT, EN, ZH.
- Interface com pontuação, vidas, tempo e instruções no jogo.
