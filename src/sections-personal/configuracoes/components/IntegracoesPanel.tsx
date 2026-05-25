import {
  Apple,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileText,
  MessageCircle,
  Smartphone,
  Sparkles,
  Watch,
} from 'lucide-react'
import type {
  Integracao,
  IntegracaoStatus,
  PlanoTier,
} from '@/../product-personal/sections/configuracoes/types'
import { Panel } from './PerfilPanel'

interface IntegracoesPanelProps {
  integracoes: Integracao[]
  planoAtual: PlanoTier
  onConectar?: (id: string) => void
  onDesconectar?: (id: string) => void
}

const ICON_MAP: Record<string, React.ElementType> = {
  apple: Apple,
  watch: Watch,
  smartphone: Smartphone,
  'credit-card': CreditCard,
  'message-circle': MessageCircle,
  calendar: Calendar,
  'file-text': FileText,
}

const PLAN_RANK: Record<PlanoTier, number> = { free: 0, plus: 1, pro: 2 }

const STATUS_LABEL: Record<IntegracaoStatus, string> = {
  conectado: 'Conectado',
  disponivel: 'Disponível',
  'em-breve': 'Em breve',
}

export function IntegracoesPanel({
  integracoes,
  planoAtual,
  onConectar,
  onDesconectar,
}: IntegracoesPanelProps) {
  return (
    <Panel
      title="Integrações"
      description="Conecte serviços externos pra ampliar seu fluxo no Nymos"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {integracoes.map((i) => (
          <IntegracaoCard
            key={i.id}
            integracao={i}
            planoAtual={planoAtual}
            onConectar={() => onConectar?.(i.id)}
            onDesconectar={() => onDesconectar?.(i.id)}
          />
        ))}
      </div>
    </Panel>
  )
}

function IntegracaoCard({
  integracao,
  planoAtual,
  onConectar,
  onDesconectar,
}: {
  integracao: Integracao
  planoAtual: PlanoTier
  onConectar: () => void
  onDesconectar: () => void
}) {
  const Icon = ICON_MAP[integracao.iconKey] ?? CreditCard
  const conectado = integracao.status === 'conectado'
  const emBreve = integracao.status === 'em-breve'
  const requerPlanoSuperior =
    integracao.requerPlano &&
    PLAN_RANK[planoAtual] < PLAN_RANK[integracao.requerPlano]

  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border p-4 ${
        conectado
          ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-900/10'
          : emBreve
            ? 'border-slate-200 bg-slate-50/40 opacity-60 dark:border-slate-800 dark:bg-slate-900/40'
            : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <header className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            conectado
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-50">
              {integracao.nome}
            </p>
            {integracao.requerPlano && (
              <span
                className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${
                  integracao.requerPlano === 'pro'
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                    : 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                }`}
              >
                {integracao.requerPlano === 'pro' && <Sparkles size={8} />}
                {integracao.requerPlano}
              </span>
            )}
          </div>
          <p className="mt-1 text-[12px] leading-snug text-slate-500 dark:text-slate-400">
            {integracao.descricao}
          </p>
        </div>
      </header>

      <footer className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <span
          className={`inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
            conectado
              ? 'text-emerald-700 dark:text-emerald-400'
              : emBreve
                ? 'text-slate-400 dark:text-slate-500'
                : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {conectado && <CheckCircle2 size={10} />}
          {STATUS_LABEL[integracao.status]}
          {conectado && integracao.conectadoEm && (
            <span className="ml-1 font-mono tabular-nums text-slate-400 dark:text-slate-500">
              · desde{' '}
              {new Date(integracao.conectadoEm).toLocaleDateString('pt-BR')}
            </span>
          )}
        </span>
        {emBreve ? null : conectado ? (
          <button
            type="button"
            onClick={onDesconectar}
            className="text-[11px] font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
          >
            Desconectar
          </button>
        ) : requerPlanoSuperior ? (
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Requer {integracao.requerPlano}
          </span>
        ) : (
          <button
            type="button"
            onClick={onConectar}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Conectar
          </button>
        )}
      </footer>
    </article>
  )
}
