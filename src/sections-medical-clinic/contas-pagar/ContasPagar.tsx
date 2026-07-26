import data from '@/../product-medical-clinic/sections/contas-pagar/data.json'
import type { FinanceiroData } from '@/../product-medical-clinic/sections/contas-pagar/types'
import { ContasPage } from '../financeiro/components'

export default function ContasPagarPreview() {
  return <ContasPage tipo="pagar" dados={data as unknown as FinanceiroData} />
}
