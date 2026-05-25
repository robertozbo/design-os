import { useMemo, useState } from 'react'
import data from '@/../product/sections/relat-rios-de-conformidade/data.json'
import type {
  AgregadoRelatorios,
  AvaliacaoPublicada,
  CicloOpcao,
  EmpregadorContexto,
  FiltrosRelatorios,
  Relatorio,
  ResponsavelTecnico,
} from '@/../product/sections/relat-rios-de-conformidade/types'
import { RelatoriosList } from './components/RelatoriosList'

export default function RelatoriosListPreview() {
  const initial: FiltrosRelatorios = useMemo(
    () => ({
      busca: data.filtrosAtuais.busca ?? '',
      status: (data.filtrosAtuais.status as FiltrosRelatorios['status']) ?? 'todos',
      ciclo: data.filtrosAtuais.ciclo ?? 'todos',
      ordenacao: (data.filtrosAtuais.ordenacao as FiltrosRelatorios['ordenacao']) ?? 'mais_recente',
    }),
    [],
  )
  const [filtros, setFiltros] = useState<FiltrosRelatorios>(initial)

  return (
    <RelatoriosList
      empregadorContexto={data.empregadorContexto as EmpregadorContexto}
      agregado={data.agregado as AgregadoRelatorios}
      ciclosDisponiveis={data.ciclosDisponiveis as CicloOpcao[]}
      responsaveisDisponiveis={data.responsaveisDisponiveis as ResponsavelTecnico[]}
      avaliacoesPublicadas={data.avaliacoesPublicadas as AvaliacaoPublicada[]}
      filtrosAtuais={filtros}
      relatorios={data.relatorios as Relatorio[]}
      onFiltrosChange={(f) => setFiltros(f)}
      onNavigateToNovo={() => console.log('Ir para criação de relatório')}
      onSelectRelatorio={(id) => console.log('Abrir relatório', id)}
      onDownload={(id) => console.log('Download PDF', id)}
      onCopyShareLink={(id) => console.log('Copiar link', id)}
      onReemitir={(id) => console.log('Reemitir', id)}
      onArchive={(id) => console.log('Arquivar', id)}
      onMarkEnviadoMte={(id) => console.log('Marcar enviado MTE', id)}
      onVerifyIntegridade={(id) => console.log('Verificar integridade', id)}
      onCreateRelatorio={(input) => console.log('Criar relatório', input)}
    />
  )
}
