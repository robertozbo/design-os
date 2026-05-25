import { AlertTriangle } from 'lucide-react'
import {
  SITIO_LABELS,
  type SitioAplicacao,
} from '@/../product/sections/medication/types'

interface Props {
  selecionado: SitioAplicacao | null
  sitiosRecentes?: SitioAplicacao[]
  sitioSaturado?: SitioAplicacao | null
  onChange: (sitio: SitioAplicacao) => void
}

const LINHAS: { titulo: string; sitios: SitioAplicacao[] }[] = [
  {
    titulo: 'Abdômen',
    sitios: ['abdome_sup_esq', 'abdome_sup_dir', 'abdome_inf_esq', 'abdome_inf_dir'],
  },
  { titulo: 'Coxa', sitios: ['coxa_esq', 'coxa_dir'] },
  { titulo: 'Braço', sitios: ['braco_esq', 'braco_dir'] },
]

const SHORT: Record<SitioAplicacao, string> = {
  abdome_sup_esq: 'Sup. Esq.',
  abdome_sup_dir: 'Sup. Dir.',
  abdome_inf_esq: 'Inf. Esq.',
  abdome_inf_dir: 'Inf. Dir.',
  coxa_esq: 'Esquerda',
  coxa_dir: 'Direita',
  braco_esq: 'Esquerdo',
  braco_dir: 'Direito',
}

export function SitesMap({
  selecionado,
  sitiosRecentes = [],
  sitioSaturado = null,
  onChange,
}: Props) {
  const recentesSet = new Set(sitiosRecentes)

  return (
    <div className="space-y-4">
      {LINHAS.map((linha) => (
        <div key={linha.titulo}>
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-500">
            {linha.titulo}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {linha.sitios.map((s) => {
              const active = s === selecionado
              const recente = recentesSet.has(s)
              const saturado = sitioSaturado === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange(s)}
                  className={`relative rounded-xl border px-3 py-3 text-left transition-all active:scale-[0.98] ${
                    active
                      ? 'border-teal-500 bg-teal-50 text-teal-900 dark:border-teal-400 dark:bg-teal-500/15 dark:text-teal-200'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-[13px] font-medium leading-tight">
                    {SHORT[s]}
                  </div>
                  {recente && !saturado && (
                    <div className="mt-1 text-[10px] text-amber-700 dark:text-amber-300">
                      usado recentemente
                    </div>
                  )}
                  {saturado && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-700 dark:text-rose-300">
                      <AlertTriangle size={9} />
                      alterne para outra zona
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {selecionado && (
        <div className="text-center text-[12.5px] text-stone-600 dark:text-slate-400">
          Selecionado:{' '}
          <span className="font-medium text-teal-700 dark:text-teal-300">
            {SITIO_LABELS[selecionado]}
          </span>
        </div>
      )}
    </div>
  )
}
