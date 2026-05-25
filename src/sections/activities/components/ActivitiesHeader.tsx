import { Plus } from 'lucide-react'

export interface ActivitiesHeaderProps {
  onCreate?: () => void
}

export function ActivitiesHeader({ onCreate }: ActivitiesHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="
          absolute -z-0 -top-28 -right-20 w-[380px] h-[380px] rounded-full
          bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.20)_0%,rgba(45,212,191,0)_60%)]
          dark:bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.16)_0%,rgba(20,184,166,0)_60%)]
          blur-2xl
        "
      />
      <div
        aria-hidden="true"
        className="
          absolute -z-0 -top-10 -left-24 w-[320px] h-[320px] rounded-full
          bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.10)_0%,rgba(244,63,94,0)_60%)]
          dark:bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.10)_0%,rgba(244,63,94,0)_60%)]
          blur-2xl
        "
      />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="nymos-reveal opacity-0" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-teal-600 dark:text-teal-400 mb-2">
            <span className="w-6 h-px bg-teal-500/60" />
            Atividades
          </div>
          <h1 className="text-3xl md:text-[40px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.05]">
            Atividades Físicas
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Registre exercícios e acompanhe a evolução · sincroniza com Apple Health e Google Fit
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="
            nymos-reveal opacity-0 self-start md:self-auto
            inline-flex items-center gap-1.5
            px-4 py-2.5 rounded-full
            bg-teal-600 hover:bg-teal-700 text-white
            dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
            text-sm font-medium
            shadow-sm
            transition-colors
          "
          style={{ animationDelay: '120ms' }}
        >
          <Plus className="w-4 h-4" />
          Cadastrar
        </button>
      </div>
    </div>
  )
}
