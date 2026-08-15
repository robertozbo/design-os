import { useEffect, useRef, useState } from 'react'
import type { DiaFluxo } from '@/../product-clinic/sections/fluxo-caixa/types'
import { moeda, moedaComSinal } from './helpers'

interface Props {
  dias: DiaFluxo[]
  /** Fronteira entre realizado e previsto, para a marca vertical. */
  hoje: string
}

const LARGURA_MIN = 30
const LARGURA_MAX = 64
const MARGEM = { topo: 14, esq: 62, dir: 12, base: 26 }
const H_BARRAS = 168
const H_SALDO = 86
const VAO = 26
const BARRA = 11

/** Passo de grade "redondo" mais próximo, para o eixo não sair com 3.847,50. */
function passoDaGrade(amplitude: number): number {
  const bruto = amplitude / 6
  const magnitude = 10 ** Math.floor(Math.log10(bruto || 1))
  return [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((p) => p >= bruto) ?? magnitude * 10
}

/**
 * Barra com canto arredondado **só na ponta do dado**. O manual pede 4px no topo, e arredondar os
 * quatro cantos (o que `rx` faz) descola a barra da linha de zero — a base tem que ser reta, senão
 * o olho perde onde o valor começa.
 */
function barra(x: number, largura: number, zero: number, ponta: number, r = 4): string {
  const h = Math.abs(ponta - zero)
  const raio = Math.min(r, h, largura / 2)
  return ponta < zero
    ? `M ${x} ${zero} L ${x} ${ponta + raio} Q ${x} ${ponta} ${x + raio} ${ponta} L ${x + largura - raio} ${ponta} Q ${x + largura} ${ponta} ${x + largura} ${ponta + raio} L ${x + largura} ${zero} Z`
    : `M ${x} ${zero} L ${x} ${ponta - raio} Q ${x} ${ponta} ${x + raio} ${ponta} L ${x + largura - raio} ${ponta} Q ${x + largura} ${ponta} ${x + largura} ${ponta - raio} L ${x + largura} ${zero} Z`
}

function escala(valores: number[], altura: number, topo: number) {
  const passo = passoDaGrade(Math.max(...valores) - Math.min(...valores))
  const max = Math.ceil(Math.max(...valores, 0) / passo) * passo
  const min = Math.floor(Math.min(...valores, 0) / passo) * passo
  const y = (v: number) => topo + ((max - v) / (max - min || 1)) * altura
  const ticks: number[] = []
  for (let v = min; v <= max + 0.001; v += passo) ticks.push(Math.round(v))
  return { y, ticks, min, max }
}

export function GraficoFluxo({ dias, hoje }: Props) {
  const [ativo, setAtivo] = useState<number | null>(null)
  const caixaRef = useRef<HTMLDivElement>(null)
  const [larguraCaixa, setLarguraCaixa] = useState(0)

  // Mede o card e distribui os dias nele. Sem isso o SVG tem largura fixa e sobra um vão morto à
  // direita que parece gráfico quebrado. Assinar o ResizeObserver é ler um sistema externo — não é o
  // caso de setState-em-effect que a regra proíbe.
  useEffect(() => {
    const el = caixaRef.current
    if (!el) return
    const obs = new ResizeObserver(([entrada]) => setLarguraCaixa(entrada.contentRect.width))
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (dias.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400 dark:border-slate-700">
        Nenhum lançamento no período.
      </div>
    )
  }

  // DOIS painéis empilhados, com o MESMO eixo X e cada um com sua escala. O movimento do dia vai de
  // R$ 0 a R$ 22 mil; espremer o saldo acumulado no mesmo eixo achatava as barras típicas em 6px e o
  // gráfico deixava de mostrar justamente o que o título promete. Duas escalas no mesmo plot seria
  // pior ainda: inventaria uma correlação que o dado não tem.
  // Ocupa a linha toda quando cabe; abaixo do mínimo legível, volta a rolar na horizontal.
  const disponivel = Math.max(0, larguraCaixa - MARGEM.esq - MARGEM.dir)
  const LARGURA_DIA = Math.min(
    LARGURA_MAX,
    Math.max(LARGURA_MIN, disponivel > 0 ? disponivel / dias.length : LARGURA_MIN),
  )

  const topoBarras = MARGEM.topo
  const topoSaldo = MARGEM.topo + H_BARRAS + VAO

  const eBarras = escala(
    [...dias.map((d) => d.entradas), ...dias.map((d) => -d.saidas)],
    H_BARRAS,
    topoBarras,
  )
  const eSaldo = escala(dias.map((d) => d.saldoAcumulado), H_SALDO, topoSaldo)

  const larguraPlot = dias.length * LARGURA_DIA
  const largura = MARGEM.esq + larguraPlot + MARGEM.dir
  const altura = topoSaldo + H_SALDO + MARGEM.base

  const x = (i: number) => MARGEM.esq + i * LARGURA_DIA + LARGURA_DIA / 2
  const zeroBarras = eBarras.y(0)

  const linhaSaldo = dias.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${eSaldo.y(d.saldoAcumulado)}`).join(' ')
  const primeiroPrevisto = dias.findIndex((d) => d.origem === 'previsto')
  const estouro = dias.find((d) => d.saldoAcumulado < 0)
  const iEstouro = estouro ? dias.indexOf(estouro) : -1
  const dia = ativo !== null ? dias[ativo] : null

  const rotuloEixo = (v: number) =>
    v === 0 ? '0' : Math.abs(v) >= 1000 ? `${(v / 1000).toLocaleString('pt-BR')}k` : String(v)

  return (
    <div className="relative" ref={caixaRef}>
      <div className="overflow-x-auto">
        <svg
          width={largura}
          height={altura}
          role="img"
          aria-label="Entradas e saídas por dia, e saldo acumulado"
          className="block"
        >
          <defs>
            {/* Hachura marca o previsto sem depender de cor — vale para daltônico e impressão. */}
            {/* Tile de 4px com traço de 1.5px: numa barra de 12px cabem ~3 listras. Com o tile de
                6px anterior cabia UMA, e a barra baixa — que é a maioria — virava um borrão
                indistinguível de barra realizada. */}
            <pattern id="fc-in" width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" className="fill-teal-600/10" />
              <line x1="0" y1="0" x2="0" y2="4" strokeWidth="1.5" className="stroke-teal-600/85" />
            </pattern>
            <pattern id="fc-out" width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" className="fill-rose-600/10 dark:fill-rose-500/10" />
              <line x1="0" y1="0" x2="0" y2="4" strokeWidth="1.5" className="stroke-rose-600/85 dark:stroke-rose-500/85" />
            </pattern>
          </defs>

          {/* ---- painel 1: movimento do dia ---- */}
          <text x={MARGEM.esq} y={topoBarras - 3} className="fill-slate-400 text-[9px] uppercase tracking-wide dark:fill-slate-500">
            movimento do dia · R$
          </text>
          {eBarras.ticks.map((t) => (
            <g key={`b${t}`}>
              <line
                x1={MARGEM.esq}
                x2={MARGEM.esq + larguraPlot}
                y1={eBarras.y(t)}
                y2={eBarras.y(t)}
                className={t === 0 ? 'stroke-slate-400 dark:stroke-slate-500' : 'stroke-slate-200 dark:stroke-slate-800'}
                strokeWidth={t === 0 ? 1.5 : 1}
              />
              <text
                x={MARGEM.esq - 8}
                y={eBarras.y(t) + 3.5}
                textAnchor="end"
                className="fill-slate-400 text-[10px] tabular-nums dark:fill-slate-500"
              >
                {rotuloEixo(t)}
              </text>
            </g>
          ))}

          {dias.map((d, i) => {
            const prev = d.origem === 'previsto'
            const hIn = Math.max(0, zeroBarras - eBarras.y(d.entradas))
            const hOut = Math.max(0, eBarras.y(-d.saidas) - zeroBarras)
            return (
              <g key={d.data} onMouseEnter={() => setAtivo(i)} onMouseLeave={() => setAtivo(null)}>
                <rect
                  x={MARGEM.esq + i * LARGURA_DIA}
                  y={topoBarras}
                  width={LARGURA_DIA}
                  height={H_BARRAS + VAO + H_SALDO}
                  className={ativo === i ? 'fill-slate-500/[0.07]' : 'fill-transparent'}
                />
                {d.entradas > 0 && (
                  <path
                    d={barra(x(i) - BARRA - 1, BARRA, zeroBarras, zeroBarras - hIn)}
                    fill={prev ? 'url(#fc-in)' : undefined}
                    strokeWidth={prev ? 1.25 : 0}
                    className={prev ? 'stroke-teal-600' : 'fill-teal-600'}
                  />
                )}
                {d.saidas > 0 && (
                  <path
                    d={barra(x(i) + 1, BARRA, zeroBarras, zeroBarras + hOut)}
                    fill={prev ? 'url(#fc-out)' : undefined}
                    strokeWidth={prev ? 1.25 : 0}
                    className={prev ? 'stroke-rose-600 dark:stroke-rose-500' : 'fill-rose-600 dark:fill-rose-500'}
                  />
                )}
              </g>
            )
          })}

          {/* ---- painel 2: saldo acumulado ---- */}
          <text x={MARGEM.esq} y={topoSaldo - 5} className="fill-slate-400 text-[9px] uppercase tracking-wide dark:fill-slate-500">
            saldo acumulado · R$
          </text>
          {eSaldo.min < 0 && (
            <rect
              x={MARGEM.esq}
              y={eSaldo.y(0)}
              width={larguraPlot}
              height={eSaldo.y(eSaldo.min) - eSaldo.y(0)}
              className="fill-rose-500/[0.07]"
            />
          )}
          {eSaldo.ticks.map((t) => (
            <g key={`s${t}`}>
              <line
                x1={MARGEM.esq}
                x2={MARGEM.esq + larguraPlot}
                y1={eSaldo.y(t)}
                y2={eSaldo.y(t)}
                className={t === 0 ? 'stroke-slate-400 dark:stroke-slate-500' : 'stroke-slate-200 dark:stroke-slate-800'}
                strokeWidth={t === 0 ? 1.5 : 1}
              />
              <text
                x={MARGEM.esq - 8}
                y={eSaldo.y(t) + 3.5}
                textAnchor="end"
                className="fill-slate-400 text-[10px] tabular-nums dark:fill-slate-500"
              >
                {rotuloEixo(t)}
              </text>
            </g>
          ))}
          <path d={linhaSaldo} fill="none" strokeWidth="2" strokeLinejoin="round" className="stroke-violet-600 dark:stroke-violet-500" />
          {dias.map((d, i) => (
            <circle
              key={d.data}
              cx={x(i)}
              cy={eSaldo.y(d.saldoAcumulado)}
              r={ativo === i ? 4 : 2.5}
              className="fill-violet-600 stroke-white dark:fill-violet-500 dark:stroke-slate-900"
              strokeWidth="1.5"
            />
          ))}
          {/* O dia do estouro ganha anel e rótulo — nunca só a cor */}
          {iEstouro >= 0 && estouro && (
            <g>
              <circle
                cx={x(iEstouro)}
                cy={eSaldo.y(estouro.saldoAcumulado)}
                r="6"
                className="fill-none stroke-rose-600 dark:stroke-rose-500"
                strokeWidth="2"
              />
              <text
                x={x(iEstouro)}
                y={eSaldo.y(estouro.saldoAcumulado) + 19}
                textAnchor="middle"
                className="fill-rose-600 text-[10px] font-semibold dark:fill-rose-400"
              >
                estoura
              </text>
            </g>
          )}

          {/* Fronteira realizado | previsto, cortando os dois painéis */}
          {primeiroPrevisto > 0 && (
            <g>
              <line
                x1={MARGEM.esq + primeiroPrevisto * LARGURA_DIA}
                x2={MARGEM.esq + primeiroPrevisto * LARGURA_DIA}
                y1={topoBarras}
                y2={topoSaldo + H_SALDO}
                strokeDasharray="3 3"
                className="stroke-slate-400 dark:stroke-slate-500"
              />
              <text
                x={MARGEM.esq + primeiroPrevisto * LARGURA_DIA + 5}
                y={topoBarras + 9}
                className="fill-slate-400 text-[9px] uppercase tracking-wide dark:fill-slate-500"
              >
                previsto →
              </text>
            </g>
          )}

          {/* Eixo X compartilhado — um rótulo a cada dois dias, senão colide */}
          {dias.map((d, i) =>
            LARGURA_DIA >= 42 || i % 2 === 0 || ativo === i ? (
              <text
                key={d.data}
                x={x(i)}
                y={altura - 8}
                textAnchor="middle"
                className={`text-[9px] tabular-nums ${
                  d.data === hoje
                    ? 'fill-slate-700 font-semibold dark:fill-slate-200'
                    : 'fill-slate-400 dark:fill-slate-500'
                }`}
              >
                {d.rotulo}
              </text>
            ) : null,
          )}
        </svg>
      </div>

      {/* Tooltip do dia sob o cursor */}
      {dia && (
        <div className="pointer-events-none absolute left-1/2 top-2 w-56 -translate-x-1/2 rounded-xl border border-slate-200 bg-white/95 p-3 text-xs shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
          <p className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-100">
            {dia.rotulo}
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{dia.origem}</span>
          </p>
          <dl className="mt-1.5 space-y-1">
            <Linha rotulo="Entradas" valor={`R$ ${moeda(dia.entradas)}`} cor="text-teal-700 dark:text-teal-400" />
            <Linha rotulo="Saídas" valor={`R$ ${moeda(dia.saidas)}`} cor="text-rose-700 dark:text-rose-400" />
            <Linha rotulo="Resultado" valor={moedaComSinal(dia.resultado)} cor="text-slate-600 dark:text-slate-300" />
            <Linha
              rotulo="Saldo"
              valor={moedaComSinal(dia.saldoAcumulado)}
              cor={dia.saldoAcumulado < 0 ? 'text-rose-700 dark:text-rose-400' : 'text-violet-700 dark:text-violet-400'}
            />
          </dl>
        </div>
      )}

      {/* Legenda — sempre presente com 3 séries */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <Chave classe="bg-teal-600">Entradas</Chave>
        <Chave classe="bg-rose-600 dark:bg-rose-500">Saídas</Chave>
        <Chave classe="bg-violet-600 dark:bg-violet-500" linha>
          Saldo acumulado
        </Chave>
        <span className="inline-flex items-center gap-1.5">
          {/* A amostra é desenhada com a MESMA hachura e o MESMO contorno das barras. Antes era um
              quadrado de 10px com gradiente CSS: renderizava, mas naquele tamanho virava borrão e
              não dizia nada sobre o que estava no gráfico. */}
          <svg width="14" height="14" aria-hidden className="shrink-0">
            <defs>
              <pattern id="fc-leg" width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <rect width="4" height="4" className="fill-slate-500/10" />
                <line x1="0" y1="0" x2="0" y2="4" strokeWidth="1.5" className="stroke-slate-500/85" />
              </pattern>
            </defs>
            <rect
              x="0.75"
              y="1.75"
              width="12.5"
              height="10.5"
              rx="3"
              fill="url(#fc-leg)"
              strokeWidth="1.25"
              className="stroke-slate-500"
            />
          </svg>
          Previsto (contorno + hachura)
        </span>
      </div>
    </div>
  )
}

function Linha({ rotulo, valor, cor }: { rotulo: string; valor: string; cor: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500 dark:text-slate-400">{rotulo}</dt>
      <dd className={`font-medium tabular-nums ${cor}`}>{valor}</dd>
    </div>
  )
}

function Chave({ classe, linha = false, children }: { classe: string; linha?: boolean; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`${linha ? 'h-0.5 w-4' : 'h-2.5 w-2.5 rounded-sm'} ${classe}`} />
      {children}
    </span>
  )
}
