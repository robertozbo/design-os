import type { Fornecedor } from '@/../product-medical-clinic/sections/fornecedores/types'

/** Só dígitos. */
export function soDigitos(v: string): string {
  return v.replace(/\D/g, '')
}

/** Formata CNPJ: 12345678000190 -> 12.345.678/0001-90 */
export function formatCnpj(v: string): string {
  const d = soDigitos(v).slice(0, 14)
  let out = d
  if (d.length > 2) out = `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length > 5) out = `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length > 8) out = `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  if (d.length > 12) out = `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
  return out
}

/** Formata telefone: (11) 3255-4010 / (11) 99999-8888 */
export function formatTelefone(v: string): string {
  const d = soDigitos(v).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function cnpjValido(v: string): boolean {
  return soDigitos(v).length === 14
}

/** Mock de consulta de CNPJ (no produto real: BrasilAPI/ReceitaWS). */
const MOCK_CNPJ: Record<string, Partial<Fornecedor>> = {
  '11444777000161': {
    razaoSocial: 'Farmácia Central Comércio de Medicamentos Ltda',
    nomeFantasia: 'Farmácia Central',
    telefone: '(11) 3123-4567',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  '19131243000197': {
    razaoSocial: 'Distribuidora Vida Saudável S.A.',
    nomeFantasia: 'Vida Saudável',
    telefone: '(11) 4321-8765',
    cidade: 'Campinas',
    uf: 'SP',
  },
}

/** Simula a consulta assíncrona. Retorna dados mockados por CNPJ. */
export function consultarCnpj(cnpj: string): Promise<Partial<Fornecedor> | null> {
  const d = soDigitos(cnpj)
  return new Promise((resolve) => {
    setTimeout(() => {
      if (d.length !== 14) return resolve(null)
      // CNPJ desconhecido devolve `null` — o fallback antes inventava razão social, telefone e
      // cidade, e a tela anunciava "dados preenchidos pela consulta" para dado fabricado. Sem o
      // null, o estado "CNPJ não encontrado" era inalcançável e nunca seria desenhado.
      resolve(MOCK_CNPJ[d] ?? null)
    }, 700)
  })
}
