import { useMemo, useState } from 'react'
import data from '@/../product/sections/trabalhadores/data.json'
import type {
  AgregadoTrabalhadores,
  EmpregadorContexto,
  EstabelecimentoLite,
  FiltrosTrabalhadores,
  SetorLite,
  Trabalhador,
} from '@/../product/sections/trabalhadores/types'
import { TrabalhadoresList } from './components/TrabalhadoresList'

export default function TrabalhadoresListPreview() {
  const initial: FiltrosTrabalhadores = useMemo(
    () => ({
      busca: data.filtrosAtuais.busca ?? '',
      estabelecimentoId:
        (data.filtrosAtuais.estabelecimentoId as string | null) ?? null,
      setorId: (data.filtrosAtuais.setorId as string | null) ?? null,
      idioma:
        (data.filtrosAtuais.idioma as FiltrosTrabalhadores['idioma']) ?? 'todos',
      comAcessibilidade: data.filtrosAtuais.comAcessibilidade ?? false,
      statusCampanha:
        (data.filtrosAtuais.statusCampanha as FiltrosTrabalhadores['statusCampanha']) ?? 'todos',
      ordenacao:
        (data.filtrosAtuais.ordenacao as FiltrosTrabalhadores['ordenacao']) ?? 'alfabetica',
    }),
    [],
  )
  const [filtros, setFiltros] = useState<FiltrosTrabalhadores>(initial)

  return (
    <TrabalhadoresList
      empregadorContexto={data.empregadorContexto as EmpregadorContexto}
      agregado={data.agregado as AgregadoTrabalhadores}
      estabelecimentos={data.estabelecimentos as EstabelecimentoLite[]}
      setores={data.setores as SetorLite[]}
      trabalhadores={data.trabalhadores as Trabalhador[]}
      filtrosAtuais={filtros}
      onFiltrosChange={(next) => setFiltros(next)}
      onSelectTrabalhador={(id) => console.log('Abrir detalhe trabalhador', id)}
      onAddTrabalhador={() => console.log('Abrir drawer novo trabalhador')}
      onEditTrabalhador={(id) => console.log('Editar trabalhador', id)}
      onSaveTrabalhador={(input) => console.log('Salvar trabalhador', input)}
      onArchiveTrabalhador={(id) => console.log('Arquivar trabalhador', id)}
      onInviteNymos={(id) => console.log('Convidar para Nymos', id)}
      onImportCsv={() => console.log('Abrir CSV import de trabalhadores')}
      onConfirmCsvImport={(linhas) => console.log('Confirmar CSV', linhas)}
      onNavigateToSetor={(estabId, setorId) =>
        console.log('Ir para Setor', { estabId, setorId })
      }
    />
  )
}
