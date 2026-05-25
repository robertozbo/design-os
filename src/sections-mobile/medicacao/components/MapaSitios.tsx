import { AlertTriangle } from 'lucide-react'
import {
  SITIO_LABELS,
  type SitioAplicacao,
} from '@/../product-mobile/sections/medicacao/types'

interface Props {
  selecionado: SitioAplicacao | null
  /** Sítios usados nas últimas 2 doses — label "usado recentemente" amber. */
  sitiosRecentes?: SitioAplicacao[]
  /** Sítio usado 3x consecutivas — alerta de lipodistrofia. */
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

const SHORT_LABEL: Record<SitioAplicacao, string> = {
  abdome_sup_esq: 'Sup. Esq.',
  abdome_sup_dir: 'Sup. Dir.',
  abdome_inf_esq: 'Inf. Esq.',
  abdome_inf_dir: 'Inf. Dir.',
  coxa_esq: 'Esquerda',
  coxa_dir: 'Direita',
  braco_esq: 'Esquerdo',
  braco_dir: 'Direito',
}

export function MapaSitios({
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
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">
            {linha.titulo}
          </div>
          <div
            className={`grid gap-2 ${
              linha.sitios.length === 4 ? 'grid-cols-2' : 'grid-cols-2'
            }`}
          >
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
                      ? 'bg-teal-500/15 border-teal-400 text-teal-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[13px] font-medium leading-tight">
                    {SHORT_LABEL[s]}
                  </div>
                  {recente && !saturado && (
                    <div className="mt-1 text-[10px] text-amber-300">
                      usado recentemente
                    </div>
                  )}
                  {saturado && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-300">
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
        <div className="text-center text-slate-400 text-[12px]">
          Selecionado:{' '}
          <span className="text-teal-300 font-medium">
            {SITIO_LABELS[selecionado]}
          </span>
        </div>
      )}
    </div>
  )
}
