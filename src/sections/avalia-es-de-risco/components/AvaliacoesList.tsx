import { useMemo } from 'react'
import type { AvaliacoesListProps } from '@/../product/sections/avalia-es-de-risco/types'
import { Plus, Search, ClipboardList, Lock } from 'lucide-react'
import { KpiStrip } from './KpiStrip'
import { StatusFilters } from './StatusFilters'
import { AvaliacaoCard } from './AvaliacaoCard'

export function AvaliacoesList({
  empregador,
  kpis,
  avaliacoes,
  filtroAtivo,
  busca,
  onNovaAvaliacao,
  onAbrirAvaliacao,
  onFiltrarStatus,
  onBuscar,
}: AvaliacoesListProps) {
  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return avaliacoes.filter((av) => {
      const matchStatus = filtroAtivo === 'todos' || av.status === filtroAtivo
      const matchBusca =
        termo === '' ||
        av.nome.toLowerCase().includes(termo) ||
        av.instrumentoNome.toLowerCase().includes(termo)
      return matchStatus && matchBusca
    })
  }, [avaliacoes, filtroAtivo, busca])

  /**
   * Lock simultâneo: não permite criar nova avaliação enquanto há outra em aplicação para o mesmo empregador.
   * Invariante operacional alinhada com mercado (Indexmed/Dexmat).
   */
  const avaliacaoEmAplicacao = useMemo(
    () => avaliacoes.find((av) => av.status === 'em_aplicacao'),
    [avaliacoes],
  )
  const lockNova = !!avaliacaoEmAplicacao

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Avaliações de Risco
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {empregador.razaoSocial}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                CNPJ <span className="font-mono">{empregador.cnpj}</span> ·{' '}
                <span className="tabular-nums">{empregador.totalEstabelecimentos}</span> estabelecimentos ·{' '}
                <span className="tabular-nums">{empregador.totalSetores}</span> setores ·{' '}
                <span className="tabular-nums">{empregador.totalTrabalhadores.toLocaleString('pt-BR')}</span> trabalhadores
              </p>
            </div>
            <div className="flex flex-col items-stretch md:items-end gap-1.5">
              <button
                type="button"
                onClick={lockNova ? undefined : onNovaAvaliacao}
                disabled={lockNova}
                title={
                  lockNova
                    ? `Já existe avaliação em aplicação: ${avaliacaoEmAplicacao?.nome}. Encerre antes de criar nova.`
                    : 'Iniciar uma nova avaliação NR-1'
                }
                className={`
                  inline-flex items-center justify-center gap-2
                  px-4 py-2.5 rounded-xl
                  text-white font-medium text-sm
                  transition-colors duration-150
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
                  ${
                    lockNova
                      ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 dark:bg-teal-500 dark:hover:bg-teal-400 shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)] dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]'
                  }
                `}
              >
                {lockNova ? (
                  <Lock className="w-4 h-4" strokeWidth={2.25} />
                ) : (
                  <Plus className="w-4 h-4" strokeWidth={2.25} />
                )}
                {lockNova ? 'Avaliação em aplicação' : 'Nova avaliação'}
              </button>
              {lockNova && (
                <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-tight max-w-[280px] text-right">
                  Lock simultâneo: encerre <span className="font-semibold">{avaliacaoEmAplicacao?.nome}</span> antes de criar nova.
                </p>
              )}
            </div>
          </div>
        </header>

        <div className="mt-7">
          <KpiStrip kpis={kpis} diasAteVigenciaNr1={empregador.diasAteVigenciaNr1} />
        </div>

        <div
          style={{ animationDelay: '420ms' }}
          className="nymos-reveal opacity-0 mt-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
        >
          <StatusFilters ativo={filtroAtivo} kpis={kpis} onChange={onFiltrarStatus} />
          <div className="relative lg:max-w-xs lg:w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
            <input
              type="search"
              value={busca}
              onChange={(e) => onBuscar?.(e.target.value)}
              placeholder="Buscar por nome ou instrumento"
              className="
                w-full pl-9 pr-3 py-2 rounded-xl
                bg-white/80 dark:bg-slate-900/40
                border border-slate-200 dark:border-slate-800
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                text-sm text-slate-700 dark:text-slate-200
                focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                transition
              "
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filtradas.length === 0 ? (
            <EmptyState onNovaAvaliacao={onNovaAvaliacao} />
          ) : (
            filtradas.map((av, idx) => (
              <AvaliacaoCard
                key={av.id}
                avaliacao={av}
                revealIndex={idx + 8}
                onAbrir={() => onAbrirAvaliacao?.(av.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onNovaAvaliacao }: { onNovaAvaliacao?: () => void }) {
  return (
    <div className="
      nymos-reveal opacity-0
      rounded-2xl border border-dashed border-slate-300 dark:border-slate-700
      bg-white/40 dark:bg-slate-900/30
      px-8 py-14
      flex flex-col items-center text-center
    ">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <ClipboardList className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        Nenhuma avaliação neste filtro
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        Ajuste os filtros para ver outras avaliações ou crie uma nova para iniciar a campanha psicossocial.
      </p>
      <button
        type="button"
        onClick={onNovaAvaliacao}
        className="
          mt-5 inline-flex items-center gap-2
          px-3.5 py-2 rounded-xl
          bg-slate-900 hover:bg-slate-800
          dark:bg-slate-100 dark:hover:bg-slate-200
          text-white dark:text-slate-900
          font-medium text-sm
          transition-colors duration-150
        "
      >
        <Plus className="w-4 h-4" strokeWidth={2.25} />
        Nova avaliação
      </button>
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
