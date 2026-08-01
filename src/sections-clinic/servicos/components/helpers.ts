export function moeda(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Máscara de moeda ao vivo: dígitos = centavos → "15.000,00". */
export function mascaraMoeda(v: string): string {
  const d = v.replace(/\D/g, '')
  if (!d) return ''
  return (Number(d) / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Converte "1.234,50" | "1234.50" | "150" em número (último separador = decimal). */
export function parseValorBR(v: string): number {
  const s = v.trim().replace(/[^\d.,]/g, '')
  const dec = Math.max(s.lastIndexOf(','), s.lastIndexOf('.'))
  if (dec === -1) return Number(s) || 0
  const inteiro = s.slice(0, dec).replace(/[.,]/g, '')
  const frac = s.slice(dec + 1).replace(/[.,]/g, '')
  return Number(`${inteiro}.${frac}`) || 0
}
