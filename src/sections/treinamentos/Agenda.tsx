import { TreinamentosView } from './components/TreinamentosView'
import { useTreinamentosPreview } from './preview-state'

/** Item "Agenda" da sidebar SST — quando os treinamentos acontecem: turmas e eventos. */
export default function Agenda() {
  return <TreinamentosView {...useTreinamentosPreview()} visao="agenda" />
}
