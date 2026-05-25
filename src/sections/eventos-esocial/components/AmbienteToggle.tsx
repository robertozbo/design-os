import type { Ambiente } from '@/../product/sections/eventos-esocial/types'
import { Radio, FlaskConical } from 'lucide-react'

interface Props {
  ambiente: Ambiente
  onChange?: (ambiente: Ambiente) => void
}

export function AmbienteToggle({ ambiente, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Ambiente eSocial"
      className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 ring-1 ring-slate-200/60 dark:ring-slate-800"
    >
      <button
        type="button"
        role="radio"
        aria-checked={ambiente === 'producao'}
        onClick={() => onChange?.('producao')}
        className={`
          inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition
          ${
            ambiente === 'producao'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }
        `}
      >
        <Radio className="w-3.5 h-3.5" strokeWidth={2} />
        Produção
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={ambiente === 'homologacao'}
        onClick={() => onChange?.('homologacao')}
        className={`
          inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition
          ${
            ambiente === 'homologacao'
              ? 'bg-white dark:bg-slate-800 text-orange-700 dark:text-orange-300 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }
        `}
      >
        <FlaskConical className="w-3.5 h-3.5" strokeWidth={2} />
        Homologação
      </button>
    </div>
  )
}
