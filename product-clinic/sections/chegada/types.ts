import type { StatusConsulta } from '../_shared/status'

export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type Modalidade = 'presencial' | 'tele'

/**
 * Como a chegada foi registrada. Espelha `check_in_method` da issue #808 — a
 * distinção não é cosmética: `manual` é o caminho de quem não tem o app (todo o
 * legado importado), e some do funil de adoção se não for gravada.
 */
export type MetodoChegada = 'codigo' | 'manual'

/** O carimbo que a chegada deixa. Ausente = o paciente ainda não chegou. */
export interface RegistroChegada {
  /** "HH:MM" do momento em que a recepção registrou. */
  hora: string
  /** Quem registrou — a chegada tem autor, como qualquer ato de balcão. */
  por: string
  metodo: MetodoChegada
}

/** Uma consulta do dia, na leitura da recepção: quem vem, quando, com quem. */
export interface LinhaChegada {
  id: string
  /** "HH:MM" 24h. */
  hora: string
  duracaoMin: number
  pacienteNome: string
  pacienteIniciais: string
  profissionalNome: string
  especialidade: string
  cor: CorEspecialidade
  /** Sala quando presencial; `null` em teleconsulta. */
  sala: string | null
  modalidade: Modalidade
  convenio: string
  status: StatusConsulta
  /** Recado da recepção para o balcão (primeira consulta, exame em mãos…). */
  observacao?: string
  chegada?: RegistroChegada
  /**
   * Código de 6 dígitos que o app do paciente está exibindo agora.
   *
   * Existe só no protótipo, para que a tela possa ser experimentada sem o app:
   * na implementação o código vive no Redis com TTL de 5 min e **nunca** viaja
   * junto da lista do dia — mandá-lo para o cliente entregaria a todo mundo o
   * segredo de todo mundo.
   */
  codigo?: string
}

export interface ChegadaData {
  /** Dia exibido, "YYYY-MM-DD". */
  data: string
  /** "HH:MM" — o "agora" do protótipo, que move a linha do tempo e o atraso. */
  agora: string
  /** Quem está no balcão: vira o `por` de cada chegada registrada. */
  recepcionista: string
  linhas: LinhaChegada[]
}
