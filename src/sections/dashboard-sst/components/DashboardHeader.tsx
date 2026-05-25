import type { Professional, CarteiraResumo } from '@/../product/sections/dashboard-sst/types'
import { Plus, ShieldAlert } from 'lucide-react'

interface DashboardHeaderProps {
  professional: Professional
  carteira: CarteiraResumo
  onNovoEmpregador?: () => void
  onAbrirVigencia?: () => void
}

const NR1_VIGENCIA_FORMATTER = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

function formatVigencia(iso: string) {
  return NR1_VIGENCIA_FORMATTER.format(new Date(iso + 'T12:00:00'))
}

export function DashboardHeader({ professional, carteira, onNovoEmpregador, onAbrirVigencia }: DashboardHeaderProps) {
  return (
    <header className="nymos-reveal opacity-0">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
        <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
          SST · Carteira NR-1
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Eng. {professional.nome}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            {professional.funcao} · <span className="font-mono">{professional.registroProfissional}</span>
          </p>
          <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-500">
            Carteira com{' '}
            <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">{carteira.totalEmpregadores}</span>{' '}
            empregadores ·{' '}
            <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">{carteira.totalEstabelecimentos}</span>{' '}
            estabelecimentos ·{' '}
            <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">{carteira.totalSetores}</span>{' '}
            setores ·{' '}
            <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
              {carteira.totalTrabalhadores.toLocaleString('pt-BR')}
            </span>{' '}
            trabalhadores
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAbrirVigencia}
            className="
              group inline-flex items-center gap-2.5
              px-3.5 py-2 rounded-xl
              bg-rose-50/80 dark:bg-rose-950/30
              ring-1 ring-rose-200/70 dark:ring-rose-900/50
              hover:bg-rose-100/80 dark:hover:bg-rose-950/50
              transition-colors duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2
            "
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" strokeWidth={1.75} />
            <div className="text-left leading-tight">
              <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-rose-700 dark:text-rose-400">
                Vigência NR-1
              </div>
              <div className="text-xs text-rose-900 dark:text-rose-200 tabular-nums">
                <span className="font-semibold">{carteira.diasAteVigenciaNr1}</span> dias ·{' '}
                <span className="font-mono">{formatVigencia(carteira.dataVigenciaNr1)}</span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onNovoEmpregador}
            className="
              inline-flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl
              bg-teal-600 hover:bg-teal-700 active:bg-teal-800
              dark:bg-teal-500 dark:hover:bg-teal-400
              text-white font-medium text-sm
              shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
              dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
              transition-colors duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
            "
          >
            <Plus className="w-4 h-4" strokeWidth={2.25} />
            Novo empregador
          </button>
        </div>
      </div>
    </header>
  )
}
