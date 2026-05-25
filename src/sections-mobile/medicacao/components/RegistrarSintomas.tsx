import { useState } from 'react'
import { X, Save } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  /** Label da última injeção pra contextualizar ("Ozempic 0,5mg · 15/05"). */
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

interface Sintoma {
  key:
    | 'nausea'
    | 'refluxo'
    | 'pensamentosAlimentares'
    | 'fadiga'
    | 'diarreia'
    | 'constipacao'
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

const intensidadeLabel = (n: number): string => {
  if (n === 0) return 'Sem'
  if (n <= 3) return 'Leve'
  if (n <= 6) return 'Moderada'
  if (n <= 8) return 'Forte'
  return 'Severa'
}

const intensidadeColor = (n: number, ancora = false): string => {
  if (n === 0) return ancora ? 'text-emerald-300' : 'text-slate-500'
  if (n <= 3) return ancora ? 'text-emerald-300' : 'text-slate-300'
  if (n <= 6) return 'text-amber-300'
  if (n <= 8) return 'text-orange-300'
  return 'text-rose-300'
}

export function RegistrarSintomas({
  open,
  onClose,
  contextoLabel,
  onSalvar,
}: Props) {
  const [valores, setValores] = useState<Record<Sintoma['key'], number>>({
    nausea: 0,
    refluxo: 0,
    pensamentosAlimentares: 0,
    fadiga: 0,
    diarreia: 0,
    constipacao: 0,
  })
  const [observacoes, setObservacoes] = useState('')

  if (!open) return null

  const set = (key: Sintoma['key'], v: number) =>
    setValores((prev) => ({ ...prev, [key]: v }))

  const handleSalvar = () => {
    onSalvar({ ...valores, observacoes })
    // reset
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
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <button
          onClick={onClose}
          className="w-9 h-9 -ml-2 rounded-lg flex items-center justify-center hover:bg-slate-800"
        >
          <X size={18} className="text-slate-300" />
        </button>
        <div className="text-center">
          <div className="text-slate-100 text-[14px] font-semibold">
            Como você está se sentindo?
          </div>
          {contextoLabel && (
            <div className="text-slate-500 text-[11px] mt-0.5">
              após {contextoLabel}
            </div>
          )}
        </div>
        <div className="w-9" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {SINTOMAS.map((s) => {
          const val = valores[s.key]
          return (
            <div
              key={s.key}
              className={`rounded-2xl p-4 border ${
                s.ancora
                  ? 'bg-teal-500/[0.04] border-teal-500/20'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-slate-100 text-[13.5px] font-medium">
                    {s.label}
                  </div>
                  {s.hint && (
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-snug max-w-[230px]">
                      {s.hint}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className={`font-mono text-[22px] font-bold tabular-nums leading-none ${intensidadeColor(val, s.ancora)}`}
                  >
                    {val}
                  </div>
                  <div
                    className={`text-[10.5px] mt-0.5 ${intensidadeColor(val, s.ancora)}`}
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
                className="w-full accent-teal-500"
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          )
        })}

        {/* Observações */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <label className="text-slate-300 text-[12.5px] font-medium block mb-2">
            Outros sintomas ou observações
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value.slice(0, 280))}
            placeholder="Opcional · até 280 caracteres"
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-[12.5px] text-slate-100 placeholder:text-slate-600 resize-none focus:outline-none focus:border-teal-500"
          />
          <div className="text-right text-[10px] text-slate-500 font-mono mt-1">
            {observacoes.length}/280
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-950">
        <button
          onClick={handleSalvar}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold bg-teal-500 text-slate-950 active:scale-[0.99] transition-all"
        >
          <Save size={14} strokeWidth={2.4} />
          Salvar registro
        </button>
      </div>
    </div>
  )
}
