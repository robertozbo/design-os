import { useState } from 'react'
import data from '@/../product-clinic/sections/meus-recebimentos/data.json'
import type {
  FiltroExtrato,
  MeusRecebimentosData,
  RepassePago,
} from '@/../product-clinic/sections/meus-recebimentos/types'
import { MeusRecebimentosView, ReciboModal } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function MeusRecebimentosPreview() {
  const base = data as unknown as MeusRecebimentosData

  const [filtro, setFiltro] = useState<FiltroExtrato>('todos')
  const [reciboId, setReciboId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const recibo = base.historico.find((r) => r.id === reciboId) ?? null

  return (
    <>
      <MeusRecebimentosView
        clinica={base.clinica}
        profissional={base.profissional}
        contrato={base.contrato}
        resumo={base.resumo}
        porServico={base.porServico}
        deducoes={base.deducoes}
        extrato={base.extrato}
        historico={base.historico}
        filtro={filtro}
        onFiltro={setFiltro}
        onExportar={() => pushToast('Extrato de agosto exportado em CSV (mock)')}
        onAbrirRecibo={(r: RepassePago) => setReciboId(r.id)}
      />

      {recibo && (
        <ReciboModal
          repasse={recibo}
          profissional={base.profissional}
          clinica={base.clinica}
          onBaixar={() => pushToast(`Recibo ${recibo.recibo}.pdf baixado (mock)`)}
          onFechar={() => setReciboId(null)}
        />
      )}

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
    </>
  )
}
