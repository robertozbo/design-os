import { useMemo, useState } from 'react'
import data from '@/../product/sections/cat-logos/data.json'
import type {
  AgregadoCatalogos,
  CatalogoTab,
  FiltrosModelos,
  FiltrosPerigos,
  Instrumento,
  ModeloAvaliacao,
  Perigo,
  ResponsavelLogado,
} from '@/../product/sections/cat-logos/types'
import { CatalogosLibrary } from './components/CatalogosLibrary'

export default function CatalogosLibraryPreview() {
  const [tabAtiva, setTabAtiva] = useState<CatalogoTab>('instrumentos')

  const initialFiltrosPerigos: FiltrosPerigos = useMemo(
    () => ({
      busca: '',
      categoria: 'todas',
      ordenacao: 'alfabetica',
      subTab: 'global',
    }),
    [],
  )
  const [filtrosPerigos, setFiltrosPerigos] =
    useState<FiltrosPerigos>(initialFiltrosPerigos)

  const initialFiltrosModelos: FiltrosModelos = useMemo(
    () => ({ busca: '', instrumentoId: null, ordenacao: 'mais_usado' }),
    [],
  )
  const [filtrosModelos, setFiltrosModelos] =
    useState<FiltrosModelos>(initialFiltrosModelos)

  return (
    <CatalogosLibrary
      responsavelLogado={data.responsavelLogado as ResponsavelLogado}
      agregado={data.agregado as AgregadoCatalogos}
      instrumentos={data.instrumentos as Instrumento[]}
      perigos={data.perigos as Perigo[]}
      modelos={data.modelos as ModeloAvaliacao[]}
      tabAtiva={tabAtiva}
      filtrosPerigos={filtrosPerigos}
      filtrosModelos={filtrosModelos}
      onTabChange={(t) => setTabAtiva(t)}
      onPreviewInstrumento={(id) => console.log('Preview instrumento', id)}
      onFiltrosPerigosChange={(f) => setFiltrosPerigos(f)}
      onSelectPerigo={(id) => console.log('Abrir perigo', id)}
      onAddPerigo={() => console.log('Novo perigo')}
      onEditPerigo={(id) => console.log('Editar perigo', id)}
      onSavePerigo={(input) => console.log('Salvar perigo', input)}
      onArchivePerigo={(id) => console.log('Arquivar perigo', id)}
      onFiltrosModelosChange={(f) => setFiltrosModelos(f)}
      onUseModelo={(id) => console.log('Usar modelo', id)}
      onAddModelo={() => console.log('Novo modelo')}
      onEditModelo={(id) => console.log('Editar modelo', id)}
      onDuplicateModelo={(id) => console.log('Duplicar modelo', id)}
      onSaveModelo={(input) => console.log('Salvar modelo', input)}
      onArchiveModelo={(id) => console.log('Arquivar modelo', id)}
    />
  )
}
