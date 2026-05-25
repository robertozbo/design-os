import { useState } from 'react'
import type {
  EstabelecimentoDetailProps,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import {
  ChevronRight,
  Building,
  Building2,
  MapPin,
  Pencil,
  Archive,
  Plus,
  ExternalLink,
  Layers3,
} from 'lucide-react'
import { EstabelecimentoDetailKpi } from './EstabelecimentoDetailKpi'
import { SetorRow } from './SetorRow'
import { SetorDrawer } from './SetorDrawer'

export function EstabelecimentoDetail({
  empregadorContexto,
  estabelecimento,
  profissionaisDisponiveis,
  onBackToList,
  onEditEstabelecimento,
  onArchiveEstabelecimento,
  onAddSetor,
  onEditSetor,
  onSaveSetor,
  onArchiveSetor,
  onSelectSetor,
  onNavigateToAvaliacoes,
}: EstabelecimentoDetailProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingSetorId, setEditingSetorId] = useState<string | null>(null)

  const isMatriz = estabelecimento.tipo === 'matriz'
  const setores = estabelecimento.setores
  const setorEmEdicao = editingSetorId
    ? setores.find((s) => s.id === editingSetorId) ?? null
    : null

  const handleAdd = () => {
    setEditingSetorId(null)
    setDrawerOpen(true)
    onAddSetor?.(estabelecimento.id)
  }

  const handleEdit = (setorId: string) => {
    setEditingSetorId(setorId)
    setDrawerOpen(true)
    onEditSetor?.(estabelecimento.id, setorId)
  }

  const enderecoLine1 = `${estabelecimento.endereco.logradouro}${
    estabelecimento.endereco.numero ? `, ${estabelecimento.endereco.numero}` : ''
  }`
  const enderecoLine2 = `${estabelecimento.endereco.bairro} · ${estabelecimento.endereco.cidade}/${estabelecimento.endereco.uf}`

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
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
          <button
            type="button"
            onClick={onBackToList}
            className="text-teal-600 dark:text-teal-400 hover:underline underline-offset-2 font-medium"
          >
            Estabelecimentos
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400 truncate">{estabelecimento.nome}</span>
        </div>

        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Detalhe do estabelecimento
            </span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-px rounded-md ring-1 text-[10px] font-medium ${
                isMatriz
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/60'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200 dark:ring-slate-700'
              }`}
            >
              {isMatriz ? (
                <Building2 className="w-3 h-3" strokeWidth={2} />
              ) : (
                <Building className="w-3 h-3" strokeWidth={2} />
              )}
              {isMatriz ? 'Matriz' : 'Filial'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {estabelecimento.nome}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                CNPJ <span className="font-mono">{estabelecimento.cnpjProprio}</span> · eSocial{' '}
                <span className="font-mono">#{estabelecimento.codigoEsocial}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onEditEstabelecimento?.(estabelecimento.id)}
                className="
                  inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
                  bg-white/80 dark:bg-slate-900/40
                  border border-slate-200 dark:border-slate-800
                  hover:bg-slate-50 dark:hover:bg-slate-800/60
                  text-slate-700 dark:text-slate-200 font-medium text-sm
                  transition
                "
              >
                <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onArchiveEstabelecimento?.(estabelecimento.id)}
                className="
                  inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
                  bg-white/80 dark:bg-slate-900/40
                  border border-slate-200 dark:border-slate-800
                  hover:bg-slate-50 dark:hover:bg-slate-800/60
                  text-slate-700 dark:text-slate-200 font-medium text-sm
                  transition
                "
              >
                <Archive className="w-3.5 h-3.5" strokeWidth={1.75} />
                Arquivar
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-teal-600 hover:bg-teal-700 active:bg-teal-800
                  dark:bg-teal-500 dark:hover:bg-teal-400
                  text-white font-medium text-sm
                  shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
                  dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
                  transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
                "
              >
                <Plus className="w-4 h-4" strokeWidth={2.25} />
                Adicionar setor
              </button>
            </div>
          </div>
        </header>

        <div className="mt-7">
          <EstabelecimentoDetailKpi estabelecimento={estabelecimento} />
        </div>

        <div
          style={{ animationDelay: '300ms' }}
          className="nymos-reveal opacity-0 mt-7 grid grid-cols-1 lg:grid-cols-3 gap-3"
        >
          <div className="lg:col-span-2 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-4">
            <div className="flex items-center gap-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Localização
              </span>
            </div>
            <p className="text-[15px] text-slate-900 dark:text-slate-50 font-medium">
              {enderecoLine1}
            </p>
            {estabelecimento.endereco.complemento && (
              <p className="text-[13px] text-slate-600 dark:text-slate-300">
                {estabelecimento.endereco.complemento}
              </p>
            )}
            <p className="mt-0.5 text-[13px] text-slate-600 dark:text-slate-300">{enderecoLine2}</p>
            <p className="mt-1 text-[12px] font-mono text-slate-500 dark:text-slate-400">
              CEP {estabelecimento.endereco.cep}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToAvaliacoes?.(estabelecimento.id)}
            className="
              group rounded-2xl bg-white/95 dark:bg-slate-900/70
              border border-slate-200/80 dark:border-slate-800
              hover:border-teal-300 dark:hover:border-teal-700
              hover:shadow-[0_4px_20px_-8px_rgba(15,118,110,0.25)]
              dark:hover:shadow-[0_4px_20px_-8px_rgba(20,184,166,0.35)]
              transition-all duration-200
              px-5 py-4 text-left
            "
          >
            <div className="flex items-center gap-1.5 mb-3">
              <ExternalLink
                className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-500 transition"
                strokeWidth={1.75}
              />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Avaliações NR-1
              </span>
            </div>
            <p className="text-[15px] text-slate-900 dark:text-slate-50 font-medium">
              Ver campanhas e matriz psicossocial
            </p>
            <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
              Filtrado neste estabelecimento ·{' '}
              <span className="font-mono">{estabelecimento.saudeNr1.ultimoInstrumento ?? '—'}</span>
            </p>
          </button>
        </div>

        <div
          style={{ animationDelay: '380ms' }}
          className="nymos-reveal opacity-0 mt-7 flex items-end justify-between gap-3"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Layers3 className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Setores
              </span>
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {setores.length} {setores.length === 1 ? 'setor' : 'setores'} cadastrados
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="
              hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
              text-teal-700 dark:text-teal-300 text-sm font-medium
              hover:bg-teal-50 dark:hover:bg-teal-950/40 transition
            "
          >
            <Plus className="w-4 h-4" strokeWidth={2.25} />
            Adicionar setor
          </button>
        </div>

        <div className="mt-3">
          {setores.length === 0 ? (
            <SetoresEmpty onAdd={handleAdd} />
          ) : (
            <div className="space-y-2">
              {setores.map((setor, idx) => (
                <SetorRow
                  key={setor.id}
                  setor={setor}
                  revealIndex={idx + 6}
                  onSelect={() => onSelectSetor?.(estabelecimento.id, setor.id)}
                  onEdit={() => handleEdit(setor.id)}
                  onArchive={() => onArchiveSetor?.(estabelecimento.id, setor.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <SetorDrawer
          key={editingSetorId ?? 'new'}
          open
          estabelecimentoId={estabelecimento.id}
          setorEmEdicao={setorEmEdicao}
          profissionaisDisponiveis={profissionaisDisponiveis}
          onClose={() => {
            setDrawerOpen(false)
            setEditingSetorId(null)
          }}
          onSave={(input) => {
            onSaveSetor?.(input)
            setDrawerOpen(false)
            setEditingSetorId(null)
          }}
        />
      )}
    </div>
  )
}

function SetoresEmpty({ onAdd }: { onAdd?: () => void }) {
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
        <Layers3 className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        Nenhum setor cadastrado ainda
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        Cadastre os setores para definir o eixo de análise do PGR e abrir avaliações NR-1 com
        cobertura por área.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="
          mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
          bg-slate-900 hover:bg-slate-800
          dark:bg-slate-100 dark:hover:bg-slate-200
          text-white dark:text-slate-900 font-medium text-sm transition
        "
      >
        <Plus className="w-4 h-4" strokeWidth={2.25} />
        Adicionar primeiro setor
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
