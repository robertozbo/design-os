import { useState } from 'react'
import data from '@/../product-medical-clinic/sections/configuracoes-recepcao/data.json'
import type {
  Antecedencia,
  ConfiguracoesRecepcaoData,
  FormaLink,
  Tema,
  VisaoAgenda,
} from '@/../product-medical-clinic/sections/configuracoes-recepcao/types'
import { ConfiguracoesRecepcaoView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function ConfiguracoesRecepcaoPreview() {
  const base = data as unknown as ConfiguracoesRecepcaoData
  const [dados, setDados] = useState<ConfiguracoesRecepcaoData>(base)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return (
    <>
      <ConfiguracoesRecepcaoView
        dados={dados}
        onAlterarSenha={() => pushToast('Protótipo: fluxo de alteração de senha (mock)')}
        onToggleDoisFatores={() => {
          setDados((d) => {
            const next = !d.conta.doisFatores
            pushToast(next ? '2FA ativado' : '2FA desativado')
            return { ...d, conta: { ...d.conta, doisFatores: next } }
          })
        }}
        onToggleNotificacao={(n) => {
          setDados((d) => ({
            ...d,
            notificacoes: d.notificacoes.map((x) =>
              x.id === n.id ? { ...x, ativa: !x.ativa } : x,
            ),
          }))
          pushToast(`${n.titulo}: ${n.ativa ? 'desativada' : 'ativada'}`)
        }}
        onVisaoAgenda={(v: VisaoAgenda) => {
          setDados((d) => ({ ...d, agenda: { ...d.agenda, visaoPadrao: v } }))
          pushToast(`Visão padrão: ${v === 'medico' ? 'por médico' : 'por sala'}`)
        }}
        onToggleLembrete={() => {
          setDados((d) => {
            const next = !d.agenda.lembreteAtivo
            pushToast(next ? 'Lembrete automático ativado' : 'Lembrete automático desativado')
            return { ...d, agenda: { ...d.agenda, lembreteAtivo: next } }
          })
        }}
        onAntecedencia={(a: Antecedencia) => {
          setDados((d) => ({ ...d, agenda: { ...d.agenda, antecedencia: a } }))
          pushToast(`Antecedência do lembrete: ${a}`)
        }}
        onFormaPadrao={(f: FormaLink) => {
          setDados((d) => ({ ...d, cobranca: { ...d.cobranca, formaPadrao: f } }))
          pushToast(`Forma padrão do link: ${f === 'pix' ? 'PIX' : 'Cartão'}`)
        }}
        onToggleRecibo={() => {
          setDados((d) => {
            const next = !d.cobranca.reciboAutomatico
            pushToast(next ? 'Recibo automático ativado' : 'Recibo automático desativado')
            return { ...d, cobranca: { ...d.cobranca, reciboAutomatico: next } }
          })
        }}
        onTema={(t: Tema) => {
          setDados((d) => ({ ...d, aparencia: { ...d.aparencia, tema: t } }))
          pushToast(`Tema: ${t}`)
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
