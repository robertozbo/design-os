import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Sparkles,
  Hash,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ToggleRight,
  BarChart3,
} from 'lucide-react'
import type {
  CategoriaPerguntaId,
  Pergunta,
  PerguntasCatalogo,
  TipoPergunta,
} from '@/../product/sections/configura-es-nutri/types'
import { Card, PanelHeader, Switch } from './_shared'

interface PerguntasPanelProps {
  catalogo: PerguntasCatalogo
  onCreate?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onToggleHabilitada?: (id: string, next: boolean) => void
}

const TIPO_ICON: Record<TipoPergunta, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  'texto-curto': AlignLeft,
  'texto-longo': AlignLeft,
  numero: Hash,
  'escolha-unica': CircleDot,
  'escolha-multipla': CheckSquare,
  'sim-nao': ToggleRight,
  'escala-likert': BarChart3,
}

const TIPO_LABEL: Record<TipoPergunta, string> = {
  'texto-curto': 'Texto curto',
  'texto-longo': 'Texto longo',
  numero: 'Número',
  'escolha-unica': 'Escolha única',
  'escolha-multipla': 'Escolha múltipla',
  'sim-nao': 'Sim / Não',
  'escala-likert': 'Escala 1–5',
}

export function PerguntasPanel({
  catalogo,
  onCreate,
  onEdit,
  onDelete,
  onToggleHabilitada,
}: PerguntasPanelProps) {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState<CategoriaPerguntaId>('todas')

  const counts = useMemo(() => {
    const c: Record<CategoriaPerguntaId, number> = {
      todas: catalogo.itens.length,
      saude: 0,
      habitos: 0,
      'estilo-vida': 0,
      objetivos: 0,
      personalizadas: 0,
    }
    for (const item of catalogo.itens) c[item.categoria]++
    return c
  }, [catalogo.itens])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return catalogo.itens
      .filter((p) => activeCat === 'todas' || p.categoria === activeCat)
      .filter((p) => !q || p.enunciado.toLowerCase().includes(q))
      .sort((a, b) => a.ordem - b.ordem)
  }, [catalogo.itens, activeCat, search])

  const padraoCount = catalogo.itens.filter((p) => p.padraoNymos).length
  const customCount = catalogo.itens.filter((p) => !p.padraoNymos).length

  return (
    <div>
      <PanelHeader
        eyebrow="Perguntas · Anamnese"
        title="Catálogo de perguntas"
        description={`${padraoCount} padrão Nymos · ${customCount} personalizadas. Define o formulário do atendimento dinamicamente.`}
      />

      <div className="space-y-4">
        <Card>
          <div className="space-y-3">
            {/* Search + Add */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar pergunta…"
                  className="
                    block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900
                    placeholder:text-slate-400
                    focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
                    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-600
                  "
                />
              </div>
              <button
                type="button"
                onClick={onCreate}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
              >
                <Plus size={14} /> Nova pergunta
              </button>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              {catalogo.categorias.map((cat) => {
                const active = activeCat === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCat(cat.id)}
                    className={`
                      inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition
                      ${active
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
                    `}
                  >
                    {cat.label}
                    <span
                      className={`
                        rounded-full px-1.5 py-px text-[10px] font-mono
                        ${active
                          ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                          : 'bg-white text-slate-500 dark:bg-slate-700 dark:text-slate-400'}
                      `}
                    >
                      {counts[cat.id]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Question list */}
        <Card>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-500">
              Nenhuma pergunta encontrada.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.map((p) => (
                <PerguntaRow
                  key={p.id}
                  pergunta={p}
                  onEdit={() => onEdit?.(p.id)}
                  onDelete={() => onDelete?.(p.id)}
                  onToggle={(next) => onToggleHabilitada?.(p.id, next)}
                />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

function PerguntaRow({
  pergunta,
  onEdit,
  onDelete,
  onToggle,
}: {
  pergunta: Pergunta
  onEdit?: () => void
  onDelete?: () => void
  onToggle?: (next: boolean) => void
}) {
  const Icon = TIPO_ICON[pergunta.tipo]
  return (
    <li className="group flex items-start gap-3 py-3">
      <span
        className="mt-1 cursor-grab text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-400"
        aria-label="Arrastar para reordenar"
      >
        <GripVertical size={14} />
      </span>

      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
        <Icon size={14} strokeWidth={1.75} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p
            className={`text-sm font-medium leading-snug ${
              pergunta.habilitada
                ? 'text-slate-900 dark:text-slate-100'
                : 'text-slate-400 dark:text-slate-600 line-through decoration-slate-300'
            }`}
          >
            {pergunta.enunciado}
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge label={TIPO_LABEL[pergunta.tipo]} tone="slate" />
          {pergunta.tipo === 'numero' && pergunta.unidade && (
            <Badge label={pergunta.unidade} tone="slate" mono />
          )}
          {pergunta.padraoNymos ? (
            <Badge label="Padrão Nymos" tone="violet" icon={<Sparkles size={9} />} />
          ) : (
            <Badge label="Personalizada" tone="teal" />
          )}
          {pergunta.obrigatoria && <Badge label="Obrigatória" tone="amber" />}
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-500">
            · {pergunta.usosCount} usos
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Switch
          checked={pergunta.habilitada}
          onChange={onToggle}
          ariaLabel="Mostrar na anamnese"
        />

        <div className="hidden items-center gap-0.5 group-hover:flex sm:flex">
          {!pergunta.padraoNymos && (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Editar"
              >
                <Pencil size={12} />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                aria-label="Excluir"
              >
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

function Badge({
  label,
  tone,
  icon,
  mono,
}: {
  label: string
  tone: 'slate' | 'violet' | 'teal' | 'amber'
  icon?: React.ReactNode
  mono?: boolean
}) {
  const toneClass: Record<typeof tone, string> = {
    slate:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    violet:
      'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
    amber:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  }
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium
        ${toneClass[tone]} ${mono ? 'font-mono' : ''}
      `}
    >
      {icon}
      {label}
    </span>
  )
}
