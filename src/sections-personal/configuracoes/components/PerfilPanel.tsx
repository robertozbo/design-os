import { useState } from 'react'
import { Camera, Plus, Save, X } from 'lucide-react'
import type {
  FormacaoItem,
  PerfilProfissional,
} from '@/../product-personal/sections/configuracoes/types'

interface PerfilPanelProps {
  perfil: PerfilProfissional
  onSave?: (perfil: PerfilProfissional) => void
  onUploadAvatar?: () => void
}

const ESPECIALIDADES_OPTIONS = [
  'Hipertrofia',
  'Emagrecimento',
  'Performance',
  'Reabilitação',
  'Idosos',
  'Crianças',
  'Funcional',
  'Crossfit',
  'Pilates',
  'Yoga',
]

const ABORDAGENS_OPTIONS = [
  'Musculação',
  'Treinamento Funcional',
  'Cross Training',
  'HIIT',
  'Calistenia',
  'Personal Online',
]

export function PerfilPanel({
  perfil: perfilInitial,
  onSave,
  onUploadAvatar,
}: PerfilPanelProps) {
  const [perfil, setPerfil] = useState<PerfilProfissional>(perfilInitial)
  const [dirty, setDirty] = useState(false)

  const update = (patch: Partial<PerfilProfissional>) => {
    setPerfil((prev) => ({ ...prev, ...patch }))
    setDirty(true)
  }

  const toggleArr = (arr: string[], value: string): string[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]

  const addFormacao = () => {
    const nova: FormacaoItem = {
      id: `f-${Date.now()}`,
      curso: '',
      instituicao: '',
      ano: new Date().getFullYear(),
    }
    update({ formacao: [...perfil.formacao, nova] })
  }

  const updateFormacao = (id: string, patch: Partial<FormacaoItem>) => {
    update({
      formacao: perfil.formacao.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })
  }

  const removeFormacao = (id: string) => {
    update({ formacao: perfil.formacao.filter((f) => f.id !== id) })
  }

  return (
    <Panel
      title="Perfil profissional"
      footer={
        <button
          type="button"
          onClick={() => {
            onSave?.(perfil)
            setDirty(false)
          }}
          disabled={!dirty}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            dirty
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
          }`}
        >
          <Save size={14} />
          Salvar alterações
        </button>
      }
    >
      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {perfil.avatarUrl ? (
              <img
                src={perfil.avatarUrl}
                alt={perfil.nome}
                className="h-24 w-24 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-2xl font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                {perfil.nome.charAt(0)}
              </div>
            )}
            <button
              type="button"
              onClick={onUploadAvatar}
              aria-label="Trocar foto"
              className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-md ring-2 ring-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:ring-slate-900 dark:hover:bg-white"
            >
              <Camera size={14} />
            </button>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Foto de perfil
            </p>
            <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
              JPG, PNG · até 2 MB · quadrada (1:1) recomendada
            </p>
          </div>
        </div>

        {/* Dados básicos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nome completo">
            <Input
              value={perfil.nome}
              onChange={(v) => update({ nome: v })}
              placeholder="Seu nome"
            />
          </Field>
          <Field label="CREF">
            <Input
              value={perfil.cref}
              onChange={(v) => update({ cref: v })}
              placeholder="000000-G/SP"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={perfil.email}
              onChange={(v) => update({ email: v })}
              placeholder="seu@email.com"
            />
          </Field>
          <Field label="Telefone">
            <Input
              value={perfil.telefone}
              onChange={(v) => update({ telefone: v })}
              placeholder="(11) 99999-9999"
            />
          </Field>
        </div>

        {/* Especialidades */}
        <Field label="Especialidades">
          <ChipsMulti
            options={ESPECIALIDADES_OPTIONS}
            selected={perfil.especialidades}
            onToggle={(v) =>
              update({ especialidades: toggleArr(perfil.especialidades, v) })
            }
          />
        </Field>

        {/* Abordagens */}
        <Field label="Abordagens">
          <ChipsMulti
            options={ABORDAGENS_OPTIONS}
            selected={perfil.abordagens}
            onToggle={(v) =>
              update({ abordagens: toggleArr(perfil.abordagens, v) })
            }
          />
        </Field>

        {/* Bio */}
        <Field label="Bio">
          <textarea
            rows={4}
            value={perfil.bio}
            onChange={(e) => update({ bio: e.target.value })}
            placeholder="Conte sobre sua trajetória, áreas de atuação, abordagem…"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
          />
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {perfil.bio.length} / 500 caracteres
          </p>
        </Field>

        {/* Formação */}
        <Field label="Formação">
          <div className="space-y-2">
            {perfil.formacao.map((f) => (
              <div
                key={f.id}
                className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50/40 p-3 sm:grid-cols-[1fr_1fr_80px_36px] dark:border-slate-800 dark:bg-slate-900/40"
              >
                <Input
                  value={f.curso}
                  onChange={(v) => updateFormacao(f.id, { curso: v })}
                  placeholder="Curso"
                />
                <Input
                  value={f.instituicao}
                  onChange={(v) => updateFormacao(f.id, { instituicao: v })}
                  placeholder="Instituição"
                />
                <Input
                  type="number"
                  value={String(f.ano)}
                  onChange={(v) =>
                    updateFormacao(f.id, { ano: Number(v) || new Date().getFullYear() })
                  }
                  placeholder="Ano"
                />
                <button
                  type="button"
                  onClick={() => removeFormacao(f.id)}
                  aria-label="Remover"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFormacao}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-600 dark:hover:text-teal-400"
            >
              <Plus size={12} />
              Adicionar formação
            </button>
          </div>
        </Field>
      </div>
    </Panel>
  )
}

// ===== Shared =====

export function Panel({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </header>
      <div className="p-6">{children}</div>
      {footer && (
        <footer className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          {footer}
        </footer>
      )}
    </article>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && (
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </label>
  )
}

export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
    />
  )
}

function ChipsMulti({
  options,
  selected,
  onToggle,
}: {
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:ring-teal-800'
                : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
