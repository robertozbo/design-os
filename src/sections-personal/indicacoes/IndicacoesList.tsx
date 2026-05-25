import { useState } from 'react'
import data from '@/../product-personal/sections/indicacoes/data.json'
import type {
  AlunoSemApp,
  CanalFiltroId,
  Convite,
  NovoConviteData,
  SortId,
  TabId,
} from '@/../product-personal/sections/indicacoes/types'
import { IndicacoesList as IndicacoesListView } from './components/IndicacoesList'
import { NovoConviteDrawer } from './components/NovoConviteDrawer'

export default function IndicacoesListPreview() {
  const [convites, setConvites] = useState<Convite[]>(
    data.convites as Convite[],
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<TabId>(
    data.selected.tab as TabId,
  )
  const [selectedCanal, setSelectedCanal] = useState<CanalFiltroId>(
    data.selected.canal as CanalFiltroId,
  )
  const [selectedSort, setSelectedSort] = useState<SortId>(
    data.selected.sort as SortId,
  )
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <IndicacoesListView
        convites={convites}
        kpis={data.kpis}
        tabs={data.tabs as never}
        selectedTab={selectedTab}
        canais={data.canais as never}
        selectedCanal={selectedCanal}
        sortOptions={data.sortOptions as never}
        selectedSort={selectedSort}
        emptyStates={data.emptyStates}
        alunosSemApp={data.alunosSemApp as AlunoSemApp[]}
        planoPersonal={data.planoPersonal as 'free' | 'plus' | 'pro'}
        searchQuery={searchQuery}
        onTabChange={setSelectedTab}
        onSearchChange={setSearchQuery}
        onCanalChange={setSelectedCanal}
        onSortChange={setSelectedSort}
        onCreate={() => setDrawerOpen(true)}
        onReenviar={(id) => console.log('reenviar:', id)}
        onCopiarLink={(id) => console.log('copiar link:', id)}
        onMostrarQR={(id) => console.log('mostrar QR:', id)}
        onCancelar={(id) =>
          setConvites((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...c,
                    status: 'cancelado',
                    canceladoEm: new Date().toISOString(),
                  }
                : c,
            ),
          )
        }
        onExcluir={(id) =>
          setConvites((prev) => prev.filter((c) => c.id !== id))
        }
        onRestaurar={(id) =>
          setConvites((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...c,
                    status: 'pendente',
                    canceladoEm: undefined,
                    motivoCancelamento: undefined,
                  }
                : c,
            ),
          )
        }
        onOpenFichaAluno={(id) => console.log('open ficha aluno:', id)}
        onUpgrade={() => console.log('upgrade plus')}
        onClearFilters={() => {
          setSearchQuery('')
          setSelectedCanal('todos')
        }}
      />

      <NovoConviteDrawer
        open={drawerOpen}
        alunosSemApp={data.alunosSemApp as AlunoSemApp[]}
        onClose={() => setDrawerOpen(false)}
        onSave={(d: NovoConviteData) => {
          console.log('novo convite:', d)
          setDrawerOpen(false)
        }}
      />
    </>
  )
}
