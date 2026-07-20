import { useState } from 'react'
import data from '@/../product-clinico/sections/cobranca/data.json'
import type {
  AbaCobranca,
  CobrancaData,
  FiltroCobranca,
  StatusConvenio,
} from '@/../product-clinico/sections/cobranca/types'
import { Cobranca as CobrancaComponent } from './components/Cobranca'

export default function CobrancaPreview() {
  const [state, setState] = useState<CobrancaData>(data as unknown as CobrancaData)
  const [aba, setAba] = useState<AbaCobranca>('particular')
  const [filtro, setFiltro] = useState<FiltroCobranca>({ busca: '', status: [], periodo: '30d' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        body, [data-nymos-clinico],
        [data-nymos-clinico] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-clinico] .font-mono,
        [data-nymos-clinico] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-clinico="true">
        <CobrancaComponent
          data={state}
          abaAtiva={aba}
          filtro={filtro}
          onChangeAba={setAba}
          onChangeFiltro={setFiltro}
          onNovoLink={() => console.log('Novo link de cobrança')}
          onCopiarLink={(id) => console.log('Copiar link', id)}
          onReenviar={(id) => console.log('Reenviar', id)}
          onEmitirRecibo={(id) => console.log('Emitir recibo', id)}
          onCancelar={(id) =>
            setState((s) => ({
              ...s,
              particulares: s.particulares.map((c) =>
                c.id === id ? { ...c, status: 'cancelado', linkPagamento: null } : c,
              ),
            }))
          }
          onStatusConvenioChange={(id, status: StatusConvenio) =>
            setState((s) => ({
              ...s,
              convenios: s.convenios.map((c) => (c.id === id ? { ...c, status } : c)),
            }))
          }
          onExportarCsv={(a) => console.log('Exportar CSV', a)}
        />
      </div>
    </>
  )
}
