/**
 * Status de um agendamento — **fonte única** da clínica.
 *
 * Antes disto, `agenda/types.ts` (5 membros) e `inicio/types.ts` (6 membros)
 * declaravam dois `StatusConsulta` divergentes que não se importavam, e o
 * handoff sufixava os nomes com a section (`StatusConsulta__agenda`) só para o
 * `overview.ts` compilar — sintoma, não solução. Nenhuma section deve
 * redeclarar este tipo: **reexporte daqui**.
 *
 * O `_` marca módulo interno — sem rota e sem spec, como `_contas/`.
 */
export type StatusConsulta =
  /** Agendado, ainda sem confirmação do paciente. */
  | 'pendente'
  /** Paciente confirmou que vem. Ainda não chegou. */
  | 'confirmado'
  /**
   * **Paciente chegou na clínica** e a recepção registrou. Substitui o antigo
   * `aguardando` do Início, que era ambíguo (aguardando confirmação? aguardando
   * atendimento?) e cujo fixture usava a semântica errada — marcava uma consulta
   * futura, das 14:00.
   *
   * Este é o estado que a issue #808 materializa: quem registra é a recepção,
   * com código de 6 dígitos do app do paciente (TTL 5 min) ou manualmente.
   * Existir aqui é o que **impede** `faltou` — ver `TRANSICOES`.
   */
  | 'chegou'
  /** O profissional chamou e a consulta está acontecendo. */
  | 'em-atendimento'
  /**
   * Consulta executada. É o estado que alimenta repasse, comissão e taxa de
   * no-show — então quem o produz importa: o ato do profissional ao encerrar e
   * assinar a evolução, não um botão da recepção.
   */
  | 'realizado'
  /** Desmarcada antes da hora, por qualquer lado. Terminal. */
  | 'cancelado'
  /** Não compareceu. Só alcançável a partir de quem nunca chegou. */
  | 'faltou'

/** Ordem de exibição — legenda da agenda e qualquer agrupamento por status. */
export const ORDEM_STATUS: StatusConsulta[] = [
  'pendente',
  'confirmado',
  'chegou',
  'em-atendimento',
  'realizado',
  'faltou',
  'cancelado',
]

/**
 * Transições permitidas (de → para). A UI deve **derivar** daqui quais ações
 * oferece, em vez de renderizar os quatro botões incondicionalmente — hoje dá
 * para marcar "Faltou" numa consulta já realizada.
 *
 * Duas regras carregam a decisão de produto:
 *
 * 1. **`chegou` não vai para `faltou`.** Presença registrada é prova; quem
 *    chegou e não foi atendido é problema de operação, não falta do paciente.
 *    É a invariante da #808 (`no_show` bloqueado quando existe `checked_in_at`)
 *    manifestada na tela, e não só como validação de backend que aparece
 *    depois do clique.
 * 2. **`realizado` e `cancelado` são terminais.** Reabrir uma cancelada
 *    devolvia dois blocos ao mesmo horário sem reclamação, porque
 *    `acharConflito` ignora justamente o `cancelado`. Remarcar cria
 *    agendamento novo.
 *
 * `faltou → chegou` existe de propósito: a recepção marca falta e o paciente
 * aparece atrasado. Correção legítima, e barata de desfazer.
 */
export const TRANSICOES: Record<StatusConsulta, StatusConsulta[]> = {
  pendente: ['confirmado', 'chegou', 'cancelado', 'faltou'],
  confirmado: ['chegou', 'em-atendimento', 'cancelado', 'faltou'],
  chegou: ['em-atendimento', 'realizado', 'cancelado'],
  'em-atendimento': ['realizado', 'cancelado'],
  realizado: [],
  cancelado: [],
  faltou: ['chegou'],
}

export function podeTransicionar(de: StatusConsulta, para: StatusConsulta): boolean {
  return TRANSICOES[de].includes(para)
}

/**
 * Par de cada status no backend (`appointment_status`,
 * `backend/src/schema/types/enums.ts`). Quem portar a agenda para o produto
 * real traduz por esta tabela — os nomes do protótipo são PT de domínio, os do
 * banco são EN.
 *
 * ⚠️ `em-atendimento` **não tem par**: o enum de produção vai de `confirmed`
 * direto a `completed`. O protótipo modela um estado a mais que o banco. Ao
 * implementar a #808, ou o enum ganha os dois valores (`checked_in` e
 * `in_progress`), ou `em-atendimento` vira estado só de tela — decidir antes de
 * portar, não durante.
 */
export const PAR_BACKEND: Record<StatusConsulta, string | null> = {
  pendente: 'scheduled',
  confirmado: 'confirmed',
  chegou: 'checked_in',
  'em-atendimento': null,
  realizado: 'completed',
  cancelado: 'cancelled',
  faltou: 'no_show',
}
