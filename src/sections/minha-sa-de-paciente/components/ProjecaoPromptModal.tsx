import { useEffect, useState } from 'react'
import { Sparkles, X, Zap } from 'lucide-react'
import type {
  ProjecaoPromptConfig,
  ProjecaoPreviewUsage,
} from '@/../product/sections/minha-sa-de-paciente/types'

interface ProjecaoPromptModalProps {
  open: boolean
  prompt: ProjecaoPromptConfig | null
  usage: ProjecaoPreviewUsage | null
  isGenerating?: boolean
  onCancel: () => void
  onConfirm: (editedPrompt: string) => void
}

function formatBRL(cents: number): string {
  const reais = cents / 100
  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

export function ProjecaoPromptModal({
  open,
  prompt,
  usage,
  isGenerating,
  onCancel,
  onConfirm,
}: ProjecaoPromptModalProps) {
  const [edited, setEdited] = useState('')

  useEffect(() => {
    if (open) setEdited(prompt?.promptTexto ?? '')
  }, [open, prompt?.promptTexto])

  if (!open || !prompt) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2
                id="prompt-preview-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Revise o prompt
              </h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                A IA gerou esse prompt a partir da sua meta. Você pode editar
                antes de gerar a imagem.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fechar"
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-4 px-6 py-5">
          {/* Prompt textarea */}
          <div>
            <label
              htmlFor="prompt-text"
              className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
            >
              Prompt textual
            </label>
            <textarea
              id="prompt-text"
              value={edited}
              onChange={(e) => setEdited(e.target.value)}
              rows={8}
              className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>

          {/* Preservar tags */}
          {prompt.preservar.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Preservar da foto original
              </p>
              <div className="flex flex-wrap gap-1">
                {prompt.preservar.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Usage / cost */}
          {usage && (
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Zap
                  className="h-4 w-4 text-teal-500 dark:text-teal-400"
                  aria-hidden
                />
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Custo da etapa anterior:
                </span>
              </div>
              <div className="flex items-baseline gap-2 font-mono text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {usage.promptTokens + usage.completionTokens} tokens
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatBRL(usage.costCents)}
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {(usage.latencyMs / 1000).toFixed(1)}s
                </span>
              </div>
            </div>
          )}

          <p className="text-[10px] italic text-slate-500 dark:text-slate-400">
            {prompt.disclaimerEducativo}
          </p>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onCancel}
            disabled={isGenerating}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(edited)}
            disabled={isGenerating || edited.trim().length === 0}
            className="rounded-full bg-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? 'Gerando…' : 'Gerar imagem'}
          </button>
        </footer>
      </div>
    </div>
  )
}
