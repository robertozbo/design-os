import { useState } from 'react'
import data from '@/../product-clinic/sections/exames/data.json'
import type { ExamesData } from '@/../product-clinic/sections/exames/types'
import { ExameDetalheView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function ExameDetalhePreview() {
  const base = data as unknown as ExamesData

  const ids = Object.keys(base.detalhes)
  const outrosIds = ids.map((id) => ({
    id,
    label: `${base.detalhes[id].paciente.nome} · ${base.detalhes[id].tipo}`,
  }))

  const [selectedId, setSelectedId] = useState(ids[0])
  const [confirmados, setConfirmados] = useState<Set<string>>(new Set())
  const [revisados, setRevisados] = useState<Set<string>>(new Set())
  const [toasts, setToasts] = useState<Toast[]>([])

  const exame = base.detalhes[selectedId]

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return (
    <>
      <ExameDetalheView
        exame={exame}
        outrosIds={outrosIds}
        valoresConfirmados={exame.valoresConfirmados || confirmados.has(selectedId)}
        revisado={exame.statusRevisao === 'revisado' || revisados.has(selectedId)}
        onSelecionar={setSelectedId}
        onVoltar={() => pushToast('Protótipo: voltaria para a lista de exames')}
        onConfirmarValores={() => {
          setConfirmados((prev) => new Set(prev).add(selectedId))
          pushToast('Valores confirmados — chancela registrada no prontuário')
        }}
        onMarcarRevisado={() => {
          setRevisados((prev) => new Set(prev).add(selectedId))
          pushToast('Exame marcado como revisado')
        }}
        onCompartilhar={() => pushToast('Protótipo: enviaria um resumo simplificado ao paciente')}
        onImprimir={() => pushToast('Protótipo: geraria o PDF do laudo')}
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
