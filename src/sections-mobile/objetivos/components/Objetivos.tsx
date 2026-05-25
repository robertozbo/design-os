import type { ObjetivosProps, ObjetivoViewModel } from '@/../product-mobile/sections/objetivos/types'
import type { GoalStatus } from '@/../product-mobile/api-types'
import { StatsRow } from './StatsRow'
import { StatusPills } from './StatusPills'
import { ObjetivoCard } from './ObjetivoCard'
import { EmptyState } from './EmptyState'

function applyStatus(objetivos: ObjetivoViewModel[], status: GoalStatus): ObjetivoViewModel[] {
  return objetivos.filter((o) => o.goal.status === status)
}

export function Objetivos({
  data,
  selectedStatus,
  onStatusChange,
  onObjetivoClick,
  onCriarClick,
}: ObjetivosProps) {
  const visiveis = applyStatus(data.objetivos, selectedStatus)
  const totalEmpty = data.objetivos.length === 0
  const filterEmpty = !totalEmpty && visiveis.length === 0

  return (
    <div className="min-h-full bg-slate-950 pb-6 pt-3">
      {!totalEmpty && <StatsRow stats={data.stats} />}
      {!totalEmpty && (
        <StatusPills filtros={data.filtros} selected={selectedStatus} onChange={onStatusChange} />
      )}

      {totalEmpty && <EmptyState type="no-goals" onCriar={onCriarClick} />}
      {filterEmpty && <EmptyState type="no-results" />}

      {!totalEmpty &&
        visiveis.map((o) => (
          <ObjetivoCard key={o.goal.id} objetivo={o} onClick={onObjetivoClick} />
        ))}
    </div>
  )
}
