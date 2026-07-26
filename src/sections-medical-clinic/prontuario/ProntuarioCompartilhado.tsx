import { useState } from 'react'
import data from '@/../product-medical-clinic/sections/prontuario/data.json'
import type {
  AcessoAtual,
  AnamneseCompartilhada,
  AuditEvento,
  Evolucao,
  MedicoVinculo,
  PacienteRef,
} from '@/../product-medical-clinic/sections/prontuario/types'
import { ProntuarioView, AuditLogDrawer } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function ProntuarioCompartilhadoPreview() {
  const [auditOpen, setAuditOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  return (
    <>
      <ProntuarioView
        paciente={data.paciente as PacienteRef}
        acessoAtual={data.acessoAtual as AcessoAtual}
        equipeCuidado={data.equipeCuidado as MedicoVinculo[]}
        anamnese={data.anamnese as AnamneseCompartilhada}
        evolucoes={data.evolucoes as Evolucao[]}
        onAbrirAudit={() => setAuditOpen(true)}
        onExportar={() => pushToast('PDF gerado · exportação registrada no log de acesso')}
      />

      <AuditLogDrawer
        open={auditOpen}
        eventos={data.auditLog as AuditEvento[]}
        onClose={() => setAuditOpen(false)}
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
