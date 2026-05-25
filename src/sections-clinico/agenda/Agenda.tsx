import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-clinico/sections/agenda/data.json'
import type {
  Agendamento,
  FiltroAtivo,
  VisaoAtual,
  VisaoTipo,
  NovoAgendamentoInput,
  StatusAgendamento,
} from '@/../product-clinico/sections/agenda/types'
import { Agenda as AgendaView } from './components/Agenda'

export default function AgendaPreview() {
  const navigate = useNavigate()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(
    data.agendamentos as Agendamento[],
  )
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroAtivo>(data.filtroAtivo as FiltroAtivo)
  const [visaoAtual, setVisaoAtual] = useState<VisaoAtual>(data.visaoAtual as VisaoAtual)

  return (
    <AgendaView
      visaoAtual={visaoAtual}
      diasSemana={data.diasSemana as never}
      agendamentos={agendamentos}
      bloqueios={data.bloqueios as never}
      pendentes={data.pendentes as never}
      proximas={data.proximas as never}
      filtroAtivo={filtroAtivo}
      pacientesAutocomplete={data.pacientesAutocomplete as never}
      onTrocarVisao={(t: VisaoTipo) => setVisaoAtual((v) => ({ ...v, tipo: t }))}
      onNavegarPeriodo={(d) => console.log('navegar período:', d)}
      onSelecionarDia={(iso) => setVisaoAtual((v) => ({ ...v, dataFoco: iso }))}
      onClickSlotVazio={(iso, hora) => console.log('slot vazio:', iso, hora)}
      onClickAgendamento={(id) => console.log('click agendamento:', id)}
      onCriarNovo={() => console.log('criar novo')}
      onSalvarNovo={(input: NovoAgendamentoInput) => {
        const novo: Agendamento = {
          id: `agd-novo-${Date.now()}`,
          pacienteId: input.pacienteId,
          pacienteNome:
            data.pacientesAutocomplete.find((p) => p.id === input.pacienteId)?.nome ||
            'Novo paciente',
          iniciaEm: input.iniciaEm,
          duracaoMin: input.duracaoMin,
          modalidade: input.modalidade,
          status: 'pendente',
          valor: input.valor,
          isEncaixe: input.isEncaixe,
          observacao: input.observacao,
        }
        setAgendamentos((prev) => [...prev, novo])
      }}
      onSalvarEdicao={(id, input) => {
        setAgendamentos((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  iniciaEm: input.iniciaEm,
                  duracaoMin: input.duracaoMin,
                  modalidade: input.modalidade,
                  valor: input.valor,
                  observacao: input.observacao,
                  isEncaixe: input.isEncaixe,
                }
              : a,
          ),
        )
      }}
      onCancelarAgendamento={(id) => {
        setAgendamentos((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: 'cancelado' as StatusAgendamento } : a,
          ),
        )
      }}
      onConfirmarPendente={(id) => {
        setAgendamentos((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: 'confirmado' as StatusAgendamento } : a,
          ),
        )
      }}
      onRemarcarPendente={(id) => console.log('remarcar:', id)}
      onAplicarFiltro={(f) => setFiltroAtivo(f)}
      onLimparFiltros={() => setFiltroAtivo({ status: [], modalidades: [], pacienteIds: [] })}
      onIniciarConsulta={(id) => {
        console.log('iniciar consulta:', id)
        navigate(`/clinico/sections/consulta?agendamento=${id}`)
      }}
      onVerPaciente={(id) => console.log('ver paciente:', id)}
    />
  )
}
