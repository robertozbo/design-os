import type { Profissional, Saudacao } from '@/../product-clinico/sections/inicio/types'

interface Props {
  profissional: Profissional
  saudacao: Saudacao
  onAbrirPerfil?: () => void
}

export function HeroBlock({ profissional, saudacao, onAbrirPerfil }: Props) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {saudacao.texto}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {saudacao.frase}
        </p>
      </div>
      <button
        onClick={onAbrirPerfil}
        className="
          inline-flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-2
          text-left transition-all hover:border-teal-300 hover:shadow-sm
          dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700
        "
      >
        <div className="relative">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-xs font-medium text-white shadow-sm">
            {profissional.iniciais}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
            {profissional.nome}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {profissional.especialidade} · {profissional.crm}
          </p>
        </div>
      </button>
    </header>
  )
}
