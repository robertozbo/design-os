import data from '@/../product-medical-clinic/sections/contas-receber/data.json'
import type { FinanceiroData } from '@/../product-medical-clinic/sections/contas-receber/types'
import { ContasPage } from '../financeiro/components'

export default function ContasReceberPreview() {
  return <ContasPage tipo="receber" dados={data as unknown as FinanceiroData} />
}
