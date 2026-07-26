import { useState } from 'react'
import {
  Activity,
  Apple,
  Brain,
  FlaskConical,
  HeartPulse,
  Lock,
  Ruler,
  Smartphone,
  TrendingUp,
} from 'lucide-react'
import type {
  AcompanhamentoData,
  Consentimento,
} from '@/../product-medical-clinic/sections/acompanhamento/types'
import { MetricasPanel } from './MetricasPanel'
import { AtividadePanel } from './AtividadePanel'
import { IndicadoresPanel } from './IndicadoresPanel'
import { BioindicadoresPanel } from './BioindicadoresPanel'
import { ExamesPanel } from './ExamesPanel'
import { ConsentimentoPanel } from './ConsentimentoPanel'
import { dataExtensa, desdeUltimaConsulta } from './helpers'

/**
 * As abas espelham os **escopos de consentimento**, um para um. É o que permite responder, dentro
 * da própria aba, se o paciente liberou aquele dado — em vez de o médico ter que cruzar com uma
 * lista à parte. Escopo sem tela (diário alimentar, saúde mental) vira aba travada: aparece,
 * explica que não foi compartilhado, e não some.
 */
type TabId =
  | 'Métricas'
  | 'Atividades'
  | 'Indicadores'
  | 'Bioindicadores'
  | 'Exames'
  | 'Diário alimentar'
  | 'Saúde mental'

const ICONE: Record<TabId, typeof TrendingUp> = {
  Métricas: TrendingUp,
  Atividades: Activity,
  Indicadores: Ruler,
  Bioindicadores: HeartPulse,
  Exames: FlaskConical,
  'Diário alimentar': Apple,
  'Saúde mental': Brain,
}

interface Props {
  dados: AcompanhamentoData
  /** Aba inicial — permite abrir direto no que interessa a partir de outra tela. */
  tabInicial?: TabId
}

export function AcompanhamentoView({ dados, tabInicial = 'Métricas' }: Props) {
  const { paciente, vinculo, ultimaConsultaEm, consentimentos } = dados
  const [tab, setTab] = useState<TabId>(tabInicial)

  const consentimentoDe = (escopo: string): Consentimento | undefined =>
    consentimentos.find((c) => c.escopo === escopo)

  const contadorDe = (id: TabId): number => {
    if (id === 'Métricas') return dados.metricas.length
    if (id === 'Indicadores') return dados.avaliacoes.length
    if (id === 'Bioindicadores') return dados.bioimpedancias.length
    if (id === 'Exames') return dados.examesCompartilhados.length
    return 0
  }

  const atual = consentimentoDe(tab)
  const liberado = atual?.compartilhado ?? false

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-5">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white">
            {paciente.iniciais}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Acompanhamento · {paciente.nome}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {paciente.idade} anos · variações desde a consulta de{' '}
              {dataExtensa(ultimaConsultaEm)} ({desdeUltimaConsulta(ultimaConsultaEm)})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Smartphone className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span>
            No app desde {dataExtensa(vinculo.desde)} · sincronizado{' '}
            {desdeUltimaConsulta(vinculo.ultimaSync.slice(0, 10))}
          </span>
        </div>
      </div>

      {/* Abas — o cadeado diz, antes do clique, o que o paciente não liberou */}
      <div
        role="tablist"
        aria-label="Dados compartilhados pelo paciente"
        className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-800"
      >
        {consentimentos.map((c) => {
          const id = c.escopo as TabId
          const Icon = ICONE[id] ?? TrendingUp
          const ativa = tab === id
          const n = contadorDe(id)
          return (
            <button
              key={c.escopo}
              role="tab"
              aria-selected={ativa}
              onClick={() => setTab(id)}
              title={
                c.compartilhado
                  ? `Compartilhado desde ${dataExtensa(c.desde as string)}`
                  : 'O paciente não compartilhou este dado'
              }
              className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                ativa
                  ? 'border-teal-500 text-teal-700 dark:text-teal-300'
                  : c.compartilhado
                    ? 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                    : 'border-transparent text-slate-400 hover:border-slate-300 dark:text-slate-600 dark:hover:border-slate-700'
              }`}
            >
              {c.compartilhado ? (
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Lock className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              {c.escopo}
              {c.compartilhado && n > 0 && (
                <span className="rounded-full bg-slate-100 px-1.5 text-[10px] font-mono tabular-nums text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {n}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Estado do consentimento da aba aberta — a resposta no lugar onde a pergunta nasce */}
      {atual && (
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] ${
            liberado
              ? 'bg-slate-50 text-slate-500 dark:bg-slate-900/60 dark:text-slate-400'
              : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
          }`}
        >
          {liberado ? (
            <>
              <Smartphone className="h-3.5 w-3.5 shrink-0" />
              <span>
                Compartilhado desde {dataExtensa(atual.desde as string)} — não há dado anterior a
                essa data.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>
                O paciente não compartilhou este dado. Ele pode liberar no app, em Permissões de
                compartilhamento.
              </span>
            </>
          )}
        </div>
      )}

      <div role="tabpanel">
        {!liberado ? null : tab === 'Métricas' ? (
          <MetricasPanel metricas={dados.metricas} ultimaConsultaEm={ultimaConsultaEm} />
        ) : tab === 'Atividades' ? (
          <AtividadePanel atividade={dados.atividade} ultimaConsultaEm={ultimaConsultaEm} />
        ) : tab === 'Indicadores' ? (
          <IndicadoresPanel avaliacoes={dados.avaliacoes} />
        ) : tab === 'Bioindicadores' ? (
          <BioindicadoresPanel bioimpedancias={dados.bioimpedancias} />
        ) : tab === 'Exames' ? (
          <ExamesPanel exames={dados.examesCompartilhados} />
        ) : null}
      </div>

      {/* Vínculo e dispositivos — contexto de todas as abas, não de uma. */}
      <ConsentimentoPanel vinculo={vinculo} consentimentos={consentimentos} />
    </div>
  )
}
