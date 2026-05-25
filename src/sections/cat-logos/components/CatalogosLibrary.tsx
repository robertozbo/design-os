import { useMemo, useState } from 'react'
import type {
  CatalogosProps,
  CatalogoTab,
  CategoriaPerigo,
  Instrumento,
  ModeloAvaliacao,
  Perigo,
  PerigoTab,
} from '@/../product/sections/cat-logos/types'
import {
  Search,
  Plus,
  FlaskConical,
  AlertTriangle,
  LayoutTemplate,
  ShieldCheck,
  Wrench,
  BadgeCheck,
} from 'lucide-react'
import { InstrumentoCard } from './InstrumentoCard'
import { InstrumentoPreviewDrawer } from './InstrumentoPreviewDrawer'
import { PerigoCard } from './PerigoCard'
import { ModeloCard } from './ModeloCard'

const CATEGORIAS: { value: CategoriaPerigo | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'sobrecarga', label: 'Sobrecarga' },
  { value: 'assedio', label: 'Assédio' },
  { value: 'autonomia', label: 'Autonomia' },
  { value: 'metas', label: 'Metas' },
  { value: 'ambiente', label: 'Ambiente' },
  { value: 'cultura', label: 'Cultura' },
]

export function CatalogosLibrary({
  responsavelLogado,
  agregado,
  instrumentos,
  perigos,
  modelos,
  tabAtiva,
  filtrosPerigos,
  filtrosModelos,
  onTabChange,
  onPreviewInstrumento,
  onFiltrosPerigosChange,
  onSelectPerigo,
  onAddPerigo,
  onEditPerigo,
  onArchivePerigo,
  onFiltrosModelosChange,
  onUseModelo,
  onAddModelo,
  onEditModelo,
  onDuplicateModelo,
  onArchiveModelo,
}: CatalogosProps) {
  const [previewInstrumento, setPreviewInstrumento] = useState<Instrumento | null>(null)

  const tabs: { value: CatalogoTab; label: string; count: number; icon: React.ReactNode }[] = [
    {
      value: 'instrumentos',
      label: 'Instrumentos',
      count: agregado.totalInstrumentos,
      icon: <FlaskConical className="w-3.5 h-3.5" strokeWidth={1.75} />,
    },
    {
      value: 'perigos',
      label: 'Perigos psicossociais',
      count: agregado.totalPerigosGlobais + agregado.totalPerigosCustomizados,
      icon: <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.75} />,
    },
    {
      value: 'modelos',
      label: 'Modelos',
      count: agregado.totalModelos,
      icon: <LayoutTemplate className="w-3.5 h-3.5" strokeWidth={1.75} />,
    },
  ]

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Biblioteca da carteira
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Catálogos
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                <span className="tabular-nums">{agregado.totalInstrumentos}</span> instrumentos
                científicos ·{' '}
                <span className="tabular-nums">
                  {agregado.totalPerigosGlobais + agregado.totalPerigosCustomizados}
                </span>{' '}
                perigos psicossociais ·{' '}
                <span className="tabular-nums">{agregado.totalModelos}</span> modelos reutilizáveis
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800">
              <BadgeCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" strokeWidth={1.75} />
              <div className="text-[12px]">
                <p className="text-slate-700 dark:text-slate-200 font-medium">
                  {responsavelLogado.nome}
                </p>
                <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  {responsavelLogado.registro}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-7 inline-flex p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 ring-1 ring-slate-200/60 dark:ring-slate-800"
        >
          {tabs.map((tab) => {
            const active = tabAtiva === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange?.(tab.value)}
                className={`
                  inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                  ${
                    active
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`
                    inline-flex items-center justify-center min-w-[22px] px-1.5 rounded-md text-[10px] font-mono tabular-nums
                    ${
                      active
                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }
                  `}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-5">
          {tabAtiva === 'instrumentos' && (
            <InstrumentosTab
              instrumentos={instrumentos}
              onPreview={(id) => {
                setPreviewInstrumento(instrumentos.find((i) => i.id === id) ?? null)
                onPreviewInstrumento?.(id)
              }}
            />
          )}

          {tabAtiva === 'perigos' && (
            <PerigosTab
              perigos={perigos}
              filtros={filtrosPerigos}
              onChange={onFiltrosPerigosChange}
              onSelect={onSelectPerigo}
              onAdd={onAddPerigo}
              onEdit={onEditPerigo}
              onArchive={onArchivePerigo}
              countGlobal={agregado.totalPerigosGlobais}
              countCustom={agregado.totalPerigosCustomizados}
            />
          )}

          {tabAtiva === 'modelos' && (
            <ModelosTab
              modelos={modelos}
              instrumentos={instrumentos}
              filtros={filtrosModelos}
              onChange={onFiltrosModelosChange}
              onUse={onUseModelo}
              onAdd={onAddModelo}
              onEdit={onEditModelo}
              onDuplicate={onDuplicateModelo}
              onArchive={onArchiveModelo}
            />
          )}
        </div>
      </div>

      <InstrumentoPreviewDrawer
        open={!!previewInstrumento}
        instrumento={previewInstrumento}
        onClose={() => setPreviewInstrumento(null)}
      />
    </div>
  )
}

function InstrumentosTab({
  instrumentos,
  onPreview,
}: {
  instrumentos: Instrumento[]
  onPreview: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {instrumentos.map((ins, idx) => (
        <InstrumentoCard
          key={ins.id}
          instrumento={ins}
          revealIndex={idx + 4}
          onPreview={() => onPreview(ins.id)}
        />
      ))}
    </div>
  )
}

function PerigosTab({
  perigos,
  filtros,
  onChange,
  onSelect,
  onAdd,
  onEdit,
  onArchive,
  countGlobal,
  countCustom,
}: {
  perigos: Perigo[]
  filtros: CatalogosProps['filtrosPerigos']
  onChange?: (f: CatalogosProps['filtrosPerigos']) => void
  onSelect?: (id: string) => void
  onAdd?: () => void
  onEdit?: (id: string) => void
  onArchive?: (id: string) => void
  countGlobal: number
  countCustom: number
}) {
  const filtered = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    return perigos.filter((p) => {
      if (filtros.subTab === 'global' && p.origem !== 'global') return false
      if (filtros.subTab === 'meus' && p.origem !== 'customizado') return false
      if (filtros.categoria !== 'todas' && p.categoria !== filtros.categoria) return false
      if (termo) {
        const haystack = `${p.nome} ${p.codigo} ${p.descricao}`.toLowerCase()
        if (!haystack.includes(termo)) return false
      }
      return true
    })
  }, [perigos, filtros])

  const isMeus = filtros.subTab === 'meus'
  const subTabs: { value: PerigoTab; label: string; count: number; icon: React.ReactNode }[] = [
    {
      value: 'global',
      label: 'Catálogo Nymos',
      count: countGlobal,
      icon: <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />,
    },
    {
      value: 'meus',
      label: 'Meus perigos',
      count: countCustom,
      icon: <Wrench className="w-3.5 h-3.5" strokeWidth={1.75} />,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="inline-flex p-1 rounded-xl bg-white/80 dark:bg-slate-900/40 ring-1 ring-slate-200 dark:ring-slate-800 self-start">
          {subTabs.map((sub) => {
            const active = filtros.subTab === sub.value
            return (
              <button
                key={sub.value}
                type="button"
                onClick={() => onChange?.({ ...filtros, subTab: sub.value })}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition
                  ${
                    active
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                {sub.icon}
                {sub.label}
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md bg-slate-200/70 dark:bg-slate-800 text-[10px] font-mono tabular-nums text-slate-600 dark:text-slate-400">
                  {sub.count}
                </span>
              </button>
            )
          })}
        </div>

        {isMeus && (
          <button
            type="button"
            onClick={onAdd}
            className="
              inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
              bg-teal-600 hover:bg-teal-700 active:bg-teal-800
              dark:bg-teal-500 dark:hover:bg-teal-400
              text-white font-medium text-sm
              shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
              dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
              transition self-start lg:self-auto
            "
          >
            <Plus className="w-4 h-4" strokeWidth={2.25} />
            Novo perigo
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 lg:max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={filtros.busca}
            onChange={(e) => onChange?.({ ...filtros, busca: e.target.value })}
            placeholder="Nome, código ou descrição"
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
        <div className="flex items-center gap-1 flex-wrap">
          {CATEGORIAS.map((cat) => {
            const active = filtros.categoria === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onChange?.({ ...filtros, categoria: cat.value })}
                className={`
                  px-2.5 py-1 rounded-lg text-[12px] font-medium ring-1 transition
                  ${
                    active
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/60'
                      : 'bg-white/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }
                `}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <PerigoEmptyState isMeus={isMeus} onAdd={onAdd} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((p, idx) => (
            <PerigoCard
              key={p.id}
              perigo={p}
              revealIndex={idx + 4}
              onSelect={() => onSelect?.(p.id)}
              onEdit={() => onEdit?.(p.id)}
              onArchive={() => onArchive?.(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PerigoEmptyState({ isMeus, onAdd }: { isMeus: boolean; onAdd?: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 px-8 py-14 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <AlertTriangle className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {isMeus ? 'Sem perigos customizados ainda' : 'Nenhum perigo neste filtro'}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {isMeus
          ? 'Customize o catálogo Nymos com perigos específicos da sua carteira (segmentos, contextos regionais).'
          : 'Ajuste os filtros para ver outros perigos catalogados.'}
      </p>
      {isMeus && (
        <button
          type="button"
          onClick={onAdd}
          className="
            mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
            bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200
            text-white dark:text-slate-900 font-medium text-sm transition
          "
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          Criar primeiro perigo customizado
        </button>
      )}
    </div>
  )
}

function ModelosTab({
  modelos,
  instrumentos,
  filtros,
  onChange,
  onUse,
  onAdd,
  onEdit,
  onDuplicate,
  onArchive,
}: {
  modelos: ModeloAvaliacao[]
  instrumentos: Instrumento[]
  filtros: CatalogosProps['filtrosModelos']
  onChange?: (f: CatalogosProps['filtrosModelos']) => void
  onUse?: (id: string) => void
  onAdd?: () => void
  onEdit?: (id: string) => void
  onDuplicate?: (id: string) => void
  onArchive?: (id: string) => void
}) {
  const filtered = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    const out = modelos.filter((m) => {
      if (filtros.instrumentoId && m.instrumentoId !== filtros.instrumentoId) return false
      if (termo) {
        const haystack = `${m.nome} ${m.descricao} ${m.instrumentoSigla}`.toLowerCase()
        if (!haystack.includes(termo)) return false
      }
      return true
    })
    switch (filtros.ordenacao) {
      case 'mais_usado':
        return out.sort(
          (a, b) => b.metricasUso.vezesAplicado - a.metricasUso.vezesAplicado,
        )
      case 'alfabetica':
        return out.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
      case 'mais_recente':
        return out
    }
  }, [modelos, filtros])

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
          <div className="relative flex-1 lg:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={filtros.busca}
              onChange={(e) => onChange?.({ ...filtros, busca: e.target.value })}
              placeholder="Nome, descrição ou instrumento"
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
            value={filtros.instrumentoId ?? ''}
            onChange={(e) =>
              onChange?.({
                ...filtros,
                instrumentoId: e.target.value === '' ? null : e.target.value,
              })
            }
            className="
              px-3 py-2 rounded-xl
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition cursor-pointer
            "
          >
            <option value="">Todos instrumentos</option>
            {instrumentos.map((ins) => (
              <option key={ins.id} value={ins.id}>
                {ins.sigla}
              </option>
            ))}
          </select>
          <select
            value={filtros.ordenacao}
            onChange={(e) =>
              onChange?.({
                ...filtros,
                ordenacao: e.target.value as CatalogosProps['filtrosModelos']['ordenacao'],
              })
            }
            className="
              px-3 py-2 rounded-xl
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition cursor-pointer
            "
          >
            <option value="mais_usado">Mais usado</option>
            <option value="alfabetica">Alfabética (A → Z)</option>
            <option value="mais_recente">Mais recentes</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="
            inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
            bg-teal-600 hover:bg-teal-700 active:bg-teal-800
            dark:bg-teal-500 dark:hover:bg-teal-400
            text-white font-medium text-sm
            shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
            dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
            transition self-start lg:self-auto
          "
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          Novo modelo
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 px-8 py-14 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <LayoutTemplate className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Sem modelos no filtro atual
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Crie modelos reutilizáveis para acelerar a aplicação de avaliações em novos empregadores.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((m, idx) => (
            <ModeloCard
              key={m.id}
              modelo={m}
              revealIndex={idx + 4}
              onUse={() => onUse?.(m.id)}
              onEdit={() => onEdit?.(m.id)}
              onDuplicate={() => onDuplicate?.(m.id)}
              onArchive={() => onArchive?.(m.id)}
            />
          ))}
        </div>
      )}
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
      @keyframes drawer-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .drawer-fade {
        animation: drawer-fade-in 0.18s ease-out forwards;
      }
      @keyframes drawer-slide-in {
        from { transform: translateX(20px); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
      .drawer-slide {
        animation: drawer-slide-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal, .drawer-fade, .drawer-slide {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
