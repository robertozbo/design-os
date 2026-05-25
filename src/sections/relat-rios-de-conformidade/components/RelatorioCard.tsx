import { useState } from 'react'
import type {
  Relatorio,
  StatusRelatorio,
} from '@/../product/sections/relat-rios-de-conformidade/types'
import {
  Download,
  Link as LinkIcon,
  RefreshCw,
  Archive,
  Send,
  ShieldCheck,
  AlertTriangle,
  CalendarRange,
  Activity,
  Clock,
  FileText,
  MoreHorizontal,
  History,
  Hash,
} from 'lucide-react'

interface RelatorioCardProps {
  relatorio: Relatorio
  revealIndex?: number
  onSelect?: () => void
  onDownload?: () => void
  onCopyShareLink?: () => void
  onReemitir?: () => void
  onArchive?: () => void
  onMarkEnviadoMte?: () => void
}

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return `${DATE_FORMATTER.format(date)} · ${TIME_FORMATTER.format(date)}`
}

const STATUS_TONE: Record<
  StatusRelatorio,
  { label: string; pill: string; dot: string; icon: React.ReactNode }
> = {
  gerado: {
    label: 'Gerado',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
    dot: 'bg-emerald-500',
    icon: <FileText className="w-3 h-3" strokeWidth={2} />,
  },
  enviado_mte: {
    label: 'Enviado ao MTE',
    pill: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/50',
    dot: 'bg-violet-500',
    icon: <Send className="w-3 h-3" strokeWidth={2} />,
  },
  arquivado: {
    label: 'Arquivado',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200/60 dark:ring-slate-700',
    dot: 'bg-slate-400 dark:bg-slate-500',
    icon: <Archive className="w-3 h-3" strokeWidth={2} />,
  },
}

function avatarInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  return (first + last).toUpperCase()
}

export function RelatorioCard({
  relatorio,
  revealIndex = 0,
  onSelect,
  onDownload,
  onCopyShareLink,
  onReemitir,
  onArchive,
  onMarkEnviadoMte,
}: RelatorioCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const status = STATUS_TONE[relatorio.status]
  const hashShort = `${relatorio.hashSha256.slice(0, 8)}…${relatorio.hashSha256.slice(-6)}`
  const isReemissao = !!relatorio.reemissaoDe
  const isCoberturaBaixa = relatorio.metricasCapa.coberturaFinalPct < 65

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.()
        }
      }}
      style={{ animationDelay: `${50 * revealIndex}ms` }}
      className={`
        nymos-reveal opacity-0
        group relative cursor-pointer
        rounded-2xl bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        ${relatorio.status === 'arquivado' ? 'opacity-80' : ''}
        hover:border-teal-300 dark:hover:border-teal-700
        hover:shadow-[0_4px_20px_-8px_rgba(15,118,110,0.25)]
        dark:hover:shadow-[0_4px_20px_-8px_rgba(20,184,166,0.35)]
        transition-all duration-200
        p-5
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[10px] font-medium ${status.pill}`}
            >
              {status.icon}
              {status.label}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-1 ring-teal-200/60 dark:ring-teal-900/60 text-[10px] font-medium">
              <CalendarRange className="w-3 h-3" strokeWidth={2} />
              Ciclo {relatorio.ciclo}
            </span>
            {isReemissao && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-1 ring-amber-200/60 dark:ring-amber-900/50 text-[10px] font-medium">
                <RefreshCw className="w-3 h-3" strokeWidth={2} />
                Reemissão
              </span>
            )}
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-snug">
            {relatorio.nome}
          </h3>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-mono text-[10px] uppercase tracking-wider">
              {relatorio.avaliacaoOrigem.instrumentoSigla}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="truncate">{relatorio.avaliacaoOrigem.nome}</span>
          </p>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((v) => !v)
            }}
            className="
              inline-flex items-center justify-center w-7 h-7 rounded-lg
              text-slate-500 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            "
            aria-label="Mais ações"
          >
            <MoreHorizontal className="w-4 h-4" strokeWidth={1.75} />
          </button>
          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen(false)
                }}
                className="fixed inset-0 z-30 cursor-default"
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="
                  absolute right-0 top-full mt-1 z-40
                  w-[200px] rounded-xl
                  bg-white dark:bg-slate-950
                  ring-1 ring-slate-200/80 dark:ring-slate-800
                  shadow-[0_12px_32px_-12px_rgba(15,23,42,0.25)]
                  py-1
                "
              >
                {relatorio.status === 'gerado' && (
                  <MenuItem
                    icon={<Send className="w-3.5 h-3.5" strokeWidth={1.75} />}
                    label="Marcar enviado ao MTE"
                    onClick={() => {
                      onMarkEnviadoMte?.()
                      setMenuOpen(false)
                    }}
                  />
                )}
                <MenuItem
                  icon={<RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />}
                  label="Reemitir"
                  onClick={() => {
                    onReemitir?.()
                    setMenuOpen(false)
                  }}
                />
                {relatorio.status !== 'arquivado' && (
                  <MenuItem
                    icon={<Archive className="w-3.5 h-3.5" strokeWidth={1.75} />}
                    label="Arquivar"
                    danger
                    onClick={() => {
                      onArchive?.()
                      setMenuOpen(false)
                    }}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat
          icon={<Activity className="w-3 h-3" strokeWidth={1.75} />}
          label="Cobertura"
          value={`${relatorio.metricasCapa.coberturaFinalPct}%`}
          alert={isCoberturaBaixa}
        />
        <Stat
          icon={<AlertTriangle className="w-3 h-3" strokeWidth={1.75} />}
          label="Críticos"
          value={String(relatorio.metricasCapa.fatoresCriticos)}
          alert={relatorio.metricasCapa.fatoresCriticos > 3}
        />
        <Stat
          icon={<FileText className="w-3 h-3" strokeWidth={1.75} />}
          label="Ações"
          value={String(relatorio.metricasCapa.acoesPropostas)}
        />
        <Stat
          icon={<FileText className="w-3 h-3" strokeWidth={1.75} />}
          label="Páginas"
          value={String(relatorio.metricasCapa.totalPaginas)}
          mono
        />
      </div>

      <div className="mt-3 flex items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-[9px] font-mono font-semibold shrink-0">
          {avatarInitials(relatorio.responsavelTecnico.nome)}
        </span>
        <div className="min-w-0">
          <p className="text-slate-700 dark:text-slate-200 font-medium truncate">
            {relatorio.responsavelTecnico.nome}
          </p>
          <p className="font-mono text-[10px] truncate">{relatorio.responsavelTecnico.registro}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
        <div
          className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-500"
          title={`SHA-256: ${relatorio.hashSha256}`}
        >
          <Hash className="w-3 h-3 shrink-0" strokeWidth={1.75} />
          <span className="font-mono">{hashShort}</span>
          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-500">
          <Clock className="w-3 h-3 shrink-0" strokeWidth={1.75} />
          <span className="font-mono">{formatDateTime(relatorio.geradoEm)}</span>
        </div>
        {isReemissao && (
          <div className="inline-flex items-center gap-1.5 text-[10px] text-amber-700 dark:text-amber-300">
            <History className="w-3 h-3 shrink-0" strokeWidth={1.75} />
            <span>
              Reemissão de <span className="font-mono">{relatorio.reemissaoDe}</span>
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDownload?.()
          }}
          className="
            flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
            bg-teal-600 hover:bg-teal-700 active:bg-teal-800
            dark:bg-teal-500 dark:hover:bg-teal-400
            text-white font-medium text-[12px]
            shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
            dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
            transition
          "
        >
          <Download className="w-3.5 h-3.5" strokeWidth={2} />
          Download PDF
        </button>
        {relatorio.linkCompartilhavel && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onCopyShareLink?.()
            }}
            title={`Link expira em ${relatorio.linkCompartilhavel.expiraEm}`}
            className="
              inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              hover:bg-slate-50 dark:hover:bg-slate-800/60
              text-slate-700 dark:text-slate-200 font-medium text-[12px]
              transition
            "
          >
            <LinkIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
            Copiar link
          </button>
        )}
      </div>
    </div>
  )
}

function Stat({
  icon,
  label,
  value,
  mono,
  alert,
}: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
  alert?: boolean
}) {
  return (
    <div
      className={`
        rounded-xl ring-1 px-3 py-2
        ${
          alert
            ? 'bg-amber-50/60 dark:bg-amber-950/20 ring-amber-200/60 dark:ring-amber-900/40'
            : 'bg-slate-50/70 dark:bg-slate-800/40 ring-slate-200/60 dark:ring-slate-800'
        }
      `}
    >
      <span
        className={`
          inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] font-semibold
          ${alert ? 'text-amber-700 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'}
        `}
      >
        {icon}
        {label}
      </span>
      <p
        className={`
          mt-0.5 text-[14px] font-semibold tracking-tight tabular-nums
          ${alert ? 'text-amber-800 dark:text-amber-200' : 'text-slate-900 dark:text-slate-50'}
          ${mono ? 'font-mono' : ''}
        `}
      >
        {value}
      </p>
    </div>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium
        transition
        ${
          danger
            ? 'text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
        }
      `}
    >
      {icon}
      {label}
    </button>
  )
}
