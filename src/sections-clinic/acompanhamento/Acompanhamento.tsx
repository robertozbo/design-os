import data from '@/../product-clinic/sections/acompanhamento/data.json'
import type { AcompanhamentoData } from '@/../product-clinic/sections/acompanhamento/types'
import { AcompanhamentoView } from './components'

export default function AcompanhamentoPreview() {
  return <AcompanhamentoView dados={data as unknown as AcompanhamentoData} />
}
