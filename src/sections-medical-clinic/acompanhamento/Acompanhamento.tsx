import data from '@/../product-medical-clinic/sections/acompanhamento/data.json'
import type { AcompanhamentoData } from '@/../product-medical-clinic/sections/acompanhamento/types'
import { AcompanhamentoView } from './components'

export default function AcompanhamentoPreview() {
  return <AcompanhamentoView dados={data as unknown as AcompanhamentoData} />
}
