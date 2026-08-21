import { useEffect, useState, type ReactNode } from 'react'
import { CheckCircle2, Clock, Pause, Play, Save, X } from 'lucide-react'
import type { BaseAtendimento } from '@/../product-clinic/sections/atendimento/types'
import { COR_PROFISSAO } from './helpers'

interface Props {
  atendimento: BaseAtendimento
  clinica: string
  /** Nome da tela: "Sessão de fisioterapia", "Consulta de nutrição"… */
  titulo: string
  /** O registro específico da profissão. */
  children: ReactNode
  /** A coluna de contexto — histórico e alertas. */
  lateral: ReactNode
  onSalvar: () => void
  onFinalizar: () => void
  onSair: () => void
}

/**
 * O esqueleto que TODA tela de atendimento compartilha, seja qual for o conselho: quem é o
 * paciente, quem atende, onde a sessão está no tratamento, o cronômetro e as duas ações que
 * encerram (salvar rascunho / finalizar e assinar). O que muda por profissão é só o miolo —
 * é isso que faz quatro telas diferentes continuarem sendo o mesmo produto.
 */
export function AtendimentoShell({
  atendimento: a,
  clinica,
  titulo,
  children,
  lateral,
  onSalvar,
  onFinalizar,
  onSair,
}: Props) {
  const cor = COR_PROFISSAO[a.profissional.cor]
  const [segundos, setSegundos] = useState(0)
  const [correndo, setCorrendo] = useState(true)

  useEffect(() => {
    if (!correndo) return
    const t = setInterval(() => setSegundos((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [correndo])

  const hh = String(Math.floor(segundos / 3600)).padStart(2, '0')
  const mm = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0')
  const ss = String(segundos % 60).padStart(2, '0')
  const passouDoPrevisto = segundos > a.duracaoPrevistaMin * 60

  return (
    <div className="min-h-screen bg-slate-100 pb-10 dark:bg-slate-950">
      {/* Barra fixa: paciente, cronômetro e as ações que encerram */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto max-w-7xl px-4 py-3 pl-16 lg:pl-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              aria-label="Sair do atendimento"
              onClick={onSair}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${cor.barra}`}
            >
              {a.paciente.iniciais}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {a.paciente.nome}
                </span>
                <span className="text-[11px] text-slate-400">
                  {a.paciente.idade}a · {a.paciente.convenio}
                </span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${cor.chip}`}>
                  {titulo}
                </span>
                {a.sessaoNumero !== null && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Sessão {a.sessaoNumero}
                    {a.sessoesPacote ? ` de ${a.sessoesPacote}` : ''}
                  </span>
                )}
              </div>
              <div className="truncate text-[11px] text-slate-400">
                {a.motivo} · {a.dataLabel}, {a.horaInicio}
              </div>
            </div>

            {/* Cronômetro */}
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs tabular-nums ${
                  passouDoPrevisto
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
                title={`Previsto: ${a.duracaoPrevistaMin} min`}
              >
                <Clock className="h-3.5 w-3.5" />
                {hh}:{mm}:{ss}
              </span>
              <button
                aria-label={correndo ? 'Pausar' : 'Retomar'}
                onClick={() => setCorrendo((v) => !v)}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {correndo ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onSalvar}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Save className="h-3.5 w-3.5" /> Salvar rascunho
              </button>
              <button
                onClick={onFinalizar}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Finalizar e assinar
              </button>
            </div>
          </div>

          {a.paciente.observacaoCritica && (
            <div className="mt-2 rounded-lg bg-rose-50 px-3 py-1.5 text-[11px] font-medium text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
              {a.paciente.observacaoCritica}
            </div>
          )}
        </div>
      </div>

      {/* Miolo (profissão) + contexto */}
      <div className="mx-auto max-w-7xl px-4 pt-4 lg:grid lg:grid-cols-[1fr_320px] lg:gap-4">
        <div className="min-w-0 space-y-3">{children}</div>
        <div className="mt-3 space-y-3 lg:mt-0">{lateral}</div>
      </div>
    </div>
  )
}

/** Bloco padrão do miolo — todo registro é uma pilha destes. */
export function Bloco({
  titulo,
  acessorio,
  children,
}: {
  titulo: string
  acessorio?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{titulo}</h2>
        {acessorio}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

/** Textarea com rótulo — o campo mais repetido de qualquer evolução. */
export function Campo({
  label,
  hint,
  valor,
  onChange,
  linhas = 3,
}: {
  label: string
  hint?: string
  valor: string
  onChange: (v: string) => void
  linhas?: number
}) {
  return (
    <div>
      <label className="mb-1 flex items-baseline gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </label>
      <textarea
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        rows={linhas}
        className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      />
    </div>
  )
}
