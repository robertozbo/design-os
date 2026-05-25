import { useState } from 'react'
import data from '@/../product/sections/dashboard-sst/data.json'
import type {
  EmpregadorStatusFiltro,
  Professional,
  CarteiraResumo,
  DashboardKpis,
  EmpregadorResumo,
  NotificacaoSst,
  AtalhoRapido,
  EventosCarteiraResumo,
  JanelaPesquisaCalendario,
} from '@/../product/sections/dashboard-sst/types'
import { DashboardSst } from './components/DashboardSst'

export default function DashboardSstPreview() {
  const [filtroStatus, setFiltroStatus] = useState<EmpregadorStatusFiltro>('todos')
  const [busca, setBusca] = useState('')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-dashboard-sst],
        [data-nymos-dashboard-sst] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-dashboard-sst] .font-mono,
        [data-nymos-dashboard-sst] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-dashboard-sst>
        <DashboardSst
          professional={data.professional as Professional}
          carteiraResumo={data.carteiraResumo as CarteiraResumo}
          kpis={data.kpis as DashboardKpis}
          empregadores={data.empregadores as EmpregadorResumo[]}
          notificacoes={data.notificacoes as NotificacaoSst[]}
          atalhosRapidos={data.atalhosRapidos as AtalhoRapido[]}
          eventosCarteira={data.eventosCarteira as EventosCarteiraResumo}
          calendarioPesquisas={data.calendarioPesquisas as JanelaPesquisaCalendario[]}
          filtroStatus={filtroStatus}
          busca={busca}
          onNovoEmpregador={() => console.log('Novo empregador')}
          onAbrirEmpregador={(id) => console.log('Abrir empregador', id)}
          onAbrirNotificacao={(id) => console.log('Abrir notificação', id)}
          onAtalhoRapido={(id) => console.log('Atalho rápido', id)}
          onFiltrarStatus={(status) => setFiltroStatus(status)}
          onBuscar={(termo) => setBusca(termo)}
          onAbrirVigencia={() => console.log('Abrir vigência')}
          onAbrirEventoCarteira={(empId, evtId) =>
            console.log('Abrir evento carteira', empId, evtId)
          }
          onAbrirEventosDoEmpregador={(empId) =>
            console.log('Abrir eventos do empregador', empId)
          }
          onAbrirJanelaPesquisa={(avId) => console.log('Abrir janela de pesquisa', avId)}
        />
      </div>
    </>
  )
}
