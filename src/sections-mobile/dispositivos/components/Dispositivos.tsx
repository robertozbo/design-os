import type { DispositivosProps, DispositivoViewModel, FiltroStatus } from '@/../product-mobile/sections/dispositivos/types'
import { StatsRow } from './StatsRow'
import { FilterPills } from './FilterPills'
import { DispositivoCard } from './DispositivoCard'
import { EmptyState } from './EmptyState'

function applyFilter(dispositivos: DispositivoViewModel[], filtro: FiltroStatus): DispositivoViewModel[] {
  if (filtro === 'todos') return dispositivos
  if (filtro === 'conectados') {
    return dispositivos.filter((d) => d.device.syncStatus === 'connected' || d.device.syncStatus === 'syncing')
  }
  return dispositivos.filter((d) => d.device.syncStatus === 'disconnected' || d.device.syncStatus === 'error')
}

export function Dispositivos({
  data,
  selectedFiltro,
  onFiltroChange,
  onDispositivoClick,
  onSincronizarDispositivo,
  onAdicionarClick,
}: DispositivosProps) {
  const visiveis = applyFilter(data.dispositivos, selectedFiltro)
  const isEmpty = data.dispositivos.length === 0
  const isFilterEmpty = !isEmpty && visiveis.length === 0

  return (
    <div className="min-h-full bg-slate-950 pb-6 pt-3 relative">
      {!isEmpty && <StatsRow stats={data.stats} />}

      {!isEmpty && (
        <FilterPills filtros={data.filtros} selected={selectedFiltro} onChange={onFiltroChange} />
      )}

      {isEmpty && <EmptyState onAdicionar={onAdicionarClick} />}

      {isFilterEmpty && <EmptyState type="no-results" />}

      {!isEmpty &&
        visiveis.map((d) => (
          <DispositivoCard
            key={d.device.id}
            dispositivo={d}
            onClick={onDispositivoClick}
            onSincronizar={onSincronizarDispositivo}
          />
        ))}
    </div>
  )
}
