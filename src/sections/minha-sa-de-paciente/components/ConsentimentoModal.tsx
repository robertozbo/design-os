import { useState } from 'react'
import { Lock, Shield, X } from 'lucide-react'
import type { EscopoConsentimento } from '@/../product/sections/minha-sa-de-paciente/types'

interface ConsentimentoModalProps {
  open: boolean
  versaoTermo: string
  requiredScopes: EscopoConsentimento[]
  optionalScopes?: EscopoConsentimento[]
  privacyPolicyHref?: string
  onAccept: (scopes: EscopoConsentimento[]) => void
  onCancel: () => void
}

const SCOPE_LABEL: Record<EscopoConsentimento, string> = {
  analise_visual: 'Análise visual das fotos',
  projecao_ia: 'Geração de imagem projetada por IA',
  armazenamento: 'Armazenamento das fotos por até 5 anos',
  export_profissional: 'Compartilhamento com profissional vinculado',
}

const SCOPE_DESCRIPTION: Record<EscopoConsentimento, string> = {
  analise_visual:
    'A IA analisa pontos de gordura, postura e simetria a partir das fotos enviadas',
  projecao_ia:
    'Gera uma imagem estimativa do seu corpo ao atingir a meta, preservando identidade',
  armazenamento: 'Suas fotos ficam criptografadas e privadas, podem ser apagadas a qualquer momento',
  export_profissional: 'Permite que o profissional vinculado veja análise e fotos',
}

export function ConsentimentoModal({
  open,
  versaoTermo,
  requiredScopes,
  optionalScopes = [],
  privacyPolicyHref = '/legal/privacy',
  onAccept,
  onCancel,
}: ConsentimentoModalProps) {
  const [selectedOptional, setSelectedOptional] = useState<Set<EscopoConsentimento>>(
    new Set(),
  )

  if (!open) return null

  function toggleOptional(scope: EscopoConsentimento) {
    setSelectedOptional((prev) => {
      const next = new Set(prev)
      if (next.has(scope)) next.delete(scope)
      else next.add(scope)
      return next
    })
  }

  function handleAccept() {
    onAccept([...requiredScopes, ...selectedOptional])
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consentimento-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400">
              <Shield className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2
                id="consentimento-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Consentimento de análise
              </h2>
              <p className="mt-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                Termo {versaoTermo}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fechar"
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Para gerar esta análise precisamos do seu aceite explícito para os
            itens abaixo. Você pode revogar a qualquer momento nas
            configurações.
          </p>

          {/* Required scopes */}
          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Obrigatório
            </h3>
            <ul className="space-y-2">
              {requiredScopes.map((scope) => (
                <li
                  key={scope}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
                >
                  <Lock
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400"
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {SCOPE_LABEL[scope]}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      {SCOPE_DESCRIPTION[scope]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Optional scopes */}
          {optionalScopes.length > 0 && (
            <section>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Opcional
              </h3>
              <ul className="space-y-2">
                {optionalScopes.map((scope) => (
                  <li key={scope}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-teal-500 dark:border-slate-800 dark:hover:border-teal-400">
                      <input
                        type="checkbox"
                        checked={selectedOptional.has(scope)}
                        onChange={() => toggleOptional(scope)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-500 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {SCOPE_LABEL[scope]}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                          {SCOPE_DESCRIPTION[scope]}
                        </p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Suas fotos e dados são criptografados em repouso e em trânsito,
            tratados como dados sensíveis sob a LGPD.{' '}
            <a
              href={privacyPolicyHref}
              className="text-teal-600 underline-offset-2 hover:underline dark:text-teal-400"
            >
              Política de privacidade
            </a>
            .
          </p>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600"
          >
            Aceitar e continuar
          </button>
        </footer>
      </div>
    </div>
  )
}
