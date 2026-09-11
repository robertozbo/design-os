import { TreinamentosView } from './components/TreinamentosView'
import { useTreinamentosPreview } from './preview-state'

/** Item "Eventos" da sidebar SST — mesma seção Treinamentos, visão fixa. */
export default function Eventos() {
  return <TreinamentosView {...useTreinamentosPreview()} visao="eventos" />
}
