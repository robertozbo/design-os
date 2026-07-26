import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-medical-clinic/sections/atendimentos/data.json'
import type {
  AtendimentosData,
  Modalidade,
  Periodo,
} from '@/../product-medical-clinic/sections/atendimentos/types'
import { AtendimentosView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
type FiltroMod = 'todas' | Modalidade

export default function AtendimentosPreview() {
  const navigate = useNavigate()
  const base = data as unknown as AtendimentosData

  const [periodo, setPeriodo] = useState<Periodo>(base.periodo)
  const [busca, setBusca] = useState('')
  const [filtroMod, setFiltroMod] = useState<FiltroMod>('todas')
  const [soIA, setSoIA] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return (
    <>
      <AtendimentosView
        dados={{ ...base, periodo }}
        busca={busca}
        filtroMod={filtroMod}
        soIA={soIA}
        onPeriodo={(p) => {
          setPeriodo(p)
          if (p !== base.periodo) pushToast('Protótipo: dados de exemplo são da semana')
        }}
        onBusca={setBusca}
        onFiltroMod={setFiltroMod}
        onToggleIA={() => setSoIA((v) => !v)}
        onAbrir={(a) => {
          pushToast(`Abrindo prontuário de ${a.paciente.nome}`)
          navigate('/medical-clinic/sections/prontuario')
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
