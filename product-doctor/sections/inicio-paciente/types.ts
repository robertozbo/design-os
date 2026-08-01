export type Periodo = 'manha' | 'tarde' | 'noite' | 'madrugada'
export type Modalidade = 'presencial' | 'tele'
export type StatusLembrete = 'cumprido' | 'pendente' | 'atrasado' | 'pulado'
export type TipoAlerta = 'mensagem' | 'exame-pedido' | 'plano-novo' | 'consulta'
export type AcaoRapidaId = 'peso' | 'glicemia' | 'exame' | 'receita'

export interface Paciente {
  id: string
  nome: string
  nomeCompleto: string
  iniciais: string
  notificacoesNaoLidas: number
}

export interface Saudacao {
  periodo: Periodo
  texto: string
  dica: string
}

export interface AlertaTopo {
  id: string
  tipo: TipoAlerta
  label: string
  ctaLabel: string
  ctaHref: string
}

export interface ProximaConsulta {
  agendamentoId: string
  data: string
  hora: string
  modalidade: Modalidade
  medicoNome: string
  medicoEspecialidade: string
  observacao: string
  minutosAteInicio: number
  ehHoje: boolean
  podeEntrarSala: boolean
}

export interface LembreteMedicacao {
  id: string
  medicacao: string
  dose: string
  horario: string
  instrucao: string
  status: StatusLembrete
  cumpridoEm: string | null
}

export interface AcaoRapida {
  id: AcaoRapidaId
  label: string
  icone: string
  valorAtual: string | null
  ultimoRegistro: string | null
}

export interface ProfissionalVinculadoPendencias {
  proximaConsultaTexto: string | null
  mensagensNaoLidas: number
  planoAtivoLabel: string | null
}

export interface ProfissionalVinculado {
  id: string
  nome: string
  especialidade: string
  iniciais: string
  vinculadoEm: string
  pendencias: ProfissionalVinculadoPendencias
}

export interface ProfissionalPlaceholder {
  verticalId: string
  verticalLabel: string
  ctaLabel: string
  explicacao: string
}

export interface InicioPacienteProps {
  paciente: Paciente
  saudacao: Saudacao
  alertaTopo: AlertaTopo | null
  proximaConsulta: ProximaConsulta | null
  lembretesMedicacaoHoje: LembreteMedicacao[]
  acoesRapidas: AcaoRapida[]
  profissionaisVinculados: ProfissionalVinculado[]
  profissionaisPlaceholder: ProfissionalPlaceholder[]

  /** Click no sino de notificações no topbar. */
  onAbrirNotificacoes?: () => void
  /** Click no avatar do paciente no topbar. */
  onAbrirPerfil?: () => void

  /** Click no banner de alerta do topo (vai pra mensagem/exame/etc). */
  onAbrirAlerta?: (id: string) => void

  /** Click no card de próxima consulta — abre detalhe na Agenda. */
  onAbrirProximaConsulta?: (agendamentoId: string) => void
  /** Botão "Entrar na sala" da próxima consulta (modalidade tele e podeEntrarSala). */
  onEntrarSalaTele?: (agendamentoId: string) => void
  /** Botão "Confirmar presença" (modalidade presencial e podeEntrarSala). */
  onConfirmarPresenca?: (agendamentoId: string) => void

  /** Marca um lembrete como cumprido. */
  onMarcarCumprido?: (id: string) => void
  /** Pula um lembrete (com motivo opcional). */
  onPularLembrete?: (id: string, motivo?: string) => void

  /** Click numa ação rápida — abre o fluxo correspondente. */
  onAcaoRapida?: (id: AcaoRapidaId) => void

  /** Click num card de profissional vinculado — abre track dele. */
  onAbrirProfissional?: (id: string) => void
  /** Click no CTA "Buscar nutri/psicólogo/etc" do placeholder (V2). */
  onBuscarProfissional?: (verticalId: string) => void
}
