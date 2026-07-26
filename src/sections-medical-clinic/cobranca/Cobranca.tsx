import { useState } from 'react'
import data from '@/../product-medical-clinic/sections/cobranca/data.json'
import type { CobrancaData } from '@/../product-medical-clinic/sections/cobranca/types'
import { CobrancaView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function CobrancaPreview() {
  const base = data as unknown as CobrancaData
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return (
    <>
      <CobrancaView
        dados={base}
        onNova={() => pushToast('Link PIX/cartão gerado (mock) · pronto para enviar ao paciente')}
        onExportar={() => pushToast('CSV do histórico gerado (mock)')}
        onCobranca={(c) =>
          pushToast(
            `${c.pacienteNome} · ${c.status} · detalhe mock: enviar link, marcar pago, emitir recibo, estornar`,
          )
        }
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
