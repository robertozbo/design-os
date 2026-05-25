import { useMemo } from 'react'
import type { DashboardSstProps } from '@/../product/sections/dashboard-sst/types'
import { Search } from 'lucide-react'
import { DashboardHeader } from './DashboardHeader'
import { KpiStrip } from './KpiStrip'
import { AtalhosRapidos } from './AtalhosRapidos'
import { StatusFilters } from './StatusFilters'
import { EmpregadorList } from './EmpregadorList'
import { NotificacoesPanel } from './NotificacoesPanel'
import { EventosCarteiraWidget } from './EventosCarteiraWidget'
import { CalendarioPesquisas } from './CalendarioPesquisas'

export function DashboardSst({
  professional,
  carteiraResumo,
  kpis,
  empregadores,
  notificacoes,
  atalhosRapidos,
  eventosCarteira,
  calendarioPesquisas,
  filtroStatus,
  busca,
  onNovoEmpregador,
  onAbrirEmpregador,
  onAbrirNotificacao,
  onAtalhoRapido,
  onFiltrarStatus,
  onBuscar,
  onAbrirVigencia,
  onAbrirEventoCarteira,
  onAbrirEventosDoEmpregador,
  onAbrirJanelaPesquisa,
}: DashboardSstProps) {
  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return empregadores.filter((emp) => {
      const matchStatus = filtroStatus === 'todos' || emp.status === filtroStatus
      const matchBusca =
        termo === '' ||
        emp.razaoSocial.toLowerCase().includes(termo) ||
        emp.cnpj.replace(/[^0-9]/g, '').includes(termo.replace(/[^0-9]/g, ''))
      return matchStatus && matchBusca
    })
  }, [empregadores, filtroStatus, busca])

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <DashboardHeader
          professional={professional}
          carteira={carteiraResumo}
          onNovoEmpregador={onNovoEmpregador}
          onAbrirVigencia={onAbrirVigencia}
        />

        <div className="mt-7">
          <KpiStrip kpis={kpis} onAbrirVigencia={onAbrirVigencia} />
        </div>

        <div className="mt-5">
          <AtalhosRapidos atalhos={atalhosRapidos} onAtalhoRapido={onAtalhoRapido} />
        </div>

        {calendarioPesquisas && calendarioPesquisas.length > 0 && (
          <div className="mt-5">
            <CalendarioPesquisas
              janelas={calendarioPesquisas}
              onAbrirJanelaPesquisa={onAbrirJanelaPesquisa}
            />
          </div>
        )}

        {eventosCarteira && (
          <div className="mt-5">
            <EventosCarteiraWidget
              resumo={eventosCarteira}
              onAbrirEvento={onAbrirEventoCarteira}
              onAbrirEventosDoEmpregador={onAbrirEventosDoEmpregador}
            />
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] gap-6">
          <div className="min-w-0">
            <div
              style={{ animationDelay: '420ms' }}
              className="nymos-reveal opacity-0 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Empregadores
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  Mostrando {filtrados.length} de {empregadores.length}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                <StatusFilters ativo={filtroStatus} carteira={carteiraResumo} onChange={onFiltrarStatus} />
                <div className="relative sm:max-w-xs sm:w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                  <input
                    type="search"
                    value={busca}
                    onChange={(e) => onBuscar?.(e.target.value)}
                    placeholder="Buscar por razão social ou CNPJ"
                    className="
                      w-full pl-9 pr-3 py-2 rounded-xl
                      bg-white/80 dark:bg-slate-900/40
                      border border-slate-200 dark:border-slate-800
                      placeholder:text-slate-400 dark:placeholder:text-slate-500
                      text-sm text-slate-700 dark:text-slate-200
                      focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                      transition
                    "
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <EmpregadorList
                empregadores={filtrados}
                onAbrirEmpregador={onAbrirEmpregador}
                onNovoEmpregador={onNovoEmpregador}
              />
            </div>
          </div>

          <div className="min-w-0">
            <NotificacoesPanel
              notificacoes={notificacoes}
              onAbrirNotificacao={onAbrirNotificacao}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
