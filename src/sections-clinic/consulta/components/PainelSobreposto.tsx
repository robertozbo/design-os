import { useEffect, type ReactNode } from 'react'
import { ArrowLeft, X } from 'lucide-react'

interface Props {
  titulo: string
  /** Linha de apoio no header — paciente, escopo, o que for. */
  subtitulo?: string
  /** Rótulo do botão de retorno. */
  voltarPara?: string
  onFechar: () => void
  children: ReactNode
}

/**
 * Painel do tamanho da página, aberto **por cima** da consulta.
 *
 * Existe porque navegar para outra rota durante o atendimento desmonta a Consulta e joga fora a
 * evolução ainda não assinada. Aqui o SOAP permanece montado atrás — o médico consulta o que
 * precisa, fecha e continua de onde parou.
 */
export function PainelSobreposto({ titulo, subtitulo, voltarPara, onFechar, children }: Props) {
  // Esc fecha: o caminho de saída mais rápido quando se está no meio de um atendimento.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onFechar])

  return (
    <div className="fixed inset-0 z-[70]">
      {/* A consulta fica visível nas bordas — sinal de que ela não foi embora. */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={onFechar} />

      <div className="absolute inset-0 flex flex-col bg-white shadow-2xl dark:bg-slate-950 lg:inset-4 lg:rounded-2xl lg:ring-1 lg:ring-slate-200 dark:lg:ring-slate-800">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-3 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onFechar}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              {voltarPara ?? 'Voltar'}
            </button>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                {titulo}
              </div>
              {subtitulo && (
                <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {subtitulo}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onFechar}
            aria-label="Fechar painel"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
