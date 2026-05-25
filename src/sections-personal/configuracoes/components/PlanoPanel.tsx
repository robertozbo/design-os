import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  CreditCard,
  Plus,
  Receipt,
  Sparkles,
  Star,
  Trash2,
  X,
  XCircle,
} from 'lucide-react'
import type {
  Cobranca,
  CobrancaStatus,
  MetodoPagamento,
  PlanoConfig,
  PlanoOption,
  PlanoTier,
} from '@/../product-personal/sections/configuracoes/types'
import { Panel } from './PerfilPanel'

interface PlanoPanelProps {
  plano: PlanoConfig
  onTrocarPlano?: (tier: PlanoTier) => void
  onAddMetodoPagamento?: () => void
  onRemoveMetodo?: (id: string) => void
  onMakeMetodoPrincipal?: (id: string) => void
}

const STATUS_TONE: Record<CobrancaStatus, { label: string; tone: string }> = {
  paga: {
    label: 'Paga',
    tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  pendente: {
    label: 'Pendente',
    tone: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  falhou: {
    label: 'Falhou',
    tone: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  },
}

function fmtBRL(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

export function PlanoPanel({
  plano,
  onTrocarPlano,
  onAddMetodoPagamento,
  onRemoveMetodo,
  onMakeMetodoPrincipal,
}: PlanoPanelProps) {
  const planoAtual = plano.opcoes.find((p) => p.tier === plano.atual)!

  return (
    <div className="space-y-5">
      {/* Plano atual */}
      <Panel title="Plano atual">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                  plano.atual === 'pro'
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                    : plano.atual === 'plus'
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {plano.atual === 'pro' && <Sparkles size={10} />}
                {planoAtual.nome}
              </span>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {planoAtual.centavos === 0
                  ? 'Gratuito'
                  : `${fmtBRL(planoAtual.centavos)} / mês`}
              </p>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Você está no plano {planoAtual.nome}
            </h3>
            {plano.proximaCobrancaData && plano.proximaCobrancaCentavos && (
              <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                Próxima cobrança:{' '}
                <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {fmtBRL(plano.proximaCobrancaCentavos)}
                </span>{' '}
                em{' '}
                <span className="font-mono tabular-nums">
                  {new Date(plano.proximaCobrancaData).toLocaleDateString(
                    'pt-BR',
                    { day: '2-digit', month: 'long' },
                  )}
                </span>
              </p>
            )}
          </div>
          {plano.atual !== 'pro' && (
            <button
              type="button"
              onClick={() => onTrocarPlano?.('pro')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-orange-700"
            >
              <Sparkles size={14} />
              Upgrade pra Pro
            </button>
          )}
        </div>

        {/* Features */}
        <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {planoAtual.features.map((f) => (
            <li
              key={f.label}
              className={`flex items-start gap-2 text-[13px] ${
                f.incluido
                  ? 'text-slate-700 dark:text-slate-300'
                  : 'text-slate-400 line-through dark:text-slate-600'
              }`}
            >
              {f.incluido ? (
                <Check
                  size={14}
                  className="mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400"
                />
              ) : (
                <X
                  size={14}
                  className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-700"
                />
              )}
              {f.label}
            </li>
          ))}
        </ul>
      </Panel>

      {/* Comparação dos 3 tiers */}
      <Panel title="Comparar planos">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {plano.opcoes.map((opt) => (
            <PlanoCard
              key={opt.tier}
              opt={opt}
              atual={opt.tier === plano.atual}
              onSelect={() => onTrocarPlano?.(opt.tier)}
            />
          ))}
        </div>
      </Panel>

      {/* Métodos */}
      <Panel
        title="Métodos de pagamento"
        description="Cartões e Pix cadastrados"
      >
        <div className="space-y-2">
          {plano.metodos.map((m) => (
            <MetodoRow
              key={m.id}
              metodo={m}
              onMakePrincipal={() => onMakeMetodoPrincipal?.(m.id)}
              onRemove={() => onRemoveMetodo?.(m.id)}
            />
          ))}
          <button
            type="button"
            onClick={onAddMetodoPagamento}
            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-600 dark:hover:text-teal-400"
          >
            <Plus size={12} />
            Adicionar método de pagamento
          </button>
        </div>
      </Panel>

      {/* Histórico */}
      <Panel
        title="Histórico de cobranças"
        description="Últimas faturas e recibos"
      >
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-[100px_1fr_100px_90px_60px] gap-3 bg-slate-50/60 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
            <div>Data</div>
            <div>Descrição</div>
            <div className="text-right">Valor</div>
            <div>Status</div>
            <div className="text-right">Recibo</div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {plano.historico.map((c) => (
              <CobrancaRow key={c.id} cobranca={c} />
            ))}
          </div>
        </div>
      </Panel>
    </div>
  )
}

function PlanoCard({
  opt,
  atual,
  onSelect,
}: {
  opt: PlanoOption
  atual: boolean
  onSelect: () => void
}) {
  const tom =
    opt.tier === 'pro'
      ? 'border-orange-300 dark:border-orange-700'
      : opt.destaque
        ? 'border-teal-300 dark:border-teal-700'
        : 'border-slate-200 dark:border-slate-800'

  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-5 dark:bg-slate-900 ${tom}`}
    >
      <header className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Plano
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
            {opt.nome}
          </h3>
        </div>
        {opt.destaque && opt.tier !== 'pro' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            <Star size={9} />
            Popular
          </span>
        )}
        {opt.tier === 'pro' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
            <Sparkles size={9} />
            Premium
          </span>
        )}
      </header>

      <div className="mt-3 flex items-baseline gap-1 font-mono">
        <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {opt.centavos === 0 ? 'R$0' : fmtBRL(opt.centavos)}
        </span>
        {opt.centavos > 0 && (
          <span className="text-xs text-slate-400 dark:text-slate-500">/mês</span>
        )}
      </div>

      <ul className="mt-4 flex-1 space-y-1.5">
        {opt.features.map((f) => (
          <li
            key={f.label}
            className={`flex items-start gap-1.5 text-[12px] ${
              f.incluido
                ? 'text-slate-700 dark:text-slate-300'
                : 'text-slate-400 line-through dark:text-slate-600'
            }`}
          >
            {f.incluido ? (
              <Check
                size={12}
                className="mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400"
              />
            ) : (
              <X
                size={12}
                className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-700"
              />
            )}
            {f.label}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        disabled={atual}
        className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          atual
            ? 'cursor-default bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            : opt.tier === 'pro'
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
              : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
        }`}
      >
        {atual ? (
          <>
            <CheckCircle2 size={13} />
            Plano atual
          </>
        ) : (
          <>
            Escolher {opt.nome}
            <ArrowUpRight size={12} />
          </>
        )}
      </button>
    </article>
  )
}

function MetodoRow({
  metodo,
  onMakePrincipal,
  onRemove,
}: {
  metodo: MetodoPagamento
  onMakePrincipal: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <CreditCard size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
          {metodo.rotulo}
          {metodo.ultimosDigitos && (
            <span className="ml-1 font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
              ···· {metodo.ultimosDigitos}
            </span>
          )}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {metodo.tipo === 'cartao' ? `Validade ${metodo.validade}` : 'Pix'}
          {metodo.principal && (
            <>
              {' · '}
              <span className="text-teal-600 dark:text-teal-400">Principal</span>
            </>
          )}
        </p>
      </div>
      {!metodo.principal && (
        <button
          type="button"
          onClick={onMakePrincipal}
          className="text-[11px] font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Tornar principal
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remover"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

function CobrancaRow({ cobranca }: { cobranca: Cobranca }) {
  const tone = STATUS_TONE[cobranca.status]
  return (
    <div className="grid grid-cols-[100px_1fr_100px_90px_60px] items-center gap-3 px-4 py-2.5">
      <p className="font-mono text-[12px] tabular-nums text-slate-500 dark:text-slate-400">
        {new Date(cobranca.data).toLocaleDateString('pt-BR')}
      </p>
      <p className="text-[13px] text-slate-700 dark:text-slate-300">
        {cobranca.descricao}
      </p>
      <p className="text-right font-mono text-[13px] font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {fmtBRL(cobranca.centavos)}
      </p>
      <span
        className={`inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${tone.tone}`}
      >
        {cobranca.status === 'paga' ? (
          <CheckCircle2 size={10} />
        ) : cobranca.status === 'falhou' ? (
          <XCircle size={10} />
        ) : null}
        {tone.label}
      </span>
      <div className="flex justify-end">
        {cobranca.reciboUrl && (
          <a
            href={cobranca.reciboUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Recibo"
            title="Baixar recibo"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/20"
          >
            <Receipt size={12} />
          </a>
        )}
      </div>
    </div>
  )
}
