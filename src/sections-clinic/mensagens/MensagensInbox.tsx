import { useState } from 'react'
import data from '@/../product-clinic/sections/mensagens/data.json'
import type {
  Canal,
  MensagensData,
  Thread,
} from '@/../product-clinic/sections/mensagens/types'
import { MensagensView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let msgSeq = 0

export default function MensagensPreview() {
  const base = data as unknown as MensagensData

  const [canal, setCanal] = useState<Canal>(base.canalPadrao)
  const [threads, setThreads] = useState<Thread[]>(base.threads)
  const [ativaId, setAtivaId] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const threadsCanal = threads.filter((t) => t.canal === canal)
  const threadAtiva = threadsCanal.find((t) => t.id === ativaId) ?? null

  const selecionar = (id: string) => {
    setAtivaId(id)
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, naoLidas: 0 } : t)))
  }

  const enviar = (texto: string) => {
    if (!ativaId) return
    setThreads((prev) =>
      prev.map((t) =>
        t.id === ativaId
          ? {
              ...t,
              ultimaEm: 'agora',
              mensagens: [
                ...t.mensagens,
                {
                  id: `novo-${++msgSeq}`,
                  autor: 'profissional',
                  texto,
                  hora: 'agora',
                  dia: 'Hoje',
                },
              ],
            }
          : t,
      ),
    )
  }

  return (
    <div className="h-[calc(100vh-3.25rem)]">
      <MensagensView
        canal={canal}
        threads={threadsCanal}
        threadAtiva={threadAtiva}
        busca={busca}
        onCanal={(c) => {
          setCanal(c)
          setAtivaId(null)
        }}
        onBusca={setBusca}
        onSelecionar={selecionar}
        onVoltar={() => setAtivaId(null)}
        onEnviar={enviar}
        onAbrirProntuario={(t) =>
          pushToast(`Protótipo: abriria o prontuário de ${t.paciente.nome}`)
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
    </div>
  )
}
