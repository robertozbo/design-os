export type StatusPrescricao = 'ativa' | 'expirada' | 'cancelada'

export type OrigemPrescricao =
  | 'consulta'
  | 'renovacao_sem_consulta'
  | 'prescricao_avulsa'

export type MotivoCancelamento =
  | 'erro_prescricao'
  | 'mudanca_conduta'
  | 'reacao_adversa'
  | 'outro'

export type FiltroStatus =
  | 'ativa'
  | 'expirada'
  | 'cancelada'
  | 'precisa_renovar'

export type PeriodoFiltro = '7d' | '30d' | '90d' | 'tudo'

export type ClasseTerapeutica =
  | 'antidiabetico'
  | 'antidiabetico-glp1'
  | 'insulina-basal'
  | 'insulina-rapida'
  | 'hormonio-tireoidiano'
  | 'antitireoidiano'
  | 'beta-bloqueador'
  | 'hipolipemiante'
  | 'suplemento'
  | 'insumo'
  | 'outro'

export interface MedicamentoResumo {
  nome: string
  classe: ClasseTerapeutica
}

export interface PrescricaoListItem {
  id: string
  pacienteId: string
  pacienteNome: string
  iniciais: string
  condicoesCronicas: string[]
  medicamentosResumo: MedicamentoResumo[]
  totalItens: number
  dataEmissao: string
  validade: string
  /** Pode ser negativo se a prescrição já expirou. */
  diasAteVencer: number
  status: StatusPrescricao
  precisaRenovar: boolean
  origem: OrigemPrescricao
}

export interface ItemPrescricao {
  id: string
  medicamento: string
  principioAtivo: string
  dose: string
  posologia: string
  duracaoDias: number
  observacao: string | null
}

export interface RenovacaoHistoricoItem {
  id: string
  dataEmissao: string
  medicoNome: string
  tipo: 'consulta' | 'renovacao_sem_consulta' | 'prescricao_avulsa'
}

export interface PrescricaoDetalhe {
  id: string
  memedId: string
  memedPdfUrl: string
  pacienteId: string
  pacienteNome: string
  iniciais: string
  condicoesCronicas: string[]
  status: StatusPrescricao
  origem: OrigemPrescricao
  /** Presente quando origem === 'consulta' — id da consulta vinculada. */
  consultaId: string | null
  /** Data da consulta vinculada (mostrada como link no drawer). */
  consultaData: string | null
  /** Presente quando origem === 'renovacao_sem_consulta' — id da prescrição original que está sendo renovada. */
  renovacaoDe: string | null
  numeroRenovacoes: number
  historicoRenovacoes: RenovacaoHistoricoItem[]
  dataEmissao: string
  validade: string
  diasAteVencer: number
  observacaoGeral: string | null
  itens: ItemPrescricao[]
  /** Campos abaixo só presentes quando status === 'cancelada'. */
  canceladaEm?: string
  canceladaPor?: string
  motivoCancelamentoCategoria?: MotivoCancelamento
  justificativaCancelamento?: string
}

export interface FiltroLista {
  busca: string
  status: FiltroStatus[]
  periodo: PeriodoFiltro
}

export interface PrescricaoKpis {
  ativas: number
  precisaRenovar: number
  expiradas: number
  canceladasUlt30d: number
}

export interface PacienteSelector {
  id: string
  nome: string
  iniciais: string
  condicoesCronicas: string[]
  ultimaConsulta: string | null
}

export interface PrescricaoListaProps {
  filtroAtivo: FiltroLista
  kpis: PrescricaoKpis
  prescricoesLista: PrescricaoListItem[]
  prescricoesDetalhes: Record<string, PrescricaoDetalhe>
  pacientesParaNovaPrescricao: PacienteSelector[]
  /** Disparado ao clicar numa linha da lista — abre drawer de detalhe. */
  onSelectPrescricao?: (prescricaoId: string) => void
  /** Disparado pelo botão "Renovar" (drawer ou inline na lista quando filtro "Precisa renovar" ativo). Abre Memed embutido pré-preenchido. */
  onAbrirRenovacao?: (prescricaoId: string) => void
  /** Disparado pelo botão "Cancelar" no drawer. Abre modal de cancelamento. */
  onAbrirCancelamento?: (prescricaoId: string) => void
  /** Disparado pelo botão "+ Nova prescrição" no header. Abre seletor de paciente seguido de Memed embutido em branco. */
  onAbrirNovaPrescricao?: (pacienteId: string) => void
  /** Disparado pelo botão "Abrir PDF Memed" no drawer. */
  onAbrirPdfMemed?: (prescricaoId: string) => void
  /** Disparado quando o médico clica no link "Ver consulta de DD/MM" no drawer. Navega pra Consulta vinculada. */
  onAbrirConsultaVinculada?: (consultaId: string) => void
  /** Disparado quando filtros mudam (busca, chips de status, período). */
  onChangeFiltro?: (filtro: FiltroLista) => void
  /** Disparado ao confirmar cancelamento no modal. */
  onConfirmarCancelamento?: (
    prescricaoId: string,
    motivo: MotivoCancelamento,
    justificativa: string,
  ) => void
}
