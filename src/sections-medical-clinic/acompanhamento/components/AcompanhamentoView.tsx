import { Smartphone } from 'lucide-react'
import type { AcompanhamentoData } from '@/../product-medical-clinic/sections/acompanhamento/types'
import { MetricasPanel } from './MetricasPanel'
import { AtividadePanel } from './AtividadePanel'
import { ComposicaoPanel } from './ComposicaoPanel'
import { ConsentimentoPanel } from './ConsentimentoPanel'
import { dataExtensa, desdeUltimaConsulta } from './helpers'

interface Props {
  dados: AcompanhamentoData
}

/**
 * Tudo que o paciente compartilhou pelo app desde a última consulta.
 *
 * A referência de tempo é sempre `ultimaConsultaEm` — o médico não quer o histórico completo,
 * quer saber o que mudou desde que viu o paciente.
 */
export function AcompanhamentoView({ dados }: Props) {
  const { paciente, vinculo, ultimaConsultaEm } = dados

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

      <MetricasPanel metricas={dados.metricas} ultimaConsultaEm={ultimaConsultaEm} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AtividadePanel atividade={dados.atividade} ultimaConsultaEm={ultimaConsultaEm} />
        <ComposicaoPanel bioimpedancias={dados.bioimpedancias} avaliacoes={dados.avaliacoes} />
      </div>

      <ConsentimentoPanel
        vinculo={vinculo}
        consentimentos={dados.consentimentos}
        exames={dados.examesCompartilhados}
      />
    </div>
  )
}
