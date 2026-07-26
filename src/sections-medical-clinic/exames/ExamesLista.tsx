import { useState } from 'react'
import data from '@/../product-medical-clinic/sections/exames/data.json'
import type {
  CategoriaExame,
  ExamesData,
  StatusRevisao,
} from '@/../product-medical-clinic/sections/exames/types'
import { ExamesListaView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
type FiltroTipo = 'todos' | CategoriaExame
type FiltroStatus = 'todos' | StatusRevisao

export default function ExamesListaPreview() {
  const base = data as unknown as ExamesData

  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todos')
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos')
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return (
    <>
      <ExamesListaView
        clinica={base.clinica}
        exames={base.exames}
        busca={busca}
        filtroTipo={filtroTipo}
        filtroStatus={filtroStatus}
        onBusca={setBusca}
        onFiltroTipo={setFiltroTipo}
        onFiltroStatus={setFiltroStatus}
        onAbrir={(e) => {
          if (base.detalhes[e.id]) {
            pushToast(`Protótipo: use a aba "Detalhe" para ver ${e.paciente.nome}`)
          } else {
            pushToast(`Protótipo: detalhe de ${e.paciente.nome} não incluído neste mock`)
          }
        }}
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
