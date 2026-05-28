import { useMemo, useState } from 'react'
import {
  FileText,
  Shield,
  Database,
  Mail,
  Briefcase,
  ChevronRight,
  X,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'
import type {
  HistoricoConsentimentosProps,
  ConsentimentoItem,
  ConsentimentoTipo,
  ConsentimentoFiltro,
  Tema,
} from '@/../product-mobile/sections/historico-consentimentos/types'

// ─── Tokens ──────────────────────────────────────────────────────────────

interface TT {
  bgPage: string
  bgCard: string
  bgInner: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textMuted: string
  border: string
  borderSubtle: string
}

function tokens(tema: Tema): TT {
  if (tema === 'claro') {
    return {
      bgPage: 'bg-stone-50',
      bgCard: 'bg-white',
      bgInner: 'bg-stone-100',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-500',
      textTertiary: 'text-stone-400',
      textMuted: 'text-stone-400',
      border: 'border-stone-200',
      borderSubtle: 'border-stone-200/70',
    }
  }
  return {
    bgPage: 'bg-slate-950',
    bgCard: 'bg-slate-900',
    bgInner: 'bg-slate-950',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-500',
    textTertiary: 'text-slate-400',
    textMuted: 'text-slate-700',
    border: 'border-slate-800',
    borderSubtle: 'border-slate-800/60',
  }
}

const TIPO_META: Record<ConsentimentoTipo, { label: string; icon: LucideIcon; cor: string }> = {
  terms_of_use: { label: 'Termos de Uso', icon: FileText, cor: 'violet' },
  privacy_policy: { label: 'Política de Privacidade', icon: Shield, cor: 'sky' },
  data_processing: { label: 'Tratamento de Dados', icon: Database, cor: 'emerald' },
  marketing: { label: 'Comunicações de Marketing', icon: Mail, cor: 'amber' },
  corporate_followup: { label: 'Acompanhamento Corporativo', icon: Briefcase, cor: 'violet' },
}

const COR_BG: Record<string, string> = {
  violet: 'bg-violet-500/15 text-violet-500 dark:text-violet-300',
  sky: 'bg-sky-500/15 text-sky-500 dark:text-sky-300',
  emerald: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-500 dark:text-amber-300',
  rose: 'bg-rose-500/15 text-rose-500 dark:text-rose-300',
}

const FILTROS: { v: ConsentimentoFiltro; label: string }[] = [
  { v: 'todos', label: 'Todos' },
  { v: 'ativo', label: 'Ativos' },
  { v: 'revogado', label: 'Revogados' },
]

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return `${date} · ${time}`
  } catch {
    return iso
  }
}

// ─────────────────────────────────────────────────────────────────────────

export function HistoricoConsentimentos({
  data,
  onRevogarConsentimento,
  onAbrirTermoCompleto,
  onAbrirExcluirConta,
}: HistoricoConsentimentosProps) {
  const t = tokens(data.tema)
  const [filtro, setFiltro] = useState<ConsentimentoFiltro>('todos')
  const [aberto, setAberto] = useState<ConsentimentoItem | null>(null)
  const [revogando, setRevogando] = useState(false)
  const [confirmacao, setConfirmacao] = useState<ConsentimentoItem | null>(null)

  const ativosCount = data.consentimentos.filter((c) => c.ativo).length
  const revogadosCount = data.consentimentos.length - ativosCount

  const filtrados = useMemo(() => {
    const list = filtro === 'todos'
      ? data.consentimentos
      : data.consentimentos.filter((c) => (filtro === 'ativo' ? c.ativo : !c.ativo))
    return [...list].sort((a, b) => b.aceitoEm.localeCompare(a.aceitoEm))
  }, [data.consentimentos, filtro])

  const handleRevogarConfirmado = async (item: ConsentimentoItem) => {
    setRevogando(true)
    try {
      await onRevogarConsentimento?.(item.id)
      setConfirmacao(null)
      setAberto(null)
    } finally {
      setRevogando(false)
    }
  }

  return (
    <div className={`min-h-full ${t.bgPage} pb-6`}>
      {/* Counter strip */}
      <div className="px-4 pt-3 grid grid-cols-3 gap-2">
        <CounterCard label="Total" valor={data.consentimentos.length} cor="textPrimary" t={t} />
        <CounterCard label="Ativos" valor={ativosCount} cor="emerald" t={t} />
        <CounterCard label="Revogados" valor={revogadosCount} cor="rose" t={t} />
      </div>

      {/* Filtros */}
      <div className="px-4 mt-4">
        <div className={`inline-flex p-1 rounded-xl ${t.bgInner} border ${t.borderSubtle}`}>
          {FILTROS.map((f) => {
            const active = filtro === f.v
            return (
              <button
                key={f.v}
                onClick={() => setFiltro(f.v)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition ${
                  active
                    ? `${t.bgCard} ${t.textPrimary} shadow-sm`
                    : `${t.textSecondary} hover:${t.textPrimary}`
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 mt-3 flex flex-col gap-2">
        {filtrados.length === 0 ? (
          <div className={`${t.bgCard} border ${t.border} rounded-2xl p-6 text-center`}>
            <p className={`text-[13px] ${t.textSecondary}`}>
              {filtro === 'revogado'
                ? 'Você nunca revogou um consentimento'
                : 'Nenhum consentimento registrado'}
            </p>
          </div>
        ) : (
          filtrados.map((item) => {
            const meta = TIPO_META[item.tipo]
            const Icon = meta.icon
            return (
              <button
                key={item.id}
                onClick={() => setAberto(item)}
                className={`w-full ${t.bgCard} border ${t.border} rounded-2xl px-3 py-3 flex items-center gap-3 text-left hover:${t.bgInner} transition`}
              >
                <div className={`w-9 h-9 rounded-xl ${COR_BG[meta.cor]} flex items-center justify-center shrink-0`}>
                  <Icon size={14} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[13px] font-semibold ${t.textPrimary}`}>{meta.label}</span>
                    <span className={`text-[10px] font-mono ${t.textTertiary} px-1.5 py-0.5 rounded-md ${t.bgInner}`}>
                      {item.versao}
                    </span>
                  </div>
                  <div className={`text-[11px] ${t.textSecondary} mt-0.5 flex items-center gap-1.5 flex-wrap`}>
                    <span className="font-mono">{formatDateTime(item.aceitoEm)}</span>
                    <span>·</span>
                    <span>{item.obrigatorio ? 'Obrigatório' : 'Opt-in'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                      item.ativo ? COR_BG.emerald : COR_BG.rose
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${item.ativo ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {item.ativo ? 'Ativo' : 'Revogado'}
                  </span>
                  <ChevronRight size={13} className={t.textTertiary} />
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Modal de detalhe */}
      {aberto && (
        <Modal onClose={() => setAberto(null)}>
          <DetalheConsentimento
            item={aberto}
            t={t}
            onClose={() => setAberto(null)}
            onRevogar={() => setConfirmacao(aberto)}
            onAbrirTermo={() => onAbrirTermoCompleto?.(aberto.tipo, aberto.versao)}
            onAbrirExcluirConta={() => {
              setAberto(null)
              onAbrirExcluirConta?.()
            }}
          />
        </Modal>
      )}

      {/* Modal de confirmação de revogação */}
      {confirmacao && (
        <Modal onClose={() => !revogando && setConfirmacao(null)}>
          <div className={`${t.bgCard} rounded-2xl p-5 flex flex-col gap-3`}>
            <h3 className={`text-base font-semibold ${t.textPrimary}`}>
              Revogar consentimento?
            </h3>
            <p className={`text-[13px] ${t.textSecondary} leading-snug`}>
              Você está revogando "{TIPO_META[confirmacao.tipo].label}". Esta ação fica
              registrada no seu histórico para auditoria LGPD.
            </p>
            <div className="flex gap-2 mt-2">
              <button
                disabled={revogando}
                onClick={() => setConfirmacao(null)}
                className={`flex-1 py-2.5 rounded-xl ${t.bgInner} border ${t.border} ${t.textPrimary} text-[13px] font-semibold transition disabled:opacity-50`}
              >
                Cancelar
              </button>
              <button
                disabled={revogando}
                onClick={() => handleRevogarConfirmado(confirmacao)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold transition disabled:opacity-50"
              >
                {revogando ? 'Revogando…' : 'Revogar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Subcomponentes ──────────────────────────────────────────────────────

function CounterCard({
  label,
  valor,
  cor,
  t,
}: {
  label: string
  valor: number
  cor: 'emerald' | 'rose' | 'textPrimary'
  t: TT
}) {
  const colorClass =
    cor === 'emerald'
      ? 'text-emerald-500 dark:text-emerald-400'
      : cor === 'rose'
        ? 'text-rose-500 dark:text-rose-400'
        : t.textPrimary
  return (
    <div className={`${t.bgCard} border ${t.border} rounded-xl px-3 py-2.5`}>
      <div className={`text-[10px] font-semibold uppercase tracking-wider ${t.textSecondary}`}>
        {label}
      </div>
      <div className={`mt-0.5 text-xl font-semibold tabular-nums ${colorClass}`}>
        {valor}
      </div>
    </div>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function DetalheConsentimento({
  item,
  t,
  onClose,
  onRevogar,
  onAbrirTermo,
  onAbrirExcluirConta,
}: {
  item: ConsentimentoItem
  t: TT
  onClose: () => void
  onRevogar: () => void
  onAbrirTermo: () => void
  onAbrirExcluirConta: () => void
}) {
  const meta = TIPO_META[item.tipo]
  const Icon = meta.icon
  const podeRevogar = item.ativo && !item.obrigatorio

  return (
    <div className={`${t.bgCard} rounded-2xl overflow-hidden`}>
      {/* Header */}
      <div className={`p-5 flex items-center gap-3 border-b ${t.border}`}>
        <div className={`w-12 h-12 rounded-2xl ${COR_BG[meta.cor]} flex items-center justify-center shrink-0`}>
          <Icon size={20} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`text-base font-semibold ${t.textPrimary} leading-tight`}>
            {meta.label}
          </h3>
          <div className={`text-[11px] ${t.textSecondary} mt-0.5 flex items-center gap-1.5`}>
            <span className="font-mono">{item.versao}</span>
            <span>·</span>
            <span>{item.obrigatorio ? 'Obrigatório' : 'Opt-in'}</span>
            <span>·</span>
            <span className={item.ativo ? 'text-emerald-500' : 'text-rose-500'}>
              {item.ativo ? 'Ativo' : 'Revogado'}
            </span>
          </div>
        </div>
        <button onClick={onClose} className={`${t.textTertiary} hover:${t.textPrimary} transition`}>
          <X size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* Stats em grid */}
      <div className={`px-5 py-4 grid grid-cols-2 gap-3 border-b ${t.border}`}>
        <StatField label="Aceito em" value={formatDateTime(item.aceitoEm)} t={t} />
        <StatField
          label="Revogado em"
          value={item.revogadoEm ? formatDateTime(item.revogadoEm) : '—'}
          t={t}
        />
        <StatField label="IP de registro" value={item.ipRegistro ?? '—'} mono t={t} />
        <StatField label="Versão" value={item.versao} mono t={t} />
      </div>

      {/* Preview do termo */}
      <div className="px-5 py-4">
        <div className={`text-[10px] font-semibold uppercase tracking-wider ${t.textSecondary} mb-1.5`}>
          Trecho do termo
        </div>
        <div className={`${t.bgInner} rounded-xl p-3 text-[12px] ${t.textSecondary} leading-snug max-h-[140px] overflow-y-auto`}>
          {item.trechoTermo}
        </div>
        <button
          onClick={onAbrirTermo}
          className="mt-2 inline-flex items-center gap-1 text-[12px] text-sky-500 dark:text-sky-400 hover:underline"
        >
          Ler termo completo
          <ExternalLink size={11} strokeWidth={2.2} />
        </button>
      </div>

      {/* Footer */}
      <div className={`px-5 py-4 border-t ${t.border} flex flex-col gap-2`}>
        {podeRevogar && (
          <button
            onClick={onRevogar}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-semibold transition"
          >
            Revogar consentimento
          </button>
        )}
        {item.ativo && item.obrigatorio && (
          <div className={`${t.bgInner} rounded-xl p-3 flex flex-col gap-1.5`}>
            <p className={`text-[11.5px] ${t.textSecondary} leading-snug`}>
              Este é um consentimento obrigatório para uso da plataforma. Revogar significa
              encerrar a conta.
            </p>
            <button
              onClick={onAbrirExcluirConta}
              className="text-[12px] text-rose-500 dark:text-rose-400 hover:underline self-start"
            >
              Excluir conta →
            </button>
          </div>
        )}
        <button
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl ${t.bgInner} border ${t.border} ${t.textPrimary} text-[13px] font-semibold transition`}
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

function StatField({
  label,
  value,
  mono,
  t,
}: {
  label: string
  value: string
  mono?: boolean
  t: TT
}) {
  return (
    <div>
      <div className={`text-[10px] font-semibold uppercase tracking-wider ${t.textSecondary}`}>
        {label}
      </div>
      <div className={`mt-0.5 text-[12.5px] ${t.textPrimary} ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
    </div>
  )
}
