import { TreinamentosView } from './components/TreinamentosView'
import { useTreinamentosPreview } from './preview-state'

/** Item "Turmas" da sidebar SST — mesma seção Treinamentos, visão fixa. */
export default function Turmas() {
  return <TreinamentosView {...useTreinamentosPreview()} visao="turmas" />
}
