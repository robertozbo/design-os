// Types for Saúde Mental (Mobile)
//
// Conexão paciente↔psicólogo via chat 1-1 + diário emocional diário.
// Layout em 2 tabs: Chat e Diário. Diário sempre disponível;
// Chat exige psicólogo vinculado (empty state com CTA convidar).

export type TabSaudeMental = 'chat' | 'diario'

export type StatusPsicologo = 'online' | 'offline' | 'em-sessao'

export type EmocaoTom = 'positivo' | 'neutro' | 'negativo'

export type AutorMensagem = 'paciente' | 'psicologo' | 'sistema'

export type TipoMensagem = 'texto' | 'sistema' | 'diario_compartilhado'

export type DirecaoTendencia = 'subida' | 'queda' | 'estavel'

export interface Header {
  tag: string
  title: string
  subtitle: string
}

export interface ProximoAgendamento {
  /** ISO datetime do próximo agendamento */
  dataISO: string
  /** Label formatado pra UI ("Sex, 15 mai · 16h00") */
  label: string
  modalidade: 'Videochamada' | 'Presencial'
}

export interface PsicologoVinculado {
  id: string
  fullName: string
  tratamento: string
  /** Registro profissional ("CRP 06/45678") */
  registro: string
  /** Abordagens praticadas ("TCC · ACT") */
  abordagem: string
  fotoUrl: string | null
  /** Inicial pra avatar fallback */
  inicial: string
  status: StatusPsicologo
  /** Label visível do status ("Online agora", "Visto há 2h", "Em sessão") */
  statusLabel: string
  /** Tempo relativo da última interação ("há 3h") */
  ultimaInteracao: string | null
  proximoAgendamento: ProximoAgendamento | null
}

export interface ChatMensagem {
  id: string
  autor: AutorMensagem
  tipo: TipoMensagem
  texto: string
  /** ISO datetime do envio */
  enviadaEm: string
  /** Status de leitura — só relevante pra mensagens próprias (paciente) */
  lida: boolean
}

export interface ChatState {
  naoLidas: number
  digitando: boolean
  mensagens: ChatMensagem[]
}

export interface EmocaoOption {
  id: string
  label: string
  tom: EmocaoTom
}

export interface DiarioHoje {
  /** ISO date do registro (sempre hoje) */
  dataISO: string
  preenchido: boolean
  /** Humor 1-10 (null quando não preenchido) */
  humor: number | null
  /** IDs das emoções selecionadas */
  emocaoIds: string[]
  /** Energia percebida 1-5 (null quando não preenchido) */
  energia: number | null
  /** Qualidade do sono 1-5 (null quando não preenchido) */
  sono: number | null
  /** Nota livre opcional */
  nota: string
  /** Default do toggle compartilhamento — só relevante quando há psicólogo vinculado */
  compartilharComPsicologo: boolean
  /** ISO datetime do save (null quando não preenchido) */
  submittedAt: string | null
  /** Texto de ajuda exibido no card */
  hint: string
}

export interface HumorPonto {
  /** ISO date do dia */
  dateISO: string
  /** Label curto pro eixo X ("Qua") */
  label: string
  /** Humor 1-10 ou null quando não houve check-in */
  score: number | null
  temRegistro: boolean
}

export interface HumorSemana {
  rangeLabel: string
  mediaSemanaAtual: number
  mediaSemanaAnterior: number
  deltaLabel: string
  tendenciaLabel: 'Subindo' | 'Estável' | 'Caindo'
  dias: HumorPonto[]
}

export interface TendenciaMensal {
  mesLabel: string
  humorMedio: number
  humorMedioAnterior: number
  deltaLabel: string
  direcao: DirecaoTendencia
  /** Frase curta de contexto gerada por IA */
  frase: string
}

export interface HistoricoItem {
  id: string
  /** ISO date da entrada */
  dataISO: string
  /** Label formatado ("Seg, 11 mai") */
  dataLabel: string
  humor: number
  /** Até 2 labels de emoções mais relevantes — visíveis no estado colapsado */
  emocaoLabelsTop: string[]
  /** Nota truncada (~100 chars) com reticências — visível no estado colapsado */
  notaTruncada: string
  compartilhadoComPsicologo: boolean

  /**
   * Conteúdo completo exibido quando o item é expandido (acordeon).
   * São opcionais pra manter retro-compatibilidade — UI degrada se faltarem.
   */
  notaCompleta?: string
  todasEmocoesLabels?: string[]
  energia?: number
  sono?: number
}

export interface SaudeMentalData {
  header: Header
  tabAtiva: TabSaudeMental
  psicologo: PsicologoVinculado | null
  chat: ChatState
  diarioHoje: DiarioHoje
  emocoesCatalogo: EmocaoOption[]
  humorSemana: HumorSemana
  tendenciaMensal: TendenciaMensal
  historico: HistoricoItem[]
}

/** Payload submetido ao salvar/atualizar uma entrada do diário */
export interface DiarioSubmission {
  humor: number
  emocaoIds: string[]
  energia: number
  sono: number
  nota: string
  compartilharComPsicologo: boolean
}

export interface SaudeMentalProps {
  data: SaudeMentalData
  /** Tab inicial (sobrescreve data.tabAtiva quando definido) */
  abaInicial?: TabSaudeMental
  /** Usuário trocou a tab ativa */
  onChangeTab?: (tab: TabSaudeMental) => void

  // --- Chat ---
  /** Usuário enviou uma mensagem no chat */
  onSendMessage?: (texto: string) => void
  /** Usuário tocou no botão de anexar (foto/áudio — placeholder V2) */
  onAttachFile?: () => void
  /** Usuário tocou no strip do psicólogo (abre detalhe via Profissionais) */
  onOpenPsicologoDetail?: (psicologoId: string) => void
  /** Empty state: usuário tocou em "Convidar psicólogo" */
  onInvitePsicologo?: () => void

  // --- Diário ---
  /** Usuário salvou (ou editou) a entrada do diário de hoje */
  onSubmitDiario?: (payload: DiarioSubmission) => void
  /** Usuário tocou em "Editar" no resumo do diário de hoje */
  onEditDiario?: () => void
  /** Usuário tocou em um item do histórico */
  onOpenHistoricoItem?: (id: string) => void
}
