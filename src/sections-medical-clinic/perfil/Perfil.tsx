import { useState } from 'react'
import data from '@/../product-medical-clinic/sections/perfil/data.json'
import type { PerfilData } from '@/../product-medical-clinic/sections/perfil/types'
import { PerfilView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function PerfilPreview() {
  const base = data as unknown as PerfilData
  const [bio, setBio] = useState(base.bio)
  const [prefs, setPrefs] = useState(base.preferencias)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return (
    <>
      <PerfilView
        dados={{ ...base, bio, preferencias: prefs }}
        onEditar={() => pushToast('Protótipo: edição do perfil abre aqui (mock)')}
        onBioChange={setBio}
        onSalvarBio={() => pushToast('Bio pública salva (mock) · já visível no app do paciente')}
        onGerenciarCredencial={(id) => {
          const c = base.credenciais.find((x) => x.id === id)
          pushToast(`${c?.nome ?? 'Credencial'} · gerenciar (mock)`)
        }}
        onToggle={(p) => {
          setPrefs((prev) =>
            prev.map((x) => (x.id === p.id ? { ...x, ativo: !x.ativo } : x)),
          )
          pushToast(`${p.label}: ${p.ativo ? 'desligado' : 'ligado'} (mock)`)
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
