import { useMemo } from 'react'
import data from '@/../product/sections/empregadores/data.json'
import type { Empregador } from '@/../product/sections/empregadores/types'
import { EmpregadorDetail } from './components/EmpregadorDetail'

const EMPREGADOR_ID = 'emp-002'

export default function EmpregadorDetailPreview() {
  const empregador = useMemo<Empregador>(() => {
    const found = data.empregadores.find((e) => e.id === EMPREGADOR_ID)
    return (found ?? data.empregadores[0]) as Empregador
  }, [])

  return (
    <EmpregadorDetail
      empregador={empregador}
      onBackToList={() => console.log('Voltar para lista de empregadores')}
      onEditEmpregador={(id) => console.log('Editar empregador', id)}
      onArchiveEmpregador={(id) => console.log('Arquivar empregador', id)}
      onUnarchiveEmpregador={(id) => console.log('Desarquivar empregador', id)}
      onSelectAlerta={(empId, alertaId) =>
        console.log('Abrir alerta', { empId, alertaId })
      }
      onNavigateToSecao={(empId, secao) =>
        console.log('Ir para seção', { empId, secao })
      }
      onSelectAtividade={(empId, atividadeId) =>
        console.log('Abrir atividade', { empId, atividadeId })
      }
    />
  )
}
