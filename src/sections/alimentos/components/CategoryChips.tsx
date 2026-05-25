import type {
  CategoryFilterId,
  FilterOption,
} from '@/../product/sections/alimentos/types'

interface CategoryChipsProps {
  categories: FilterOption<CategoryFilterId>[]
  selectedCategory: CategoryFilterId
  onCategoryChange?: (id: CategoryFilterId) => void
}

export function CategoryChips({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryChipsProps) {
  // Always render "Todas" first
  const all: FilterOption<CategoryFilterId> = {
    id: 'todas',
    label: 'Todas',
    count: categories.reduce((sum, c) => sum + c.count, 0),
  }
  const items = [all, ...categories]

  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1 sm:flex-wrap sm:overflow-visible">
      {items.map((c) => {
        const active = c.id === selectedCategory
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onCategoryChange?.(c.id)}
            className={`
              inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all
              ${
                active
                  ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-300 dark:bg-teal-900/30 dark:text-teal-200 dark:ring-teal-800'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800/60 dark:hover:text-slate-300'
              }
            `}
          >
            {c.label}
            <span
              className={`font-mono text-[10px] tabular-nums ${
                active ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              {c.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
