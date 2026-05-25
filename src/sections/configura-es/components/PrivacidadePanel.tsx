import type {
  ConfigPrivacidade,
  ConfiguracoesProps,
  RetencaoLogs,
  StatusExportacao,
} from '@/../product/sections/configura-es/types'
import {
  CheckCircle2,
  ExternalLink,
  Download,
  Trash2,
  AlertTriangle,
  Archive,
  ScrollText,
} from 'lucide-react'

interface PrivacidadePanelProps {
  privacidade: ConfigPrivacidade
  onChangeRetencaoLogs?: ConfiguracoesProps['onChangeRetencaoLogs']
  onToggleConsentimento?: ConfiguracoesProps['onToggleConsentimento']
  onRequestExport?: ConfiguracoesProps['onRequestExport']
  onDeleteAccountIntent?: ConfiguracoesProps['onDeleteAccountIntent']
}

const RETENCAO_OPTS: {
  value: RetencaoLogs
  label: string
  helper: string
}[] = [
  {
    value: '12_meses',
    label: '12 meses',
    helper: 'Logs deletados após 1 ano. Bom para reduzir superfície de auditoria.',
  },
  {
    value: '24_meses',
    label: '24 meses',
    helper: 'Logs mantidos por 2 anos. Padrão recomendado para empresas médias.',
  },
  {
    value: '5_anos',
    label: '5 anos',
    helper: 'Atende ao prazo legal de auditoria do MTE para conformidade NR-1.',
  },
  {
    value: 'indefinido',
    label: 'Indefinido',
    helper: 'Logs nunca deletados automaticamente. Auditoria completa.',
  },
]

const STATUS_EXPORT: Record<StatusExportacao, { label: string; pill: string }> = {
  pendente: {
    label: 'Em processamento',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
  },
  pronto: {
    label: 'Pronto para download',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
  },
  expirado: {
    label: 'Link expirado',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200/60 dark:ring-slate-700',
  },
}

const DATETIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatDateTime(iso: string): string {
  return DATETIME_FORMATTER.format(new Date(iso))
}

function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso + 'T12:00:00'))
}

export function PrivacidadePanel({
  privacidade,
  onChangeRetencaoLogs,
  onToggleConsentimento,
  onRequestExport,
  onDeleteAccountIntent,
}: PrivacidadePanelProps) {
  return (
    <div className="space-y-3">
      <Card title="Retenção de logs" description="Controla por quanto tempo logs de auditoria são mantidos." icon={<Archive className="w-3.5 h-3.5" strokeWidth={1.75} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {RETENCAO_OPTS.map((opt) => {
            const active = privacidade.retencaoLogs === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChangeRetencaoLogs?.(opt.value)}
                className={`
                  rounded-xl ring-1 px-4 py-3 text-left transition
                  ${
                    active
                      ? 'bg-teal-50 ring-teal-200/70 dark:bg-teal-950/40 dark:ring-teal-900/60'
                      : 'bg-white/60 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`inline-flex items-center justify-center w-4 h-4 rounded-full ring-1 ${
                      active
                        ? 'bg-teal-600 ring-teal-600 text-white'
                        : 'bg-white dark:bg-slate-900 ring-slate-300 dark:ring-slate-700'
                    }`}
                  >
                    {active && <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />}
                  </span>
                  <span
                    className={`text-[14px] font-semibold ${
                      active
                        ? 'text-teal-700 dark:text-teal-300'
                        : 'text-slate-900 dark:text-slate-50'
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {opt.helper}
                </p>
              </button>
            )
          })}
        </div>
      </Card>

      <Card
        title="Consentimentos LGPD"
        description="Você pode revogar consentimentos a qualquer momento."
        icon={<ScrollText className="w-3.5 h-3.5" strokeWidth={1.75} />}
      >
        <div className="space-y-2">
          {privacidade.consentimentos.map((cons) => (
            <div
              key={cons.id}
              className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-4 py-3 flex items-start justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200">
                  {cons.nome}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {cons.descricao}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-500">
                  {cons.aceito && cons.dataAceite && (
                    <span className="font-mono">
                      Aceito em {formatDate(cons.dataAceite)}
                    </span>
                  )}
                  <a
                    className="inline-flex items-center gap-0.5 hover:text-teal-700 dark:hover:text-teal-300 underline underline-offset-2"
                    href={cons.linkTermo}
                  >
                    Ler termo completo
                    <ExternalLink className="w-2.5 h-2.5" strokeWidth={2} />
                  </a>
                </div>
              </div>
              <Toggle
                checked={cons.aceito}
                onChange={(v) => onToggleConsentimento?.(cons.id, v)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Exportação de dados"
        description="Baixe uma cópia de todos os seus dados pessoais. Prazo de 7 dias úteis."
        icon={<Download className="w-3.5 h-3.5" strokeWidth={1.75} />}
      >
        <button
          type="button"
          onClick={onRequestExport}
          className="
            inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl
            bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
            text-white font-medium text-sm transition
          "
        >
          <Download className="w-3.5 h-3.5" strokeWidth={2} />
          Solicitar exportação
        </button>

        {privacidade.exportacoesAnteriores.length > 0 && (
          <div className="mt-4">
            <span className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Exportações anteriores
            </span>
            <div className="space-y-2">
              {privacidade.exportacoesAnteriores.map((exp) => {
                const tone = STATUS_EXPORT[exp.status]
                return (
                  <div
                    key={exp.id}
                    className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3.5 py-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-slate-700 dark:text-slate-300 font-mono">
                        Solicitada em {formatDateTime(exp.solicitadoEm)}
                      </p>
                      {exp.expiraEm && exp.status === 'pronto' && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">
                          Expira em {formatDate(exp.expiraEm)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-md ring-1 text-[10px] font-medium ${tone.pill}`}
                      >
                        {tone.label}
                      </span>
                      {exp.status === 'pronto' && exp.linkDownload && (
                        <a
                          href={exp.linkDownload}
                          className="inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-300 hover:underline underline-offset-2"
                        >
                          <Download className="w-3 h-3" strokeWidth={2} />
                          Baixar
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Card>

      <div className="rounded-2xl ring-2 ring-rose-200 dark:ring-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 px-5 py-5">
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle
            className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400"
            strokeWidth={2}
          />
          <h3 className="text-[14px] font-semibold tracking-tight text-rose-800 dark:text-rose-200">
            Zona de perigo
          </h3>
        </div>
        <p className="text-[12px] text-rose-700/80 dark:text-rose-300/80 leading-snug">
          Excluir sua conta remove todos os dados pessoais associados. Você terá 30 dias para
          reativar antes da exclusão definitiva. Empregadores e relatórios continuam acessíveis para
          outros responsáveis técnicos da equipe.
        </p>
        <button
          type="button"
          onClick={onDeleteAccountIntent}
          className="
            mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl
            bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400
            text-white font-medium text-sm transition
          "
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
          Excluir minha conta
        </button>
      </div>
    </div>
  )
}

function Card({
  title,
  description,
  icon,
  children,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5">
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          {icon && <span className="text-slate-500">{icon}</span>}
          <h3 className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h3>
        </div>
        {description && (
          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`
        relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-150 shrink-0
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
        ${checked ? 'bg-teal-600 dark:bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}
      `}
    >
      <span
        className={`
          inline-block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-150
          ${checked ? 'translate-x-[18px]' : 'translate-x-[3px]'}
        `}
      />
    </button>
  )
}

