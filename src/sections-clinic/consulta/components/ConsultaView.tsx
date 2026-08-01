import { Clock, FlaskConical, MapPin, Pill, Share2 } from 'lucide-react'
import type {
  AssinaturaInfo,
  ConsultaData,
  EscribaEstado,
  Modalidade,
  SOAP,
  ItemExtraido,
  MedidasConsulta,
  ResumoApp,
} from '@/../product-clinic/sections/consulta/types'
import { ContextoPanel } from './ContextoPanel'
import { EscribaPanel } from './EscribaPanel'
import { SolicitacoesPanel, type SolicItem } from './SolicitacoesPanel'
import { TeleconsultaPanel } from './TeleconsultaPanel'
import { formatTimer } from './helpers'

interface Props {
  dados: ConsultaData
  /** Delta do app desde a última consulta. Ausente = paciente não vinculado. */
  queixas: string[]
  itensExtraidos?: ItemExtraido[]
  onAplicarItens?: (itens: ItemExtraido[]) => void
  onDescartarItens?: () => void
  origemRevisao?: 'transcricao' | 'analise'
  onAnalisar?: () => void
  medidas?: MedidasConsulta
  onMedida?: (campo: keyof MedidasConsulta, valor: string) => void
  resumoApp?: ResumoApp
  onAbrirAcompanhamento?: () => void
  modalidade: Modalidade
  onModalidade: (m: Modalidade) => void
  consultaTimer: number
  estado: EscribaEstado
  escribaTimer: number
  transcricaoVisivel: string[]
  transcricaoCompleta: string[]
  soap: SOAP
  assinatura: AssinaturaInfo | null
  onIniciar: () => void
  onConsentir: () => void
  onRecusar: () => void
  onParar: () => void
  onSoapChange: (campo: keyof SOAP, valor: string) => void
  onAssinar: () => void
  onAbrirProntuario: () => void
  onAcao: (acao: 'prescrever' | 'exame' | 'encaminhar') => void
  solicitacoes: {
    prescricoes: SolicItem[]
    exames: SolicItem[]
    encaminhamentos: SolicItem[]
  }
}

export function ConsultaView(props: Props) {
  const { dados, modalidade } = props
  const assinado = props.estado === 'assinado'

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Cabeçalho do paciente */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
              {dados.paciente.iniciais}
            </span>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {dados.paciente.nome}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {dados.paciente.idade} anos · {dados.paciente.genero} · {dados.paciente.convenio}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {dados.paciente.condicoesCronicas.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="font-mono tabular-nums">{formatTimer(props.consultaTimer)}</span>
            </div>
            <ModalidadeToggle
              value={modalidade}
              disabled={assinado}
              onChange={props.onModalidade}
            />
            {modalidade === 'presencial' && dados.sala && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <MapPin className="h-3 w-3" /> {dados.sala}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="font-medium text-slate-600 dark:text-slate-300">Motivo:</span>{' '}
          {dados.motivo}
        </div>
      </div>

      {/* Teleconsulta */}
      {modalidade === 'tele' && !assinado && (
        <TeleconsultaPanel
          pacienteNome={dados.paciente.nome}
          pacienteIniciais={dados.paciente.iniciais}
          medicoNome="Dra. Helena Prado"
        />
      )}

      {/* Corpo: escriba + contexto */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EscribaPanel
            estado={props.estado}
            timer={props.escribaTimer}
            modalidade={modalidade}
            pacientePrimeiroNome={dados.paciente.nome.split(' ')[0]}
            transcricaoVisivel={props.transcricaoVisivel}
            transcricaoCompleta={props.transcricaoCompleta}
            soap={props.soap}
            modeloIA={dados.modeloIA}
            assinatura={props.assinatura}
            onIniciar={props.onIniciar}
            onConsentir={props.onConsentir}
            onRecusar={props.onRecusar}
            onParar={props.onParar}
            onSoapChange={props.onSoapChange}
            onAssinar={props.onAssinar}
            onAbrirProntuario={props.onAbrirProntuario}
            queixas={props.queixas}
            itensExtraidos={props.itensExtraidos}
            onAplicarItens={props.onAplicarItens}
            onDescartarItens={props.onDescartarItens}
            origemRevisao={props.origemRevisao}
            onAnalisar={props.onAnalisar}
            medidas={props.medidas}
            onMedida={props.onMedida}
          />
        </div>
        <div>
          <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Contexto do paciente
          </div>
          <ContextoPanel
            contexto={dados.contexto}
            resumoApp={props.resumoApp}
            onAbrirAcompanhamento={props.onAbrirAcompanhamento}
          />
        </div>
      </div>

      {/* Solicitações (nesta consulta + anteriores) */}
      <div className="mt-4">
        <SolicitacoesPanel
          prescricoes={props.solicitacoes.prescricoes}
          exames={props.solicitacoes.exames}
          encaminhamentos={props.solicitacoes.encaminhamentos}
        />
      </div>

      {/* Barra de ações */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <AcaoBtn
          icon={<Pill className="h-4 w-4" />}
          label="Prescrever"
          onClick={() => props.onAcao('prescrever')}
        />
        <AcaoBtn
          icon={<FlaskConical className="h-4 w-4" />}
          label="Solicitar exame"
          onClick={() => props.onAcao('exame')}
        />
        <AcaoBtn
          icon={<Share2 className="h-4 w-4" />}
          label="Encaminhar"
          onClick={() => props.onAcao('encaminhar')}
        />
        <span className="ml-auto text-[11px] text-slate-400">
          {assinado ? 'Consulta finalizada e assinada' : 'A consulta é finalizada ao assinar o SOAP'}
        </span>
      </div>
    </div>
  )
}

function ModalidadeToggle({
  value,
  disabled,
  onChange,
}: {
  value: Modalidade
  disabled: boolean
  onChange: (m: Modalidade) => void
}) {
  const opts: { v: Modalidade; label: string }[] = [
    { v: 'presencial', label: 'Presencial' },
    { v: 'tele', label: 'Teleconsulta' },
  ]
  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
      {opts.map((o) => (
        <button
          key={o.v}
          disabled={disabled}
          onClick={() => onChange(o.v)}
          className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            value === o.v
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function AcaoBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-300"
    >
      {icon}
      {label}
    </button>
  )
}
