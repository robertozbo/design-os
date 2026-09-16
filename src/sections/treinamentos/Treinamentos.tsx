import { TreinamentosView } from './components/TreinamentosView'
import { useTreinamentosPreview } from './preview-state'

/** Item "Treinamentos" da sidebar SST — o catálogo do que a consultoria oferece. */
export default function Treinamentos() {
  return <TreinamentosView {...useTreinamentosPreview()} visao="treinamentos" />
}
