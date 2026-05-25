import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  LayoutTemplate,
  MoreHorizontal,
  Star,
  Trash2,
} from 'lucide-react'
import type {
  Objetivo,
  ObjetivoOption,
  TemplateFull,
} from '@/../product/sections/planos-alimentares/types'
import { ObjetivoPicker } from './ObjetivoPicker'

interface TemplateBuilderHeaderProps {
  template: TemplateFull
  objetivoOptions: ObjetivoOption[]
  onChangeName: (name: string) => void
  onChangeObjetivo: (next: Objetivo | null) => void
  onChangeDescription: (description: string) => void
  onToggleFavorite?: () => void
  onBack?: () => void
  onDelete?: () => void
}

export function TemplateBuilderHeader({
  template,
  objetivoOptions,
  onChangeName,
  onChangeObjetivo,
  onChangeDescription,
  onToggleFavorite,
  onBack,
  onDelete,
}: TemplateBuilderHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handlePointer(e: PointerEvent) {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer, true)
    return () => document.removeEventListener('pointerdown', handlePointer, true)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto max-w-[1600px] space-y-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Top row: voltar + nome + badges + menu */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="
              inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600
              transition-colors hover:bg-slate-100 hover:text-slate-900
              dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50
            "
          >
            <ArrowLeft size={15} />
            Voltar
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Template label */}
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <LayoutTemplate size={11} />
            Template
          </span>

          {/* Name (editable) */}
          <input
            type="text"
            value={template.name}
            onChange={(e) => onChangeName(e.target.value)}
            className="
              min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1
              text-base font-semibold text-slate-900
              transition-colors hover:bg-slate-50 focus:border-slate-300 focus:bg-white focus:outline-none
              dark:text-slate-50 dark:hover:bg-slate-800/50 dark:focus:border-slate-600 dark:focus:bg-slate-900
              sm:text-lg
            "
            aria-label="Nome do template"
          />

          {/* Objetivo */}
          <ObjetivoPicker
            value={template.objetivo}
            options={objetivoOptions}
            onChange={onChangeObjetivo}
          />

          {/* Favorite */}
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={template.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Star
              size={15}
              className={
                template.isFavorite
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-400 dark:text-slate-500'
              }
            />
          </button>

          {/* Kebab menu */}
          <div ref={wrapRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={`
                rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700
                dark:hover:bg-slate-800 dark:hover:text-slate-200
                ${menuOpen ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : ''}
              `}
              aria-label="Mais ações"
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-40 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onDelete?.()
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30"
                >
                  <Trash2 size={13} />
                  Excluir template
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description row */}
        <div className="flex items-start gap-2 pl-[68px]">
          <input
            type="text"
            value={template.description}
            onChange={(e) => onChangeDescription(e.target.value)}
            placeholder="Descrição opcional — quando usar este template, indicações…"
            className="
              w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-slate-600
              placeholder:text-slate-400
              hover:bg-slate-50 focus:border-slate-300 focus:bg-white focus:outline-none
              dark:text-slate-400 dark:placeholder:text-slate-600 dark:hover:bg-slate-800/50 dark:focus:border-slate-600 dark:focus:bg-slate-900
            "
          />
        </div>
      </div>
    </header>
  )
}
