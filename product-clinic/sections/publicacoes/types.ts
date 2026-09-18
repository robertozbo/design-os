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

/**
 * Os layouts de cartão da marca.
 *
 * São layouts de verdade, não a mesma caixa em seis cores: o que faz um post parecer
 * template é a composição sempre igual, não a paleta.
 */
export type TemplateId = 'editorial' | 'lista' | 'estatistica' | 'convite' | 'citacao' | 'foto'

/** Um cartão do carrossel. Feed/Story têm exatamente um. */
export interface Slide {
  ordem: number
  titulo: string
  texto: string
  /**
   * O número que o template `estatistica` imprime grande ("77%", "1 em 4").
   *
   * Explícito, e não extraído do título por regex: título sem número renderizaria uma
   * estatística vazia sem ninguém perceber até o post estar no ar.
   */
  destaque?: string
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
  /** O layout do cartão. Com `tipo: 'upload'`, só `foto` faz sentido. */
  template: TemplateId
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

/**
 * As duas abas da section.
 *
 * Módulo vendido à parte carrega as próprias configurações: a conta do Instagram, a
 * pauta e os padrões da marca não cabem nas Configurações da clínica, senão a clínica
 * que não compra o módulo vê configuração de um produto que não tem.
 */
export type AbaPublicacoes = 'fila' | 'configuracoes'

/** O que a IA assume quando o brief não diz. Editável na aba Configurações. */
export interface PadroesMarca {
  tom: string
  template: TemplateId
  /**
   * Cor de acento dos cartões.
   *
   * Ou uma chave da paleta da marca (`teal`), ou um hex vindo do logo da clínica
   * (`#0f766e`) — e é por isso que é `string` e não uma união fechada.
   */
  acento: string
  /**
   * As cores extraídas do logo, na ordem de dominância.
   *
   * Guardadas porque a extração acontece uma vez, no upload: sem isso, trocar de
   * acento depois exigiria subir o logo de novo.
   */
  paletaImportada: string[]
  autorPadrao: Autor
  /** Fecho fixo colado no fim de toda legenda. Vazio = sem CTA. */
  ctaFixo: string
  /**
   * Registro profissional no rodapé do cartão. Ligado por padrão porque os conselhos
   * exigem identificação do responsável técnico na peça publicitária.
   */
  mostrarRegistro: boolean
}

/**
 * O que o conteúdo da clínica está tentando conseguir.
 *
 * Um só, não vários: "captar e educar e fidelizar" é o mesmo que nenhum — o objetivo
 * existe para decidir o fecho de cada post, e três objetivos não decidem nada.
 */
export type ObjetivoConteudo = 'captar' | 'educar' | 'fidelizar' | 'divulgar-servicos'

/**
 * O contexto de negócio que entra em toda geração.
 *
 * Não repete o cadastro: razão social, CNPJ e endereço moram em Configurações da
 * clínica, e as especialidades saem da Equipe. Aqui fica só o que é decisão de
 * comunicação — e que ninguém consegue inferir do CNPJ.
 */
export interface ContextoNegocio {
  objetivo: ObjetivoConteudo
  /** Quem é o paciente típico, em uma linha. */
  publico: string
  /** O que a clínica é e no que se diferencia. Vira contexto do prompt. */
  descricao: string
  /**
   * Termos que a clínica não quer ver num post.
   *
   * Vira **aviso** no validador de publicidade — não bloqueio: é preferência da casa,
   * não vedação de conselho, e misturar as duas coisas ensina a ignorar as duas.
   */
  evitar: string[]
}

export type QuemAprova = 'gestor' | 'gestor-e-autor' | 'qualquer'

export interface RegrasAprovacao {
  quemAprova: QuemAprova
  /**
   * Aviso (não bloqueio) precisa ser reconhecido antes de agendar.
   *
   * Desligado, o aviso continua aparecendo e não impede nada — é o default, porque
   * exigir clique em todo superlativo treina a pessoa a clicar sem ler.
   */
  exigirCienciaDeAviso: boolean
}

export interface PublicacoesData {
  /** Quem está logado e aprova neste workspace. */
  aprovador: string
  conta: ContaConectada
  quota: QuotaAddon
  pauta: PautaSemanal
  contexto: ContextoNegocio
  /** Só leitura aqui: vem do cadastro da clínica e da Equipe. */
  clinica: { nome: string; especialidades: string[] }
  padroes: PadroesMarca
  regras: RegrasAprovacao
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
  /** Abre o OAuth da Meta. Não há credencial para digitar: o app é da plataforma. */
  onConectarConta?: () => void
  /** Revoga o token. Para de publicar — os agendados ficam na fila esperando. */
  onDesconectarConta?: () => void
  onSalvarPadroes?: (p: PadroesMarca) => void
  onSalvarRegras?: (r: RegrasAprovacao) => void
  onSalvarContexto?: (c: ContextoNegocio) => void
}
