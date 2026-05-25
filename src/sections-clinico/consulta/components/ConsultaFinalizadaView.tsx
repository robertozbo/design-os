import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  FilePlus,
  ImageIcon,
  Lock,
  MapPin,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
} from 'lucide-react'
import type { ConsultaFinalizadaItem } from '@/../product-clinico/sections/consultas/types'

interface Props {
  consulta: ConsultaFinalizadaItem
  onVoltar?: () => void
  onAbrirProntuarioPaciente?: (pacienteId: string) => void
  onAdicionarAdendo?: (consultaId: string) => void
}

function formatarDataExtenso(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  })
}

function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatarDataHoraCurta(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatarDataCurta(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function ConsultaFinalizadaView({
  consulta,
  onVoltar,
  onAbrirProntuarioPaciente,
  onAdicionarAdendo,
}: Props) {
  return (
    <div
      data-clinico-consulta-finalizada
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">
      {/* Voltar */}
      <button
        onClick={onVoltar}
        className="
          -ml-1 inline-flex items-center gap-1 rounded-md p-1.5 text-xs font-medium text-slate-500 transition-colors
          hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
        "
      >
        <ArrowLeft className="size-4" />
        Voltar pra Consultas
      </button>

      {/* Header com avatar */}
      <header className="mt-4 flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-base font-medium text-white shadow-sm">
          {consulta.pacienteIniciais}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {consulta.pacienteNome}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {formatarDataExtenso(consulta.inicioEm)} · {formatarHora(consulta.inicioEm)}–
            {formatarHora(consulta.fimEm)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          <Lock className="size-3" />
          Assinada · read-only
        </div>
      </header>

      {/* Banner de assinatura */}
      <section className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-4 text-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-emerald-900 dark:text-emerald-100">
            Consulta assinada em {formatarDataHoraCurta(consulta.assinadoEm)}
          </p>
          <p className="mt-0.5 text-[12px] text-emerald-800/80 dark:text-emerald-300/80">
            Documento clínico imutável (CFM 1.821 · 20 anos de retenção). Edições só via
            nova consulta de acréscimo.
          </p>
        </div>
        <button
          onClick={() => onAdicionarAdendo?.(consulta.id)}
          className="
            inline-flex shrink-0 items-center gap-1.5 self-center
            rounded-lg border border-emerald-300/70 bg-white px-3 py-2 text-[12.5px] font-semibold text-emerald-800
            transition-colors hover:bg-emerald-50
            focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
            dark:border-emerald-800/60 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-slate-800
            dark:focus:ring-offset-slate-950
          "
        >
          <FilePlus className="size-3.5" />
          Adicionar adendo
        </button>
      </section>

      {/* Metadados rápidos */}
      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          icon={consulta.modalidade === 'tele' ? Video : MapPin}
          label="Modalidade"
          value={consulta.modalidade === 'tele' ? 'Teleconsulta' : 'Presencial'}
        />
        <Stat icon={Clock} label="Duração" value={`${consulta.duracaoMin} min`} />
        <Stat
          icon={Sparkles}
          label="IA escriba"
          value={consulta.geradoPorIA ? 'Sim' : 'Não'}
          accent={consulta.geradoPorIA ? 'emerald' : 'slate'}
        />
        <Stat
          icon={Stethoscope}
          label="Tipo"
          value={consulta.queixaPrincipal.startsWith('Primeira') ? '1ª consulta' : 'Retorno'}
        />
      </section>

      {/* Queixa principal */}
      <section className="mt-5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Queixa principal
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
          {consulta.queixaPrincipal}
        </p>
      </section>

      {/* Hipótese / Avaliação */}
      <section className="mt-3 rounded-xl border border-teal-200/70 bg-gradient-to-b from-teal-50/40 to-white p-5 shadow-sm dark:border-teal-900/40 dark:from-teal-950/20 dark:to-slate-900">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          Hipótese diagnóstica · Conduta
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-900 dark:text-slate-50">
          "{consulta.hipoteseDiagnostica}"
        </p>
      </section>

      {/* SOAP completo */}
      {consulta.soap && (
        <section className="mt-5">
          <h3 className="mb-2 flex items-baseline gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>SOAP — Atendimento completo</span>
            {consulta.geradoPorIA && (
              <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium normal-case text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Sparkles className="size-2.5" />
                Gerado por IA · revisado pelo médico
              </span>
            )}
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <SoapBlock letter="S" titulo="Subjetivo" texto={consulta.soap.S} tom="slate" />
            <SoapBlock letter="O" titulo="Objetivo" texto={consulta.soap.O} tom="slate" />
            <SoapBlock letter="A" titulo="Avaliação" texto={consulta.soap.A} tom="teal" />
            <SoapBlock letter="P" titulo="Plano" texto={consulta.soap.P} tom="teal" />
          </div>
        </section>
      )}

      {/* Prescrições emitidas */}
      {consulta.prescricoes && consulta.prescricoes.length > 0 && (
        <section className="mt-5">
          <header className="mb-2 flex items-baseline justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Pill className="size-3" />
              Prescrições emitidas · {consulta.prescricoes.length}
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="size-3" />
              Assinadas digitalmente (Memed · ICP-Brasil)
            </span>
          </header>
          <ul className="space-y-2">
            {consulta.prescricoes.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-violet-200/70 bg-gradient-to-br from-violet-50/40 to-white p-4 dark:border-violet-900/40 dark:from-violet-950/20 dark:to-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {p.medicacao}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {p.posologia}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {p.via && <span>Via {p.via.toLowerCase()}</span>}
                      {p.duracao && <span>· {p.duracao}</span>}
                      <span>· Validade {formatarDataCurta(p.validade)}</span>
                    </div>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log('abrir Memed:', p.memedId)
                    }}
                    className="
                      shrink-0 inline-flex items-center gap-1 rounded-md border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-800 transition-colors
                      hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-400
                      dark:border-violet-900/60 dark:bg-slate-900 dark:text-violet-300 dark:hover:bg-violet-950/40
                    "
                  >
                    <ExternalLink className="size-3" />
                    Memed
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Counters secundários: exames / imagens */}
      <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CountCard
          icon={FileText}
          label="Exames solicitados"
          count={consulta.examesSolicitadosCount}
          tom="amber"
          empty="Nenhum exame solicitado"
        />
        <CountCard
          icon={ImageIcon}
          label="Imagens analisadas (IA)"
          count={consulta.imagensAnalisadasCount}
          tom="emerald"
          empty="Nenhuma imagem analisada"
        />
      </section>

      {/* Footer — drill in pro prontuário */}
      <footer className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/40 p-4 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-[12px] text-slate-600 dark:text-slate-300">
          Para SOAP completo, prescrições detalhadas e ações pós-consulta, abra o
          prontuário do paciente.
        </p>
        <button
          onClick={() => onAbrirProntuarioPaciente?.(consulta.pacienteId)}
          className="
            mt-2 inline-flex items-center gap-1 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors
            hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
          "
        >
          <Stethoscope className="size-3.5" />
          Abrir prontuário de {consulta.pacienteNome.split(' ')[0]}
        </button>
      </footer>
      </div>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  accent = 'slate',
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  accent?: 'slate' | 'emerald'
}) {
  const styles =
    accent === 'emerald'
      ? 'border-emerald-200/70 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
      : 'border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900'
  return (
    <div className={`rounded-lg border p-3 ${styles}`}>
      <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        <Icon className="size-3" />
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  )
}

function CountCard({
  icon: Icon,
  label,
  count,
  tom,
  empty,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  count: number
  tom: 'violet' | 'amber' | 'emerald'
  empty: string
}) {
  const tones = {
    violet: 'border-violet-200/70 bg-violet-50/40 text-violet-800 dark:border-violet-900/40 dark:bg-violet-950/20 dark:text-violet-200',
    amber: 'border-amber-200/70 bg-amber-50/40 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200',
    emerald: 'border-emerald-200/70 bg-emerald-50/40 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200',
  }
  const has = count > 0
  return (
    <div
      className={`rounded-xl border p-4 ${
        has ? tones[tom] : 'border-slate-200/70 bg-slate-50/40 text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400'
      }`}
    >
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
        <Icon className="size-3" />
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-bold tabular-nums">
        {has ? count : '—'}
      </p>
      <p className="mt-0.5 text-[10px] italic opacity-80">{has ? '' : empty}</p>
    </div>
  )
}

function SoapBlock({
  letter,
  titulo,
  texto,
  tom,
}: {
  letter: 'S' | 'O' | 'A' | 'P'
  titulo: string
  texto: string
  tom: 'slate' | 'teal'
}) {
  const styles =
    tom === 'teal'
      ? {
          card: 'border-teal-200/70 bg-gradient-to-b from-teal-50/40 to-white dark:border-teal-900/40 dark:from-teal-950/20 dark:to-slate-900',
          badge: 'bg-teal-600 text-white dark:bg-teal-500',
          label: 'text-teal-700 dark:text-teal-300',
        }
      : {
          card: 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900',
          badge: 'bg-slate-700 text-white dark:bg-slate-600',
          label: 'text-slate-500 dark:text-slate-400',
        }
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${styles.card}`}>
      <header className="flex items-center gap-2">
        <span
          className={`flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${styles.badge}`}
        >
          {letter}
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${styles.label}`}>
          {titulo}
        </span>
      </header>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-800 dark:text-slate-100">
        {texto}
      </p>
    </div>
  )
}
