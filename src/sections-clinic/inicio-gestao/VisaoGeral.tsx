import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-clinic/sections/inicio-gestao/data.json'
import type { GestaoData, Periodo } from '@/../product-clinic/sections/inicio-gestao/types'
import { VisaoGeralView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function VisaoGeralPreview() {
  const navigate = useNavigate()
  const base = data as unknown as GestaoData

  const [periodo, setPeriodo] = useState<Periodo>(base.periodo)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return (
    <>
      <VisaoGeralView
        dados={{ ...base, periodo }}
        onPeriodo={(p) => {
          setPeriodo(p)
          if (p !== base.periodo) pushToast('Protótipo: dados de exemplo são da semana')
        }}
        onPendencia={(pd) => navigate(pd.href)}
      />

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[55] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full rounded-xl border border-emerald-200/80 bg-emerald-50/95 px-4 py-2.5 text-sm text-emerald-900 shadow-lg backdrop-blur-sm dark:border-emerald-900/50 dark:bg-emerald-950/90 dark:text-emerald-100"
          >
            {t.texto}
          </div>
        ))}
      </div>
    </>
  )
}
