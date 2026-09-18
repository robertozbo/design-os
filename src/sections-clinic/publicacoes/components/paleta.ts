/**
 * Extração das cores dominantes de uma imagem (logo ou arte de referência).
 *
 * Roda no navegador com canvas, sem biblioteca: a imagem é reduzida a 64×64, os pixels
 * são agrupados em baldes de 32 níveis por canal e os baldes mais cheios viram a
 * paleta. É aproximação, e é suficiente — o objetivo é oferecer cinco cores plausíveis
 * para a pessoa escolher, não reproduzir o manual de marca.
 */

export interface CorExtraida {
  hex: string
  /** Fração dos pixels considerados que caíram neste balde. 0–1. */
  peso: number
}

/** #rrggbb a partir de 0–255. */
function hex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
}

/** Saturação HSL simplificada — separa cor de marca de cinza de fundo. */
function saturacao(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max === 0) return 0
  return (max - min) / max
}

/**
 * Luminância relativa (WCAG). Usada para decidir se o texto sobre a cor sai branco ou
 * escuro — cor clara da marca com texto branco por cima é ilegível, e é o erro que
 * aparece só depois do post publicado.
 */
export function luminancia(corHex: string): number {
  const n = corHex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

/** `true` quando o texto por cima precisa ser escuro. */
export function precisaTextoEscuro(corHex: string): boolean {
  return luminancia(corHex) > 0.45
}

export async function extrairPaleta(arquivo: File, quantas = 5): Promise<CorExtraida[]> {
  const url = URL.createObjectURL(arquivo)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('imagem inválida'))
      el.src = url
    })

    const lado = 64
    const canvas = document.createElement('canvas')
    canvas.width = lado
    canvas.height = lado
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return []
    ctx.drawImage(img, 0, 0, lado, lado)
    const { data } = ctx.getImageData(0, 0, lado, lado)

    const baldes = new Map<string, { r: number; g: number; b: number; n: number }>()
    let considerados = 0

    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
      // Transparente, quase-branco, quase-preto e cinza saem fora: são o papel do logo,
      // não a marca. Sem isso a paleta de todo logo vem branco, preto e cinza.
      if (a < 200) continue
      const max = Math.max(r, g, b)
      if (max > 240 && saturacao(r, g, b) < 0.1) continue
      if (max < 24) continue
      if (saturacao(r, g, b) < 0.15) continue

      considerados++
      const chave = `${r >> 5}-${g >> 5}-${b >> 5}`
      const atual = baldes.get(chave)
      if (atual) {
        atual.r += r
        atual.g += g
        atual.b += b
        atual.n++
      } else {
        baldes.set(chave, { r, g, b, n: 1 })
      }
    }

    if (considerados === 0) return []

    return [...baldes.values()]
      .sort((a, b) => b.n - a.n)
      .slice(0, quantas)
      .map((c) => ({ hex: hex(c.r / c.n, c.g / c.n, c.b / c.n), peso: c.n / considerados }))
      // Abaixo de 4% dos pixels é quase sempre borda anti-serrilhada entre duas cores
      // de verdade — entrava na paleta como uma cor que não existe no logo. O primeiro
      // balde nunca é descartado: se a marca é monocromática, é essa a cor dela.
      .filter((c, i) => i === 0 || c.peso >= 0.04)
  } finally {
    URL.revokeObjectURL(url)
  }
}
