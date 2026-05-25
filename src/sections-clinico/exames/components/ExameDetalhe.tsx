import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  Printer,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react'
import type { ExameDetalheProps } from '@/../product-clinico/sections/exames/types'
import { LaudoViewer } from './LaudoViewer'
import { BiomarkersPanel } from './BiomarkersPanel'
import { IAApoioPanel } from './IAApoioPanel'
import { formatDataBR } from './helpers'

export function ExameDetalhe({
  exame,
  onVoltar,
  onMarcarRevisado,
  onCompartilharComPaciente,
  onImprimir,
  onAbrirBiomarker,
  onAbrirPaciente,
  onAbrirAuditIA,
}: ExameDetalheProps) {
  const [observacao, setObservacao] = useState(exame.observacaoMedico)
  const aRevisar = exame.statusRevisao === 'a-revisar'

  return (
    <div
      data-clinico-exame-detalhe
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-10">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              onClick={onVoltar}
              className="
                -ml-1 inline-flex items-center gap-1 rounded-md p-1.5 text-xs font-medium text-slate-500
                transition-colors hover:bg-slate-100 hover:text-slate-900
                dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
              "
            >
              <ArrowLeft className="size-3.5" />
              Exames
            </button>

            <div className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

            <button
              onClick={() => onAbrirPaciente?.(exame.pacienteId)}
              className="flex min-w-0 items-center gap-2.5 rounded-md p-1 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-xs font-medium text-white shadow-sm">
                {exame.iniciais}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {exame.pacienteNome}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {exame.idade} anos · {exame.condicoesCronicas.join(' · ')}
                </p>
              </div>
            </button>

            <div className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 lg:block" />

            <div className="hidden min-w-0 lg:block">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {exame.tipo}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {exame.laboratorio} · coletado {formatDataBR(exame.dataColeta)} · solicitado por{' '}
                {exame.medicoSolicitante}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {aRevisar ? (
              <button
                onClick={() => onMarcarRevisado?.(observacao)}
                className="
                  inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm
                  transition-colors hover:bg-teal-500
                "
              >
                <CheckCircle2 className="size-3.5" />
                Marcar como revisado
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="size-3" />
                Revisado · {formatDataBR(exame.revisadoEm)}
              </span>
            )}
            <ToolbarButton
              onClick={() => onCompartilharComPaciente?.(exame.iaAnalise.blocos[0]?.conteudo || '')}
              icon={Send}
              label="Compartilhar"
            />
            <ToolbarButton onClick={onImprimir} icon={Printer} label="Imprimir" />
            <button
              className="
                rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 transition-colors hover:bg-slate-50
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800
              "
              aria-label="Mais ações"
            >
              <MoreHorizontal className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-6 sm:px-6 lg:px-10">
        {/* Sintomas + medicação contextuais (resumo de fontes IA) */}
        <div className="mb-5 grid gap-3 lg:grid-cols-2">
          <ContextoCard
            titulo="Queixa atual (anamnese)"
            items={exame.anamneseSintomas}
          />
          <ContextoCard
            titulo="Medicação em uso"
            items={exame.medicacaoAtiva.map((m) => `${m.nome} ${m.dose} · ${m.posologia}`)}
          />
        </div>

        {/* Grid 3 colunas */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          {/* Coluna 1 — Laudo */}
          <div className="min-h-[640px] min-w-0 lg:flex-1">
            <LaudoViewer
              laudo={exame.laudoOriginal}
              laboratorio={exame.laboratorio}
              dataResultado={exame.dataResultado}
            />
          </div>

          {/* Coluna 2 — Biomarkers */}
          <div className="w-full min-w-0 lg:w-[320px] lg:shrink-0">
            <BiomarkersPanel
              biomarkers={exame.biomarkers}
              onAbrirBiomarker={onAbrirBiomarker}
            />
          </div>

          {/* Coluna 3 — IA */}
          <div className="w-full min-w-0 lg:w-[360px] lg:shrink-0">
            <IAApoioPanel analise={exame.iaAnalise} onAbrirAuditIA={onAbrirAuditIA} />
          </div>
        </div>

        {/* Observação do médico */}
        <section className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Sua observação no prontuário
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Texto livre que vai pra evolução do paciente. Salvo automaticamente ao marcar como revisado.
          </p>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            rows={3}
            placeholder="Ex: Aumentar Levotiroxina pra 75mcg em jejum, reavaliar TSH em 6 sem."
            className="
              mt-3 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm
              focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
              dark:border-slate-700 dark:bg-slate-900
            "
          />
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
            <Sparkles className="size-3" />
            Dica IA: você pode aproveitar a sugestão do bloco "Cruzamento com medicação" como ponto
            de partida.
          </div>
        </section>
      </div>
    </div>
  )
}

function ToolbarButton({
  onClick,
  icon: Icon,
  label,
}: {
  onClick?: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700
        transition-colors hover:bg-slate-50
        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
      "
    >
      <Icon className="size-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function ContextoCard({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {titulo}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((s, i) => (
          <li
            key={i}
            className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
