import { useState } from 'react'

interface Toast {
  id: number
  texto: string
}
let seq = 0

/** As três telas da section dão o mesmo tipo de retorno; o toast mora aqui uma vez só. */
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = (texto: string) => {
    const id = ++seq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }
  return { toasts, push }
}

export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[80] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
        >
          {t.texto}
        </div>
      ))}
    </div>
  )
}
