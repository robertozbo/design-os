import type { AtividadesProps, AtividadeViewModel, CategoriaUI } from '@/../product-mobile/sections/atividades/types'
import { StatsRow } from './StatsRow'
import { PeriodoPills } from './PeriodoPills'
import { CategoriaPills } from './CategoriaPills'
import { AtividadeRow } from './AtividadeRow'
import { EmptyState } from './EmptyState'

function applyCategorias(
  atividades: AtividadeViewModel[],
  selected: CategoriaUI[],
): AtividadeViewModel[] {
  if (selected.length === 0) return atividades
  return atividades.filter((a) => selected.includes(a.categoria))
}

export function Atividades({
  data,
  selectedPeriodo,
  onPeriodoChange,
  selectedCategorias,
  onCategoriasChange,
  onAtividadeClick,
  onRegistrarClick,
  onConectarDispositivoClick,
}: AtividadesProps) {
  const visiveis = applyCategorias(data.atividades, selectedCategorias)
  const totalEmpty = data.atividades.length === 0
  const filterEmpty = !totalEmpty && visiveis.length === 0

  return (
    <div className="min-h-full bg-slate-950 pb-6 pt-3">
      {!totalEmpty && <StatsRow stats={data.stats} />}

      {!totalEmpty && (
        <PeriodoPills
          periodos={data.periodos}
          selected={selectedPeriodo}
          onChange={onPeriodoChange}
        />
      )}

      {!totalEmpty && (
        <CategoriaPills
          pills={data.categoriasFiltro}
          selected={selectedCategorias}
          onChange={onCategoriasChange}
        />
      )}

      {totalEmpty && (
        <EmptyState
          type="no-activities"
          onRegistrar={onRegistrarClick}
          onConectarDispositivo={onConectarDispositivoClick}
        />
      )}

      {filterEmpty && <EmptyState type="no-results" />}

      {!totalEmpty &&
        visiveis.map((a) => (
          <AtividadeRow
            key={a.activity.id}
            atividade={a}
            onClick={onAtividadeClick}
          />
        ))}
    </div>
  )
}
