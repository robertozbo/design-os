import { PersonStanding, ImageOff } from 'lucide-react'
import type { SnapshotFotos } from '@/../product-mobile/sections/minha-saude/types'
import { formatDateBR } from './_shared'

interface FotosCompareProps {
  inicial: SnapshotFotos | undefined
  final: SnapshotFotos | undefined
  dataInicial: string
  dataFinal: string
}

const POSICOES: { key: keyof SnapshotFotos; label: string }[] = [
  { key: 'frontal', label: 'Frontal' },
  { key: 'posterior', label: 'Posterior' },
  { key: 'lateralEsquerda', label: 'Lat. Esq.' },
  { key: 'lateralDireita', label: 'Lat. Dir.' },
]

export function FotosCompare({ inicial, final, dataInicial, dataFinal }: FotosCompareProps) {
  if (!inicial && !final) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-4 py-6 text-center">
        <ImageOff size={20} className="text-slate-600 mx-auto mb-2" />
        <div className="text-slate-300 text-[12.5px] font-medium">Sem fotos pra comparar</div>
        <div className="text-slate-500 text-[11px] mt-0.5">
          Adicione fotos corporais nas próximas análises pra ver a evolução visual.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2 px-1">
        <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider text-center">
          {formatDateBR(dataInicial)}
        </div>
        <div className="text-teal-300 text-[10px] font-semibold uppercase tracking-wider text-center">
          {formatDateBR(dataFinal)}
        </div>
      </div>
      {POSICOES.map((pos) => (
        <div key={pos.key} className="grid grid-cols-2 gap-2">
          <FotoPlaceholder url={inicial?.[pos.key]} label={pos.label} variant="inicial" />
          <FotoPlaceholder url={final?.[pos.key]} label={pos.label} variant="final" />
        </div>
      ))}
    </div>
  )
}

interface FotoPlaceholderProps {
  url?: string
  label: string
  variant: 'inicial' | 'final'
}

function FotoPlaceholder({ url, label, variant }: FotoPlaceholderProps) {
  const ringCls = variant === 'final' ? 'border-teal-500/30' : 'border-slate-800'
  const tone = variant === 'final' ? 'text-teal-300/40' : 'text-slate-600/60'

  if (!url) {
    return (
      <div className={`aspect-[3/4] rounded-xl bg-slate-900/40 border border-dashed ${ringCls} flex flex-col items-center justify-center`}>
        <ImageOff size={20} className="text-slate-700" />
        <div className="text-slate-600 text-[10px] mt-1.5">{label}</div>
      </div>
    )
  }

  return (
    <div className={`relative aspect-[3/4] rounded-xl bg-slate-900 border ${ringCls} overflow-hidden flex items-center justify-center`}>
      <PersonStanding size={64} className={tone} strokeWidth={1.2} />
      <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-sm">
        <span className="text-slate-200 text-[10px] font-medium">{label}</span>
      </div>
    </div>
  )
}
