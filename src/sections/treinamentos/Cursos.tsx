import { TreinamentosView } from './components/TreinamentosView'
import { useTreinamentosPreview } from './preview-state'

/** Item "Cursos" da sidebar SST — mesma seção Treinamentos, visão fixa. */
export default function Cursos() {
  return <TreinamentosView {...useTreinamentosPreview()} visao="cursos" />
}
