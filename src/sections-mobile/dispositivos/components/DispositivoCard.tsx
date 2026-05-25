import type { DispositivoViewModel } from '@/../product-mobile/sections/dispositivos/types'
import { MoreVertical, RefreshCw, Battery } from 'lucide-react'
import { getIcon, bgFromCor, textFromCor } from './_shared'

interface DispositivoCardProps {
  dispositivo: DispositivoViewModel
  onClick?: (id: string) => void
  onSincronizar?: (id: string) => void
}

const STATUS_DOT: Record<string, string> = {
  connected: 'bg-emerald-400',
  disconnected: 'bg-slate-500',
  syncing: 'bg-teal-400 animate-pulse',
  error: 'bg-rose-500',
}

const STATUS_TEXT: Record<string, string> = {
  connected: 'Conectado',
  disconnected: 'Desconectado',
  syncing: 'Sincronizando…',
  error: 'Erro de sync',
}

const STATUS_TEXT_COLOR: Record<string, string> = {
  connected: 'text-emerald-300',
  disconnected: 'text-slate-400',
  syncing: 'text-teal-300',
  error: 'text-rose-300',
}

export function DispositivoCard({ dispositivo, onClick, onSincronizar }: DispositivoCardProps) {
  const { device } = dispositivo
  const Icon = getIcon(dispositivo.iconeNome)
  const iconBg = bgFromCor(dispositivo.iconeCor)
  const iconText = textFromCor(dispositivo.iconeCor)

  const visibleChips = dispositivo.tiposDado.slice(0, 4)
  const extraCount = dispositivo.tiposDado.length - visibleChips.length

  const status = device.syncStatus

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(device.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(device.id)
        }
      }}
      className="w-[calc(100%-32px)] mx-4 mb-3 rounded-2xl bg-slate-900 border border-slate-800 p-4 active:scale-[0.99] transition-transform text-left block cursor-pointer"
    >
      {/* Top row: ícone + nome + status + menu */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center ${iconText} shrink-0`}>
          <Icon size={20} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-slate-100 font-semibold text-[15px] truncate flex-1">
              {dispositivo.marcaLabel}
            </h3>
            {dispositivo.bateriaPct !== null && (
              <span className="inline-flex items-center gap-0.5 text-slate-400 font-mono text-[10.5px] tabular-nums">
                <Battery size={11} strokeWidth={2.2} />
                {dispositivo.bateriaPct}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
            <span className={`text-[11.5px] font-medium ${STATUS_TEXT_COLOR[status]}`}>
              {STATUS_TEXT[status]}
            </span>
            <span className="text-slate-600 text-[11.5px]">·</span>
            <span className="text-slate-500 text-[11.5px] truncate">{dispositivo.modelo}</span>
          </div>
        </div>
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800/70 shrink-0"
          aria-label="Mais ações"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <MoreVertical size={15} />
        </button>
      </div>

      {/* Tipos de dado chips */}
      {visibleChips.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 mb-3">
          {visibleChips.map((td) => {
            const TdIcon = getIcon(td.iconeNome)
            return (
              <span
                key={td.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10.5px] font-medium"
              >
                <TdIcon size={10} strokeWidth={2.2} />
                {td.label}
              </span>
            )
          })}
          {extraCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10.5px] font-mono tabular-nums">
              +{extraCount}
            </span>
          )}
        </div>
      )}

      {/* Footer: última sync + botão sync */}
      <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between">
        <span className="text-slate-500 text-[11px] font-mono tabular-nums">
          Última sync: {dispositivo.ultimaSyncRelativo}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSincronizar?.(device.id)
          }}
          className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 text-[11.5px] font-medium"
        >
          <RefreshCw
            size={12}
            strokeWidth={2.2}
            className={status === 'syncing' ? 'animate-spin' : ''}
          />
          Sincronizar
        </button>
      </div>
    </div>
  )
}
