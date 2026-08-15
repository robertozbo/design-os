import type {
  AlertaCaixa,
  Conta,
  DiaFluxo,
  FluxoCaixaData,
  ModoFluxo,
  ResumoCaixa,
} from '@/../product-clinic/sections/fluxo-caixa/types'

export function moeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** `R$ 1.234,56` com sinal explícito — num fluxo de caixa o sinal é metade da informação. */
export function moedaComSinal(valor: number): string {
  const sinal = valor < 0 ? '−' : valor > 0 ? '+' : ''
  return `${sinal}R$ ${moeda(Math.abs(valor))}`
}

/** `2026-07-30` → `30/07`. */
export function rotuloDia(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

/** `2026-07-30` → `30 de julho`. */
export function dataPorExtenso(iso: string): string {
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ]
  const [, m, d] = iso.split('-')
  return `${Number(d)} de ${meses[Number(m) - 1]}`
}

/**
 * O dia em que o dinheiro REALMENTE se move — a diferença entre fluxo de caixa e as telas de contas.
 *
 * Pago entra no `pagoEm`. Em aberto, no `vencimento`. E o que **venceu e não foi pago** é reprojetado
 * para hoje: o dinheiro não entrou na data original e segue pendurado, então fingir que ele caiu lá
 * atrás faria o saldo de hoje mentir.
 */
export function dataDeCaixa(l: Conta, hoje: string): string {
  if (l.status === 'pago' && l.pagoEm) return l.pagoEm
  return l.vencimento < hoje ? hoje : l.vencimento
}

/** Venceu, não foi pago, e por isso está sendo reprojetado. */
export function estaAtrasado(l: Conta, hoje: string): boolean {
  return l.status !== 'pago' && l.vencimento < hoje
}

/**
 * Agrega os lançamentos em dias e faz o saldo correr por cima.
 *
 * Isto é calculado, nunca lido do JSON: se a linha do tempo fosse dado, o gráfico poderia discordar
 * da tabela logo abaixo dele sem ninguém perceber.
 */
export function montarDias(dados: FluxoCaixaData, modo: ModoFluxo): DiaFluxo[] {
  const considerados =
    modo === 'realizado' ? dados.lancamentos.filter((l) => l.status === 'pago') : dados.lancamentos

  const porDia = new Map<string, Conta[]>()
  for (const l of considerados) {
    const dia = dataDeCaixa(l, dados.hoje)
    const lista = porDia.get(dia)
    if (lista) lista.push(l)
    else porDia.set(dia, [l])
  }

  let saldo = dados.saldoInicial
  return [...porDia.keys()]
    .sort()
    .map((data) => {
      const lancamentos = porDia.get(data) ?? []
      const entradas = lancamentos.filter((l) => l.tipo === 'receber').reduce((s, l) => s + l.valor, 0)
      const saidas = lancamentos.filter((l) => l.tipo === 'pagar').reduce((s, l) => s + l.valor, 0)
      saldo += entradas - saidas
      return {
        data,
        rotulo: rotuloDia(data),
        entradas,
        saidas,
        resultado: entradas - saidas,
        saldoAcumulado: saldo,
        origem: data <= dados.hoje ? ('realizado' as const) : ('previsto' as const),
        lancamentos: [...lancamentos].sort((a, b) => b.valor - a.valor),
      }
    })
}

export function montarResumo(dados: FluxoCaixaData, dias: DiaFluxo[]): ResumoCaixa {
  const pagos = dados.lancamentos.filter((l) => l.status === 'pago')
  const abertos = dados.lancamentos.filter((l) => l.status !== 'pago')
  const soma = (ls: Conta[], tipo: Conta['tipo']) =>
    ls.filter((l) => l.tipo === tipo).reduce((s, l) => s + l.valor, 0)

  const entradasRealizadas = soma(pagos, 'receber')
  const saidasRealizadas = soma(pagos, 'pagar')

  return {
    saldoHoje: dados.saldoInicial + entradasRealizadas - saidasRealizadas,
    entradasRealizadas,
    entradasPrevistas: soma(abertos, 'receber'),
    saidasRealizadas,
    saidasPrevistas: soma(abertos, 'pagar'),
    saldoProjetado: dias.length ? dias[dias.length - 1].saldoAcumulado : dados.saldoInicial,
  }
}

/**
 * O dia que a tela existe para anunciar: o primeiro com saldo negativo. Não havendo estouro, devolve
 * o dia de menor saldo — o mais apertado —, que é a mesma pergunta com resposta melhor.
 */
export function montarAlerta(dias: DiaFluxo[]): AlertaCaixa | null {
  if (dias.length === 0) return null

  const negativo = dias.find((d) => d.saldoAcumulado < 0)
  const alvo = negativo ?? dias.reduce((min, d) => (d.saldoAcumulado < min.saldoAcumulado ? d : min))

  return {
    estoura: !!negativo,
    data: alvo.data,
    rotulo: alvo.rotulo,
    saldo: alvo.saldoAcumulado,
    causas: alvo.lancamentos.filter((l) => l.tipo === 'pagar').slice(0, 3),
  }
}

/**
 * Paleta do gráfico. Rodada em `scripts/validate_palette.js` nos dois modos — os seis checks passam.
 * `slate` reprovou no piso de croma (lia como cinza). O saldo usa o **accent** do produto
 * (`violet`), não uma cor inventada — indigo estava fora do token set da clínica.
 */
export const CORES = {
  claro: { entrada: '#0d9488', saida: '#e11d48', saldo: '#7c3aed' },
  escuro: { entrada: '#0d9488', saida: '#f43f5e', saldo: '#7c3aed' },
} as const
