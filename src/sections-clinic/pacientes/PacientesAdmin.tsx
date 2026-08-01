/**
 * Pacientes — visão da Recepção.
 *
 * A mesma tela do médico com `escopo="administrativo"`: some condição crônica da linha, do drawer e
 * do cadastro, e a busca deixa de vasculhar diagnóstico. Não é uma segunda tela mantida em
 * paralelo — é o mesmo componente sob o recorte que a LGPD exige do balcão.
 *
 * Existe como screen design próprio porque o recorte precisa ser **visível** no handoff: sem isso,
 * quem implementar vê só a versão do médico e assume que a recepção enxerga o mesmo.
 */
import PacientesListaPreview from './PacientesLista'

export default function PacientesAdminPreview() {
  return <PacientesListaPreview escopo="administrativo" />
}
