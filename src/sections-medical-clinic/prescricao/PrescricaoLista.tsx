import { useState } from 'react'
import data from '@/../product-medical-clinic/sections/prescricao/data.json'
import type {
  FiltroStatus,
  MotivoCancelamento,
  PrescricaoData,
  PrescricaoItem,
} from '@/../product-medical-clinic/sections/prescricao/types'
import {
  CancelamentoModal,
  MemedModal,
  PrescricaoDrawer,
  PrescricaoListaView,
} from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

interface MemedState {
  modo: 'nova' | 'renovacao'
  base: PrescricaoItem | null
}

export default function PrescricaoListaPreview() {
  const base = data as unknown as PrescricaoData

  const [prescricoes, setPrescricoes] = useState<PrescricaoItem[]>(base.prescricoes)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<FiltroStatus>('todas')
  const [drawerId, setDrawerId] = useState<string | null>(null)
  const [memed, setMemed] = useState<MemedState | null>(null)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const drawerPrescricao = prescricoes.find((p) => p.id === drawerId) ?? null
  const cancelPrescricao = prescricoes.find((p) => p.id === cancelId) ?? null

  const confirmarCancelamento = (motivo: MotivoCancelamento, justificativa: string) => {
    if (!cancelId) return
    setPrescricoes((prev) =>
      prev.map((p) =>
        p.id === cancelId
          ? {
              ...p,
              status: 'cancelada',
              canceladaEm: '22 jul 2026',
              canceladaPor: 'Dra. Helena Prado',
              motivoCancelamento: motivo,
              justificativaCancelamento: justificativa.trim() || null,
            }
          : p,
      ),
    )
    setCancelId(null)
    setDrawerId(null)
    pushToast('Prescrição cancelada — registro no audit log')
  }

  return (
    <>
      <PrescricaoListaView
        dados={{ ...base, prescricoes }}
        busca={busca}
        filtro={filtro}
        onBusca={setBusca}
        onFiltro={setFiltro}
        onNova={() => setMemed({ modo: 'nova', base: null })}
        onAbrir={(p) => setDrawerId(p.id)}
        onRenovar={(p) => setMemed({ modo: 'renovacao', base: p })}
      />

      {drawerPrescricao && (
        <PrescricaoDrawer
          p={drawerPrescricao}
          onFechar={() => setDrawerId(null)}
          onRenovar={() => setMemed({ modo: 'renovacao', base: drawerPrescricao })}
          onCancelar={() => setCancelId(drawerPrescricao.id)}
          onAbrirPdf={() => pushToast('Protótipo: abriria o PDF Memed assinado')}
        />
      )}

      {memed && (
        <MemedModal
          modo={memed.modo}
          pacientes={base.pacientes}
          base={memed.base}
          onFechar={() => setMemed(null)}
          onEmitir={(pacienteNome, itens) => {
            setMemed(null)
            pushToast(
              memed.modo === 'renovacao'
                ? `Renovação emitida para ${pacienteNome} · enviada ao app`
                : `Prescrição emitida para ${pacienteNome} (${itens} item${itens === 1 ? '' : 's'}) · enviada ao app`,
            )
          }}
        />
      )}

      {cancelPrescricao && (
        <CancelamentoModal
          pacienteNome={cancelPrescricao.paciente.nome}
          onConfirmar={confirmarCancelamento}
          onFechar={() => setCancelId(null)}
        />
      )}

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
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
