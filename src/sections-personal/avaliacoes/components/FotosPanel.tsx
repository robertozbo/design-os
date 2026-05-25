import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { Avaliacao } from '@/../product-personal/sections/avaliacoes/types'

type Vista = 'frontalUrl' | 'lateralUrl' | 'posteriorUrl'

const VISTAS: { id: Vista; label: string }[] = [
  { id: 'frontalUrl', label: 'Frontal' },
  { id: 'lateralUrl', label: 'Lateral' },
  { id: 'posteriorUrl', label: 'Posterior' },
]

interface FotosPanelProps {
  atual: Avaliacao
  outras: Avaliacao[]
}

export function FotosPanel({ atual, outras }: FotosPanelProps) {
  const fotos = atual.antropometria?.fotos
  const candidatasAntes = outras
    .filter((a) => a.alunoId === atual.alunoId && a.id !== atual.id)
    .filter((a) => {
      const f = a.antropometria?.fotos
      return f && (f.frontalUrl || f.lateralUrl || f.posteriorUrl)
    })
    .sort((a, b) => a.data.localeCompare(b.data))

  const [antesId, setAntesId] = useState<string | null>(
    candidatasAntes[0]?.id ?? null,
  )
  const [vista, setVista] = useState<Vista>('frontalUrl')

  if (!fotos || (!fotos.frontalUrl && !fotos.lateralUrl && !fotos.posteriorUrl)) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <ImageOff size={20} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Sem fotos nesta avaliação
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          As fotos podem ser adicionadas ao editar a avaliação.
        </p>
      </div>
    )
  }

  const antes = candidatasAntes.find((a) => a.id === antesId) ?? null
  const antesFotos = antes?.antropometria?.fotos

  return (
    <div className="space-y-5">
      {/* Galeria de fotos atuais */}
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Galeria · {new Date(atual.data).toLocaleDateString('pt-BR')}
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {VISTAS.map((v) => (
            <FotoTile key={v.id} label={v.label} url={fotos[v.id]} />
          ))}
        </div>
      </article>

      {/* Antes/depois slider */}
      {candidatasAntes.length > 0 && (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Antes · Depois
            </p>
            <div className="flex flex-wrap gap-1">
              {VISTAS.map((v) => {
                const active = vista === v.id
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVista(v.id)}
                    className={`
                      rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors
                      ${
                        active
                          ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                      }
                    `}
                  >
                    {v.label}
                  </button>
                )
              })}
            </div>
          </header>

          {/* Selector de avaliação anterior */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {candidatasAntes.map((c) => {
              const active = antesId === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAntesId(c.id)}
                  className={`
                    inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors
                    ${
                      active
                        ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {new Date(c.data).toLocaleDateString('pt-BR')}
                </button>
              )
            })}
          </div>

          {/* Split view */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <FotoTile
              label={`Antes · ${
                antes
                  ? new Date(antes.data).toLocaleDateString('pt-BR')
                  : '—'
              }`}
              url={antesFotos?.[vista] ?? null}
              accent="muted"
            />
            <FotoTile
              label={`Depois · ${new Date(atual.data).toLocaleDateString('pt-BR')}`}
              url={fotos[vista]}
              accent="primary"
            />
          </div>
        </article>
      )}
    </div>
  )
}

function FotoTile({
  label,
  url,
  accent = 'normal',
}: {
  label: string
  url: string | null
  accent?: 'normal' | 'primary' | 'muted'
}) {
  const ring =
    accent === 'primary'
      ? 'ring-teal-300 dark:ring-teal-700'
      : accent === 'muted'
        ? 'ring-slate-200 dark:ring-slate-800'
        : 'ring-slate-200 dark:ring-slate-800'

  return (
    <div>
      <p className={`font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${
        accent === 'primary'
          ? 'text-teal-700 dark:text-teal-400'
          : 'text-slate-500 dark:text-slate-400'
      }`}>
        {label}
      </p>
      <div
        className={`mt-1.5 aspect-[3/4] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-inset dark:bg-slate-800 ${ring}`}
      >
        {url ? (
          <img src={url} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-700">
            <ImageOff size={28} strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  )
}
