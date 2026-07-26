import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  Package,
  RefreshCw,
  Search,
  User,
  X,
} from 'lucide-react'
import type {
  Agendamento,
  ContaAgendamento,
  ConvenioAgenda,
  MedicoAgenda,
  Modalidade,
  ModeloCobranca,
  PacienteAgenda,
  Recorrencia,
  SalaAgenda,
  ServicoAgenda,
} from '@/../product-medical-clinic/sections/agenda/types'
import { acharConflito, addDias, addMeses, datasDaSerie, dataCurta, minutos } from './helpers'

export interface AgendamentoFormValues {
  pacienteNome: string
  medicoId: string
  salaId: string
  modalidade: Modalidade
  /** Serviço do cadastro — define preço de tabela e duração. Vazio = encaixe, sem cobrança. */
  servicoId: string
  /** Convênio que define o desconto sobre a tabela. */
  convenio: string
  /** Agendar um retorno de cortesia junto. */
  agendarRetorno: boolean
  /** Em quantos dias o retorno cai. */
  retornoDias: number
  duracaoMin: number
  recorrencia: Recorrencia
  /** Quantas ocorrências criar (1 = só esta). Ignorado se `recorrencia` é "Não repetir". */
  repeticoes: number
  /** Dia da consulta, "YYYY-MM-DD". */
  data: string
  inicio: string
  fim: string
  observacao: string
  gerarFinanceiro: boolean
  modeloCobranca: ModeloCobranca
  formaPagamento: string
  parcelas: number
  diaVencimento: number
}

/** O que o form entrega ao salvar: os campos + as parcelas revisadas na etapa financeira. */
export interface AgendamentoSubmit extends AgendamentoFormValues {
  contas: ContaAgendamento[]
}

/** Linha editável do resumo de pagamentos — mesma forma da conta a receber gerada. */
export type LinhaPagamento = ContaAgendamento

interface Props {
  /** Agendamento em edição — `null` = modo criar. O pai monta/desmonta o form. */
  agendamento: Agendamento | null
  medicos: MedicoAgenda[]
  salas: SalaAgenda[]
  /** Pool de pacientes da clínica — para selecionar ao agendar. */
  pacientes: PacienteAgenda[]
  /** Catálogo de serviços — fonte do preço de tabela e da duração. */
  servicos: ServicoAgenda[]
  /** Convênios aceitos e seus descontos. */
  convenios: ConvenioAgenda[]
  /** Dia aberto na agenda (ISO) — data pré-selecionada ao criar. */
  dataAgenda: string
  /** Limites do grid de horários, "HH:MM". */
  horaInicio: string
  horaFim: string
  /** Agendamentos conhecidos (de todos os dias) — filtrados por data para checar conflito. */
  agendamentos: Agendamento[]
  onClose: () => void
  onSalvar: (values: AgendamentoSubmit, id: string | null) => void
}

/** Prazos oferecidos para o retorno de cortesia. */
const PRAZOS_RETORNO = [15, 30, 60, 90]

/** Preço final da consulta: tabela do serviço menos o desconto do convênio. */
function precoDe(servico?: ServicoAgenda, convenio?: ConvenioAgenda): number {
  if (!servico) return 0
  return Math.round(servico.preco * (1 - (convenio?.desconto ?? 0) / 100) * 100) / 100
}

/**
 * Espelha `metodosReceber` da section Contas a Receber — é o que vira `metodo` na conta gerada.
 * "Particular"/"Convênio" saíram da lista: quem paga agora é o campo `convenio`, não a forma.
 */
const FORMAS_PAGAMENTO = [
  'Pix',
  'Boleto',
  'Cartão de crédito',
  'Cartão de débito',
  'Dinheiro',
  'Convênio',
]

const RECORRENCIAS: Recorrencia[] = ['Não repetir', 'Semanal', 'Quinzenal', 'Mensal']

const MODELOS_COBRANCA: { key: ModeloCobranca; label: string; icon: typeof CalendarDays }[] = [
  { key: 'sessao', label: 'Por sessão', icon: CalendarDays },
  { key: 'mensal', label: 'Mensal', icon: RefreshCw },
  { key: 'pacote', label: 'Pacote total', icon: Package },
]

const DIAS_VENCIMENTO = [5, 10, 15, 20, 25]

const STEPS = [
  { titulo: 'Identificação', sub: 'Identifique o paciente', icon: User },
  { titulo: 'Data do agendamento', sub: 'Escolha a data e a hora', icon: CalendarDays },
  { titulo: 'Financeiro', sub: 'Ajuste os pagamentos', icon: DollarSign },
  { titulo: 'Confirmação', sub: 'Confirme todos os dados', icon: FileText },
]

function iniciaisDe(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

const pad = (n: number) => String(n).padStart(2, '0')

function moeda(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function somaMinutos(hhmm: string, mins: number): string {
  const t = minutos(hhmm) + mins
  return `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
function dataExtenso(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}
/** Força o dia do mês, sem passar do último dia (dia 31 num mês de 30 vira 30). */
function comDia(iso: string, dia: number): string {
  const [ano, mes] = iso.split('-').map(Number)
  const ultimoDia = new Date(ano, mes, 0).getDate()
  return `${iso.slice(0, 8)}${String(Math.min(dia, ultimoDia)).padStart(2, '0')}`
}

/** Vencimento no dia escolhido, mas nunca antes da consulta — senão a conta nasce vencida. */
function vencimentoApos(base: string, consulta: string, dia: number): string {
  const v = comDia(base, dia)
  return v < consulta ? comDia(addMeses(base, 1), dia) : v
}

/** Campos que definem as parcelas — se algum muda, as linhas geradas ficaram obsoletas. */
const assinaturaFinanceira = (f: AgendamentoFormValues) =>
  [
    f.gerarFinanceiro,
    f.modeloCobranca,
    // servicoId + convenio definem o preço (tabela − desconto).
    f.servicoId,
    f.convenio,
    f.parcelas,
    f.diaVencimento,
    f.data,
    // No modelo por sessão a recorrência define quantas contas nascem.
    f.recorrencia,
    f.repeticoes,
  ].join('|')

/** Divide `total` em `n` parcelas com centavos inteiros — a sobra vai na última. */
function dividirEmCentavos(total: number, n: number): number[] {
  const centavos = Math.round(total * 100)
  const base = Math.floor(centavos / n)
  const resto = centavos - base * n
  return Array.from({ length: n }, (_, i) => (base + (i === n - 1 ? resto : 0)) / 100)
}

/**
 * Monta as linhas do resumo de pagamentos conforme o modelo de cobrança.
 *
 * O que `valor` significa muda por modelo — é o que separa os três:
 * - **sessão**: preço de UMA consulta. Numa série, cada sessão vira uma conta no valor cheio,
 *   vencendo no dia da própria sessão (a receita acompanha o atendimento).
 * - **mensal**: a mensalidade. Uma conta por mês, independente de quantas sessões.
 * - **pacote**: o total fechado, dividido nas parcelas.
 */
function montarLinhas(
  form: AgendamentoFormValues,
  /** Preço já calculado (tabela − convênio). */
  preco: number,
  /** Nome do serviço — vira a descrição da conta a receber. */
  nomeServico: string,
  /** Datas das sessões que serão de fato criadas (as em conflito já saíram daqui). */
  sessoes: string[],
): LinhaPagamento[] {
  // Sem preço não há cobrança: encaixe não pode gerar conta de R$ 0,00 na confirmação.
  if (!form.gerarFinanceiro || preco <= 0) return []
  const total = preco
  const n = Math.max(1, form.parcelas)
  const proc = nomeServico || 'Consulta'
  const dataSel = form.data
  const linhas: LinhaPagamento[] = []
  if (form.modeloCobranca === 'sessao') {
    if (sessoes.length > 1) {
      // Série: uma conta por sessão. Parcelamento não se aplica — cada consulta é uma cobrança.
      return sessoes.map((data, i) => ({
        vencimento: data,
        descricao: `${proc} · sessão ${i + 1}/${sessoes.length}`,
        valor: total,
        pago: false,
      }))
    }
    // Consulta única: aí sim o parcelamento divide o valor dela.
    const valores = dividirEmCentavos(total, n)
    for (let i = 0; i < n; i++) {
      linhas.push({
        vencimento: addMeses(dataSel, i),
        descricao: n > 1 ? `${proc} · parcela ${i + 1}/${n}` : proc,
        valor: valores[i],
        pago: false,
      })
    }
  } else if (form.modeloCobranca === 'mensal') {
    for (let i = 0; i < n; i++) {
      linhas.push({
        vencimento: vencimentoApos(addMeses(dataSel, i), dataSel, form.diaVencimento),
        descricao: `${proc} · mensalidade ${i + 1}`,
        valor: total,
        pago: false,
      })
    }
  } else {
    const valores = dividirEmCentavos(total, n)
    for (let i = 0; i < n; i++) {
      linhas.push({
        vencimento: vencimentoApos(addMeses(dataSel, i), dataSel, form.diaVencimento),
        descricao: n > 1 ? `${proc} · pacote ${i + 1}/${n}` : `${proc} · pacote total`,
        valor: valores[i],
        pago: false,
      })
    }
  }
  return linhas
}

const vazio = (
  medicos: MedicoAgenda[],
  salas: SalaAgenda[],
  dataAgenda: string,
): AgendamentoFormValues => ({
  pacienteNome: '',
  medicoId: medicos[0]?.id ?? '',
  salaId: salas.find((s) => s.id !== 'tele')?.id ?? salas[0]?.id ?? '',
  modalidade: 'presencial',
  servicoId: '',
  convenio: 'Particular',
  agendarRetorno: false,
  retornoDias: 30,
  duracaoMin: 30,
  recorrencia: 'Não repetir',
  repeticoes: 4,
  data: dataAgenda,
  inicio: '',
  fim: '',
  observacao: '',
  gerarFinanceiro: true,
  modeloCobranca: 'sessao',
  formaPagamento: 'Pix',
  parcelas: 1,
  diaVencimento: 5,
})

/**
 * Estado inicial no modo edição — **restaura a cobrança já combinada**, para editar o horário não
 * apagar (nem inventar) contas a receber.
 */
const daEdicao = (a: Agendamento): AgendamentoFormValues => {
  const fin = a.financeiro
  return {
    pacienteNome: a.pacienteNome,
    medicoId: a.medicoId,
    salaId: a.salaId,
    modalidade: a.modalidade,
    servicoId: a.servicoId ?? '',
    convenio: a.convenio ?? 'Particular',
    agendarRetorno: false,
    retornoDias: 30,
    duracaoMin: Math.max(10, minutos(a.fim) - minutos(a.inicio)),
    recorrencia: 'Não repetir',
    repeticoes: 4,
    data: a.data,
    inicio: a.inicio,
    fim: a.fim,
    observacao: a.observacao ?? '',
    gerarFinanceiro: !!fin,
    modeloCobranca: fin?.modeloCobranca ?? 'sessao',
    formaPagamento: fin?.formaPagamento ?? 'Pix',
    parcelas: fin?.parcelas ?? 1,
    // Recupera o dia combinado da 1ª parcela — fixar 5 fazia a tela dizer "todo dia 5"
    // enquanto o resumo logo abaixo listava as parcelas vencendo em outro dia.
    diaVencimento: fin?.contas?.[0] ? Number(fin.contas[0].vencimento.slice(8, 10)) : 5,
  }
}

const PERIODOS = [
  { key: 'manha', label: 'Manhã', min: 0, max: 12 * 60 },
  { key: 'tarde', label: 'Tarde', min: 12 * 60, max: 18 * 60 },
  { key: 'noite', label: 'Noite', min: 18 * 60, max: 24 * 60 },
] as const

export function AgendamentoForm({
  agendamento,
  medicos,
  salas,
  pacientes,
  servicos,
  convenios,
  dataAgenda,
  horaInicio,
  horaFim,
  agendamentos,
  onClose,
  onSalvar,
}: Props) {
  // O pai monta o form com `key` por alvo de edição, então o estado inicial já é o certo.
  const [form, setForm] = useState<AgendamentoFormValues>(() =>
    agendamento ? daEdicao(agendamento) : vazio(medicos, salas, dataAgenda),
  )
  const [buscaPaciente, setBuscaPaciente] = useState('')
  // Em edição, parte das contas já combinadas — editar o horário não pode apagar a cobrança.
  const [linhas, setLinhas] = useState<LinhaPagamento[]>(
    () => agendamento?.financeiro?.contas ?? [],
  )
  /**
   * Assinatura dos campos que geraram as linhas atuais. Enquanto ela não muda, edições manuais
   * (vencimento, "pago") são preservadas; se algum campo da cobrança muda, as linhas viraram
   * obsoletas e são regeradas — assim o contrato nunca sai divergente do formulário.
   */
  const [assinatura, setAssinatura] = useState<string | null>(() =>
    agendamento?.financeiro ? assinaturaFinanceira(daEdicao(agendamento)) : null,
  )
  const [step, setStep] = useState(0)

  const pacientesFiltrados = useMemo(() => {
    const q = buscaPaciente.trim().toLowerCase()
    if (!q) return pacientes.slice(0, 6)
    return pacientes.filter((p) => p.nome.toLowerCase().includes(q)).slice(0, 8)
  }, [pacientes, buscaPaciente])

  const iniMin = minutos(form.inicio)
  const fimMin = minutos(form.fim)
  // Válido: fim depois do início E dentro do expediente (não passa do fechamento).
  const horarioValido = fimMin > iniMin && fimMin <= minutos(horaFim)
  const nomeValido = form.pacienteNome.trim().length > 1

  // Ocupação/conflito valem por dia: só concorrem os agendamentos da data escolhida.
  const agendamentosDoDia = useMemo(
    () =>
      agendamentos.filter(
        (a) => a.data === form.data && a.status !== 'cancelado' && a.id !== agendamento?.id,
      ),
    [agendamentos, form.data, agendamento],
  )

  const conflito = useMemo(() => {
    if (!horarioValido) return null
    for (const a of agendamentosDoDia) {
      const sobrepoe = iniMin < minutos(a.fim) && fimMin > minutos(a.inicio)
      if (!sobrepoe) continue
      if (a.medicoId === form.medicoId) {
        const m = medicos.find((x) => x.id === form.medicoId)
        return `${m?.nome ?? 'Médico'} já tem consulta ${a.inicio}–${a.fim}`
      }
      if (form.modalidade === 'presencial' && a.salaId === form.salaId) {
        const s = salas.find((x) => x.id === form.salaId)
        return `${s?.nome ?? 'Sala'} ocupada ${a.inicio}–${a.fim}`
      }
    }
    return null
  }, [
    agendamentosDoDia,
    form.medicoId,
    form.modalidade,
    form.salaId,
    iniMin,
    fimMin,
    horarioValido,
    medicos,
    salas,
  ])

  // Horários candidatos (de hora em hora) que cabem no expediente dada a duração.
  const fimGridMin = minutos(horaFim)
  const slotsPorPeriodo = useMemo(() => {
    const ini = minutos(horaInicio)
    const grupos = PERIODOS.map((p) => ({ label: p.label, slots: [] as string[] }))
    for (let m = ini; m < fimGridMin; m += 60) {
      if (m + form.duracaoMin > fimGridMin) continue
      const slot = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
      const g = PERIODOS.findIndex((p) => m >= p.min && m < p.max)
      if (g >= 0) grupos[g].slots.push(slot)
    }
    return grupos.filter((g) => g.slots.length > 0)
  }, [horaInicio, fimGridMin, form.duracaoMin])

  const editando = agendamento !== null
  const set = (patch: Partial<AgendamentoFormValues>) => setForm((f) => ({ ...f, ...patch }))

  /**
   * Muda um campo da cobrança e já regenera as parcelas — senão a etapa Financeiro mostra o
   * resumo antigo ao lado do valor novo.
   */
  const setCobranca = (patch: Partial<AgendamentoFormValues>) => {
    const proximo = { ...form, ...patch }
    setForm(proximo)
    const servico = servicos.find((s) => s.id === proximo.servicoId)
    const conv = convenios.find((c) => c.nome === proximo.convenio)
    const viaveis = datasDaSerie(proximo.data, proximo.recorrencia, proximo.repeticoes).filter(
      (d) =>
        !acharConflito(agendamentos, {
          id: agendamento?.id,
          data: d,
          inicio: proximo.inicio,
          fim: proximo.fim,
          medicoId: proximo.medicoId,
          salaId: proximo.salaId,
          modalidade: proximo.modalidade,
        }),
    )
    setLinhas(montarLinhas(proximo, precoDe(servico, conv), servico?.nome ?? '', viaveis))
    setAssinatura(assinaturaFinanceira(proximo))
  }

  // Preço não se digita: sai do cadastro de Serviços, com o desconto do convênio aplicado.
  const servicoSel = servicos.find((s) => s.id === form.servicoId)
  const convenioSel = convenios.find((c) => c.nome === form.convenio)
  const descontoPct = convenioSel?.desconto ?? 0
  const precoConsulta = precoDe(servicoSel, convenioSel)

  /** Escolher o serviço puxa a duração do cadastro e reposiciona o fim da consulta. */
  const escolherServico = (id: string) => {
    const s = servicos.find((x) => x.id === id)
    if (!s) {
      set({ servicoId: id })
      return
    }
    set({
      servicoId: id,
      duracaoMin: s.duracaoMin,
      fim: form.inicio ? somaMinutos(form.inicio, s.duracaoMin) : form.fim,
    })
  }

  const mudarDuracao = (min: number) => {
    const d = Math.max(10, Math.min(240, min || 0))
    // Se o slot selecionado não cabe mais no expediente com a nova duração, limpa a seleção.
    if (form.inicio && minutos(form.inicio) + d > fimGridMin) {
      set({ duracaoMin: d, inicio: '', fim: '' })
    } else {
      set({ duracaoMin: d, fim: form.inicio ? somaMinutos(form.inicio, d) : form.fim })
    }
  }

  const selecionarSlot = (slot: string) =>
    set({ inicio: slot, fim: somaMinutos(slot, form.duracaoMin) })

  // Status de cada horário do dia para o médico/sala selecionados e a duração escolhida.
  const slotStatus = (slot: string): 'disponivel' | 'selecionado' | 'ocupado' => {
    // A própria seleção tem precedência (evita virar "ocupado" ao aumentar a duração).
    if (form.inicio === slot) return 'selecionado'
    const s = minutos(slot)
    const e = s + form.duracaoMin
    for (const a of agendamentosDoDia) {
      const sobrepoe = s < minutos(a.fim) && e > minutos(a.inicio)
      if (!sobrepoe) continue
      if (a.medicoId === form.medicoId) return 'ocupado'
      if (form.modalidade === 'presencial' && a.salaId === form.salaId) return 'ocupado'
    }
    return 'disponivel'
  }

  const escolherTipo = (mod: Modalidade) =>
    set({
      modalidade: mod,
      salaId: mod === 'tele' ? 'tele' : salas.find((s) => s.id !== 'tele')?.id ?? form.salaId,
    })

  // Serviço é opcional: encaixe/bloqueio existe e simplesmente não gera cobrança.
  const procOk = true
  const stepValido = [
    nomeValido && procOk && !!form.medicoId, // Identificação
    !!form.inicio && horarioValido && !conflito, // Data
    true, // Financeiro
    nomeValido && procOk && !!form.inicio && horarioValido && !conflito, // Confirmação
  ]

  const salvar = () => {
    if (!stepValido[3]) return
    onSalvar(
      {
        ...form,
        pacienteNome: form.pacienteNome.trim(),
        observacao: form.observacao.trim(),
        contas: form.gerarFinanceiro ? linhas : [],
      },
      agendamento?.id ?? null,
    )
  }

  const proximo = () => {
    if (!stepValido[step]) return
    if (step >= STEPS.length - 1) {
      salvar()
      return
    }
    // O preço vem do cadastro, então as parcelas já podem ser montadas ao entrar no Financeiro.
    // Regenera a cada avanço se algum campo da cobrança mudou desde a última geração — assim
    // edições manuais sobrevivem sem deixar o contrato obsoleto.
    const atual = assinaturaFinanceira(form)
    if (step + 1 >= 2 && form.gerarFinanceiro && assinatura !== atual) {
      // Preserva o que já foi quitado: remarcar uma consulta paga não pode reabrir a conta.
      setLinhas((ant) =>
        montarLinhas(form, precoConsulta, servicoSel?.nome ?? '', sessoesViaveis).map((l, i) =>
          ant[i]?.pago ? { ...l, pago: true } : l,
        ),
      )
      setAssinatura(atual)
    }
    setStep((s) => s + 1)
  }

  const iniciais = form.pacienteNome.trim() ? iniciaisDe(form.pacienteNome) : '—'
  const medico = medicos.find((m) => m.id === form.medicoId)
  const sala = salas.find((s) => s.id === form.salaId)

  const recalcularLinhas = () => {
    setLinhas(montarLinhas(form, precoConsulta, servicoSel?.nome ?? '', sessoesViaveis))
    setAssinatura(assinaturaFinanceira(form))
  }
  // Edições manuais não mexem na assinatura: sobrevivem enquanto a cobrança não for alterada.
  const editarVencimento = (i: number, v: string) =>
    setLinhas((ls) => ls.map((l, idx) => (idx === i ? { ...l, vencimento: v } : l)))
  const togglePago = (i: number) =>
    setLinhas((ls) => ls.map((l, idx) => (idx === i ? { ...l, pago: !l.pago } : l)))
  const totalReceber = linhas.reduce((s, l) => s + l.valor, 0)
  const totalPago = linhas.filter((l) => l.pago).reduce((s, l) => s + l.valor, 0)

  // Série recorrente: datas de cada ocorrência e quais delas já colidem com a agenda.
  const datasSerie = datasDaSerie(form.data, form.recorrencia, form.repeticoes)
  const ocorrencias = datasSerie.map((data) => ({
    data,
    conflito: acharConflito(agendamentos, {
      id: agendamento?.id,
      data,
      inicio: form.inicio,
      fim: form.fim,
      medicoId: form.medicoId,
      salaId: form.salaId,
      modalidade: form.modalidade,
    }),
  }))
  const comConflito = ocorrencias.filter((o) => o.conflito)
  /** Datas que sobram depois de descartar as ocorrências em conflito. */
  const sessoesViaveis = ocorrencias.filter((o) => !o.conflito).map((o) => o.data)
  /** Retorno de cortesia — a partir da última sessão que realmente será criada. */
  const dataRetorno =
    form.agendarRetorno && sessoesViaveis.length
      ? addDias(sessoesViaveis[sessoesViaveis.length - 1], form.retornoDias)
      : null
  // 20 — o horário do retorno também pode estar ocupado; avisa antes de prometer.
  const conflitoRetorno =
    dataRetorno && form.inicio
      ? acharConflito(agendamentos, {
          id: agendamento?.id,
          data: dataRetorno,
          inicio: form.inicio,
          fim: form.fim,
          medicoId: form.medicoId,
          salaId: form.salaId,
          modalidade: form.modalidade,
        })
      : null

  /** Por sessão + recorrência: cada consulta é uma cobrança, então não há parcelamento. */
  const cobrancaPorSessaoEmSerie = form.modeloCobranca === 'sessao' && ocorrencias.length > 1

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-900/50 backdrop-blur-sm">
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900">
        {/* Header + stepper horizontal */}
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {editando ? 'Editar agendamento' : 'Novo agendamento'}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex items-start gap-1.5">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const ativo = i === step
              const feito = i < step
              return (
                <button
                  key={s.titulo}
                  onClick={() => i <= step && setStep(i)}
                  disabled={i > step}
                  title={s.titulo}
                  className="flex flex-1 flex-col items-center gap-1.5 disabled:cursor-not-allowed"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      ativo || feito
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-200 text-slate-400 dark:bg-slate-700'
                    }`}
                  >
                    {feito ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <span
                    className={`h-1 w-full rounded-full ${
                      i <= step ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                </button>
              )
            })}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Passo {step + 1} de {STEPS.length}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {STEPS[step].titulo}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {step === 0
                ? 'Entre com as informações do agendamento'
                : step === 1
                  ? 'Escolha a data e a duração'
                  : step === 2
                    ? 'Valor e forma de pagamento'
                    : 'Revise antes de confirmar'}
            </p>

            <div className="mt-5 space-y-5">
              {/* ETAPA 1 — Identificação */}
              {step === 0 && (
                <>
                  {/* Paciente */}
                  <div>
                    <Label obrigatorio>Selecione o paciente</Label>
                    {form.pacienteNome ? (
                      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-400 text-xs font-semibold text-white">
                          {iniciais}
                        </div>
                        <span className="flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                          {form.pacienteNome}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            set({ pacienteNome: '' })
                            setBuscaPaciente('')
                          }}
                          className="shrink-0 text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
                        >
                          Trocar
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            value={buscaPaciente}
                            onChange={(e) => setBuscaPaciente(e.target.value)}
                            placeholder="Buscar paciente no pool da clínica…"
                            autoFocus
                            className={`${inputCls} pl-9`}
                          />
                        </div>
                        <ul className="mt-1.5 max-h-40 space-y-1 overflow-y-auto">
                          {pacientesFiltrados.length === 0 ? (
                            <li className="px-1 py-2 text-xs text-slate-400">Nenhum paciente encontrado.</li>
                          ) : (
                            pacientesFiltrados.map((p) => (
                              <li key={p.id}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    // O convênio do paciente já define o desconto da consulta.
                                    set({
                                      pacienteNome: p.nome,
                                      convenio: convenios.some((c) => c.nome === p.convenio)
                                        ? p.convenio
                                        : 'Particular',
                                      // Quem paga define a forma: operadora → "Convênio".
                                      formaPagamento:
                                        p.convenio && p.convenio !== 'Particular'
                                          ? 'Convênio'
                                          : 'Pix',
                                    })
                                  }
                                  className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 p-2 text-left transition-colors hover:border-teal-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                >
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                                    {p.iniciais}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                      {p.nome}
                                    </div>
                                    <div className="truncate text-[11px] text-slate-400">
                                      {p.idade}a · {p.convenio}
                                    </div>
                                  </div>
                                </button>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Tipo de atendimento */}
                  <div>
                    <Label>Tipo de atendimento</Label>
                    <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
                      {(
                        [
                          { v: 'presencial', label: 'Presencial' },
                          { v: 'tele', label: 'Online (teleconsulta)' },
                        ] as { v: Modalidade; label: string }[]
                      ).map((o) => (
                        <button
                          key={o.v}
                          type="button"
                          onClick={() => escolherTipo(o.v)}
                          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            form.modalidade === o.v
                              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Profissional */}
                  <div>
                    <Label>Selecione o profissional</Label>
                    <select
                      value={form.medicoId}
                      onChange={(e) => set({ medicoId: e.target.value })}
                      className={inputCls}
                    >
                      {medicos.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nome} · {m.especialidade}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Serviço — vem do cadastro, com preço de tabela e duração */}
                  <div>
                    <Label obrigatorio>Serviço</Label>
                    <select
                      value={form.servicoId}
                      onChange={(e) => escolherServico(e.target.value)}
                      className={inputCls}
                    >
                      <option value="" disabled>
                        Selecione um serviço…
                      </option>
                      {[...new Set(servicos.map((s) => s.categoria))].map((cat) => (
                        <optgroup key={cat} label={cat}>
                          {servicos
                            .filter((s) => s.categoria === cat)
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.nome} · R$ {moeda(s.preco)} · {s.duracaoMin} min
                              </option>
                            ))}
                        </optgroup>
                      ))}
                    </select>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Preço e duração vêm do cadastro de Serviços.
                    </p>
                  </div>
                </>
              )}

              {/* ETAPA 2 — Data */}
              {step === 1 && (
                <>
                  {/* Data + duração */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Data da consulta</Label>
                      <input
                        type="date"
                        value={form.data}
                        onChange={(e) => set({ data: e.target.value || dataAgenda })}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <Label>Duração (minutos)</Label>
                      <input
                        type="number"
                        min={10}
                        max={240}
                        step={5}
                        value={form.duracaoMin}
                        onChange={(e) => mudarDuracao(Number(e.target.value))}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Recorrência — só ao criar: editar mexe numa ocorrência, não na série. */}
                  <div className={`grid grid-cols-2 gap-3 ${editando ? 'hidden' : ''}`}>
                    <div>
                      <Label>Recorrência</Label>
                      <select
                        value={form.recorrencia}
                        onChange={(e) => set({ recorrencia: e.target.value as Recorrencia })}
                        className={inputCls}
                      >
                        {RECORRENCIAS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    {form.recorrencia !== 'Não repetir' && (
                      <div>
                        <Label>Repetir (vezes)</Label>
                        <input
                          type="number"
                          min={2}
                          max={52}
                          value={form.repeticoes || ''}
                          // Clampa só no blur: clampar por tecla impede digitar "12" (vira "22").
                          onChange={(e) => set({ repeticoes: Number(e.target.value) })}
                          onBlur={() =>
                            set({ repeticoes: Math.max(2, Math.min(52, form.repeticoes || 2)) })
                          }
                          className={inputCls}
                        />
                      </div>
                    )}
                  </div>

                  {!editando && form.recorrencia !== 'Não repetir' && form.inicio && (
                    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {ocorrencias.length} consultas · {form.recorrencia.toLowerCase()}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {ocorrencias.map((o) => (
                          <span
                            key={o.data}
                            title={o.conflito ? `Conflito com ${o.conflito.pacienteNome}` : undefined}
                            className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${
                              o.conflito
                                ? 'bg-rose-100 text-rose-700 line-through dark:bg-rose-950/50 dark:text-rose-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {dataCurta(o.data)}
                          </span>
                        ))}
                      </div>
                      {comConflito.length > 0 && (
                        <p className="mt-2 text-[11px] text-rose-600 dark:text-rose-400">
                          {comConflito.length} ocorrência{comConflito.length === 1 ? '' : 's'} em
                          conflito {comConflito.length === 1 ? 'será pulada' : 'serão puladas'}.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Retorno de cortesia */}
                  {!editando && (
                    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                      <label className="flex cursor-pointer items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={form.agendarRetorno}
                          onChange={(e) => set({ agendarRetorno: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          Agendar retorno
                        </span>
                        <select
                          value={form.retornoDias}
                          disabled={!form.agendarRetorno}
                          onChange={(e) => set({ retornoDias: Number(e.target.value) })}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        >
                          {PRAZOS_RETORNO.map((d) => (
                            <option key={d} value={d}>
                              em {d} dias
                            </option>
                          ))}
                        </select>
                      </label>
                      {form.agendarRetorno && (
                        <p className="mt-2 text-[11px] text-slate-400">
                          {dataRetorno ? `${dataExtenso(dataRetorno)} · mesmo horário · ` : ''}
                          cortesia, sem cobrança.
                          {conflitoRetorno
                            ? ` Horário ocupado por ${conflitoRetorno.pacienteNome} — será pulado.`
                            : ''}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Sala (presencial) */}
                  {form.modalidade === 'presencial' && (
                    <div>
                      <Label>Sala</Label>
                      <select
                        value={form.salaId}
                        onChange={(e) => set({ salaId: e.target.value })}
                        className={inputCls}
                      >
                        {salas
                          .filter((s) => s.id !== 'tele')
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.nome} · {s.local}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* Horários disponíveis */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Horários disponíveis
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {medico?.nome ?? 'Profissional'} · {dataExtenso(form.data)} ·{' '}
                      {form.duracaoMin} min
                    </p>
                    {form.data !== dataAgenda && (
                      <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                        Fora do dia aberto na agenda — só contam os agendamentos criados nesta
                        sessão.
                      </p>
                    )}
                    {conflito && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{conflito} — escolha outro horário, sala ou profissional.</span>
                      </div>
                    )}

                    <div className="mt-3 space-y-3">
                      {slotsPorPeriodo.map((g) => (
                        <div key={g.label}>
                          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {g.label}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {g.slots.map((slot) => {
                              const st = slotStatus(slot)
                              const base =
                                'rounded-lg border px-3 py-1.5 text-xs font-medium tabular-nums transition-colors'
                              const cls =
                                st === 'selecionado'
                                  ? 'border-teal-500 bg-teal-500 text-white'
                                  : st === 'ocupado'
                                    ? 'cursor-not-allowed border-transparent bg-rose-100 text-rose-400 line-through dark:bg-rose-950/40 dark:text-rose-500/70'
                                    : 'border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:bg-teal-950/40'
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={st === 'ocupado'}
                                  onClick={() => selecionarSlot(slot)}
                                  className={`${base} ${cls}`}
                                >
                                  {slot}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Legenda */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded border border-slate-300 dark:border-slate-600" />
                        Disponível
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded bg-teal-500" /> Selecionado
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded bg-rose-400" /> Ocupado
                      </span>
                    </div>

                    {form.inicio && (
                      <p
                        className={`mt-3 flex items-center gap-1.5 text-xs ${
                          horarioValido
                            ? 'text-slate-600 dark:text-slate-300'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5 text-teal-500" />
                        Selecionado: <strong className="font-semibold">{form.inicio}–{form.fim}</strong>
                        {!horarioValido && ' · passa do fechamento, reduza a duração'}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* ETAPA 3 — Financeiro */}
              {step === 2 && (
                <>
                  {/* Gerar financeiro */}
                  <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800">
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Gerar financeiro
                      </span>
                      <p className="text-[11px] text-slate-400">Cria a cobrança deste agendamento</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.gerarFinanceiro}
                      onClick={() => set({ gerarFinanceiro: !form.gerarFinanceiro })}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                        form.gerarFinanceiro ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                          form.gerarFinanceiro ? 'translate-x-[22px]' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </label>

                  {!form.gerarFinanceiro ? (
                    <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-700">
                      Sem cobrança gerada para este agendamento.
                    </p>
                  ) : (
                    <>
                      {/* Modelo de cobrança */}
                      <div>
                        <Label>Modelo de cobrança</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {MODELOS_COBRANCA.map(({ key, label, icon: Icon }) => {
                            const ativo = form.modeloCobranca === key
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setCobranca({ modeloCobranca: key })}
                                className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-colors ${
                                  ativo
                                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                                    : 'border-slate-200 text-slate-600 hover:border-teal-400 dark:border-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                <span className="text-[11px] font-medium leading-tight">{label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Convênio + forma — o valor não se digita, é calculado */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Convênio</Label>
                          <select
                            value={form.convenio}
                            onChange={(e) => setCobranca({ convenio: e.target.value })}
                            className={inputCls}
                          >
                            {convenios.map((c) => (
                              <option key={c.nome} value={c.nome}>
                                {c.nome}
                                {c.desconto > 0 ? ` · −${c.desconto}%` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label>Forma de pagamento</Label>
                          <select
                            value={form.formaPagamento}
                            onChange={(e) => set({ formaPagamento: e.target.value })}
                            className={inputCls}
                          >
                            {FORMAS_PAGAMENTO.map((f) => (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Preço calculado: tabela do serviço − desconto do convênio */}
                      <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                        {servicoSel ? (
                          <>
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                              {servicoSel.nome}
                            </div>
                            {form.modeloCobranca !== 'sessao' && (
                              <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                                Neste modelo o preço do serviço é o valor{' '}
                                {form.modeloCobranca === 'pacote' ? 'fechado do pacote' : 'da mensalidade'} —
                                cadastre um serviço de {form.modeloCobranca === 'pacote' ? 'pacote' : 'mensalidade'}.
                              </p>
                            )}
                            <dl className="mt-2 space-y-1 text-xs">
                              <div className="flex items-baseline justify-between">
                                <dt className="text-slate-500 dark:text-slate-400">Tabela</dt>
                                <dd className="tabular-nums text-slate-700 dark:text-slate-200">
                                  R$ {moeda(servicoSel.preco)}
                                </dd>
                              </div>
                              {descontoPct > 0 && (
                                <div className="flex items-baseline justify-between text-teal-700 dark:text-teal-400">
                                  <dt>
                                    {form.convenio} −{descontoPct}%
                                  </dt>
                                  <dd className="tabular-nums">
                                    −R$ {moeda(servicoSel.preco - precoConsulta)}
                                  </dd>
                                </div>
                              )}
                              <div className="flex items-baseline justify-between border-t border-slate-200 pt-1 dark:border-slate-800">
                                <dt className="font-medium text-slate-900 dark:text-slate-100">
                                  {form.modeloCobranca === 'pacote'
                                    ? 'Valor do pacote'
                                    : form.modeloCobranca === 'mensal'
                                      ? 'Valor da mensalidade'
                                      : 'Valor da consulta'}
                                </dt>
                                <dd className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                                  R$ {moeda(precoConsulta)}
                                </dd>
                              </div>
                            </dl>
                          </>
                        ) : (
                          <p className="text-center text-xs text-slate-400">
                            Sem serviço selecionado — encaixe não gera cobrança.
                          </p>
                        )}
                      </div>

                      {/* Parcelamento + vencimento */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Parcelamento</Label>
                          <select
                            value={form.parcelas}
                            // Numa série por sessão cada consulta já é uma cobrança — não parcela.
                            disabled={cobrancaPorSessaoEmSerie}
                            onChange={(e) => setCobranca({ parcelas: Number(e.target.value) })}
                            className={`${inputCls} disabled:cursor-not-allowed disabled:opacity-50`}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>
                                {n === 1 ? 'À vista' : `${n}x`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label>Dia de vencimento</Label>
                          <select
                            value={form.diaVencimento}
                            disabled={form.modeloCobranca === 'sessao'}
                            onChange={(e) => setCobranca({ diaVencimento: Number(e.target.value) })}
                            className={`${inputCls} disabled:cursor-not-allowed disabled:opacity-50`}
                          >
                            {DIAS_VENCIMENTO.map((d) => (
                              <option key={d} value={d}>
                                Todo dia {d}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {form.modeloCobranca === 'sessao' && (
                        <p className="-mt-2 text-[11px] text-slate-400">
                          {cobrancaPorSessaoEmSerie
                            ? `Por sessão: o valor é de cada consulta. As ${ocorrencias.length} sessões geram ${ocorrencias.length} contas, cada uma vencendo no dia da sua sessão.`
                            : 'No modelo por sessão, o vencimento segue a data da sessão.'}
                        </p>
                      )}

                      {/* Recalcular */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={recalcularLinhas}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Recalcular parcelas
                        </button>
                      </div>

                      {/* Resumo de pagamentos */}
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Resumo de pagamentos
                        </h3>
                        {linhas.length === 0 ? (
                          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-700">
                            {servicoSel
                              ? 'Sem parcelas geradas — clique em “Recalcular parcelas”.'
                              : 'Encaixe sem serviço: não gera cobrança.'}
                          </p>
                        ) : (
                          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                              {linhas.map((l, i) => (
                                <li key={i} className="p-2.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-100">
                                      {l.descricao}
                                    </span>
                                    <span className="shrink-0 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                      R$ {moeda(l.valor)}
                                    </span>
                                  </div>
                                  <div className="mt-1.5 flex items-center justify-between gap-2">
                                    <input
                                      type="date"
                                      value={l.vencimento}
                                      onChange={(e) => editarVencimento(i, e.target.value)}
                                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    />
                                    <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                      <input
                                        type="checkbox"
                                        checked={l.pago}
                                        onChange={() => togglePago(i)}
                                        className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                      />
                                      {l.pago ? 'Pago' : 'Em aberto'}
                                    </label>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div className="flex items-center justify-between bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
                              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Total a receber
                              </span>
                              <div className="text-right">
                                <div className="text-sm font-bold text-teal-600 dark:text-teal-400">
                                  R$ {moeda(totalReceber)}
                                </div>
                                {totalPago > 0 && (
                                  <div className="text-[10px] text-slate-400">
                                    R$ {moeda(totalPago)} já pago
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Observação */}
                      <div>
                        <Label>Observação</Label>
                        <textarea
                          value={form.observacao}
                          onChange={(e) => set({ observacao: e.target.value })}
                          rows={2}
                          placeholder="Opcional — preparo, encaixe, cobrança…"
                          className={`${inputCls} resize-none`}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ETAPA 4 — Confirmação */}
              {step === 3 && (
                <div className="space-y-2.5">
                  <Resumo icon={User} label="Paciente" valor={form.pacienteNome || '—'} />
                  <Resumo
                    icon={ClipboardList}
                    label="Procedimento"
                    valor={`${servicoSel?.nome ?? 'Encaixe'} · ${form.modalidade === 'tele' ? 'Online' : 'Presencial'}`}
                  />
                  <Resumo
                    icon={User}
                    label="Profissional"
                    valor={medico ? `${medico.nome} · ${medico.especialidade}` : '—'}
                  />
                  <Resumo
                    icon={CalendarDays}
                    label="Data e hora"
                    valor={`${dataExtenso(form.data)} · ${form.inicio}–${form.fim} (${form.duracaoMin} min)`}
                  />
                  {form.modalidade === 'presencial' && (
                    <Resumo icon={FileText} label="Sala" valor={sala ? `${sala.nome} · ${sala.local}` : '—'} />
                  )}
                  {form.recorrencia !== 'Não repetir' && (
                    <Resumo
                      icon={RefreshCw}
                      label="Recorrência"
                      valor={(() => {
                        const criar = ocorrencias.length - comConflito.length
                        const frase =
                          criar === 1
                            ? `1 de ${ocorrencias.length} consultas será criada`
                            : `${criar} de ${ocorrencias.length} consultas serão criadas`
                        const conflito = comConflito.length
                          ? ` (${comConflito.map((o) => dataCurta(o.data)).join(', ')} em conflito)`
                          : ''
                        return `${form.recorrencia} · ${frase}${conflito}`
                      })()}
                    />
                  )}
                  {form.agendarRetorno && dataRetorno && (
                    <Resumo
                      icon={Clock}
                      label="Retorno"
                      valor={`${dataExtenso(dataRetorno)} · ${form.inicio} · ${
                        conflitoRetorno ? 'horário ocupado, será pulado' : 'cortesia, sem cobrança'
                      }`}
                    />
                  )}
                  <Resumo
                    icon={DollarSign}
                    label="Financeiro"
                    valor={
                      !form.gerarFinanceiro
                        ? 'Sem cobrança'
                        : `R$ ${moeda(totalReceber)} a receber · ${
                            MODELOS_COBRANCA.find((m) => m.key === form.modeloCobranca)?.label
                          } · ${
                            cobrancaPorSessaoEmSerie
                              ? `${linhas.length} sessões de R$ ${moeda(precoConsulta)}`
                              : `${linhas.length}x`
                          } · ${form.formaPagamento}${
                            descontoPct > 0 ? ` · ${form.convenio} −${descontoPct}%` : ''
                          }`
                    }
                  />

                  {/* Contrato explícito: o que a implementação deve criar em Contas a Receber. */}
                  {form.gerarFinanceiro && linhas.length > 0 && (
                    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Serão criadas em Contas a receber
                      </div>
                      <ul className="mt-2 space-y-1">
                        {linhas.map((l, i) => (
                          <li
                            key={i}
                            className="flex items-baseline justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300"
                          >
                            <span className="shrink-0 font-mono tabular-nums text-slate-400">
                              {dataCurta(l.vencimento)}
                            </span>
                            <span className="min-w-0 flex-1 truncate">{l.descricao}</span>
                            <span className="shrink-0 font-medium tabular-nums text-slate-800 dark:text-slate-100">
                              R$ {moeda(l.valor)}
                            </span>
                            {l.pago && (
                              <span className="shrink-0 rounded bg-emerald-100 px-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                pago
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[10px] text-slate-400">
                        Paciente {form.pacienteNome.trim() || '—'} · {form.formaPagamento}
                      </p>
                    </div>
                  )}
                  {conflito && (
                    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>Resolva o conflito de horário antes de confirmar.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Rodapé */}
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 dark:border-slate-800">
            <button
              onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" /> {step === 0 ? 'Cancelar' : 'Anterior'}
            </button>
            <button
              onClick={proximo}
              disabled={!stepValido[step]}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === STEPS.length - 1 ? (
                <>
                  <Check className="h-4 w-4" /> {editando ? 'Salvar' : 'Agendar'}
                </>
              ) : (
                <>
                  Próximo <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'

function Label({ children, obrigatorio }: { children: React.ReactNode; obrigatorio?: boolean }) {
  return (
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {children}
      {obrigatorio && <span className="ml-0.5 text-red-500">*</span>}
    </span>
  )
}

function Resumo({
  icon: Icon,
  label,
  valor,
}: {
  icon: typeof User
  label: string
  valor: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="w-28 shrink-0 text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">{valor}</span>
    </div>
  )
}
