export type StatusApp = 'vinculado' | 'convite-pendente' | 'nao-convidado'
export type Genero = 'feminino' | 'masculino' | 'outro'
export type Modalidade = 'presencial' | 'tele'
export type AlertNivel = 'baixo' | 'normal' | 'alto' | 'critico'
export type StatusPrescricao = 'ativa' | 'expirada' | 'cancelada'
export type TabDetalhe = 'visao-geral' | 'atendimentos' | 'exames' | 'prescricoes'
export type TipoAlerta = 'exame-pendente' | 'mensagem-nao-lida' | 'retorno-atrasado'

export interface PacienteListItem {
  id: string
  nome: string
  idade: number
  genero: Genero
  condicoesCronicas: string[]
  convenio: string
  ultimaConsultaEm: string | null
  proximaConsultaEm: string | null
  statusApp: StatusApp
  vinculadoEm?: string
  convidadoEm?: string
}

export interface FiltroLista {
  busca: string
  statusApp: StatusApp[]
  convenios: string[]
  condicoes: string[]
}

export interface ProximaConsulta {
  agendamentoId: string
  iniciaEm: string
  modalidade: Modalidade
  observacao: string
}

export interface Atendimento {
  id: string
  data: string
  modalidade: Modalidade
  medico: string
  planoResumo: string
  geradoPorIA: boolean
}

export type AcaoPosConsultaRealizada = 'agendar-retorno' | 'enviar-resumo' | 'cobrar'

export interface AnamneseResumo {
  queixaPrincipal: string
  sintomas: string[]
  medicacaoNoDia: string
  duvidasPaciente: string
}

export interface SoapEvolucao {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

export interface PrescricaoEmitidaResumo {
  id: string
  memedId: string
  medicacoes: { nome: string; dose: string; posologia: string }[]
}

/** Análise IA + comentário do médico sobre uma imagem, salva no prontuário durante o atendimento. */
export interface ImagemAnalisadaResumo {
  id: string
  tipo: string
  modalidade: 'raio-x' | 'usg' | 'rm' | 'tc' | 'cintilografia'
  laboratorio: string
  dataColeta: string
  modeloIA: string
  comentarioMedico: string | null
  seriesAnalisadas: number
  salvoEm: string
}

/** Versão expandida de um Atendimento concluído. Read-only — abre num drawer ao clicar na timeline da tab Atendimentos. */
export interface AtendimentoDetalhe extends Atendimento {
  inicioEm: string
  fimEm: string
  duracaoMin: number
  assinadoEm: string | null
  modeloIA: string | null
  versaoIA: string | null
  anamneseResumo: AnamneseResumo
  soap: SoapEvolucao
  prescricoesEmitidas: PrescricaoEmitidaResumo[]
  examesSolicitados: string[]
  imagensAnalisadas: ImagemAnalisadaResumo[]
  acoesRealizadas: AcaoPosConsultaRealizada[]
  retornoSugerido: string | null
}

export interface Biomarker {
  nome: string
  valor: number
  unidade: string
  faixaReferencia: string
  alertNivel: AlertNivel
  historico: number[]
}

export interface ExameHistorico {
  id: string
  tipo: string
  laboratorio: string
  dataColeta: string
  biomarkers: Biomarker[]
}

export interface MedicacaoEmReceita {
  nome: string
  dose: string
  posologia: string
}

export interface PrescricaoHistorico {
  id: string
  data: string
  medicacoes: MedicacaoEmReceita[]
  validade: string
  status: StatusPrescricao
  memedId: string
}

export interface MedicacaoAtiva {
  nome: string
  dose: string
  posologia: string
  iniciadaEm: string
}

export interface AdesaoMedicamento {
  medicacao: string
  percentCumprido: number
}

export interface Alerta {
  id: string
  tipo: TipoAlerta
  label: string
  criadoEm: string
}

export interface PacienteDetalhe {
  id: string
  nome: string
  idade: number
  dataNascimento: string
  genero: Genero
  telefone: string
  email: string
  endereco: string
  cpf: string
  convenio: string
  condicoesCronicas: string[]
  statusApp: StatusApp
  vinculadoEm?: string
  ultimaConsultaEm: string | null
  proximaConsulta: ProximaConsulta | null
  atendimentos: Atendimento[]
  examesRecentes: ExameHistorico[]
  prescricoes: PrescricaoHistorico[]
  medicacaoAtiva: MedicacaoAtiva[]
  adesao30Dias: AdesaoMedicamento[]
  adesaoMedicaoDiario30Dias: number
  alertas: Alerta[]
  /** Análises IA de imagem salvas no prontuário em atendimentos recentes — derivado dos atendimentosDetalhes. */
  imagensAnalisadasRecentes?: (ImagemAnalisadaResumo & { atendimentoId: string })[]
}

export interface PacientesListaProps {
  pacientes: PacienteListItem[]
  filtroAtivo: FiltroLista

  /** Atualiza o estado de filtro completo. */
  onAplicarFiltro?: (f: FiltroLista) => void
  /** Limpa todos os filtros. */
  onLimparFiltros?: () => void
  /** Click no nome ou linha do paciente — abre detalhe. */
  onAbrirPaciente?: (id: string) => void
  /** Click no botão "+ Novo paciente" — abre drawer de cadastro. */
  onCadastrarNovo?: () => void
  /** Dispara convite pro app pra um paciente. */
  onConvidarApp?: (id: string) => void
  /** Abre drawer de edição com dados do paciente pré-preenchidos. */
  onEditarPaciente?: (id: string) => void
  /** Abre confirmação de exclusão (arquivamento LGPD-aware). */
  onExcluirPaciente?: (id: string) => void
}

export interface PacienteDetalheProps {
  paciente: PacienteDetalhe
  tabAtiva?: TabDetalhe

  /** Troca a tab ativa do detalhe. */
  onTrocarTab?: (tab: TabDetalhe) => void
  /** Volta pra lista. */
  onVoltar?: () => void
  /** Inicia consulta agendada (link pra section Consulta). */
  onIniciarConsulta?: (agendamentoId: string) => void
  /** Abre canal de mensagem clínica. */
  onAbrirMensagemClinica?: () => void
  /** Abre fluxo de novo agendamento pré-preenchido com este paciente. */
  onAgendar?: () => void
  /** Exporta prontuário em PDF. */
  onExportarPDF?: () => void
  /** Abre evolução completa de um atendimento. */
  onAbrirAtendimento?: (id: string) => void
  /** Abre detalhe de um exame. */
  onAbrirExame?: (id: string) => void
  /** Abre Memed pra criar nova prescrição. */
  onAbrirMemed?: () => void
  /** Abre o prontuário longitudinal completo deste paciente. */
  onAbrirProntuario?: () => void
}
