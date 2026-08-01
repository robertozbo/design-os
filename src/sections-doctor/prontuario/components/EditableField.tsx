import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'

interface Props {
  label?: string
  value: string
  multiline?: boolean
  placeholder?: string
  onSave?: (newValue: string) => void
  className?: string
}

export function EditableField({
  label,
  value,
  multiline = false,
  placeholder = 'Não informado',
  onSave,
  className = '',
}: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const start = () => {
    setDraft(value)
    setEditing(true)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  const save = () => {
    onSave?.(draft)
    setEditing(false)
  }

  return (
    <div className={`group/field ${className}`}>
      {label && (
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
      )}
      {editing ? (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={5}
              autoFocus
              className="
                w-full resize-y rounded-md border border-teal-300 bg-white px-3 py-2 text-sm leading-relaxed
                focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                dark:border-teal-700 dark:bg-slate-900
              "
            />
          ) : (
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              className="
                w-full rounded-md border border-teal-300 bg-white px-3 py-2 text-sm
                focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                dark:border-teal-700 dark:bg-slate-900
              "
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={cancel}
              className="
                inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600
                transition-colors hover:bg-slate-50
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300
              "
            >
              <X className="size-3" />
              Cancelar
            </button>
            <button
              onClick={save}
              className="
                inline-flex items-center gap-1 rounded-md bg-teal-600 px-3 py-1 text-xs font-medium text-white
                transition-colors hover:bg-teal-500
              "
            >
              <Check className="size-3" />
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={start}
          className="
            relative block w-full rounded-md border border-transparent bg-slate-50/40 px-3 py-2 text-left text-sm leading-relaxed
            transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm
            focus:outline-none focus:ring-2 focus:ring-teal-500/40
            dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900
          "
        >
          {value ? (
            <span className="whitespace-pre-line text-slate-800 dark:text-slate-200">{value}</span>
          ) : (
            <span className="italic text-slate-400 dark:text-slate-500">{placeholder}</span>
          )}
          <Pencil
            className="
              absolute right-2 top-2 size-3 text-slate-300 opacity-0 transition-opacity
              group-hover/field:opacity-100
              dark:text-slate-600
            "
          />
        </button>
      )}
    </div>
  )
}
