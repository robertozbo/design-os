import { useEffect, useRef, useState } from 'react'
import type { TipoEvento } from '@/../product/sections/eventos-esocial/types'
import { Plus, ChevronDown } from 'lucide-react'

interface Props {
  onSelect?: (tipo: TipoEvento) => void
}

const TIPOS: { value: TipoEvento; titulo: string; descricao: string; chip: string }[] = [
  {
    value: 'S-2210',
    titulo: 'CAT',
    descricao: 'Comunicação de Acidente de Trabalho',
    chip: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40',
  },
  {
    value: 'S-2220',
    titulo: 'ASO',
    descricao: 'Monitoramento da Saúde do Trabalhador',
    chip: 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40',
  },
  {
    value: 'S-2221',
    titulo: 'Toxicológico',
    descricao: 'Exame Toxicológico do Motorista Profissional',
    chip: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40',
  },
  {
    value: 'S-2240',
    titulo: 'Riscos',
    descricao: 'Exposição a Agentes Nocivos',
    chip: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40',
  },
  {
    value: 'S-2245',
    titulo: 'Treinamentos',
    descricao: 'Capacitações e Exercícios Simulados (NRs)',
    chip: 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40',
  },
]

export function NovoEventoMenu({ onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          inline-flex items-center justify-center gap-2
          px-4 py-2.5 rounded-xl
          bg-teal-600 hover:bg-teal-700 active:bg-teal-800
          dark:bg-teal-500 dark:hover:bg-teal-400
          text-white font-medium text-sm
          shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
          dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
          transition
        "
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Plus className="w-4 h-4" strokeWidth={2.25} />
        Novo evento
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={2.25}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="
            absolute right-0 top-full mt-2 z-30 w-[320px]
            rounded-2xl bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)]
            dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)]
            overflow-hidden
            drawer-fade
          "
        >
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80">
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Escolha o tipo do evento
            </p>
          </div>
          <ul className="py-1">
            {TIPOS.map((t) => (
              <li key={t.value}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onSelect?.(t.value)
                    setOpen(false)
                  }}
                  className="
                    w-full px-3 py-2.5 flex items-start gap-3 text-left
                    hover:bg-slate-50 dark:hover:bg-slate-800/60
                    focus:bg-slate-50 dark:focus:bg-slate-800/60
                    transition outline-none
                  "
                >
                  <span
                    className={`
                      shrink-0 inline-flex items-center justify-center min-w-[64px] px-2 py-1 rounded-md
                      font-mono text-[11px] font-semibold tracking-wide
                      ${t.chip}
                    `}
                  >
                    {t.value}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                      {t.titulo}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {t.descricao}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
