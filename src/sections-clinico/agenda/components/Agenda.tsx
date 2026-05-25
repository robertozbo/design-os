import { useMemo, useState } from 'react'
import type {
  AgendaProps,
  Agendamento,
  StatusAgendamento,
  Modalidade,
} from '@/../product-clinico/sections/agenda/types'
import { AgendaToolbar } from './AgendaToolbar'
import { CalendarGrid } from './CalendarGrid'
import { AgendaSidebar } from './AgendaSidebar'
import { NovoConsultaDrawer } from './NovoConsultaDrawer'
import { getIsoDia } from './helpers'

export function Agenda({
  visaoAtual,
  diasSemana,
  agendamentos,
  bloqueios,
  pendentes,
  proximas,
  filtroAtivo,
  pacientesAutocomplete,
  onTrocarVisao,
  onNavegarPeriodo,
  onSelecionarDia,
  onClickSlotVazio,
  onClickAgendamento,
  onCriarNovo,
  onSalvarNovo,
  onSalvarEdicao,
  onCancelarAgendamento,
  onConfirmarPendente,
  onRemarcarPendente,
  onAplicarFiltro,
  onLimparFiltros,
  onIniciarConsulta,
  onVerPaciente,
}: AgendaProps) {
  const [drawerAberto, setDrawerAberto] = useState(false)
  const [drawerModo, setDrawerModo] = useState<'novo' | 'edicao'>('novo')
  const [agendamentoEdit, setAgendamentoEdit] = useState<Agendamento | null>(null)
  const [slotInicial, setSlotInicial] = useState<{ iso: string; hora: string } | null>(null)

  const diasComConsulta = useMemo(() => {
    const set = new Set<string>()
    agendamentos.forEach((a) => set.add(getIsoDia(a.iniciaEm)))
    return set
  }, [agendamentos])

  // Apply filters
  const agendamentosVisiveis = useMemo(() => {
    return agendamentos.filter((a) => {
      if (
        filtroAtivo.status.length > 0 &&
        !filtroAtivo.status.includes(a.status as StatusAgendamento)
      )
        return false
      if (
        filtroAtivo.modalidades.length > 0 &&
        !filtroAtivo.modalidades.includes(a.modalidade as Modalidade)
      )
        return false
      if (filtroAtivo.pacienteIds.length > 0 && !filtroAtivo.pacienteIds.includes(a.pacienteId))
        return false
      return true
    })
  }, [agendamentos, filtroAtivo])

  const abrirDrawerNovo = (slot?: { iso: string; hora: string }) => {
    setDrawerModo('novo')
    setAgendamentoEdit(null)
    setSlotInicial(slot || null)
    setDrawerAberto(true)
    if (!slot) onCriarNovo?.()
    else onClickSlotVazio?.(slot.iso, slot.hora)
  }

  const abrirDrawerEdicao = (id: string) => {
    const ag = agendamentos.find((a) => a.id === id) || null
    setDrawerModo('edicao')
    setAgendamentoEdit(ag)
    setSlotInicial(null)
    setDrawerAberto(true)
    onClickAgendamento?.(id)
  }

  return (
    <div
      data-clinico-agenda
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      <AgendaToolbar
        visaoAtual={visaoAtual}
        onTrocarVisao={onTrocarVisao}
        onNavegarPeriodo={onNavegarPeriodo}
        onCriarNovo={() => abrirDrawerNovo()}
      />

      <div className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-6 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Sidebar */}
          <div className="w-full shrink-0 md:sticky md:top-[78px] md:w-[280px] md:max-h-[calc(100vh-94px)] md:overflow-y-auto md:pr-1">
            <AgendaSidebar
              isoFoco={visaoAtual.dataFoco}
              diasComConsulta={diasComConsulta}
              pendentes={pendentes}
              proximas={proximas}
              filtroAtivo={filtroAtivo}
              onSelecionarDia={onSelecionarDia}
              onConfirmarPendente={onConfirmarPendente}
              onRemarcarPendente={(id) => {
                onRemarcarPendente?.(id)
                abrirDrawerEdicao(id)
              }}
              onCancelarPendente={(id) => onCancelarAgendamento?.(id)}
              onIniciarConsulta={onIniciarConsulta}
              onVerPaciente={onVerPaciente}
              onAplicarFiltro={onAplicarFiltro}
              onLimparFiltros={onLimparFiltros}
            />
          </div>

          {/* Grid */}
          <div className="min-w-0 flex-1">
            <CalendarGrid
              diasSemana={diasSemana}
              agendamentos={agendamentosVisiveis}
              bloqueios={bloqueios}
              onClickSlotVazio={(iso, hora) => abrirDrawerNovo({ iso, hora })}
              onClickAgendamento={abrirDrawerEdicao}
            />
          </div>
        </div>
      </div>

      <NovoConsultaDrawer
        aberto={drawerAberto}
        modo={drawerModo}
        agendamentoEdit={agendamentoEdit}
        slotInicial={slotInicial}
        pacientes={pacientesAutocomplete}
        onFechar={() => setDrawerAberto(false)}
        onSalvarNovo={(input) => {
          onSalvarNovo?.(input)
          setDrawerAberto(false)
        }}
        onSalvarEdicao={(id, input) => {
          onSalvarEdicao?.(id, input)
          setDrawerAberto(false)
        }}
        onCancelarAgendamento={(id) => {
          onCancelarAgendamento?.(id)
          setDrawerAberto(false)
        }}
      />
    </div>
  )
}
