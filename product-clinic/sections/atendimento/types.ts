export type Profissao = 'fisioterapia' | 'nutricao' | 'psicologia'

export type CorProfissao = 'sky' | 'emerald' | 'violet'

export type TomAlerta = 'info' | 'atencao' | 'risco'

export interface PacienteAtendimento {
  id: string
  nome: string
  iniciais: string
  idade: number
  convenio: string
  /** Uma linha do que não pode passar batido: alergia, restrição, comorbidade. */
  observacaoCritica: string | null
}

export interface ProfissionalAtendimento {
  nome: string
  iniciais: string
  /** CREFITO, CRN, CRP, CREF… */
  conselho: string
  profissao: Profissao
  atuacao: string
  cor: CorProfissao
}

/** Uma linha do histórico daquele paciente com aquele profissional. */
export interface ContextoItem {
  id: string
  titulo: string
  quando: string
  resumo: string
}

export interface AlertaContexto {
  id: string
  texto: string
  tom: TomAlerta
}

/**
 * O que toda tela de atendimento tem, seja qual for o conselho: quem é o paciente, quem atende,
 * onde a sessão está no tratamento, o histórico ao lado e o motivo de hoje. O que muda por
 * profissão é só o miolo do registro.
 */
export interface BaseAtendimento {
  id: string
  paciente: PacienteAtendimento
  profissional: ProfissionalAtendimento
  dataLabel: string
  horaInicio: string
  duracaoPrevistaMin: number
  motivo: string
  /** Número da sessão dentro do pacote/tratamento; null quando não há pacote. */
  sessaoNumero: number | null
  sessoesPacote: number | null
  contexto: ContextoItem[]
  alertas: AlertaContexto[]
}

/* ---------- Fisioterapia ---------- */

export type GrupoConduta = 'eletroterapia' | 'cinesioterapia' | 'terapia-manual' | 'crioterapia'

export interface CondutaFisio {
  id: string
  nome: string
  grupo: GrupoConduta
  aplicada: boolean
  /** Dose aplicada: tempo, séries, intensidade. */
  detalhe: string | null
}

export interface MedidaADM {
  id: string
  articulacao: string
  movimento: string
  direito: number
  esquerdo: number
  /** Amplitude normal de referência, em graus. */
  referencia: number
}

export interface AtendimentoFisio extends BaseAtendimento {
  /** EVA 0–10 relatada na chegada; a de saída é preenchida ao fim da sessão. */
  evaChegada: number
  evaSaida: number | null
  historicoEva: { sessao: number; eva: number }[]
  condutas: CondutaFisio[]
  adm: MedidaADM[]
  testesFuncionais: { id: string; nome: string; resultado: string }[]
  evolucaoTexto: string
  planoProxima: string
}

/* ---------- Nutrição ---------- */

export interface Antropometria {
  peso: number
  altura: number
  imc: number
  cintura: number
  quadril: number
  gorduraPct: number
  massaMagraKg: number
}

export interface MetaNutricional {
  kcal: number
  proteinaG: number
  carboidratoG: number
  gorduraG: number
}

export interface RefeicaoPlano {
  id: string
  nome: string
  horario: string
  itens: string[]
}

export interface AtendimentoNutri extends BaseAtendimento {
  antropometria: Antropometria
  antropometriaAnterior: Antropometria
  historicoPeso: { label: string; peso: number }[]
  metas: MetaNutricional
  recordatorio: { id: string; refeicao: string; descricao: string }[]
  plano: RefeicaoPlano[]
  orientacoes: string[]
  evolucaoTexto: string
}

/* ---------- Psicologia ---------- */

export interface EscalaPsi {
  sigla: string
  nome: string
  valor: number
  maximo: number
  faixa: string
  tendencia: 'melhora' | 'estavel' | 'piora'
}

export interface TecnicaPsi {
  id: string
  nome: string
  categoria: string
  aplicada: boolean
}

export interface AtendimentoPsi extends BaseAtendimento {
  abordagem: string
  escalas: EscalaPsi[]
  /** 0 = sem risco · 3 = risco grave. Acima de 0 a tela mostra o protocolo. */
  risco: 0 | 1 | 2 | 3
  focoSessao: string
  registro: { subjetivo: string; objetivo: string; avaliacao: string; plano: string }
  /** Impressões do profissional — não vão para o prontuário compartilhado. */
  notaPrivada: string
  tarefaCasa: string
  tecnicas: TecnicaPsi[]
}

export interface AtendimentoData {
  clinica: string
  fisioterapia: AtendimentoFisio
  nutricao: AtendimentoNutri
  psicologia: AtendimentoPsi
}
