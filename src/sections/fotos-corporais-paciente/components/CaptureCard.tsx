import { Camera, Wand2, Upload, Lock, Sparkles } from 'lucide-react'

interface CaptureCardProps {
  /** Atalho principal — abre o ai-chat global em `body_photo`. */
  onOpenAIChat?: () => void
  /** Atalho secundário — modal de upload direto (1 foto). */
  onOpenDirectUpload?: () => void
  /** Abre detalhes de privacidade. */
  onOpenPrivacy?: () => void
}

export function CaptureCard({
  onOpenAIChat,
  onOpenDirectUpload,
  onOpenPrivacy,
}: CaptureCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 shadow-sm dark:border-emerald-500/30 dark:from-emerald-500/5 dark:via-slate-900 dark:to-teal-500/5">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gradient-to-br from-emerald-400/30 via-teal-300/15 to-transparent blur-3xl dark:from-emerald-500/20 dark:via-teal-500/10"
      />
      <div className="relative flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
            <Camera className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-lg">
              Nova análise
            </h2>
            <p className="mt-0.5 max-w-md text-xs text-slate-600 dark:text-slate-400">
              Tire ou envie fotos pra análise visual completa — tipo somático,
              composição muscular, distribuição de gordura e postura.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenAIChat}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Capturar fotos
          </button>
          <button
            type="button"
            onClick={onOpenDirectUpload}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
          >
            <Upload className="h-3.5 w-3.5" />
            Enviar foto
          </button>
        </div>
      </div>
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-emerald-100 bg-white/50 px-5 py-2 dark:border-emerald-500/20 dark:bg-slate-900/40">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          Até 5 fotos por sessão · ~30s de análise IA
        </span>
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
        >
          <Lock className="h-3 w-3" />
          Como suas fotos são protegidas →
        </button>
      </div>
    </section>
  )
}
