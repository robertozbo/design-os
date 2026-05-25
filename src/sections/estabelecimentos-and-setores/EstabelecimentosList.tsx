import { useMemo, useState } from 'react'
import data from '@/../product/sections/estabelecimentos-and-setores/data.json'
import type {
  EmpregadorContexto,
  Estabelecimento,
  FiltrosEstabelecimentos,
  GestorSetor,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import { EstabelecimentosList } from './components/EstabelecimentosList'

export default function EstabelecimentosListPreview() {
  const initial: FiltrosEstabelecimentos = useMemo(
    () => ({
      busca: data.filtrosAtuais.busca ?? '',
      tipo: (data.filtrosAtuais.tipo as FiltrosEstabelecimentos['tipo']) ?? 'todos',
      saudeNr1:
        (data.filtrosAtuais.saudeNr1 as FiltrosEstabelecimentos['saudeNr1']) ?? 'todos',
      ordenacao:
        (data.filtrosAtuais.ordenacao as FiltrosEstabelecimentos['ordenacao']) ?? 'maior_risco',
    }),
    [],
  )
  const [filtros, setFiltros] = useState<FiltrosEstabelecimentos>(initial)

  const profissionaisDisponiveis = useMemo<GestorSetor[]>(() => {
    const map = new Map<string, GestorSetor>()
    for (const e of data.estabelecimentos) {
      for (const s of e.setores) {
        if (s.gestor && !map.has(s.gestor.id)) map.set(s.gestor.id, s.gestor as GestorSetor)
      }
    }
    return Array.from(map.values())
  }, [])

  return (
    <EstabelecimentosList
      empregadorContexto={data.empregadorContexto as EmpregadorContexto}
      estabelecimentos={data.estabelecimentos as Estabelecimento[]}
      filtrosAtuais={filtros}
      profissionaisDisponiveis={profissionaisDisponiveis}
      onFiltrosChange={(next) => setFiltros(next)}
      onSelectEstabelecimento={(id) => console.log('Abrir detalhe estab', id)}
      onAddEstabelecimento={() => console.log('Abrir drawer novo estab')}
      onEditEstabelecimento={(id) => console.log('Editar estab', id)}
      onSaveEstabelecimento={(input) => console.log('Salvar estab', input)}
      onArchiveEstabelecimento={(id) => console.log('Arquivar estab', id)}
      onImportCsv={() => console.log('Abrir CSV import')}
      onConfirmCsvImport={(linhas) => console.log('Confirmar CSV import', linhas)}
    />
  )
}
