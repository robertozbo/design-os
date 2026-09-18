import type { Convenio } from '@/../product-clinic/sections/convenios/types'

/**
 * Nome reduzido ao que importa para comparar: minúsculas, sem acento, sem
 * pontuação, espaços colapsados. É a mesma normalização que o `lower(name)` do
 * unique parcial faz no banco, esticada para pegar também "Unimed  Regional." —
 * que o banco deixa passar e o olho humano não.
 */
export function normalizarNome(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Quem colide com quem, por grafia.
 *
 * Devolve, para cada convênio que tem irmão, o convênio com MAIS pacientes do
 * grupo — que é o candidato a nome canônico. O de 4 pacientes aponta para o de
 * 312, nunca o contrário: a correção que dá menos trabalho é renomear o pequeno.
 *
 * Roda sobre a lista em memória de propósito. Não é campo do servidor, então
 * renomear faz o aviso sumir no mesmo render.
 */
export function detectarParecidos(convenios: Convenio[]): Map<string, Convenio> {
  const porChave = new Map<string, Convenio[]>()
  for (const c of convenios) {
    const chave = normalizarNome(c.nome)
    if (!chave) continue
    const grupo = porChave.get(chave)
    if (grupo) grupo.push(c)
    else porChave.set(chave, [c])
  }

  const parecidos = new Map<string, Convenio>()
  for (const grupo of porChave.values()) {
    if (grupo.length < 2) continue
    const canonico = grupo.reduce((a, b) => (b.pacientes > a.pacientes ? b : a))
    for (const c of grupo) {
      if (c.id !== canonico.id) parecidos.set(c.id, canonico)
    }
  }
  return parecidos
}

/** 1.234 — separador de milhar pt-BR. */
export function inteiro(n: number): string {
  return n.toLocaleString('pt-BR')
}
