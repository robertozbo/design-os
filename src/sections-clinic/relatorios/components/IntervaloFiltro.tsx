import { useState } from 'react'
import { CalendarRange, X } from 'lucide-react'
import type { IntervaloDatas } from '@/../product-clinic/sections/relatorios/types'

interface Props {
  /** Janela atualmente aplicada — mês, trimestre ou personalizada. */
  intervalo: IntervaloDatas
  /** True quando a janela veio deste filtro (e não do mês/trimestre). */
  personalizado: boolean
  onAplicar: (de: string, ate: string) => void
  onLimpar: () => void
}

/**
 * Filtro de datas do relatório. Fica antes do mês/trimestre porque é a janela
 * mais específica: aplicar aqui desliga os atalhos de período.
 *
 * Remontado pelo pai (via `key`) quando o intervalo muda por fora, para que os
 * inputs sigam o período escolhido no toggle.
 */
export function IntervaloFiltro({ intervalo, personalizado, onAplicar, onLimpar }: Props) {
  const [de, setDe] = useState(intervalo.de)
  const [ate, setAte] = useState(intervalo.ate)

  const invertido = !!de && !!ate && ate < de
  const incompleto = !de || !ate
  const inalterado = de === intervalo.de && ate === intervalo.ate
  const podeAplicar = !invertido && !incompleto && !inalterado

  const inputBase =
    'bg-transparent text-xs text-slate-700 outline-none dark:text-slate-200 [color-scheme:light] dark:[color-scheme:dark]'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-[34px] items-center gap-2 rounded-lg border px-2.5 ${
            invertido
              ? 'border-rose-400 dark:border-rose-500'
              : 'border-slate-200 dark:border-slate-700'
          }`}
        >
          <CalendarRange className="h-4 w-4 shrink-0 text-slate-400" />
          <label className="sr-only" htmlFor="rel-de">
            Data inicial
          </label>
          <input
            id="rel-de"
            type="date"
            value={de}
            max={ate || undefined}
            onChange={(e) => setDe(e.target.value)}
            className={inputBase}
          />
          <span className="text-xs text-slate-400">até</span>
          <label className="sr-only" htmlFor="rel-ate">
            Data final
          </label>
          <input
            id="rel-ate"
            type="date"
            value={ate}
            min={de || undefined}
            onChange={(e) => setAte(e.target.value)}
            className={inputBase}
          />
        </div>

        <button
          onClick={() => onAplicar(de, ate)}
          disabled={!podeAplicar}
          className="h-[34px] rounded-lg border border-transparent bg-teal-600 px-3 text-xs font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          Aplicar
        </button>

        {personalizado && (
          <button
            onClick={onLimpar}
            title="Voltar ao período do mês"
            className="inline-flex h-[34px] items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2.5 text-xs font-medium text-teal-700 hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-950/70"
          >
            Personalizado
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {invertido && (
        <p className="text-[11px] text-rose-600 dark:text-rose-400">
          A data final é anterior à inicial.
        </p>
      )}
    </div>
  )
}
