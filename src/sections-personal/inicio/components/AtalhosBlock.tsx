import { Activity, Dumbbell, Pencil, UserPlus } from 'lucide-react'
import type { AtalhoId } from '@/../product-personal/sections/inicio/types'

interface AtalhosBlockProps {
  atalhos: AtalhoId[]
  onCreateAvaliacao?: () => void
  onOpenTreinos?: () => void
  onConvidarAluno?: () => void
  onAnotar?: () => void
}

const ATALHO_CONFIG: Record<
  AtalhoId,
  { label: string; icon: React.ElementType; tone: string; iconBg: string }
> = {
  'nova-avaliacao': {
    label: 'Nova avaliação',
    icon: Activity,
    tone: 'text-violet-700 dark:text-violet-300',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
  },
  'novo-treino': {
    label: 'Aplicar template',
    icon: Dumbbell,
    tone: 'text-teal-700 dark:text-teal-300',
    iconBg: 'bg-teal-100 dark:bg-teal-900/40',
  },
  'convidar-aluno': {
    label: 'Convidar aluno',
    icon: UserPlus,
    tone: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  anotar: {
    label: 'Anotar',
    icon: Pencil,
    tone: 'text-slate-700 dark:text-slate-300',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
  },
}

export function AtalhosBlock({
  atalhos,
  onCreateAvaliacao,
  onOpenTreinos,
  onConvidarAluno,
  onAnotar,
}: AtalhosBlockProps) {
  const handler = (id: AtalhoId): (() => void) | undefined => {
    if (id === 'nova-avaliacao') return onCreateAvaliacao
    if (id === 'novo-treino') return onOpenTreinos
    if (id === 'convidar-aluno') return onConvidarAluno
    if (id === 'anotar') return onAnotar
    return undefined
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        Atalhos
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {atalhos.map((id) => {
          const cfg = ATALHO_CONFIG[id]
          const Icon = cfg.icon
          return (
            <button
              key={id}
              type="button"
              onClick={handler(id)}
              className="
                group flex flex-col items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/40 p-3 text-left
                transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:shadow-sm
                dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-teal-800 dark:hover:bg-slate-900
              "
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.iconBg} ${cfg.tone}`}
              >
                <Icon size={14} />
              </span>
              <span className="text-[12px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
                {cfg.label}
              </span>
            </button>
          )
        })}
      </div>
    </article>
  )
}
