// Funções auxiliares simples (não dependem do jogo).

// Converte milissegundos para texto "mm:ss.cc" (minutos:segundos.centésimos).
export function formatTime(ms) {
  const totalCs  = Math.floor(ms / 10)
  const cs       = totalCs % 100
  const totalSec = Math.floor(totalCs / 100)
  const sec      = totalSec % 60
  const min      = Math.floor(totalSec / 60)
  const p2 = n => String(n).padStart(2, '0')
  return `${p2(min)}:${p2(sec)}.${p2(cs)}`
}
