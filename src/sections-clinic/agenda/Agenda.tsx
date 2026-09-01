import { useState } from 'react'
import data from '@/../product-clinic/sections/agenda/data.json'
import type {
  Agendamento,
  AgendaDia,
  FinanceiroAgendamento,
  StatusConsulta,
  VisaoAgenda,
} from '@/../product-clinic/sections/agenda/types'
import {
  AgendaView,
  AgendamentoDrawer,
  AgendamentoForm,
  acharConflito,
  addDias,
  dataCurta,
  datasDaSerie,
  somaMinutos,
  type AgendamentoSubmit,
} from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let novoAgSeq = 0

/**
 * Distribui a cobrança pelas ocorrências da série.
 *
 * - **Por sessão**: o valor é de cada consulta → cada ocorrência leva a conta que vence no seu dia.
 *   Assim faltar/cancelar uma sessão mexe só na conta dela, e o repasse por médico fecha por
 *   atendimento realizado.
 * - **Mensal/pacote**: a cobrança é da série inteira → fica na primeira ocorrência criada.
 */
function cobrancaDe(
  financeiro: FinanceiroAgendamento | undefined,
  /** Posição da ocorrência na série pedida — as contas são geradas na mesma ordem. */
  indice: number,
  primeira: boolean,
  emSerie: boolean,
): { financeiro?: FinanceiroAgendamento } {
  if (!financeiro) return {}
  if (financeiro.modeloCobranca !== 'sessao' || !emSerie) {
    return primeira ? { financeiro } : {}
  }
  // Por índice, não por data: o vencimento é editável e casar por ele perderia a conta.
  const conta = financeiro.contas[indice]
  if (!conta) return {}
  return { financeiro: { ...financeiro, valor: conta.valor, parcelas: 1, contas: [conta] } }
}

function iniciaisDe(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

export default function AgendaPreview() {
  const agendaBase = data as unknown as AgendaDia

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(agendaBase.agendamentos)
  // Dia visível na grade — navegável, então consulta criada em outra data continua alcançável.
  const [diaAtual, setDiaAtual] = useState(agendaBase.data)
  const [visao, setVisao] = useState<VisaoAgenda>('medicos')
  const [selecionado, setSelecionado] = useState<Agendamento | null>(null)
  const [formAberto, setFormAberto] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  // O grid mostra um dia só — o `diaAtual`. Os demais continuam no estado, alcançáveis pelos ‹ ›.
  const agenda: AgendaDia = {
    ...agendaBase,
    data: diaAtual,
    agendamentos: agendamentos.filter((a) => a.data === diaAtual),
  }
  const emEdicao = editId ? agendamentos.find((a) => a.id === editId) ?? null : null

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200)
  }

  const abrirCriar = () => {
    setEditId(null)
    setFormAberto(true)
  }

  const abrirEditar = (a: Agendamento) => {
    setSelecionado(null)
    setEditId(a.id)
    setFormAberto(true)
  }

  const fecharForm = () => {
    setFormAberto(false)
    setEditId(null)
  }

  const servicoRetorno = agendaBase.servicos.find((s) => s.nome === 'Retorno')

  const salvar = (values: AgendamentoSubmit, id: string | null) => {
    const medico = agenda.medicos.find((m) => m.id === values.medicoId)
    // O serviço agora é campo próprio (`servicoId`), então a observação é só a observação.
    // `duracaoMin` já está refletido em `fim`; `diaVencimento` já foi consumido nas parcelas.
    const observacao = values.observacao
    const base = {
      medicoId: values.medicoId,
      salaId: values.salaId,
      pacienteNome: values.pacienteNome,
      inicio: values.inicio,
      fim: values.fim,
      modalidade: values.modalidade,
      observacao,
      especialidade: medico?.especialidade ?? '',
      cor: medico?.cor ?? 'slate',
      pacienteIniciais: iniciaisDe(values.pacienteNome),
      servicoId: values.servicoId || undefined,
      convenio: values.convenio,
    }
    // Só vira cobrança se houver valor: passar batido pela etapa financeira não pode criar uma
    // conta a receber de R$ 0,00.
    const total = values.contas.reduce((s, c) => s + c.valor, 0)
    const financeiro: FinanceiroAgendamento | undefined =
      values.gerarFinanceiro && total > 0
        ? {
            valor: total,
            formaPagamento: values.formaPagamento,
            modeloCobranca: values.modeloCobranca,
            parcelas: values.contas.length,
            contas: values.contas,
          }
        : undefined

    // O grid mostra só o dia visível — avisa quando o agendamento cai fora dele.
    const foraDoDia = (data: string) =>
      data !== diaAtual ? ` · ${dataCurta(data)}, use ‹ › para ver` : ''

    if (id) {
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...base, data: values.data, financeiro } : a)),
      )
      pushToast(`Agendamento de ${values.pacienteNome} atualizado${foraDoDia(values.data)}`)
      fecharForm()
      return
    }

    // Série recorrente: uma ocorrência por data, pulando as que colidem com a agenda.
    const datas = datasDaSerie(values.data, values.recorrencia, values.repeticoes)
    const criados: Agendamento[] = []
    const pulados: string[] = []
    for (let i = 0; i < datas.length; i++) {
      const data = datas[i]
      const janela = { data, inicio: values.inicio, fim: values.fim, medicoId: values.medicoId, salaId: values.salaId, modalidade: values.modalidade }
      // Confere contra os já existentes E contra os que acabamos de criar nesta série.
      if (acharConflito([...agendamentos, ...criados], janela)) {
        pulados.push(dataCurta(data))
        continue
      }
      criados.push({
        id: `ag-novo-${++novoAgSeq}`,
        ...base,
        data,
        status: 'pendente',
        ...cobrancaDe(financeiro, i, criados.length === 0, datas.length > 1),
      })
    }
    if (criados.length === 0) {
      pushToast(`Nenhuma consulta criada — todas as datas em conflito (${pulados.join(', ')})`)
      return
    }
    // Retorno de cortesia: nasce a partir da última sessão criada, sem cobrança.
    let retornoCriado: string | null = null
    // O retorno pulado é anunciado à parte — `pulados` fala de consultas da série.
    let retornoPulado: string | null = null
    if (values.agendarRetorno) {
      const ultima = criados[criados.length - 1]
      const dataRet = addDias(ultima.data, values.retornoDias)
      const janelaRet = {
        data: dataRet,
        inicio: values.inicio,
        fim: values.fim,
        medicoId: values.medicoId,
        salaId: values.salaId,
        modalidade: values.modalidade,
      }
      // O retorno tem a duração do PRÓPRIO serviço "Retorno", não a da consulta de origem.
      const fimRet = servicoRetorno
        ? somaMinutos(values.inicio, servicoRetorno.duracaoMin)
        : values.fim
      janelaRet.fim = fimRet
      if (acharConflito([...agendamentos, ...criados], janelaRet)) {
        retornoPulado = dataCurta(dataRet)
      } else {
        criados.push({
          id: `ag-novo-${++novoAgSeq}`,
          ...base,
          // O retorno usa o serviço "Retorno" do cadastro, quando ele existe.
          servicoId: servicoRetorno?.id ?? base.servicoId,
          data: dataRet,
          fim: fimRet,
          status: 'pendente',
          retornoDe: criados[0].id,
          // Cortesia: sem `financeiro` de propósito.
        })
        retornoCriado = dataCurta(dataRet)
      }
    }

    // Marca a série sempre que o usuário pediu recorrência, mesmo que sobre uma ocorrência só.
    const daSerie = values.recorrencia !== 'Não repetir'
    const serieId = criados[0].id
    const serie = daSerie ? criados.map((a) => (a.retornoDe ? a : { ...a, serieId })) : criados
    // O retorno é anunciado à parte — não conta como "consulta agendada" da série.
    const consultas = serie.filter((a) => !a.retornoDe)
    setAgendamentos((prev) => [...prev, ...serie])

    const comRetorno = retornoCriado
      ? ` · retorno em ${retornoCriado} (cortesia)`
      : retornoPulado
        ? ` · retorno de ${retornoPulado} não criado (horário ocupado)`
        : ''
    const puladas = pulados.length
      ? ` · ${pulados.length} pulada${pulados.length === 1 ? '' : 's'} por conflito (${pulados.join(', ')})`
      : ''
    if (consultas.length === 1) {
      pushToast(
        `Consulta agendada · ${values.inicio} ${values.pacienteNome}${foraDoDia(consultas[0].data)}${comRetorno}${puladas}`,
      )
    } else {
      const noDia = consultas.filter((a) => a.data === diaAtual).length
      pushToast(
        `${consultas.length} consultas agendadas · ${noDia} neste dia, ${consultas.length - noDia} em outros dias${comRetorno}${puladas}`,
      )
    }
    fecharForm()
  }

  const setStatus = (id: string, status: StatusConsulta) => {
    setAgendamentos((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    setSelecionado((s) => (s && s.id === id ? { ...s, status } : s))
    const label: Record<StatusConsulta, string> = {
      pendente: 'marcada como pendente',
      confirmado: 'confirmada',
      chegou: 'com chegada registrada',
      'em-atendimento': 'iniciada',
      realizado: 'marcada como realizada',
      cancelado: 'cancelada',
      faltou: 'marcada como falta',
    }
    pushToast(`Consulta ${label[status]}`)
    if (status === 'cancelado') setSelecionado(null)
  }

  return (
    <div className="h-[calc(100vh-3.25rem)]">
      <AgendaView
        agenda={agenda}
        visao={visao}
        onVisao={setVisao}
        onDia={(delta) => setDiaAtual((d) => addDias(d, delta))}
        onHoje={() => setDiaAtual(agendaBase.data)}
        onNovo={abrirCriar}
        onAbrir={(a) => setSelecionado(a)}
      />

      <AgendamentoDrawer
        agendamento={selecionado}
        medicos={agenda.medicos}
        salas={agenda.salas}
        onClose={() => setSelecionado(null)}
        onStatus={setStatus}
        onEntrarVideo={() => pushToast('Abrindo sala de vídeo (mock)')}
        onEditar={abrirEditar}
      />

      {formAberto && (
        <AgendamentoForm
          key={editId ?? 'novo'}
          agendamento={emEdicao}
          medicos={agenda.medicos}
          salas={agenda.salas}
          pacientes={agenda.pacientes}
          servicos={agenda.servicos}
          convenios={agenda.convenios}
          dataAgenda={agenda.data}
          horaInicio={agenda.horaInicio}
          horaFim={agenda.horaFim}
          agendamentos={agendamentos}
          onClose={fecharForm}
          onSalvar={salvar}
        />
      )}

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[55] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full rounded-xl border border-emerald-200/80 bg-emerald-50/95 px-4 py-2.5 text-sm text-emerald-900 shadow-lg backdrop-blur-sm dark:border-emerald-900/50 dark:bg-emerald-950/90 dark:text-emerald-100"
          >
            {t.texto}
          </div>
        ))}
      </div>
    </div>
  )
}
