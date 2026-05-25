import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import type {
  MotivoCancelamento,
  PrescricaoDetalhe,
} from '@/../product-clinico/sections/prescricao/types'
import { CLASSE_CHIP, MOTIVO_LABEL } from './helpers'

interface CancelamentoModalProps {
  prescricao: PrescricaoDetalhe | null
  onClose?: () => void
  onConfirmar?: (motivo: MotivoCancelamento, justificativa: string) => void
}

const MOTIVOS: MotivoCancelamento[] = [
  'erro_prescricao',
  'mudanca_conduta',
  'reacao_adversa',
  'outro',
]

const MIN_JUSTIFICATIVA = 10

export function CancelamentoModal({ prescricao, onClose, onConfirmar }: CancelamentoModalProps) {
  const [motivo, setMotivo] = useState<MotivoCancelamento | null>(null)
  const [justificativa, setJustificativa] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (prescricao) {
      setMotivo(null)
      setJustificativa('')
      setEnviando(false)
    }
  }, [prescricao])

  useEffect(() => {
    if (!prescricao) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !enviando) onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prescricao, enviando, onClose])

  if (!prescricao) return null

  const valido =
    motivo !== null && justificativa.trim().length >= MIN_JUSTIFICATIVA && !enviando

  const submeter = () => {
    if (!valido || !motivo) return
    setEnviando(true)
    setTimeout(() => onConfirmar?.(motivo, justificativa.trim()), 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Fechar"
        onClick={() => !enviando && onClose?.()}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-slate-950/70"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Header */}
        <header className="flex items-start gap-3 border-b border-slate-200/80 bg-rose-50/40 px-5 py-4 dark:border-slate-800/80 dark:bg-rose-950/20">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Cancelar prescrição?
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {prescricao.pacienteNome} · Memed{' '}
              <span className="font-mono">{prescricao.memedId}</span>
            </p>
          </div>
          <button
            onClick={() => !enviando && onClose?.()}
            className="-mr-1 -mt-1 inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Fechar"
            disabled={enviando}
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="space-y-4 px-5 py-4">
          {/* Resumo dos itens */}
          <div className="flex flex-wrap gap-1.5">
            {prescricao.itens.map((item) => (
              <span
                key={item.id}
                className={`
                  inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium
                  ${CLASSE_CHIP.outro}
                `}
              >
                {item.medicamento.split(' ')[0]}
              </span>
            ))}
          </div>

          {/* Motivo */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              Por que essa receita está sendo cancelada?
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {MOTIVOS.map((m) => {
                const ativo = motivo === m
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMotivo(m)}
                    disabled={enviando}
                    className={`
                      rounded-lg border px-3 py-2 text-xs font-medium transition-all
                      ${
                        ativo
                          ? 'border-rose-400 bg-rose-50 text-rose-800 shadow-sm dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600'
                      }
                      disabled:opacity-50
                    `}
                  >
                    {MOTIVO_LABEL[m]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Justificativa */}
          <div>
            <label
              htmlFor="cancel-justif"
              className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              Justificativa <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="cancel-justif"
              rows={3}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              disabled={enviando}
              placeholder="Descreva o que motivou o cancelamento (mín. 10 caracteres)…"
              className="
                w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                placeholder:text-slate-400
                focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30
                dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-500
                disabled:opacity-50
              "
            />
            <div className="mt-1 flex justify-between text-[10px]">
              <span
                className={
                  justificativa.trim().length < MIN_JUSTIFICATIVA
                    ? 'text-slate-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }
              >
                mínimo {MIN_JUSTIFICATIVA} caracteres
              </span>
              <span className="font-mono text-slate-400 tabular-nums">
                {justificativa.trim().length}
              </span>
            </div>
          </div>

          {/* Aviso */}
          <p className="rounded-md bg-slate-100/60 px-3 py-2 text-[11px] leading-relaxed text-slate-600 dark:bg-slate-900/60 dark:text-slate-400">
            Esta ação registra cancelamento no <strong>Memed</strong> e no audit log do paciente.{' '}
            <span className="font-medium text-rose-600 dark:text-rose-400">Não é reversível.</span>
          </p>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-end gap-2 border-t border-slate-200/80 bg-slate-50/40 px-5 py-3 dark:border-slate-800/80 dark:bg-slate-950/60">
          <button
            type="button"
            onClick={() => !enviando && onClose?.()}
            disabled={enviando}
            className="
              inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors
              hover:bg-slate-100
              focus:outline-none focus:ring-2 focus:ring-slate-400/40
              dark:text-slate-200 dark:hover:bg-slate-800
              disabled:opacity-50
            "
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={submeter}
            disabled={!valido}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors
              hover:bg-rose-500
              focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
              disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-rose-600
            "
          >
            {enviando ? 'Cancelando no Memed…' : 'Cancelar prescrição'}
          </button>
        </footer>
      </div>
    </div>
  )
}
