import { CameraOff } from 'lucide-react'
import type { SnapshotFotos } from '@/../product/sections/minha-sa-de-paciente/types'

interface FotosCompareProps {
  fotosA: SnapshotFotos | null | undefined
  fotosB: SnapshotFotos | null | undefined
  labelA?: string
  labelB?: string
}

type Angle = 'frontal' | 'perfilEsquerdo' | 'perfilDireito' | 'costas'

const ANGLES: { key: Angle; label: string }[] = [
  { key: 'frontal', label: 'Frente' },
  { key: 'perfilEsquerdo', label: 'Perfil esq.' },
  { key: 'perfilDireito', label: 'Perfil dir.' },
  { key: 'costas', label: 'Costas' },
]

function formatDateBR(iso: string | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function PhotoCell({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <CameraOff
          className="h-5 w-5 text-slate-300 dark:text-slate-600"
          aria-hidden
        />
      </div>
    )
  }
  return (
    <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  )
}

export function FotosCompare({
  fotosA,
  fotosB,
  labelA = 'Antes',
  labelB = 'Depois',
}: FotosCompareProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Comparativo visual
        </h3>
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
        {/* Column A */}
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {labelA}
            </p>
            <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
              {formatDateBR(fotosA?.date)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ANGLES.map(({ key, label }) => (
              <div key={key}>
                <PhotoCell src={fotosA?.[key]} alt={`${labelA} — ${label}`} />
                <p className="mt-1 text-center text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-12 h-32 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-slate-700"
          aria-hidden
        />

        {/* Column B */}
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {labelB}
            </p>
            <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
              {formatDateBR(fotosB?.date)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ANGLES.map(({ key, label }) => (
              <div key={key}>
                <PhotoCell src={fotosB?.[key]} alt={`${labelB} — ${label}`} />
                <p className="mt-1 text-center text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
