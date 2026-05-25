import { useState } from 'react'
import { Camera, Trash2, FileSignature, Upload } from 'lucide-react'
import type { Perfil } from '@/../product/sections/configura-es-nutri/types'
import { Card, PanelHeader, SaveBar } from './_shared'

interface PerfilPanelProps {
  perfil: Perfil
  ufs: string[]
  onSave?: (perfil: Perfil) => void
  onUploadFoto?: (file: File) => void
  onRemoveFoto?: () => void
  onUploadAssinatura?: (file: File) => void
  onRemoveAssinatura?: () => void
}

export function PerfilPanel({ perfil, ufs, onSave, onRemoveFoto, onRemoveAssinatura }: PerfilPanelProps) {
  const [draft, setDraft] = useState<Perfil>(perfil)

  const dirty =
    draft.nomeCompleto !== perfil.nomeCompleto ||
    draft.email !== perfil.email ||
    draft.telefone !== perfil.telefone ||
    draft.crnNumero !== perfil.crnNumero ||
    draft.crnUf !== perfil.crnUf ||
    draft.bio !== perfil.bio

  const initials = draft.nomeCompleto
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div>
      <PanelHeader
        eyebrow="Perfil"
        title="Identidade profissional"
        description="Como você aparece para seus pacientes e nos planos exportados."
      />

      <div className="space-y-4">
        <Card title="Identidade" description="Foto, nome, contato e registro CRN.">
          <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 ring-1 ring-slate-200 dark:from-teal-900/40 dark:to-emerald-900/40 dark:ring-slate-800">
                  {draft.fotoUrl ? (
                    // We use a real <img> intentionally — no background image so dark mode contrast is clean.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={draft.fotoUrl} alt={draft.nomeCompleto} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold text-teal-700 dark:text-teal-300">
                      {initials || '?'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="
                    inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5
                    text-xs font-medium text-slate-700 hover:bg-slate-50
                    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
                  "
                >
                  <Camera size={12} /> Trocar
                </button>
                <button
                  type="button"
                  onClick={onRemoveFoto}
                  className="
                    inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5
                    text-xs font-medium text-rose-600 hover:bg-rose-50
                    dark:text-rose-400 dark:hover:bg-rose-950/40
                  "
                >
                  <Trash2 size={12} /> Remover
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nome completo" className="sm:col-span-2">
                <input
                  type="text"
                  value={draft.nomeCompleto}
                  onChange={(e) => setDraft((d) => ({ ...d, nomeCompleto: e.target.value }))}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="E-mail">
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Telefone">
                <input
                  type="tel"
                  value={draft.telefone}
                  onChange={(e) => setDraft((d) => ({ ...d, telefone: e.target.value }))}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="CRN — número">
                <input
                  type="text"
                  value={draft.crnNumero}
                  onChange={(e) => setDraft((d) => ({ ...d, crnNumero: e.target.value }))}
                  className={`${INPUT_CLASS} font-mono`}
                />
              </Field>
              <Field label="CRN — UF">
                <select
                  value={draft.crnUf}
                  onChange={(e) => setDraft((d) => ({ ...d, crnUf: e.target.value }))}
                  className={INPUT_CLASS}
                >
                  {ufs.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Bio curta" hint="Aparece no rodapé dos planos exportados" className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={draft.bio}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  className={`${INPUT_CLASS} resize-none`}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Assinatura digital" description="Imagem usada no rodapé dos planos alimentares e relatórios exportados.">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-900/40">
              {draft.assinaturaUrl ? (
                <div className="flex flex-col gap-3">
                  <div className="flex h-24 items-center justify-center rounded-lg bg-white px-6 dark:bg-slate-950">
                    <FileSignature className="text-teal-500" size={32} strokeWidth={1.4} />
                    <div className="ml-4 text-sm">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{draft.nomeCompleto}</p>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        CRN {draft.crnUf} {draft.crnNumero}
                      </p>
                    </div>
                  </div>
                  {draft.assinaturaUploadadaEm && (
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Atualizada em {draft.assinaturaUploadadaEm}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <Upload className="text-slate-400" size={24} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PNG ou JPG transparente · max 1MB
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-end gap-2 sm:items-end">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
              >
                <Upload size={12} />
                {draft.assinaturaUrl ? 'Trocar assinatura' : 'Subir assinatura'}
              </button>
              {draft.assinaturaUrl && (
                <button
                  type="button"
                  onClick={onRemoveAssinatura}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <Trash2 size={12} /> Remover
                </button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <SaveBar
        dirty={dirty}
        onSave={() => onSave?.(draft)}
        onDiscard={() => setDraft(perfil)}
      />
    </div>
  )
}

const INPUT_CLASS = `
  block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
  placeholder:text-slate-400
  focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-600
`

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-500">{hint}</span>
      )}
    </label>
  )
}
