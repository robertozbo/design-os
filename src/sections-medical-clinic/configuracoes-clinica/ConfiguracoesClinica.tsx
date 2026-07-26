import { useState } from 'react'
import data from '@/../product-medical-clinic/sections/configuracoes-clinica/data.json'
import type {
  ConfiguracoesClinicaData,
  Integracao,
} from '@/../product-medical-clinic/sections/configuracoes-clinica/types'
import { ConfiguracoesClinicaView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function ConfiguracoesClinicaPreview() {
  const base = data as unknown as ConfiguracoesClinicaData
  const [integracoes, setIntegracoes] = useState<Integracao[]>(base.integracoes)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const toggleIntegracao = (alvo: Integracao) => {
    if (alvo.indisponivel) {
      pushToast(`${alvo.nome} chega no V2 — em breve`)
      return
    }
    setIntegracoes((prev) =>
      prev.map((i) => (i.id === alvo.id ? { ...i, ativa: !i.ativa } : i)),
    )
    pushToast(`${alvo.nome} ${alvo.ativa ? 'desativada' : 'ativada'} (mock)`)
  }

  return (
    <>
      <ConfiguracoesClinicaView
        dados={{ ...base, integracoes }}
        onSalvarDados={() => pushToast('Dados da clínica salvos (mock)')}
        onGerenciarPlano={() => pushToast('Gerenciar plano · fluxo de billing (mock)')}
        onToggleIntegracao={toggleIntegracao}
        onVerTermo={(c) => pushToast(`Termo "${c.titulo}" ${c.versao} (detalhe mock)`)}
        onVerAuditoria={() => pushToast('Audit log completo (mock)')}
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
