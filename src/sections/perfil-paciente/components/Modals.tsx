import { useEffect, useRef, useState } from 'react'
import {
  X,
  Camera,
  Upload,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Trash2,
} from 'lucide-react'
import type {
  ActivityLevel,
  ActivityLevelOption,
  BloodType,
  BloodTypeOption,
  Gender,
  GenderOption,
  PatientProfile,
  UpdateHealthDataPayload,
  UpdatePasswordPayload,
  UpdatePersonalDataPayload,
} from '@/../product/sections/perfil-paciente/types'

// =============================================================================
// Shared modal shell
// =============================================================================

interface ModalShellProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  footer: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: 'md:max-w-md',
  md: 'md:max-w-xl',
  lg: 'md:max-w-2xl',
}

function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: ModalShellProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex max-h-[92vh] w-full ${SIZE_CLASSES[size]} flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 md:rounded-3xl`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="min-w-0">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
          {footer}
        </footer>
      </div>
    </div>
  )
}

// =============================================================================
// Form primitives
// =============================================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  mono?: boolean
}

function Input({ label, hint, mono, className, ...rest }: InputProps) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        {...rest}
        className={`mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 ${mono ? 'font-mono' : ''} ${className ?? ''}`}
      />
      {hint && (
        <span className="mt-1 block text-[11px] text-slate-400 dark:text-slate-500">
          {hint}
        </span>
      )}
    </label>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

function Select({ label, children, className, ...rest }: SelectProps) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <select
        {...rest}
        className={`mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-teal-400 ${className ?? ''}`}
      >
        {children}
      </select>
    </label>
  )
}

function PrimaryButton({
  loading,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  )
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
    />
  )
}

// =============================================================================
// PersonalDataModal
// =============================================================================

interface PersonalDataModalProps {
  open: boolean
  onClose: () => void
  profile: PatientProfile
  genderOptions: GenderOption[]
  onSubmit: (payload: UpdatePersonalDataPayload) => void
  onCepLookup?: (zipCode: string) => void
  isUpdating?: boolean
  isLoadingCep?: boolean
}

export function PersonalDataModal({
  open,
  onClose,
  profile,
  genderOptions,
  onSubmit,
  onCepLookup,
  isUpdating,
  isLoadingCep,
}: PersonalDataModalProps) {
  const [form, setForm] = useState<UpdatePersonalDataPayload>({
    name: profile.name,
    phone: profile.phone,
    birthdate: profile.birthdate,
    bio: profile.bio,
    gender: profile.gender,
    address: profile.address,
    addressNumber: profile.addressNumber,
    addressComplement: profile.addressComplement,
    neighborhood: profile.neighborhood,
    addressCity: profile.addressCity,
    addressState: profile.addressState,
    zipCode: profile.zipCode,
  })

  useEffect(() => {
    if (open) {
      setForm({
        name: profile.name,
        phone: profile.phone,
        birthdate: profile.birthdate,
        bio: profile.bio,
        gender: profile.gender,
        address: profile.address,
        addressNumber: profile.addressNumber,
        addressComplement: profile.addressComplement,
        neighborhood: profile.neighborhood,
        addressCity: profile.addressCity,
        addressState: profile.addressState,
        zipCode: profile.zipCode,
      })
    }
  }, [open, profile])

  function handleZipBlur() {
    const digits = (form.zipCode ?? '').replace(/\D/g, '')
    if (digits.length === 8) onCepLookup?.(digits)
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Editar dados pessoais"
      subtitle="Identidade, contato e endereço"
      size="lg"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton
            loading={isUpdating}
            onClick={() => onSubmit(form)}
          >
            Salvar alterações
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Identidade
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Seu nome"
              required
            />
            <Input
              label="Telefone"
              mono
              value={form.phone ?? ''}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value || null })
              }
              placeholder="+55 11 99999-9999"
              hint="10 a 15 dígitos"
            />
            <Input
              label="Data de nascimento"
              type="date"
              mono
              value={form.birthdate ?? ''}
              onChange={(e) =>
                setForm({ ...form, birthdate: e.target.value || null })
              }
            />
            <Select
              label="Gênero"
              value={form.gender ?? ''}
              onChange={(e) =>
                setForm({ ...form, gender: (e.target.value || null) as Gender | null })
              }
            >
              <option value="">Selecione…</option>
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <label className="mt-4 block">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Bio
            </span>
            <textarea
              value={form.bio ?? ''}
              maxLength={500}
              rows={3}
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value || null })
              }
              className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Conte um pouco sobre você…"
            />
            <span className="mt-1 block text-right text-[11px] text-slate-400">
              {(form.bio ?? '').length} / 500
            </span>
          </label>
        </div>

        <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Endereço
          </p>
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Input
                label="CEP"
                mono
                value={form.zipCode ?? ''}
                onChange={(e) =>
                  setForm({ ...form, zipCode: e.target.value || null })
                }
                onBlur={handleZipBlur}
                placeholder="00000-000"
                maxLength={9}
              />
              {isLoadingCep && (
                <span className="absolute right-3 top-9 inline-flex items-center gap-1.5 text-[11px] font-medium text-teal-600 dark:text-teal-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Buscando endereço…
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">
            <Input
              label="Rua"
              value={form.address ?? ''}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value || null })
              }
              placeholder="Rua, avenida…"
            />
            <Input
              label="Número"
              mono
              value={form.addressNumber ?? ''}
              onChange={(e) =>
                setForm({ ...form, addressNumber: e.target.value || null })
              }
            />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Complemento"
              value={form.addressComplement ?? ''}
              onChange={(e) =>
                setForm({ ...form, addressComplement: e.target.value || null })
              }
              placeholder="Apto, bloco…"
            />
            <Input
              label="Bairro"
              value={form.neighborhood ?? ''}
              onChange={(e) =>
                setForm({ ...form, neighborhood: e.target.value || null })
              }
            />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">
            <Input
              label="Cidade"
              value={form.addressCity ?? ''}
              onChange={(e) =>
                setForm({ ...form, addressCity: e.target.value || null })
              }
            />
            <Input
              label="UF"
              mono
              value={form.addressState ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  addressState: e.target.value.toUpperCase() || null,
                })
              }
              maxLength={2}
              placeholder="SP"
            />
          </div>
        </div>
      </div>
    </ModalShell>
  )
}

// =============================================================================
// HealthModal
// =============================================================================

interface HealthModalProps {
  open: boolean
  onClose: () => void
  profile: PatientProfile
  bloodTypeOptions: BloodTypeOption[]
  activityLevelOptions: ActivityLevelOption[]
  onSubmit: (payload: UpdateHealthDataPayload) => void
  isUpdating?: boolean
}

export function HealthModal({
  open,
  onClose,
  profile,
  bloodTypeOptions,
  activityLevelOptions,
  onSubmit,
  isUpdating,
}: HealthModalProps) {
  const [form, setForm] = useState<UpdateHealthDataPayload>({
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    bloodType: profile.bloodType,
    activityLevel: profile.activityLevel,
    allergies: profile.allergies,
  })
  const [allergyDraft, setAllergyDraft] = useState('')

  useEffect(() => {
    if (open) {
      setForm({
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        bloodType: profile.bloodType,
        activityLevel: profile.activityLevel,
        allergies: profile.allergies,
      })
      setAllergyDraft('')
    }
  }, [open, profile])

  function addAllergy(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return
    if (form.allergies.includes(trimmed)) return
    setForm({ ...form, allergies: [...form.allergies, trimmed] })
  }

  function removeAllergy(value: string) {
    setForm({
      ...form,
      allergies: form.allergies.filter((a) => a !== value),
    })
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Editar dados de saúde"
      subtitle="Dados físicos e alergias"
      size="md"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton
            loading={isUpdating}
            onClick={() => onSubmit(form)}
          >
            Salvar
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Input
            label="Idade"
            type="number"
            min={0}
            max={150}
            mono
            value={form.age ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                age: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            hint="anos"
          />
          <Input
            label="Altura"
            type="number"
            step={0.1}
            mono
            value={form.height ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                height:
                  e.target.value === '' ? null : Number(e.target.value),
              })
            }
            hint="cm"
          />
          <Input
            label="Peso"
            type="number"
            step={0.1}
            mono
            value={form.weight ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                weight:
                  e.target.value === '' ? null : Number(e.target.value),
              })
            }
            hint="kg"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Tipo sanguíneo"
            value={form.bloodType ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                bloodType: (e.target.value || null) as BloodType | null,
              })
            }
          >
            <option value="">Selecione…</option>
            {bloodTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          <Select
            label="Nível de atividade"
            value={form.activityLevel ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                activityLevel:
                  (e.target.value || null) as ActivityLevel | null,
              })
            }
          >
            <option value="">Selecione…</option>
            {activityLevelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        {form.activityLevel && (
          <p className="rounded-xl bg-teal-50 px-3 py-2 text-xs text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
            {
              activityLevelOptions.find(
                (o) => o.value === form.activityLevel,
              )?.description
            }
          </p>
        )}

        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Alergias
          </span>
          <div className="mt-1.5 flex gap-2">
            <input
              value={allergyDraft}
              onChange={(e) => setAllergyDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  addAllergy(allergyDraft)
                  setAllergyDraft('')
                }
              }}
              placeholder="Digite e pressione Enter…"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={() => {
                addAllergy(allergyDraft)
                setAllergyDraft('')
              }}
              className="rounded-xl bg-slate-100 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Adicionar
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {form.allergies.length === 0 ? (
              <span className="text-xs text-slate-400">
                Nenhuma alergia adicionada
              </span>
            ) : (
              form.allergies.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30"
                >
                  {a}
                  <button
                    type="button"
                    onClick={() => removeAllergy(a)}
                    aria-label={`Remover ${a}`}
                    className="rounded-full p-0.5 transition hover:bg-rose-200/60 dark:hover:bg-rose-500/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </ModalShell>
  )
}

// =============================================================================
// PasswordModal
// =============================================================================

interface PasswordModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: UpdatePasswordPayload) => void
  isUpdating?: boolean
}

function getStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  const labels = ['Fraca', 'Fraca', 'Razoável', 'Boa', 'Forte']
  const colors = [
    'bg-rose-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-emerald-500',
  ]
  return { score, label: labels[score], color: colors[score] }
}

export function PasswordModal({
  open,
  onClose,
  onSubmit,
  isUpdating,
}: PasswordModalProps) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (open) {
      setCurrent('')
      setNext('')
      setConfirm('')
      setShowCurrent(false)
      setShowNext(false)
      setShowConfirm(false)
    }
  }, [open])

  const strength = getStrength(next)
  const rules = [
    { label: 'Mínimo 8 caracteres', ok: next.length >= 8 },
    { label: 'Letra minúscula', ok: /[a-z]/.test(next) },
    { label: 'Letra maiúscula', ok: /[A-Z]/.test(next) },
    { label: 'Pelo menos um número', ok: /\d/.test(next) },
  ]
  const mismatch = confirm.length > 0 && confirm !== next
  const valid = rules.every((r) => r.ok) && next === confirm && current.length > 0

  function renderToggle(show: boolean, setShow: (b: boolean) => void) {
    return (
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-9 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Trocar senha"
      subtitle="Use uma senha forte e única"
      size="sm"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton
            loading={isUpdating}
            disabled={!valid}
            onClick={() =>
              onSubmit({ currentPassword: current, newPassword: next })
            }
          >
            Trocar senha
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Senha atual"
            type={showCurrent ? 'text' : 'password'}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
          />
          {renderToggle(showCurrent, setShowCurrent)}
        </div>

        <div className="relative">
          <Input
            label="Nova senha"
            type={showNext ? 'text' : 'password'}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
          />
          {renderToggle(showNext, setShowNext)}
        </div>

        {next.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < strength.score
                      ? strength.color
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
              <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {strength.label}
              </span>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {rules.map((r) => (
                <li
                  key={r.label}
                  className={`flex items-center gap-1.5 text-[11px] font-medium ${
                    r.ok
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <Check
                    className={`h-3 w-3 ${r.ok ? '' : 'opacity-30'}`}
                    strokeWidth={3}
                  />
                  {r.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="relative">
          <Input
            label="Confirmar nova senha"
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          {renderToggle(showConfirm, setShowConfirm)}
        </div>
        {mismatch && (
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
            As senhas não conferem
          </p>
        )}
      </div>
    </ModalShell>
  )
}

// =============================================================================
// AvatarModal
// =============================================================================

interface AvatarModalProps {
  open: boolean
  onClose: () => void
  currentImage: string | null
  fallbackName: string
  onSubmit: (file: File) => void
  isUploading?: boolean
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function AvatarModal({
  open,
  onClose,
  currentImage,
  fallbackName,
  onSubmit,
  isUploading,
}: AvatarModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setFile(null)
      setPreview(null)
    }
  }, [open])

  function handleSelect(selected: File | null) {
    setFile(selected)
    if (!selected) {
      setPreview(null)
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(selected)
  }

  const shown = preview ?? currentImage
  const initials = getInitials(fallbackName)

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Editar foto de perfil"
      subtitle="PNG, JPG ou WEBP até 5MB"
      size="sm"
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton
            loading={isUploading}
            disabled={!file}
            onClick={() => file && onSubmit(file)}
          >
            Salvar foto
          </PrimaryButton>
        </>
      }
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-36 w-36 overflow-hidden rounded-3xl ring-4 ring-teal-500/10">
          {shown ? (
            <img
              src={shown}
              alt="Preview do avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-200 text-4xl font-bold tracking-tight text-teal-800 dark:from-teal-500/20 dark:to-emerald-500/30 dark:text-teal-200">
              {initials}
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
        />

        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-teal-300 bg-teal-50/40 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:border-teal-500 hover:bg-teal-50 dark:border-teal-500/30 dark:bg-teal-500/5 dark:text-teal-300 dark:hover:bg-teal-500/10"
          >
            {preview ? (
              <>
                <Camera className="h-4 w-4" />
                Trocar imagem
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Selecionar arquivo
              </>
            )}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30"
              aria-label="Descartar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Arraste e solte ou clique para escolher.
          <br />
          Formatos aceitos: PNG, JPG, WEBP
        </p>
      </div>
    </ModalShell>
  )
}
