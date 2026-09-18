import data from '@/../product-clinic/sections/publicacoes/data.json'
import type { PublicacoesData } from '@/../product-clinic/sections/publicacoes/types'
import { PublicacoesModulo } from './components'

/**
 * A section no workspace de uma clínica.
 *
 * O arquivo é só o dado: a tela inteira é `PublicacoesModulo`, a mesma que o
 * back-office da Nymos monta em `sections-admin/publicacoes`. Se um dia esta section
 * precisar de um componente próprio, o multi-tenant do módulo virou conversa fiada.
 */
export default function PublicacoesPreview() {
  return <PublicacoesModulo dados={data as unknown as PublicacoesData} />
}
