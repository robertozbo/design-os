export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type CategoriaExame = 'laboratorial' | 'imagem'
export type AlertNivel = 'baixo' | 'normal' | 'alto' | 'critico'
export type Tendencia = 'subindo' | 'caindo' | 'estavel'
export type StatusRevisao = 'a-revisar' | 'revisado'
export type IABlocoTipo =
  | 'resumo-laudo'
  | 'comparacao-historica'
  | 'cruzamento-queixa'
  | 'cruzamento-medicacao'

export interface MedicoRef {
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
}

export interface PacienteRef {
  nome: string
  iniciais: string
  idade: number
}

export interface DestaqueBiomarker {
  nome: string
  valor: string
  alertNivel: AlertNivel
  tendencia: Tendencia
}

export interface ExameListItem {
  id: string
  paciente: PacienteRef
  tipo: string
  categoria: CategoriaExame
  laboratorio: string
  solicitante: MedicoRef
  dataColeta: string
  recebidoEm: string
  statusRevisao: StatusRevisao
  revisadoPor: string | null
  /** Nº de médicos autorizados do paciente que veem este exame. */
  compartilhadoCom: number
  destaque: DestaqueBiomarker | null
}

export interface Biomarker {
  nome: string
  nomeCompleto: string
  valor: number
  unidade: string
  faixaReferencia: string
  alertNivel: AlertNivel
  tendencia: Tendencia
  deltaPercent: number
  historico: number[]
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

export interface MedicacaoAtiva {
  nome: string
  posologia: string
  prescritoPor: string
  cor: CorEspecialidade
}

export interface ExameDetalhe {
  id: string
  paciente: {
    nome: string
    iniciais: string
    idade: number
    genero: string
    convenio: string
    condicoesCronicas: string[]
  }
  tipo: string
  categoria: CategoriaExame
  laboratorio: string
  solicitante: MedicoRef
  dataColeta: string
  dataResultado: string
  recebidoEm: string
  statusRevisao: StatusRevisao
  revisadoPor: string | null
  revisadoEm: string | null
  observacaoMedico: string
  valoresConfirmados: boolean
  laudoTexto: string
  laudoPaginas: number
  biomarkers: Biomarker[]
  iaAnalise: IAAnalise
  medicosAutorizados: MedicoRef[]
  anamneseSintomas: string[]
  medicacaoAtiva: MedicacaoAtiva[]
  /** DICOM embutido é V2 — mostra aviso quando categoria imagem. */
  dicomDisponivel: boolean
}

export interface ExamesData {
  clinica: string
  exames: ExameListItem[]
  detalhes: Record<string, ExameDetalhe>
}
