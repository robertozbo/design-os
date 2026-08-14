import { useMemo, useState } from 'react'
import data from '@/../product-clinic/sections/agendamento-whatsapp/data.json'
import type {
  AgendamentoWhatsappData,
  ConfigBot,
  Lead,
  OpcaoPasso,
  PreAgendamento,
  ServicoExposto,
} from '@/../product-clinic/sections/agendamento-whatsapp/types'
import {
  AgendamentoWhatsappView,
  type Bolha,
  bolhasIniciais,
  passoPorId,
  resumoServico,
} from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let bolhaSeq = 0

export default function AgendamentoWhatsappPreview() {
  const base = data as unknown as AgendamentoWhatsappData

  const [config, setConfig] = useState<ConfigBot>(base.config)
  const [servicos, setServicos] = useState<ServicoExposto[]>(base.servicos)
  const [preAgendamentos, setPreAgendamentos] = useState<PreAgendamento[]>(base.preAgendamentos)
  const [leads, setLeads] = useState<Lead[]>(base.leads)
  const [passoId, setPassoId] = useState<string>(base.passoInicial)
  const [bolhas, setBolhas] = useState<Bolha[]>(() => bolhasIniciais(base.passos, base.passoInicial))
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  /**
   * O passo de serviço é montado a partir dos serviços expostos, não da lista fixa do data.json —
   * é o que faz o toggle da configuração refletir no chat na hora.
   */
  const passo = useMemo(() => {
    const p = passoPorId(base.passos, passoId)
    if (!p || p.id !== 'servico') return p

    const nomesDoCadastro = new Set(base.servicos.map((s) => s.nome))
    const extras = p.opcoes.filter((o) => !nomesDoCadastro.has(o.rotulo))
    const dosServicos: OpcaoPasso[] = servicos
      .filter((s) => s.exposto)
      .map((s) => ({
        id: s.id,
        rotulo: s.nome,
        descricao: resumoServico(s),
        proximo: 'profissional',
      }))

    return { ...p, opcoes: [...dosServicos, ...extras] }
  }, [base.passos, base.servicos, passoId, servicos])

  const escolher = (opcao: OpcaoPasso) => {
    const destino = passoPorId(base.passos, opcao.proximo)
    if (!destino) return

    setBolhas((prev) => [
      ...prev,
      { id: `p-${++bolhaSeq}`, autor: 'paciente', texto: opcao.rotulo },
      ...destino.bot.map((texto) => ({ id: `b-${++bolhaSeq}`, autor: 'bot' as const, texto })),
    ])
    setPassoId(destino.id)
  }

  const reiniciar = () => {
    setPassoId(base.passoInicial)
    setBolhas(bolhasIniciais(base.passos, base.passoInicial))
  }

  const confirmar = (id: string) => {
    const alvo = preAgendamentos.find((p) => p.id === id)
    setPreAgendamentos((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'confirmado' } : p)))
    pushToast(`${alvo?.paciente ?? 'Pré-agendamento'} confirmado — já está na Agenda`)
  }

  const recusar = (id: string, motivo: string) => {
    const alvo = preAgendamentos.find((p) => p.id === id)
    setPreAgendamentos((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'recusado' } : p)))
    pushToast(`${alvo?.paciente ?? 'Pré-agendamento'} recusado · ${motivo}`)
  }

  const cadastrarLead = (id: string) => {
    const alvo = leads.find((l) => l.id === id)
    setLeads((prev) => prev.filter((l) => l.id !== id))
    pushToast(`${alvo?.nome ?? 'Lead'} enviado para o cadastro de pacientes`)
  }

  const alternarServico = (servicoId: string) => {
    const alvo = servicos.find((s) => s.id === servicoId)
    setServicos((prev) => prev.map((s) => (s.id === servicoId ? { ...s, exposto: !s.exposto } : s)))
    pushToast(`"${alvo?.nome}" ${alvo?.exposto ? 'não aparece mais' : 'agora aparece'} no bot`)
  }

  const salvarConfig = (novo: ConfigBot) => {
    setConfig(novo)
    pushToast('Configuração do bot salva')
  }

  return (
    <>
      <AgendamentoWhatsappView
        dados={base}
        config={config}
        servicos={servicos}
        preAgendamentos={preAgendamentos}
        leads={leads}
        bolhas={bolhas}
        passo={passo}
        onEscolherOpcao={escolher}
        onReiniciarSimulacao={reiniciar}
        onSalvarConfig={salvarConfig}
        onAlternarServicoExposto={alternarServico}
        onConfirmarPreAgendamento={confirmar}
        onRecusarPreAgendamento={recusar}
        onCadastrarLead={cadastrarLead}
        onIaIndisponivel={() => pushToast('Disponível na V2')}
      />

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full rounded-xl border border-emerald-200/80 bg-emerald-50/95 px-4 py-2.5 text-sm text-emerald-900 shadow-lg backdrop-blur-sm dark:border-emerald-900/50 dark:bg-emerald-950/90 dark:text-emerald-100"
          >
            {t.texto}
          </div>
        ))}
      </div>
    </>
  )
}
