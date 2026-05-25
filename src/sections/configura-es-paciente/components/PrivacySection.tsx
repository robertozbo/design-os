import {
  Share2,
  BarChart3,
  Users,
  Eye,
  Globe,
  Lock,
  FileText,
  Download,
  Clock,
  Trash2,
  ExternalLink,
  AlertOctagon,
  type LucideIcon,
} from 'lucide-react'
import type {
  DataExportRequest,
  LegalDocument,
  PrivacySettings,
  ProfileVisibility,
  ProfileVisibilityOption,
  UpdatePrivacyPayload,
} from '@/../product/sections/configura-es-paciente/types'
import { Toggle } from './Toggle'

interface PrivacySectionProps {
  privacy: PrivacySettings
  profileVisibilityOptions: ProfileVisibilityOption[]
  legalDocuments: LegalDocument[]
  dataExportRequests: DataExportRequest[]
  onChange: (payload: UpdatePrivacyPayload) => void
  onViewLegalDocument?: (id: string) => void
  onRequestExport: () => void
  onDownloadExport?: (exportId: string) => void
  onOpenConsentHistory?: () => void
  onDeleteAccount: () => void
}

const VISIBILITY_ICONS: Record<ProfileVisibility, LucideIcon> = {
  public: Globe,
  friends: Users,
  private: Lock,
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

function formatSize(bytes: number | null): string {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface ConsentRowProps {
  icon: LucideIcon
  title: string
  description: string
  checked: boolean
  onChange: (next: boolean) => void
}

function ConsentRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: ConsentRowProps) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
          checked
            ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div className="pt-1">
        <Toggle checked={checked} onChange={onChange} label={title} />
      </div>
    </div>
  )
}

const EXPORT_STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
  ready: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  expired: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
}

const EXPORT_STATUS_LABELS = {
  pending: 'Processando',
  ready: 'Pronto',
  expired: 'Expirado',
}

export function PrivacySection({
  privacy,
  profileVisibilityOptions,
  legalDocuments,
  dataExportRequests,
  onChange,
  onViewLegalDocument,
  onRequestExport,
  onDownloadExport,
  onOpenConsentHistory,
  onDeleteAccount,
}: PrivacySectionProps) {
  return (
    <div className="space-y-6">
      {/* Consentimentos */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Consentimentos LGPD
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Você controla como seus dados são usados
          </p>
        </header>
        <div className="divide-y divide-slate-100 px-6 dark:divide-slate-800">
          <ConsentRow
            icon={Share2}
            title="Compartilhamento de dados anonimizados"
            description="Permite que dados sem identificação sejam usados em pesquisas de saúde"
            checked={privacy.dataSharing}
            onChange={(dataSharing) => onChange({ dataSharing })}
          />
          <ConsentRow
            icon={BarChart3}
            title="Analytics de uso"
            description="Ajuda a melhorar o app medindo quais features você usa"
            checked={privacy.analytics}
            onChange={(analytics) => onChange({ analytics })}
          />
          <ConsentRow
            icon={Users}
            title="Acesso por terceiros"
            description="Permite integrações com Apple Health, Google Fit, etc."
            checked={privacy.thirdPartyAccess}
            onChange={(thirdPartyAccess) => onChange({ thirdPartyAccess })}
          />
          <div className="flex items-start gap-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
              <Eye className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Visibilidade do perfil
              </p>
              <p className="mt-0.5 mb-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Quem pode ver suas informações
              </p>
              <div className="flex flex-wrap gap-2">
                {profileVisibilityOptions.map((opt) => {
                  const Icon = VISIBILITY_ICONS[opt.value]
                  const active = privacy.profileVisibility === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        onChange({ profileVisibility: opt.value })
                      }
                      className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition ${
                        active
                          ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-500/10'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 ${active ? 'text-teal-700 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400'}`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {opt.label}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 px-6 py-3 dark:border-slate-800">
          <button
            type="button"
            onClick={onOpenConsentHistory}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
          >
            <Clock className="h-3 w-3" />
            Ver histórico de consentimentos
          </button>
        </div>
      </section>

      {/* Documentos legais */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Documentos legais
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Termos e política sempre disponíveis pra consulta
          </p>
        </header>
        <div className="divide-y divide-slate-100 px-6 dark:divide-slate-800">
          {legalDocuments.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onViewLegalDocument?.(doc.id)}
              className="flex w-full items-center gap-4 py-4 text-left transition hover:bg-slate-50/40 -mx-6 px-6 dark:hover:bg-slate-800/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {doc.title}
                  </p>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {doc.version}
                  </span>
                  {doc.requiresReAccept && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
                      Atualizado
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Atualizado em {formatDate(doc.updatedAt)}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          ))}
        </div>
      </section>

      {/* Seus dados */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Seus dados
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Portabilidade LGPD — exportar uma cópia completa
          </p>
        </header>
        <div className="px-6 py-5">
          <div className="flex flex-wrap items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Exportar meus dados
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Receba um arquivo com todas suas informações em até 15 dias
                úteis
              </p>
            </div>
            <button
              type="button"
              onClick={onRequestExport}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700"
            >
              <Download className="h-3.5 w-3.5" />
              Solicitar exportação
            </button>
          </div>

          {dataExportRequests.length > 0 && (
            <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="border-b border-slate-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Histórico de exportações
              </p>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {dataExportRequests.map((req) => (
                  <li
                    key={req.id}
                    className="flex flex-wrap items-center gap-3 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                          {formatDate(req.requestedAt)}
                        </span>
                        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {req.format}
                        </span>
                        {req.fileSizeBytes && (
                          <span className="font-mono text-[11px] text-slate-400">
                            {formatSize(req.fileSizeBytes)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${EXPORT_STATUS_STYLES[req.status]}`}
                    >
                      {EXPORT_STATUS_LABELS[req.status]}
                    </span>
                    {req.status === 'ready' && (
                      <button
                        type="button"
                        onClick={() => onDownloadExport?.(req.id)}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-teal-700 transition hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-500/10"
                      >
                        <Download className="h-3 w-3" />
                        Baixar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Danger zone */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-rose-200 bg-rose-50/30 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/5">
        <header className="flex items-center gap-3 border-b border-rose-200 bg-rose-100/50 px-6 py-4 dark:border-rose-500/30 dark:bg-rose-500/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-200/70 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
            <AlertOctagon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-rose-900 dark:text-rose-100">
              Zona de perigo
            </h2>
            <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
              Ações irreversíveis após o prazo de reativação
            </p>
          </div>
        </header>
        <div className="flex flex-wrap items-start gap-4 px-6 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Excluir minha conta
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Apaga permanentemente todos seus dados, vínculos com profissionais
              e histórico. Você tem 30 dias pra reativar fazendo login.
            </p>
          </div>
          <button
            type="button"
            onClick={onDeleteAccount}
            className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-rose-600/20 transition hover:bg-rose-700"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir conta
          </button>
        </div>
      </section>
    </div>
  )
}
