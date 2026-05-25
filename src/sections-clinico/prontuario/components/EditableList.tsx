import { useState } from 'react'
import { Plus, X, Check } from 'lucide-react'

interface Props {
  label?: string
  items: string[]
  placeholder?: string
  onAdd?: (value: string) => void
  onRemove?: (index: number) => void
  bullet?: string
}

export function EditableList({
  label,
  items,
  placeholder = 'Adicionar item',
  onAdd,
  onRemove,
  bullet = '·',
}: Props) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  const submit = () => {
    if (draft.trim()) {
      onAdd?.(draft.trim())
      setDraft('')
    }
    setAdding(false)
  }

  return (
    <div>
      {label && (
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
      )}
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="
              group/item flex items-start gap-2 rounded-md border border-slate-200/60 bg-slate-50/40 px-3 py-2
              transition-colors hover:bg-white hover:shadow-sm
              dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900
            "
          >
            <span className="mt-0.5 text-xs text-slate-400">{bullet}</span>
            <span className="flex-1 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {item}
            </span>
            <button
              onClick={() => onRemove?.(i)}
              className="
                rounded-md p-0.5 text-slate-300 opacity-0 transition-all
                hover:bg-rose-50 hover:text-rose-600 group-hover/item:opacity-100
                dark:text-slate-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400
              "
              aria-label="Remover"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
        {items.length === 0 && !adding && (
          <li className="rounded-md border border-dashed border-slate-200 px-3 py-2 text-xs italic text-slate-400 dark:border-slate-700">
            Nenhum item registrado
          </li>
        )}
        {adding && (
          <li className="flex items-center gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
                if (e.key === 'Escape') {
                  setDraft('')
                  setAdding(false)
                }
              }}
              autoFocus
              className="
                flex-1 rounded-md border border-teal-300 bg-white px-2.5 py-1.5 text-sm
                focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                dark:border-teal-700 dark:bg-slate-900
              "
            />
            <button
              onClick={submit}
              className="
                inline-flex items-center justify-center rounded-md bg-teal-600 p-1.5 text-white
                transition-colors hover:bg-teal-500
              "
              aria-label="Salvar"
            >
              <Check className="size-3.5" />
            </button>
            <button
              onClick={() => {
                setDraft('')
                setAdding(false)
              }}
              className="
                inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-500
                transition-colors hover:bg-slate-50
                dark:border-slate-700 dark:bg-slate-900
              "
              aria-label="Cancelar"
            >
              <X className="size-3.5" />
            </button>
          </li>
        )}
      </ul>
      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="
            mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-600 underline-offset-2 hover:underline
            dark:text-teal-400
          "
        >
          <Plus className="size-3" />
          {placeholder}
        </button>
      )}
    </div>
  )
}
