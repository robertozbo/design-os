import type { Conta } from '../_contas/types'

export type { Conta }

/** `realizado` = já bateu no extrato; `previsto` = ainda vai vencer. */
export type OrigemDia = 'realizado' | 'previsto'

/** Com previsto (padrão) responde "quanto vou ter"; só realizado responde "quanto eu tenho". */
export type ModoFluxo = 'completo' | 'realizado'

/**
 * Um dia da linha do tempo. **Calculado** a partir dos lançamentos — nunca escrito no `data.json`,
 * senão o gráfico poderia discordar da lista logo abaixo dele.
 */
export interface DiaFluxo {
  /** ISO (`2026-07-30`). */
  data: string
  /** Rótulo curto no eixo e na tabela (`30/07`). */
  rotulo: string
  entradas: number
  saidas: number
  /** `entradas - saidas` do dia. */
  resultado: number
  /** Saldo em caixa ao fim do dia. */
  saldoAcumulado: number
  origem: OrigemDia
  /** Os lançamentos que caem neste dia, na ordem em que a tabela expande. */
  lancamentos: Conta[]
}

/** O que a faixa acima do gráfico anuncia. */
export interface AlertaCaixa {
  /** `true` quando existe dia com saldo negativo no período. */
  estoura: boolean
  /** Dia do primeiro saldo negativo — ou, sem estouro, o dia de menor saldo. */
  data: string
  rotulo: string
  /** Saldo naquele dia (negativo quando `estoura`). */
  saldo: number
  /** As maiores saídas do dia, que explicam o buraco. */
  causas: Conta[]
}

export interface ResumoCaixa {
  /** Saldo de hoje considerando só o que foi pago. */
  saldoHoje: number
  entradasRealizadas: number
  entradasPrevistas: number
  saidasRealizadas: number
  saidasPrevistas: number
  /** Saldo no último dia do período, com previsto incluído. */
  saldoProjetado: number
}

export interface FluxoCaixaData {
  clinica: string
  /** Fronteira entre realizado e previsto. */
  hoje: string
  periodo: { de: string; ate: string }
  /** Caixa no primeiro dia do período. */
  saldoInicial: number
  lancamentos: Conta[]
}

export interface FluxoCaixaProps {
  data: FluxoCaixaData
  /** Alterna entre "realizado + previsto" e "só realizado". */
  onTrocarModo?: (modo: ModoFluxo) => void
  /** Navega de mês; `-1` volta, `+1` avança. */
  onNavegarMes?: (passo: -1 | 1) => void
  /** Volta ao mês corrente. */
  onMesAtual?: () => void
  /** Abre/fecha os lançamentos de um dia na tabela. */
  onAbrirDia?: (data: string) => void
  /** Leva o lançamento para Contas a receber/pagar, onde ele é editável. */
  onVerLancamento?: (id: string) => void
}
