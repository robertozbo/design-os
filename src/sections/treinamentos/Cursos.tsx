import { TreinamentosView } from './components/TreinamentosView'
import { useTreinamentosPreview } from './preview-state'

/** Item "Cursos" da sidebar SST — o catálogo do que a consultoria oferece. */
export default function Cursos() {
  return <TreinamentosView {...useTreinamentosPreview()} visao="cursos" />
}
