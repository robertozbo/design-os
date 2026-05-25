import {
  Archive,
  Calendar,
  Cake,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Unlink,
  User,
} from 'lucide-react'
import type {
  PerfilAction,
  PerfilData,
  PermissaoPaciente,
} from '@/../product/sections/pacientes/types'

interface PerfilTabProps {
  data: PerfilData
  onTogglePermissao?: (id: string, enabled: boolean) => void
  onSaveNotas?: (notas: string) => void
  onPerfilAction?: (id: string) => void
}

const ACTION_ICON: Record<string, typeof Archive> = {
  archive: Archive,
  unlink: Unlink,
  export: Download,
}

export function PerfilTab({ data, onTogglePermissao, onSaveNotas, onPerfilAction }: PerfilTabProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Left col 2/3 — dados, permissões, notas */}
      <div className="space-y-5 lg:col-span-2">
        {/* Dados pessoais */}
        <Card title="Dados pessoais" icon={<User size={14} />}>
          <div className="grid gap-3 sm:grid-cols-2">
            <DataRow icon={<Mail size={12} />} label="Email" value={data.dadosPessoais.email} />
            <DataRow icon={<Phone size={12} />} label="Telefone" value={data.dadosPessoais.telefone} />
            <DataRow
              icon={<Cake size={12} />}
              label="Data de nascimento"
              value={formatDate(data.dadosPessoais.dataNascimento)}
            />
            <DataRow icon={<User size={12} />} label="Gênero" value={data.dadosPessoais.genero} />
            <DataRow
              icon={<MapPin size={12} />}
              label="Endereço"
              value={data.dadosPessoais.endereco}
              fullWidth
            />
          </div>
        </Card>

        {/* Permissões granulares */}
        <Card
          title="Permissões do paciente"
          subtitle="Controla o que ele pode fazer no app — herda dos padrões em Configurações"
          icon={<Smartphone size={14} />}
        >
          <div className="space-y-2">
            {data.permissoes.map((p) => (
              <PermissaoToggle
                key={p.id}
                permissao={p}
                onToggle={(enabled) => onTogglePermissao?.(p.id, enabled)}
              />
            ))}
          </div>
        </Card>

        {/* Notas privadas */}
        <Card
          title="Notas privadas"
          subtitle="Visíveis só pra você — paciente não vê"
          icon={<FileText size={14} />}
        >
          <textarea
            defaultValue={data.notas}
            onBlur={(e) => onSaveNotas?.(e.target.value)}
            rows={5}
            placeholder="Escreva observações privadas sobre o paciente…"
            className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/40 p-3 text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
          />
        </Card>
      </div>

      {/* Right col 1/3 — vinculação + ações */}
      <div className="space-y-5">
        <Card title="Vinculação ao app" icon={<Smartphone size={14} />}>
          <div className="space-y-3">
            <VinculacaoRow label="Status" value={vinculacaoLabel(data.vinculacao.status)} highlight />
            {data.vinculacao.codigoUsado && (
              <VinculacaoRow
                label="Código usado"
                value={data.vinculacao.codigoUsado}
                mono
              />
            )}
            {data.vinculacao.vinculadoEm && (
              <VinculacaoRow
                label="Vinculado em"
                value={formatDateTime(data.vinculacao.vinculadoEm)}
              />
            )}
            {data.vinculacao.dispositivo && (
              <VinculacaoRow label="Dispositivo" value={data.vinculacao.dispositivo} />
            )}
            {data.vinculacao.ultimaAtividade && (
              <VinculacaoRow
                label="Última atividade"
                value={formatDateTime(data.vinculacao.ultimaAtividade)}
              />
            )}
          </div>
        </Card>

        {/* Ações */}
        <Card title="Ações">
          <div className="space-y-2">
            {data.actions.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                onClick={() => onPerfilAction?.(action.id)}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ===== Sub components =====

function Card({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {icon && <span className="text-slate-400">{icon}</span>}
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </header>
      <div className="mt-4">{children}</div>
    </article>
  )
}

function DataRow({
  icon,
  label,
  value,
  fullWidth,
}: {
  icon: React.ReactNode
  label: string
  value: string
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span className="text-slate-400">{icon}</span>
        {label}
      </p>
      <p className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  )
}

function PermissaoToggle({
  permissao,
  onToggle,
}: {
  permissao: PermissaoPaciente
  onToggle?: (enabled: boolean) => void
}) {
  return (
    <label className="group flex cursor-pointer items-start justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/60">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {permissao.label}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
          {permissao.description}
        </p>
      </div>
      <Switch checked={permissao.enabled} onChange={(e) => onToggle?.(e.target.checked)} />
    </label>
  )
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <span className="relative mt-0.5 inline-flex shrink-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
      <span
        className={`block h-5 w-9 rounded-full transition-colors ${
          checked
            ? 'bg-teal-500'
            : 'bg-slate-300 dark:bg-slate-700'
        }`}
      />
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </span>
  )
}

function VinculacaoRow({
  label,
  value,
  highlight,
  mono,
}: {
  label: string
  value: string
  highlight?: boolean
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span
        className={`text-right ${
          mono ? 'font-mono tabular-nums' : ''
        } ${
          highlight
            ? 'font-semibold text-emerald-700 dark:text-emerald-400'
            : 'text-slate-900 dark:text-slate-100'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function ActionButton({
  action,
  onClick,
}: {
  action: PerfilAction
  onClick?: () => void
}) {
  const Icon = ACTION_ICON[action.id] ?? Calendar
  const tone =
    action.tone === 'destructive'
      ? 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20'
      : action.tone === 'warning'
      ? 'border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20'
      : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium transition-colors dark:bg-slate-900 ${tone}`}
    >
      <Icon size={14} />
      {action.label}
    </button>
  )
}

function vinculacaoLabel(status: string) {
  if (status === 'vinculado') return 'Ativo'
  if (status === 'pendente') return 'Pendente'
  if (status === 'arquivado') return 'Arquivado'
  return status
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}
