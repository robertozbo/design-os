import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  contextoLabel?: string | null
  onSalvar: (payload: {
    nausea: number
    refluxo: number
    pensamentosAlimentares: number
    fadiga: number
    diarreia: number
    constipacao: number
    observacoes: string
  }) => void
}

type SintomaKey =
  | 'nausea'
  | 'refluxo'
  | 'pensamentosAlimentares'
  | 'fadiga'
  | 'diarreia'
  | 'constipacao'

interface Sintoma {
  key: SintomaKey
  label: string
  hint?: string
  ancora?: boolean
}

const SINTOMAS: Sintoma[] = [
  { key: 'nausea', label: 'Náusea' },
  { key: 'refluxo', label: 'Refluxo / azia' },
  {
    key: 'pensamentosAlimentares',
    label: 'Pensamentos alimentares',
    hint: 'Quanto você pensou em comida hoje, fora das refeições?',
    ancora: true,
  },
  { key: 'fadiga', label: 'Fadiga' },
  { key: 'diarreia', label: 'Diarreia' },
  { key: 'constipacao', label: 'Constipação' },
]

function intensidadeLabel(n: number): string {
  if (n === 0) return 'Sem'
  if (n <= 3) return 'Leve'
  if (n <= 6) return 'Moderada'
  if (n <= 8) return 'Forte'
  return 'Severa'
}

function intensidadeTone(n: number, ancora = false): string {
  if (n === 0)
    return ancora
      ? 'text-emerald-600 dark:text-emerald-300'
      : 'text-slate-400 dark:text-slate-500'
  if (n <= 3)
    return ancora
      ? 'text-emerald-600 dark:text-emerald-300'
      : 'text-slate-700 dark:text-slate-300'
  if (n <= 6) return 'text-amber-600 dark:text-amber-300'
  if (n <= 8) return 'text-orange-600 dark:text-orange-300'
  return 'text-rose-600 dark:text-rose-300'
}

export function RegisterSymptomsModal({
  open,
  onClose,
  contextoLabel,
  onSalvar,
}: Props) {
  const [valores, setValores] = useState<Record<SintomaKey, number>>({
    nausea: 0,
    refluxo: 0,
    pensamentosAlimentares: 0,
    fadiga: 0,
    diarreia: 0,
    constipacao: 0,
  })
  const [observacoes, setObservacoes] = useState('')

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const set = (k: SintomaKey, v: number) =>
    setValores((p) => ({ ...p, [k]: v }))

  const handleSalvar = () => {
    onSalvar({ ...valores, observacoes })
    setValores({
      nausea: 0,
      refluxo: 0,
      pensamentosAlimentares: 0,
      fadiga: 0,
      diarreia: 0,
      constipacao: 0,
    })
    setObservacoes('')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Registrar sintomas"
        className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 md:max-w-2xl"
      >
        {/* Header */}
        <header className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-5 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
                Registrar sintomas
              </p>
              <h2 className="mt-1 text-[18px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
                Como você está se sentindo?
              </h2>
              {contextoLabel && (
                <p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400">
                  após {contextoLabel}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Fechar"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-6">
          {SINTOMAS.map((s) => {
            const val = valores[s.key]
            return (
              <div
                key={s.key}
                className={`rounded-2xl border p-4 ${
                  s.ancora
                    ? 'border-teal-200 bg-teal-50/40 dark:border-teal-500/20 dark:bg-teal-500/[0.04]'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <div className="text-[14px] font-medium text-slate-900 dark:text-slate-100">
                      {s.label}
                    </div>
                    {s.hint && (
                      <p className="mt-0.5 max-w-[260px] text-[12px] leading-snug text-slate-500 dark:text-slate-500">
                        {s.hint}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-mono text-[24px] font-bold leading-none tabular-nums ${intensidadeTone(val, s.ancora)}`}
                    >
                      {val}
                    </div>
                    <div
                      className={`mt-0.5 text-[10.5px] ${intensidadeTone(val, s.ancora)}`}
                    >
                      {intensidadeLabel(val)}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={val}
                  onChange={(e) => set(s.key, Number(e.target.value))}
                  className="w-full accent-teal-600 dark:accent-teal-400"
                />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500 dark:text-slate-500">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            )
          })}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <label className="mb-2 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
              Outros sintomas ou observações
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value.slice(0, 280))}
              placeholder="Opcional · até 280 caracteres"
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
            />
            <div className="mt-1 text-right font-mono text-[10px] text-slate-500 dark:text-slate-500">
              {observacoes.length}/280
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={handleSalvar}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-[14px] font-semibold text-white transition-all hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
          >
            <Save size={15} strokeWidth={2.4} />
            Salvar registro
          </button>
        </footer>
      </aside>
    </div>
  )
}
