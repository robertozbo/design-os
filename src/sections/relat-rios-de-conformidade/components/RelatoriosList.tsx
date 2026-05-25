import { useMemo } from 'react'
import type {
  FiltrosRelatorios,
  Ordenacao,
  Relatorio,
  RelatoriosProps,
} from '@/../product/sections/relat-rios-de-conformidade/types'
import {
  Plus,
  Search,
  ArrowDownNarrowWide,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { StatusTabs } from './StatusTabs'
import { RelatorioCard } from './RelatorioCard'

const ORDENACOES: { value: Ordenacao; label: string }[] = [
  { value: 'mais_recente', label: 'Mais recentes' },
  { value: 'alfabetica', label: 'Alfabética (A → Z)' },
  { value: 'ciclo', label: 'Por ciclo NR-1' },
]

function ordenar(arr: Relatorio[], ord: Ordenacao): Relatorio[] {
  const out = [...arr]
  switch (ord) {
    case 'mais_recente':
      return out.sort((a, b) => b.geradoEm.localeCompare(a.geradoEm))
    case 'alfabetica':
      return out.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    case 'ciclo':
      return out.sort((a, b) => b.ciclo.localeCompare(a.ciclo))
  }
}

export function RelatoriosList({
  empregadorContexto,
  agregado,
  ciclosDisponiveis,
  filtrosAtuais,
  relatorios,
  onFiltrosChange,
  onNavigateToNovo,
  onSelectRelatorio,
  onDownload,
  onCopyShareLink,
  onReemitir,
  onArchive,
  onMarkEnviadoMte,
}: RelatoriosProps) {
  const filtros = filtrosAtuais
  const setFiltros = (next: FiltrosRelatorios) => onFiltrosChange?.(next)

  const filtradosOrdenados = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    const filtered = relatorios.filter((r) => {
      if (filtros.status !== 'todos' && r.status !== filtros.status) return false
      if (filtros.ciclo !== 'todos' && r.ciclo !== filtros.ciclo) return false
      if (termo) {
        const haystack = `${r.nome} ${r.hashSha256} ${r.responsavelTecnico.nome} ${r.avaliacaoOrigem.nome}`.toLowerCase()
        if (!haystack.includes(termo)) return false
      }
      return true
    })
    return ordenar(filtered, filtros.ordenacao)
  }, [relatorios, filtros])

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
        <div
          className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap"
          aria-label="Trilha"
        >
          <span className="text-teal-600 dark:text-teal-400 font-medium">Empregadores</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">
            {empregadorContexto.nomeFantasia}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400">Relatórios de Conformidade</span>
        </div>

        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Relatórios oficiais NR-1
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Relatórios de Conformidade
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {empregadorContexto.razaoSocial} · CNPJ{' '}
                <span className="font-mono">{empregadorContexto.cnpj}</span>
              </p>
              <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                <span className="tabular-nums">{agregado.totalGerados}</span> gerados ·{' '}
                <span className="tabular-nums">{agregado.totalEnviadosMte}</span> enviados ao MTE ·{' '}
                <span className="tabular-nums">{agregado.totalArquivados}</span> arquivados
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToNovo}
              className="
                inline-flex items-center justify-center gap-2
                px-4 py-2.5 rounded-xl
                bg-teal-600 hover:bg-teal-700 active:bg-teal-800
                dark:bg-teal-500 dark:hover:bg-teal-400
                text-white font-medium text-sm
                shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
                dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
                transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
              "
            >
              <Plus className="w-4 h-4" strokeWidth={2.25} />
              Novo relatório
            </button>
          </div>
        </header>

        <div
          style={{ animationDelay: '420ms' }}
          className="nymos-reveal opacity-0 mt-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
        >
          <StatusTabs
            ativo={filtros.status}
            agregado={agregado}
            onChange={(status) => setFiltros({ ...filtros, status })}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 lg:max-w-xs lg:w-[280px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                strokeWidth={1.75}
              />
              <input
                type="search"
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                placeholder="Nome, hash ou responsável"
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
            <select
              value={filtros.ciclo}
              onChange={(e) => setFiltros({ ...filtros, ciclo: e.target.value })}
              className="
                px-3 py-2 rounded-xl
                bg-white/80 dark:bg-slate-900/40
                border border-slate-200 dark:border-slate-800
                text-sm text-slate-700 dark:text-slate-200
                focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                transition cursor-pointer
              "
            >
              {ciclosDisponiveis.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className="relative">
              <ArrowDownNarrowWide
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                strokeWidth={1.75}
              />
              <select
                value={filtros.ordenacao}
                onChange={(e) =>
                  setFiltros({ ...filtros, ordenacao: e.target.value as Ordenacao })
                }
                className="
                  appearance-none pl-8 pr-7 py-2 rounded-xl
                  bg-white/80 dark:bg-slate-900/40
                  border border-slate-200 dark:border-slate-800
                  text-sm text-slate-700 dark:text-slate-200
                  focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                  transition cursor-pointer
                "
              >
                {ORDENACOES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {filtradosOrdenados.length === 0 ? (
            <EmptyState
              isFilterEmpty={
                filtros.busca !== '' ||
                filtros.status !== 'todos' ||
                filtros.ciclo !== 'todos'
              }
              onCreate={onNavigateToNovo}
              onClear={() =>
                setFiltros({
                  busca: '',
                  status: 'todos',
                  ciclo: 'todos',
                  ordenacao: filtros.ordenacao,
                })
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtradosOrdenados.map((rel, idx) => (
                <RelatorioCard
                  key={rel.id}
                  relatorio={rel}
                  revealIndex={idx + 6}
                  onSelect={() => onSelectRelatorio?.(rel.id)}
                  onDownload={() => onDownload?.(rel.id)}
                  onCopyShareLink={() => onCopyShareLink?.(rel.id)}
                  onReemitir={() => onReemitir?.(rel.id)}
                  onArchive={() => onArchive?.(rel.id)}
                  onMarkEnviadoMte={() => onMarkEnviadoMte?.(rel.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  isFilterEmpty,
  onCreate,
  onClear,
}: {
  isFilterEmpty: boolean
  onCreate?: () => void
  onClear?: () => void
}) {
  return (
    <div
      className="
        nymos-reveal opacity-0
        rounded-2xl border border-dashed border-slate-300 dark:border-slate-700
        bg-white/40 dark:bg-slate-900/30
        px-8 py-14
        flex flex-col items-center text-center
      "
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <FileText className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {isFilterEmpty ? 'Nenhum relatório no filtro atual' : 'Nenhum relatório gerado ainda'}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {isFilterEmpty
          ? 'Ajuste os filtros para ver outros relatórios ou gere um novo a partir de uma avaliação publicada.'
          : 'Gere o primeiro relatório oficial NR-1 a partir de uma avaliação publicada para auditoria do MTE.'}
      </p>
      <div className="mt-5 flex items-center gap-2">
        {isFilterEmpty && (
          <button
            type="button"
            onClick={onClear}
            className="
              px-3.5 py-2 rounded-xl text-sm font-medium
              text-slate-600 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
          >
            Limpar filtros
          </button>
        )}
        <button
          type="button"
          onClick={onCreate}
          className="
            inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
            bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
            text-white font-medium text-sm transition
          "
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          {isFilterEmpty ? 'Novo relatório' : 'Gerar primeiro relatório'}
        </button>
      </div>
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
