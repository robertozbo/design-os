import { useState } from 'react'
import {
  Star,
  Clock,
  Users,
  MoreHorizontal,
  Pencil,
  Copy,
  Eye,
  Heart,
  Trash2,
  Send,
  EyeOff,
} from 'lucide-react'
import type {
  AlimentoLite,
  CategoriaOpcao,
  Receita,
  TagOpcao,
} from '@/../product/sections/receitas/types'
import {
  CATEGORIA_BADGE,
  CATEGORIA_GRADIENT,
  CATEGORIA_INITIAL,
  CATEGORIA_TONE,
  formatNum,
  macrosPerPorcao,
  sumMacros,
} from './utils'

interface RecipeCardProps {
  receita: Receita
  alimentosById: Record<string, AlimentoLite>
  categoriaOpcoes: CategoriaOpcao[]
  tagOpcoes: TagOpcao[]
  onOpenEdit: () => void
  onToggleFavorita: () => void
  onTogglePublicada: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function RecipeCard({
  receita,
  alimentosById,
  categoriaOpcoes,
  tagOpcoes,
  onOpenEdit,
  onToggleFavorita,
  onTogglePublicada,
  onDuplicate,
  onDelete,
}: RecipeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const tone = CATEGORIA_TONE[receita.categoria]
  const cat = categoriaOpcoes.find((c) => c.id === receita.categoria)
  const total = sumMacros(receita.ingredientes, alimentosById)
  const perPorcao = macrosPerPorcao(total, receita.porcoes)
  const tagLabels = receita.tags
    .map((t) => tagOpcoes.find((o) => o.id === t)?.label ?? t)
    .filter(Boolean)
  const visibleTags = tagLabels.slice(0, 3)
  const remainingTags = tagLabels.length - visibleTags.length
  const initial = receita.nome[0]?.toUpperCase() ?? '?'

  return (
    <article
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition
        hover:border-slate-300 hover:shadow-lg
        dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700
        ${receita.publicada ? 'border-slate-200/80' : 'border-amber-300/60 dark:border-amber-900/50'}
      `}
    >
      {/* Hero */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenEdit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpenEdit()
          }
        }}
        aria-label={`Abrir receita ${receita.nome}`}
        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        {receita.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={receita.fotoUrl} alt={receita.nome} className="h-full w-full object-cover" />
        ) : (
          <div
            className={`
              flex h-full w-full items-center justify-center
              ${CATEGORIA_GRADIENT[receita.fotoCorPlaceholder]}
            `}
          >
            <span
              className={`text-6xl font-semibold opacity-40 ${CATEGORIA_INITIAL[receita.fotoCorPlaceholder]}`}
              aria-hidden
            >
              {initial}
            </span>
          </div>
        )}

        {/* Favorite */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorita()
          }}
          aria-label={receita.isFavorita ? 'Remover favorito' : 'Favoritar'}
          className="
            absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full
            bg-white/80 text-slate-700 backdrop-blur transition
            hover:bg-white hover:text-amber-500
            dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-amber-400
          "
        >
          <Star
            size={14}
            strokeWidth={1.75}
            className={receita.isFavorita ? 'fill-amber-400 text-amber-500 dark:text-amber-400' : ''}
          />
        </button>

        {/* Draft badge (only when not published) */}
        {!receita.publicada && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700 ring-1 ring-amber-200/80 backdrop-blur dark:bg-amber-950/80 dark:text-amber-300 dark:ring-amber-900/60">
            <EyeOff size={9} strokeWidth={2.5} />
            Rascunho
          </span>
        )}

        {/* Time badge */}
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          <Clock size={9} strokeWidth={2.5} />
          {receita.tempoPreparoMin} min
        </span>

        {/* Difficulty badge (right bottom) */}
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-700 backdrop-blur dark:bg-slate-900/80 dark:text-slate-300">
          <Users size={9} strokeWidth={2.5} />
          {receita.porcoes} {receita.porcoes === 1 ? 'porção' : 'porções'}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Name + category badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50">
            {receita.nome}
          </h3>
          {cat && (
            <span
              className={`
                shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ring-1
                ${CATEGORIA_BADGE[tone]}
              `}
            >
              {cat.label}
            </span>
          )}
        </div>

        {/* Macros line */}
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {formatNum(perPorcao.kcal, 0)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
            kcal/porção
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Macro label="P" value={perPorcao.proteinaG} unit="g" tone="rose" />
          <Macro label="C" value={perPorcao.carboG} unit="g" tone="amber" />
          <Macro label="G" value={perPorcao.gorduraG} unit="g" tone="violet" />
        </div>

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {visibleTags.map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-md border border-slate-200/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400"
              >
                {label}
              </span>
            ))}
            {remainingTags > 0 && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                +{remainingTags}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-slate-200/60 pt-2.5 dark:border-slate-800/60">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
            {receita.publicada ? (
              <>
                <span className="inline-flex items-center gap-1" title="Visualizações pelos pacientes">
                  <Eye size={10} strokeWidth={1.75} />
                  <span className="tabular-nums">{receita.visualizacoesCount}</span>
                </span>
                <span className="inline-flex items-center gap-1" title="Salva por pacientes">
                  <Heart size={10} strokeWidth={1.75} />
                  <span className="tabular-nums">{receita.salvaPorPacientesCount}</span>
                </span>
              </>
            ) : (
              <span className="text-amber-700 dark:text-amber-400">Não publicada</span>
            )}
          </div>

          {/* Actions menu */}
          <div className="relative">
            <button
              type="button"
              aria-label="Mais ações"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen((o) => !o)
              }}
              className="
                rounded-md p-1 text-slate-400 transition
                hover:bg-slate-100 hover:text-slate-700
                dark:hover:bg-slate-800 dark:hover:text-slate-200
              "
            >
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  aria-hidden
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(false)
                  }}
                />
                <div
                  className="
                    absolute right-0 bottom-full z-50 mb-1 min-w-[180px] overflow-hidden rounded-xl
                    border border-slate-200 bg-white shadow-lg
                    dark:border-slate-800 dark:bg-slate-900
                  "
                >
                  <ul className="py-1">
                    <MenuItem
                      icon={<Pencil size={11} />}
                      label="Editar"
                      onClick={() => {
                        setMenuOpen(false)
                        onOpenEdit()
                      }}
                    />
                    <MenuItem
                      icon={
                        receita.publicada ? <EyeOff size={11} /> : <Send size={11} />
                      }
                      label={receita.publicada ? 'Despublicar' : 'Publicar no app'}
                      tone={receita.publicada ? 'slate' : 'teal'}
                      onClick={() => {
                        setMenuOpen(false)
                        onTogglePublicada()
                      }}
                    />
                    <MenuItem
                      icon={<Copy size={11} />}
                      label="Duplicar"
                      onClick={() => {
                        setMenuOpen(false)
                        onDuplicate()
                      }}
                    />
                    <li className="my-1 border-t border-slate-200 dark:border-slate-800" />
                    <MenuItem
                      icon={<Trash2 size={11} />}
                      label="Excluir"
                      tone="rose"
                      onClick={() => {
                        setMenuOpen(false)
                        onDelete()
                      }}
                    />
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function Macro({
  label,
  value,
  unit,
  tone,
}: {
  label: string
  value: number
  unit: string
  tone: 'rose' | 'amber' | 'violet'
}) {
  const toneClass: Record<typeof tone, string> = {
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  }
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${toneClass[tone]}`}
    >
      <span className="font-semibold">{label}</span>
      <span className="font-mono tabular-nums">{formatNum(value, 0)}</span>
      <span className="opacity-70">{unit}</span>
    </span>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  tone = 'slate',
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  tone?: 'slate' | 'rose' | 'teal'
}) {
  const cls =
    tone === 'rose'
      ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40'
      : tone === 'teal'
      ? 'text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/40 font-medium'
      : 'text-slate-700 hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-teal-950/40 dark:hover:text-teal-200'
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition ${cls}`}
      >
        {icon}
        {label}
      </button>
    </li>
  )
}
