import data from '@/../product-admin/sections/publicacoes/data.json'
import type { PublicacoesData } from '@/../product-clinic/sections/publicacoes/types'
import { PublicacoesModulo } from '@/sections-clinic/publicacoes/components'

/**
 * O módulo Marketing no workspace interno da Nymos.
 *
 * Importa o componente da clínica de propósito e sem adaptador: é a prova executável
 * de que o módulo é multi-tenant por dados. O dia em que este arquivo precisar de algo
 * além do `data.json` é o dia em que passamos a manter duas implementações.
 */
export default function PublicacoesAdmin() {
  return <PublicacoesModulo dados={data as unknown as PublicacoesData} />
}
