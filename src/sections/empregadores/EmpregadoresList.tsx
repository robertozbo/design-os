import { useMemo, useState } from 'react'
import data from '@/../product/sections/empregadores/data.json'
import type {
  CarteiraResumo,
  Empregador,
  EmpregadorReceitaSnapshot,
  FiltrosEmpregadores,
  ResponsavelTecnico,
} from '@/../product/sections/empregadores/types'
import { EmpregadoresList } from './components/EmpregadoresList'

const FAKE_RECEITA: Record<string, EmpregadorReceitaSnapshot> = {
  '11.222.333/0001-44': {
    cnpj: '11.222.333/0001-44',
    razaoSocial: 'Indústria Atlas Manufatura S.A.',
    nomeFantasia: 'Atlas',
    endereco: 'Av. Industrial, 1240 — São Bernardo do Campo, SP',
  },
}

export default function EmpregadoresListPreview() {
  const initial: FiltrosEmpregadores = useMemo(
    () => ({
      busca: data.filtrosAtuais.busca ?? '',
      status: (data.filtrosAtuais.status as FiltrosEmpregadores['status']) ?? 'ativos',
      ordenacao:
        (data.filtrosAtuais.ordenacao as FiltrosEmpregadores['ordenacao']) ?? 'vigencia_proxima',
      faixaTamanho: (data.filtrosAtuais.faixaTamanho as FiltrosEmpregadores['faixaTamanho']) ?? null,
      vigenciaAte: data.filtrosAtuais.vigenciaAte ?? null,
      coberturaMinima:
        data.filtrosAtuais.coberturaMinima === undefined
          ? null
          : (data.filtrosAtuais.coberturaMinima as number | null),
    }),
    [],
  )
  const [filtros, setFiltros] = useState<FiltrosEmpregadores>(initial)

  return (
    <EmpregadoresList
      carteira={data.carteira as CarteiraResumo}
      empregadores={data.empregadores as Empregador[]}
      responsavelLogado={data.responsavelLogado as ResponsavelTecnico}
      filtrosAtuais={filtros}
      onFiltrosChange={(next) => setFiltros(next)}
      onSelectEmpregador={(id) => console.log('Abrir detalhe do empregador', id)}
      onAddEmpregador={() => console.log('Abrir drawer de novo empregador')}
      onEditEmpregador={(id) => console.log('Editar empregador', id)}
      onSaveEmpregador={(input) => console.log('Salvar empregador', input)}
      onArchiveEmpregador={(id) => console.log('Arquivar empregador', id)}
      onUnarchiveEmpregador={(id) => console.log('Desarquivar empregador', id)}
      onSelectAlerta={(empregadorId, alertaId) =>
        console.log('Abrir alerta', { empregadorId, alertaId })
      }
      onLookupCnpj={async (cnpj) => {
        console.log('Buscar CNPJ', cnpj)
        await new Promise((r) => setTimeout(r, 600))
        return FAKE_RECEITA[cnpj] ?? null
      }}
    />
  )
}
