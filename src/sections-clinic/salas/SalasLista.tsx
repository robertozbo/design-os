import { useState } from 'react'
import data from '@/../product-clinic/sections/salas/data.json'
import type { Sala, SalasData } from '@/../product-clinic/sections/salas/types'
import { SalasLista as SalasListaView, SalaDrawer } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function SalasListaPreview() {
  const [salas, setSalas] = useState<Sala[]>((data as unknown as SalasData).salas)
  const [abertaId, setAbertaId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const dados: SalasData = { data: (data as unknown as SalasData).data, salas }
  const aberta = abertaId ? salas.find((s) => s.id === abertaId) ?? null : null

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200)
  }

  return (
    <>
      <SalasListaView
        dados={dados}
        onAbrir={(id) => setAbertaId(id)}
        onNova={() => pushToast('Nova sala (mock) · aparece como coluna na Agenda')}
      />

      {aberta && (
        <SalaDrawer
          key={aberta.id}
          sala={aberta}
          onClose={() => setAbertaId(null)}
          onSalvar={(id, patch) => {
            setSalas((prev) =>
              prev.map((s) => (s.id === id ? { ...s, ativa: patch.ativa, recursos: patch.recursos } : s)),
            )
            const s = salas.find((x) => x.id === id)
            pushToast(`${s?.nome ?? 'Sala'} atualizada`)
            setAbertaId(null)
          }}
        />
      )}

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
