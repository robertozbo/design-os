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
  horaDaBolha,
  horariosLivres,
  passoPorId,
  resumoServico,
} from './components'

interface Toast {
  id: number
  texto: string
}

/** Escolhas acumuladas na conversa. `medicoId` vazio = "primeiro horário disponível". */
interface Escolha {
  servico?: ServicoExposto
  medicoId?: string
  medicoNome?: string
  data?: string
  hora?: string
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

  /** O que o paciente já escolheu — é o que alimenta os passos seguintes e o resumo final. */
  const [escolha, setEscolha] = useState<Escolha>({})

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  /**
   * Serviço, profissional e hora **não** têm lista fixa no JSON: são calculados na hora, do cadastro
   * de serviços expostos, de quem atende aquele serviço e dos vãos livres da agenda do dia. O que o
   * `data.json` guarda de cada um desses passos é só o escape ("não achei o que preciso", "ver outro
   * dia"). É isso que mantém o bot preso à agenda em vez de recitar horários inventados.
   */
  const passo = useMemo(() => {
    const p = passoPorId(base.passos, passoId)
    if (!p) return p

    if (p.id === 'servico') {
      const dosServicos: OpcaoPasso[] = servicos
        .filter((s) => s.exposto)
        .map((s) => ({ id: s.id, rotulo: s.nome, descricao: resumoServico(s), proximo: 'profissional' }))
      return { ...p, opcoes: [...dosServicos, ...p.opcoes] }
    }

    if (p.id === 'profissional') {
      const elegiveis = base.profissionais.filter((m) => !escolha.servico || m.servicos.includes(escolha.servico.id))
      const opcoes: OpcaoPasso[] = [
        {
          id: 'qualquer',
          rotulo: 'Primeiro horário disponível',
          descricao: 'Qualquer profissional — o mais cedo possível',
          proximo: 'data',
        },
        ...elegiveis.map((m) => ({
          id: m.id,
          rotulo: m.nome,
          descricao: m.especialidade,
          proximo: 'data',
        })),
      ]
      return { ...p, opcoes }
    }

    if (p.id === 'hora') {
      const elegiveis = base.profissionais.filter(
        (m) =>
          (!escolha.servico || m.servicos.includes(escolha.servico.id)) &&
          (!escolha.medicoId || m.id === escolha.medicoId),
      )
      const livres = horariosLivres(base.agendaDoDia, escolha.servico?.duracaoMin ?? 30, elegiveis)
      const opcoes: OpcaoPasso[] = [
        ...livres.map((h) => ({
          id: `${h.hora}-${h.medicoId}`,
          rotulo: h.hora,
          descricao: h.medicoNome,
          proximo: 'confirmacao',
        })),
        ...p.opcoes,
      ]
      return { ...p, opcoes }
    }

    return p
  }, [base.passos, base.profissionais, base.agendaDoDia, passoId, servicos, escolha])

  const escolher = (opcao: OpcaoPasso) => {
    const destino = passoPorId(base.passos, opcao.proximo)
    if (!destino) return

    // Registra a escolha ANTES de montar as bolhas: o resumo da confirmação sai daqui.
    const atual: Escolha = { ...escolha }
    if (passoId === 'servico') atual.servico = servicos.find((s) => s.id === opcao.id)
    if (passoId === 'profissional') {
      atual.medicoId = opcao.id === 'qualquer' ? undefined : opcao.id
      atual.medicoNome = opcao.id === 'qualquer' ? undefined : opcao.rotulo
    }
    if (passoId === 'data') atual.data = opcao.rotulo
    if (passoId === 'hora' && opcao.id !== 'outro-dia') {
      atual.hora = opcao.rotulo
      atual.medicoNome = opcao.descricao ?? atual.medicoNome
    }
    setEscolha(atual)

    const resumo = [
      atual.servico?.nome,
      atual.data && atual.hora ? `${atual.data}, ${atual.hora}` : undefined,
      atual.medicoNome,
    ]
      .filter(Boolean)
      .join(' · ')

    setBolhas((prev) => {
      const novas: Bolha[] = [
        { id: `p-${++bolhaSeq}`, autor: 'paciente', texto: opcao.rotulo, hora: '' },
        ...destino.bot.map((texto) => ({
          id: `b-${++bolhaSeq}`,
          autor: 'bot' as const,
          texto: texto.replace('{{resumo}}', resumo),
          hora: '',
        })),
      ]
      // A hora sai da posição na conversa, não do relógio — screenshot precisa ser reprodutível.
      return [...prev, ...novas].map((b, i) => ({ ...b, hora: horaDaBolha(i) }))
    })
    setPassoId(destino.id)
  }

  /** Passo `entrada`: o paciente digitou os próprios dados em vez de escolher opção. */
  const enviarTexto = (texto: string) => {
    if (!passo?.proximo) return
    const destino = passoPorId(base.passos, passo.proximo)
    if (!destino) return

    setBolhas((prev) => {
      const novas: Bolha[] = [
        { id: `p-${++bolhaSeq}`, autor: 'paciente', texto, hora: '' },
        ...destino.bot.map((t) => ({ id: `b-${++bolhaSeq}`, autor: 'bot' as const, texto: t, hora: '' })),
      ]
      return [...prev, ...novas].map((b, i) => ({ ...b, hora: horaDaBolha(i) }))
    })
    setPassoId(destino.id)
  }

  const reiniciar = () => {
    setPassoId(base.passoInicial)
    setBolhas(bolhasIniciais(base.passos, base.passoInicial))
    setEscolha({})
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
        onEnviarTexto={enviarTexto}
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
