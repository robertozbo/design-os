import type { InicioProps } from '@/../product-clinico/sections/inicio/types'
import { HeroBlock } from './HeroBlock'
import { KpiStrip } from './KpiStrip'
import { ProximaConsultaCard } from './ProximaConsultaCard'
import { AgendaDoDia } from './AgendaDoDia'
import { PacientesAtencaoPanel } from './PacientesAtencaoPanel'

export function Inicio({
  profissional,
  saudacao,
  kpis,
  proximaConsulta,
  agendaHoje,
  pacientesAtencao,
  onAbrirConsulta,
  onIniciarConsulta,
  onAbrirPacienteAtencao,
  onAbrirKpi,
  onFiltrarAgenda,
  onAbrirPerfil,
}: InicioProps) {
  return (
    <div
      data-clinico-inicio
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">
        <HeroBlock
          profissional={profissional}
          saudacao={saudacao}
          onAbrirPerfil={onAbrirPerfil}
        />

        <div className="mt-6">
          <KpiStrip kpis={kpis} onAbrirKpi={onAbrirKpi} />
        </div>

        <div className="mt-6">
          <ProximaConsultaCard
            consulta={proximaConsulta}
            onIniciar={() =>
              proximaConsulta && onIniciarConsulta?.(proximaConsulta.agendamentoId)
            }
            onVerPaciente={() =>
              proximaConsulta && onAbrirConsulta?.(proximaConsulta.agendamentoId)
            }
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <AgendaDoDia
              agenda={agendaHoje}
              proximoAgendamentoId={proximaConsulta?.agendamentoId}
              onAbrirConsulta={onAbrirConsulta}
              onIniciarConsulta={onIniciarConsulta}
              onFiltrar={onFiltrarAgenda}
            />
          </div>
          <div className="min-w-0">
            <PacientesAtencaoPanel
              pacientes={pacientesAtencao}
              onAbrir={onAbrirPacienteAtencao}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
