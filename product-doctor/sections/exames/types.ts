export type CategoriaExame = 'laboratorial' | 'imagem'
export type AlertNivel = 'baixo' | 'normal' | 'alto' | 'critico'
export type Tendencia = 'subindo' | 'caindo' | 'estavel'
export type StatusRevisao = 'a-revisar' | 'revisado' | 'todos'
export type PeriodoFiltro = '7d' | '30d' | '90d' | 'tudo'
export type IABlocoTipo =
  | 'resumo-laudo'
  | 'comparacao-historica'
  | 'cruzamento-queixa'
  | 'cruzamento-medicacao'

export interface BiomarkerDestaque {
  nome: string
  valor: number
  unidade: string
  alertNivel: AlertNivel
  tendencia: Tendencia
  historico: number[]
}

export interface ExameListItem {
  id: string
  pacienteId: string
  pacienteNome: string
  iniciais: string
  condicoesCronicas: string[]
  tipo: string
  categoria: CategoriaExame
  laboratorio: string
  dataColeta: string
  recebidoEm: string
  statusRevisao: 'a-revisar' | 'revisado'
  revisadoEm?: string
  destaqueBiomarker: BiomarkerDestaque | null
}

export interface FiltroLista {
  busca: string
  tipos: CategoriaExame[]
  statusRevisao: StatusRevisao
  periodo: PeriodoFiltro
}

export interface BiomarkerHistoricoPonto {
  data: string
  valor: number
}

export interface BiomarkerDetalhe {
  nome: string
  nomeCompleto: string
  valor: number
  unidade: string
  faixaReferencia: string
  alertNivel: AlertNivel
  tendencia: Tendencia
  deltaPercent: number
  historico: BiomarkerHistoricoPonto[]
}

export interface LaudoOriginal {
  texto: string
  paginas: number
}

export interface IABloco {
  tipo: IABlocoTipo
  titulo: string
  conteudo: string
  fonte: string
}

export interface IAAnalise {
  modeloIA: string
  geradoEm: string
  blocos: IABloco[]
}

export interface MedicacaoEmUso {
  nome: string
  dose: string
  posologia: string
  iniciadaEm: string
  adesao30Dias: number
}

export interface ExameDetalhe {
  id: string
  pacienteId: string
  pacienteNome: string
  iniciais: string
  idade: number
  condicoesCronicas: string[]
  tipo: string
  categoria: CategoriaExame
  laboratorio: string
  medicoSolicitante: string
  dataColeta: string
  dataResultado: string
  recebidoEm: string
  statusRevisao: 'a-revisar' | 'revisado'
  revisadoEm: string | null
  revisadoPor: string | null
  observacaoMedico: string
  laudoOriginal: LaudoOriginal
  biomarkers: BiomarkerDetalhe[]
  iaAnalise: IAAnalise
  anamneseSintomas: string[]
  medicacaoAtiva: MedicacaoEmUso[]
}

export interface ExamesListaProps {
  exames: ExameListItem[]
  filtroAtivo: FiltroLista

  onAplicarFiltro?: (f: FiltroLista) => void
  onLimparFiltros?: () => void
  /** Click num exame da lista — abre detalhe. */
  onAbrirExame?: (id: string) => void
}

export interface ExameDetalheProps {
  exame: ExameDetalhe

  /** Volta pra lista de exames. */
  onVoltar?: () => void
  /** Marca exame como revisado (com observação opcional). */
  onMarcarRevisado?: (observacao?: string) => void
  /** Compartilha resumo simplificado pelo canal clínico do paciente. */
  onCompartilharComPaciente?: (resumoSimplificado: string) => void
  /** Imprime laudo. */
  onImprimir?: () => void
  /** Abre detalhe expandido de um biomarker (gráfico longitudinal). */
  onAbrirBiomarker?: (nome: string) => void
  /** Abre o paciente (detalhe). */
  onAbrirPaciente?: (id: string) => void
  /** Abre log de auditoria da inferência IA (LGPD). */
  onAbrirAuditIA?: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Exames de imagem (raio-X, USG, RM, TC) — variante quando categoria='imagem'
// ─────────────────────────────────────────────────────────────────────────────

export type ModalidadeImagem = 'raio-x' | 'usg' | 'rm' | 'tc' | 'cintilografia'
export type SignificanciaAchado = 'normal' | 'atencao' | 'critico'

export interface ImagemSerie {
  id: string
  rotulo: string
  /** Descrição da incidência/corte (ex: "PA", "Perfil", "Sagital T1", "LD longitudinal"). */
  descricao: string
  /** Identificador anatômico pra render do mock visual (ver MOCK_VISUAL no componente). */
  mockVisual:
    | 'torax-pa'
    | 'torax-perfil'
    | 'tireoide-long'
    | 'tireoide-trans'
    | 'abdome-fig-hepatico'
    | 'abdome-rim'
    | 'crânio-sagital-t1'
    | 'crânio-coronal-t1'
}

export interface AchadoImagem {
  /** Texto curto do achado (ex: "Cardiomegalia leve", "Nódulo TI-RADS 3 LD 8mm"). */
  texto: string
  significancia: SignificanciaAchado
  /** Medida estruturada opcional (ex: "8 × 6 × 5 mm"). */
  medida?: string
}

export interface ComparacaoImagem {
  /** Data do exame anterior comparado. */
  dataAnterior: string
  /** Resumo da diferença (ex: "Nódulo cresceu de 7→8mm"). */
  resumo: string
  /** Categoria visual da mudança. */
  delta: 'estavel' | 'progressao' | 'regressao' | 'novo'
}

export interface ExameImagemDetalhe {
  id: string
  pacienteId: string
  pacienteNome: string
  iniciais: string
  idade: number
  condicoesCronicas: string[]
  tipo: string
  modalidade: ModalidadeImagem
  laboratorio: string
  medicoSolicitante: string
  radiologistaResponsavel: string
  dataColeta: string
  dataResultado: string
  recebidoEm: string
  statusRevisao: 'a-revisar' | 'revisado'
  revisadoEm: string | null
  revisadoPor: string | null
  observacaoMedico: string
  /** Indicação clínica registrada na requisição. */
  indicacao: string
  /** Texto do laudo escrito pelo radiologista. */
  laudoOriginal: LaudoOriginal
  /** Imagens disponíveis no estudo (cortes, séries, incidências). */
  imagens: ImagemSerie[]
  /** Achados estruturados extraídos do laudo. */
  achados: AchadoImagem[]
  /** Comparação com exame anterior se existir. */
  comparacao: ComparacaoImagem | null
  /** Análise IA (mesma estrutura do exame laboratorial). */
  iaAnalise: IAAnalise
  anamneseSintomas: string[]
  medicacaoAtiva: MedicacaoEmUso[]
  /** Aviso pra abrir DICOM em viewer externo (V1). */
  dicomDisponivel: boolean
}

export interface ExameImagemDetalheProps {
  exames: ExameImagemDetalhe[]
  /** Id do exame selecionado no picker (controlled). Default: primeiro da lista. */
  selectedId?: string

  onSelectExame?: (id: string) => void
  onVoltar?: () => void
  onMarcarRevisado?: (id: string, observacao?: string) => void
  onCompartilharComPaciente?: (id: string, resumoSimplificado: string) => void
  onImprimir?: (id: string) => void
  onAbrirDicomExterno?: (id: string, serieId: string) => void
  onAbrirPaciente?: (pacienteId: string) => void
  onAbrirAuditIA?: (id: string) => void
  onAbrirComparacao?: (id: string) => void
}
