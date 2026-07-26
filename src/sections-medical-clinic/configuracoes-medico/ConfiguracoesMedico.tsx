import { useState } from 'react'
import data from '@/../product-medical-clinic/sections/configuracoes-medico/data.json'
import type {
  ConfiguracoesMedicoData,
  Tema,
} from '@/../product-medical-clinic/sections/configuracoes-medico/types'
import { ConfiguracoesMedicoView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function ConfiguracoesMedicoPreview() {
  const base = data as unknown as ConfiguracoesMedicoData
  const [dados, setDados] = useState<ConfiguracoesMedicoData>(base)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return (
    <>
      <ConfiguracoesMedicoView
        dados={dados}
        onAlterarSenha={() => pushToast('Fluxo de troca de senha aberto (mock)')}
        onToggle2FA={() => {
          setDados((d) => ({ ...d, conta: { ...d.conta, doisFatores: !d.conta.doisFatores } }))
          pushToast(dados.conta.doisFatores ? '2FA desativado (mock)' : '2FA ativado (mock)')
        }}
        onToggleNotificacao={(evento, canal) => {
          setDados((d) => ({
            ...d,
            notificacoes: d.notificacoes.map((n) =>
              n.id === evento.id ? { ...n, [canal]: !n[canal] } : n,
            ),
          }))
          pushToast(`${evento.titulo} · ${canal === 'email' ? 'e-mail' : 'push'} alternado`)
        }}
        onToggleEscriba={() => {
          setDados((d) => ({
            ...d,
            atendimento: { ...d.atendimento, escribaPadrao: !d.atendimento.escribaPadrao },
          }))
          pushToast('Escriba IA por padrão alternado')
        }}
        onToggleTeleconsulta={() => {
          setDados((d) => ({
            ...d,
            atendimento: { ...d.atendimento, teleconsulta: !d.atendimento.teleconsulta },
          }))
          pushToast('Teleconsulta alternada')
        }}
        onTemplateAnamnese={(value) => {
          setDados((d) => ({ ...d, atendimento: { ...d.atendimento, templateAnamnese: value } }))
          const label = base.atendimento.templatesDisponiveis.find((o) => o.value === value)?.label
          pushToast(`Template de anamnese: ${label ?? value}`)
        }}
        onDuracaoConsulta={(value) => {
          setDados((d) => ({ ...d, atendimento: { ...d.atendimento, duracaoConsulta: value } }))
          pushToast(`Duração padrão: ${value} minutos`)
        }}
        onReconectarMemed={() => pushToast('Reconectando à Memed… (mock)')}
        onToggleAssinatura={() => {
          setDados((d) => ({
            ...d,
            prescricao: { ...d.prescricao, assinaturaAttest: !d.prescricao.assinaturaAttest },
          }))
          pushToast('Assinatura click-to-attest alternada')
        }}
        onToggleGravacao={() => {
          setDados((d) => ({
            ...d,
            privacidade: {
              ...d.privacidade,
              confirmarGravacaoPorConsulta: !d.privacidade.confirmarGravacaoPorConsulta,
            },
          }))
          pushToast('Consentimento de gravação por consulta alternado')
        }}
        onExportarDados={() => pushToast('Exportação de dados iniciada (mock) · você receberá por e-mail')}
        onTema={(t: Tema) => {
          setDados((d) => ({ ...d, tema: t }))
          pushToast(`Tema: ${t} (mock)`)
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
