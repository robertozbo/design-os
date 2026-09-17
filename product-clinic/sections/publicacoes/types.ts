export type FiltroPublicacao = 'tudo' | 'revisar' | 'agendados' | 'publicados' | 'problemas'

/**
 * Os oito estados do pipeline. Não é excesso: cada um existe porque alguém pode
 * estar olhando a fila exatamente nele.
 *
 * - `rascunho`  — brief capturado (ditado ou digitado), IA ainda não gerou
 * - `gerando`   — chamada de IA em andamento
 * - `revisar`   — gerado, esperando **pessoa**. Editar a legenda traz de volta pra cá
 * - `agendado`  — aprovado com data/hora, na fila do publicador
 * - `publicando`— o job está nos dois passos da API do Instagram (container → publish)
 * - `publicado` — saiu, tem permalink
 * - `falhou`    — o publish não passou; tem motivo e contagem de tentativas
 * - `bloqueado` — o validador de conselho reprovou. Não é erro técnico, é conteúdo
 */
export type StatusPublicacao =
  | 'rascunho'
  | 'gerando'
  | 'revisar'
  | 'agendado'
  | 'publicando'
  | 'publicado'
  | 'falhou'
  | 'bloqueado'

/**
 * Sem `reels`. Reels é vídeo, e não há geração de vídeo nesta fatia — declarar o
 * formato faria a tela oferecer algo que o pipeline não produz.
 */
export type FormatoPublicacao = 'feed' | 'carrossel' | 'story'

/** De onde nasceu o brief. `pauta` = gerado pela recorrência semanal. */
export type OrigemPublicacao = 'voz' | 'manual' | 'pauta'

/**
 * O conselho do **autor** — é ele que escolhe o conjunto de regras que o validador
 * aplica. A clínica é multi-especialidade, então o mesmo post escrito por nutri e
 * por médico não é julgado pela mesma resolução.
 */
export type Conselho = 'CRN' | 'CRM' | 'CREF' | 'CRP'

export interface Autor {
  nome: string
  conselho: Conselho
  /** "CRN-3 12345" — como aparece no rodapé do post. */
  registro: string
}

/**
 * Achado do validador de publicidade.
 *
 * `bloqueio` impede agendar e não tem "publicar mesmo assim". `aviso` deixa passar
 * depois de reconhecido. A diferença é a que existe entre vedação expressa do código
 * de ética e boa prática.
 */
export interface AlertaCompliance {
  id: string
  severidade: 'bloqueio' | 'aviso'
  /** A norma citada, verbatim: "CFN 599/2018, art. 12" · "CFM 2.336/2023". */
  regra: string
  /** O pedaço do texto (ou da mídia) que disparou. É o que permite corrigir sem adivinhar. */
  trecho: string
  explicacao: string
}

/** Por que o publish não passou. Vem da API, traduzido. */
export interface FalhaPublicacao {
  /**
   * `token_expirado` não se resolve tentando de novo — o token de longa duração do
   * Instagram vive ~60 dias e precisa de reconexão. Os outros dois, sim.
   */
  codigo: 'token_expirado' | 'limite_diario' | 'midia_invalida'
  mensagem: string
  tentativas: number
  /** ISO. `null` quando não há retry programado (caso do token). */
  proximaTentativa: string | null
}

/** Um cartão do carrossel. Feed/Story têm exatamente um. */
export interface Slide {
  ordem: number
  titulo: string
  texto: string
}

/**
 * A imagem do post.
 *
 * `template` é o default e o motivo é técnico: modelo de imagem erra texto e não
 * mantém identidade visual, então o cartão é HTML da marca renderizado em PNG.
 * `upload` é foto própria da clínica.
 */
export interface Midia {
  tipo: 'template' | 'upload'
  /** Nome do template da marca ("Dica clínica", "Estatística", "Convite"). */
  template: string
  /** Utilitário Tailwind do acento do cartão — o preview desenha com ele. */
  acento: string
}

export interface Publicacao {
  id: string
  /** O assunto, em uma linha. É o que identifica a publicação na fila. */
  tema: string
  formato: FormatoPublicacao
  status: StatusPublicacao
  origem: OrigemPublicacao
  autor: Autor
  legenda: string
  hashtags: string[]
  slides: Slide[]
  midia: Midia
  /** A frase ditada, crua. `null` quando o brief foi digitado. */
  briefOriginal: string | null
  /** Quantas vezes a IA reescreveu. Cada refação gasta cota — por isso é visível. */
  versoes: number
  /** ISO. `null` = sem data (rascunho, revisar, bloqueado). */
  agendadoPara: string | null
  publicadoEm: string | null
  /** Link do post no Instagram. O único dado que volta depois de publicar. */
  permalink: string | null
  criadoEm: string
  /** Quem aprovou. `null` = ninguém ainda, e sem isso não agenda. */
  aprovadoPor: string | null
  alertas: AlertaCompliance[]
  falha: FalhaPublicacao | null
}

/** A conta de destino. Business/Creator — conta pessoal não publica por API. */
export interface ContaConectada {
  rede: 'instagram'
  usuario: string
  nome: string
  conectada: boolean
  /** ISO. Token de longa duração ~60 dias; a faixa avisa a menos de 7. */
  tokenExpiraEm: string
  publicadosHoje: number
  /** 50/dia por conta. Limite da API, não do plano. */
  limiteDiario: number
}

/** A cota do add-on pago. Por clínica, por mês. Refazer gasta. */
export interface QuotaAddon {
  addon: string
  postsUsados: number
  postsIncluidos: number
  /** ISO — primeiro dia do próximo ciclo. */
  renovaEm: string
}

/** A recorrência: 1 rascunho por semana a partir de uma lista de temas. */
export interface PautaSemanal {
  ativa: boolean
  /** 0 = domingo. */
  diaSemana: number
  /** "HH:mm" */
  hora: string
  temas: string[]
  proximaGeracao: string
  autorPadrao: Autor
}

export interface PublicacoesData {
  conta: ContaConectada
  quota: QuotaAddon
  pauta: PautaSemanal
  publicacoes: Publicacao[]
}

/** O que o modal de ditado/criação devolve depois de o usuário corrigir os campos. */
export interface BriefValues {
  tema: string
  formato: FormatoPublicacao
  tom: string
  agendadoPara: string | null
  origem: OrigemPublicacao
  /** Transcrição crua, quando veio por voz. */
  briefOriginal: string | null
}

export interface PublicacoesProps extends PublicacoesData {
  /** Cria o post a partir do brief e dispara a geração (status `gerando`). */
  onGerar?: (brief: BriefValues) => void
  /** Reescreve com instrução livre ("mais curto", "sem emoji"). Gasta cota e soma versão. */
  onRefazer?: (id: string, instrucao: string) => void
  /** Salva a legenda editada à mão. Devolve o post para `revisar`. */
  onEditarLegenda?: (id: string, legenda: string) => void
  /** Aprova e põe na fila. Recusa se houver alerta de bloqueio pendente. */
  onAgendar?: (id: string, quando: string) => void
  onPublicarAgora?: (id: string) => void
  /** Só rascunho/agendado/bloqueado. Publicado não se apaga por aqui. */
  onExcluir?: (id: string) => void
  /** Retry do publish. Não oferecido para `token_expirado`. */
  onTentarNovamente?: (id: string) => void
  /** Reabre o OAuth do Instagram. Único caminho para token expirado. */
  onReconectarConta?: () => void
  onAlternarPauta?: (ativa: boolean) => void
}
