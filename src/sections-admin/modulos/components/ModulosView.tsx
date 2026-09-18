import { ArrowRight, Package, Users } from 'lucide-react'
import type { Modulo, ModulosProps, StatusModulo } from '@/../product-admin/sections/modulos/types'

const STATUS_META: Record<StatusModulo, { label: string; badge: string }> = {
  ativo: {
    label: 'Ativo',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  beta: { label: 'Beta', badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300' },
  planejado: {
    label: 'Planejado',
    badge: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  },
}

/** Abaixo disso o módulo vende bem e entrega mal — o pior estado, porque o churn é futuro. */
const ADOCAO_MINIMA = 0.6

function reais(v: number): string {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`
}

export function ModulosView({ resumo, modulos, onAbrir, onVerContratantes }: ModulosProps) {
  return (
    <div className="p-6 pl-16 lg:pl-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Módulos</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          O catálogo de add-ons pelo lado de quem vende.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Kpi rotulo="MRR de add-ons" valor={reais(resumo.mrrAddons)} destaque />
        <Kpi
          rotulo="Workspaces com add-on"
          valor={`${resumo.workspacesComAddon} de ${resumo.totalWorkspaces}`}
        />
        <Kpi
          rotulo="Penetração da base"
          valor={pct(resumo.workspacesComAddon / resumo.totalWorkspaces)}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {modulos.map((m) => (
          <Card key={m.id} m={m} onAbrir={onAbrir} onVerContratantes={onVerContratantes} />
        ))}
      </div>
    </div>
  )
}

function Card({
  m,
  onAbrir,
  onVerContratantes,
}: {
  m: Modulo
  onAbrir?: (secao: string) => void
  onVerContratantes?: (id: string) => void
}) {
  const meta = STATUS_META[m.status]
  const planejado = m.status === 'planejado'
  const penetracao = m.elegiveis > 0 ? m.contratantes / m.elegiveis : 0
  const adocao = m.contratantes > 0 ? m.ativos30d / m.contratantes : 0
  const adocaoBaixa = !planejado && adocao < ADOCAO_MINIMA

  return (
    <section
      className={`rounded-2xl border border-slate-200 p-4 dark:border-slate-800 ${
        planejado ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{m.nome}</h2>
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${meta.badge}`}>
              {meta.label}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {m.descricao}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">
            {reais(m.precoMensal)}
            <span className="text-xs font-normal text-slate-400">/mês</span>
          </p>
          {!planejado && (
            <p className="mt-0.5 text-[11px] tabular-nums text-teal-700 dark:text-teal-400">
              {reais(m.precoMensal * m.contratantes)}/mês total
            </p>
          )}
        </div>
      </div>

      {planejado ? (
        // Sem contratante não há penetração nem adoção: zero aqui é ausência de dado, e
        // desenhar duas barras vazias sugeriria um fracasso que não aconteceu.
        <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
          Previsto para {m.previsto}. Sem contratantes — não há adoção a medir ainda.
        </p>
      ) : (
        <div className="mt-3 space-y-2.5">
          <Barra
            rotulo="Penetração"
            detalhe={`${m.contratantes} de ${m.elegiveis} elegíveis`}
            valor={penetracao}
          />
          <Barra
            rotulo="Adoção"
            detalhe={`${m.ativos30d} usaram nos últimos 30 dias`}
            valor={adocao}
            alerta={adocaoBaixa}
          />
          {adocaoBaixa && (
            <p className="text-[11px] leading-relaxed text-amber-600 dark:text-amber-400">
              Vende bem e entrega mal: {m.contratantes - m.ativos30d} contas pagam e não usam. Sai na
              renovação se nada mudar.
            </p>
          )}
        </div>
      )}

      {!planejado && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
          <button
            onClick={() => onVerContratantes?.(m.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Users className="h-3 w-3" /> Ver contratantes
          </button>
          {m.secao && (
            <button
              onClick={() => onAbrir?.(m.secao!)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40"
            >
              Abrir <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </section>
  )
}

function Barra({
  rotulo,
  detalhe,
  valor,
  alerta = false,
}: {
  rotulo: string
  detalhe: string
  valor: number
  alerta?: boolean
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[11px]">
        <span className="text-slate-600 dark:text-slate-300">
          {rotulo} <span className="text-slate-400 dark:text-slate-500">· {detalhe}</span>
        </span>
        <span
          className={`font-medium tabular-nums ${
            alerta ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {pct(valor)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${alerta ? 'bg-amber-500' : 'bg-teal-500'}`}
          style={{ width: `${Math.min(valor * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}

function Kpi({
  rotulo,
  valor,
  destaque = false,
}: {
  rotulo: string
  valor: string
  destaque?: boolean
}) {
  return (
    <div className="rounded-xl border border-slate-200 px-3.5 py-3 dark:border-slate-800">
      <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {rotulo}
      </p>
      <p
        className={`mt-1 text-xl font-semibold tabular-nums ${
          destaque ? 'text-teal-700 dark:text-teal-400' : 'text-slate-900 dark:text-slate-50'
        }`}
      >
        {valor}
      </p>
    </div>
  )
}
