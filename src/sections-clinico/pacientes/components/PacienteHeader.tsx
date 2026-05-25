import { ArrowLeft, MessageCircle, CalendarPlus, FileDown, MoreHorizontal, Stethoscope, Video, MapPin, FileText } from 'lucide-react'
import type { PacienteDetalhe } from '@/../product-clinico/sections/pacientes/types'
import { Avatar } from './Avatar'
import { formatDataExtenso, STATUS_APP_LABEL, STATUS_APP_STYLE, STATUS_APP_DOT } from './helpers'

interface Props {
  paciente: PacienteDetalhe
  onVoltar?: () => void
  onAbrirMensagemClinica?: () => void
  onAgendar?: () => void
  onExportarPDF?: () => void
  onIniciarConsulta?: (agendamentoId: string) => void
  onAbrirProntuario?: () => void
}

export function PacienteHeader({
  paciente,
  onVoltar,
  onAbrirMensagemClinica,
  onAgendar,
  onExportarPDF,
  onIniciarConsulta,
  onAbrirProntuario,
}: Props) {
  return (
    <header
      className="
        sticky top-0 z-10
        border-b border-slate-200/80 bg-white/85 backdrop-blur-md
        dark:border-slate-800/80 dark:bg-slate-950/80
      "
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        {/* Top row */}
        <div className="flex items-center gap-2 pt-3">
          <button
            onClick={onVoltar}
            className="
              -ml-1 inline-flex items-center gap-1 rounded-md p-1.5 text-xs font-medium text-slate-500
              transition-colors hover:bg-slate-100 hover:text-slate-900
              dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
            "
          >
            <ArrowLeft className="size-3.5" />
            Pacientes
          </button>
        </div>

        {/* Main row */}
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Avatar nome={paciente.nome} size="xl" />
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {paciente.nome}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {paciente.idade} anos · {paciente.genero} · {paciente.convenio} · CPF {paciente.cpf}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {paciente.condicoesCronicas.map((c, i) => (
                  <span
                    key={i}
                    className="
                      inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px]
                      text-slate-700
                      dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200
                    "
                  >
                    {c}
                  </span>
                ))}
                <span
                  className={`
                    inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium
                    ${STATUS_APP_STYLE[paciente.statusApp]}
                  `}
                >
                  <span className={`size-1.5 rounded-full ${STATUS_APP_DOT[paciente.statusApp]}`} />
                  {STATUS_APP_LABEL[paciente.statusApp]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {paciente.proximaConsulta && (
              <button
                onClick={() => onIniciarConsulta?.(paciente.proximaConsulta!.agendamentoId)}
                className="
                  inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm
                  transition-colors hover:bg-teal-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                  dark:focus:ring-offset-slate-950
                "
              >
                <Stethoscope className="size-3.5" />
                Iniciar consulta
                {paciente.proximaConsulta.modalidade === 'tele' ? (
                  <Video className="size-3 opacity-80" />
                ) : (
                  <MapPin className="size-3 opacity-80" />
                )}
              </button>
            )}
            <button
              onClick={onAbrirProntuario}
              className="
                inline-flex items-center gap-1.5 rounded-md border border-teal-300 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-700
                transition-colors hover:bg-teal-100
                focus:outline-none focus:ring-2 focus:ring-teal-400
                dark:border-teal-500/40 dark:bg-teal-500/15 dark:text-teal-300 dark:hover:bg-teal-500/25
              "
            >
              <FileText className="size-3.5" />
              <span className="hidden sm:inline">Prontuário</span>
            </button>
            <ToolbarButton onClick={onAbrirMensagemClinica} icon={MessageCircle} label="Mensagem" />
            <ToolbarButton onClick={onAgendar} icon={CalendarPlus} label="Agendar" />
            <ToolbarButton onClick={onExportarPDF} icon={FileDown} label="PDF" />
            <button
              className="
                rounded-md border border-slate-200 bg-white p-1.5 text-slate-500
                transition-colors hover:bg-slate-50 hover:text-slate-700
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800
              "
              aria-label="Mais ações"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        </div>

        {/* Last consult line */}
        {paciente.ultimaConsultaEm && (
          <p className="pb-2 text-[11px] text-slate-500 dark:text-slate-500">
            Última consulta {formatDataExtenso(paciente.ultimaConsultaEm)}
          </p>
        )}
      </div>
    </header>
  )
}

function ToolbarButton({
  onClick,
  icon: Icon,
  label,
}: {
  onClick?: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700
        transition-colors hover:bg-slate-50
        focus:outline-none focus:ring-2 focus:ring-slate-300
        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
        dark:focus:ring-slate-600
      "
    >
      <Icon className="size-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
