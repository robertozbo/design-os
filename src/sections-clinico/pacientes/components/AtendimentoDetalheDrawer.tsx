import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Bone,
  Brain,
  CalendarPlus,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileSignature,
  FileText,
  Image as ImageIcon,
  Lock,
  MapPin,
  MessageCircle,
  Pill,
  ScanSearch,
  ScrollText,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Video,
  Waves,
  X,
} from 'lucide-react'
import type {
  AcaoPosConsultaRealizada,
  AtendimentoDetalhe,
  SoapEvolucao,
} from '@/../product-clinico/sections/pacientes/types'
import { formatDataBR, formatDataExtenso } from './helpers'

interface Props {
  atendimento: AtendimentoDetalhe | null
  pacienteNome: string
  pacienteIniciais: string
  onClose?: () => void
  onAbrirPrescricao?: (prescricaoId: string) => void
  onAbrirAuditIA?: (atendimentoId: string) => void
  /** Permite atalho "Iniciar nova consulta" ao olhar o histórico (saída pra Consulta ativa). */
  onIniciarNovaConsulta?: () => void
}

const SOAP_META: Record<
  keyof SoapEvolucao,
  { label: string; descricao: string; cor: string; icon: React.ComponentType<{ className?: string }> }
> = {
  subjective: {
    label: 'Subjective',
    descricao: 'O que o paciente conta',
    cor: 'border-l-emerald-500',
    icon: MessageCircle,
  },
  objective: {
    label: 'Objective',
    descricao: 'O que se observa — exame físico, sinais',
    cor: 'border-l-teal-500',
    icon: Stethoscope,
  },
  assessment: {
    label: 'Assessment',
    descricao: 'A avaliação clínica',
    cor: 'border-l-violet-500',
    icon: ScrollText,
  },
  plan: {
    label: 'Plan',
    descricao: 'O plano de conduta',
    cor: 'border-l-amber-500',
    icon: FileSignature,
  },
}

const ACAO_META: Record<
  AcaoPosConsultaRealizada,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  'agendar-retorno': { label: 'Retorno agendado', icon: CalendarPlus },
  'enviar-resumo': { label: 'Resumo enviado pro paciente', icon: MessageCircle },
  cobrar: { label: 'Cobrança disparada', icon: CreditCard },
}

export function AtendimentoDetalheDrawer({
  atendimento,
  pacienteNome,
  pacienteIniciais,
  onClose,
  onAbrirPrescricao,
  onAbrirAuditIA,
  onIniciarNovaConsulta,
}: Props) {
  useEffect(() => {
    if (!atendimento) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [atendimento, onClose])

  if (!atendimento) return null

  const tempoFmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const cancelado = !atendimento.assinadoEm

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="atd-detalhe-title"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-slate-950/70"
      />

      <aside className="relative ml-auto flex h-full w-full max-w-3xl flex-col border-l border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200/80 bg-white/85 px-5 py-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-xs font-medium text-white shadow-sm">
              {pacienteIniciais}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="atd-detalhe-title"
                  className="text-base font-semibold text-slate-900 dark:text-slate-50"
                >
                  Atendimento de {formatDataBR(atendimento.data)}
                </h2>
                <span
                  className={`
                    inline-flex items-center gap-1 rounded-md border px-1.5 py-0 text-[10px] font-medium
                    ${
                      atendimento.modalidade === 'tele'
                        ? 'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300'
                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    }
                  `}
                >
                  {atendimento.modalidade === 'tele' ? (
                    <>
                      <Video className="size-2.5" />
                      Teleconsulta
                    </>
                  ) : (
                    <>
                      <MapPin className="size-2.5" />
                      Presencial
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100/80 px-1.5 py-0 text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Lock className="size-2.5" />
                  Read-only · CFM 1.821
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {pacienteNome} · atendido por {atendimento.medico} · {tempoFmt(atendimento.inicioEm)}
                {' → '}
                {tempoFmt(atendimento.fimEm)}{' '}
                <span className="text-slate-400">({atendimento.duracaoMin} min)</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-1 -mt-1 inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Faixa de assinatura + IA */}
          <section
            className={`
              flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5
              ${
                cancelado
                  ? 'border-rose-200/70 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20'
                  : atendimento.geradoPorIA
                    ? 'border-emerald-200/70 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                    : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
              }
            `}
          >
            <div className="flex items-start gap-2.5">
              {cancelado ? (
                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400" />
              ) : (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {cancelado
                    ? 'Atendimento sem assinatura'
                    : `Assinado em ${formatDataExtenso(atendimento.assinadoEm!)} às ${tempoFmt(
                        atendimento.assinadoEm!,
                      )}`}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {atendimento.geradoPorIA && atendimento.modeloIA ? (
                    <>
                      <Sparkles className="mr-1 -mt-0.5 inline size-3 text-emerald-600 dark:text-emerald-400" />
                      Evolução gerada/assistida por IA · modelo{' '}
                      <span className="font-mono">
                        {atendimento.modeloIA}
                        {atendimento.versaoIA}
                      </span>{' '}
                      · revisada por {atendimento.medico}
                    </>
                  ) : (
                    <>Evolução escrita pelo médico (sem IA)</>
                  )}
                </p>
              </div>
            </div>
            {atendimento.geradoPorIA && (
              <button
                onClick={() => onAbrirAuditIA?.(atendimento.id)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FileText className="size-3" />
                Audit log IA
              </button>
            )}
          </section>

          {/* Anamnese */}
          <section className="mt-5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <header className="mb-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Anamnese (pré-preenchida pelo paciente)
              </h3>
            </header>
            <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Queixa principal
                </dt>
                <dd className="mt-1 text-slate-800 dark:text-slate-100">
                  {atendimento.anamneseResumo.queixaPrincipal}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Medicação no dia
                </dt>
                <dd className="mt-1 text-slate-800 dark:text-slate-100">
                  {atendimento.anamneseResumo.medicacaoNoDia}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Sintomas
                </dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {atendimento.anamneseResumo.sintomas.length === 0 ? (
                    <span className="text-[11px] italic text-slate-400">Nenhum sintoma reportado</span>
                  ) : (
                    atendimento.anamneseResumo.sintomas.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {s}
                      </span>
                    ))
                  )}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Dúvidas do paciente
                </dt>
                <dd className="mt-1 italic text-slate-700 dark:text-slate-200">
                  "{atendimento.anamneseResumo.duvidasPaciente}"
                </dd>
              </div>
            </dl>
          </section>

          {/* SOAP */}
          <section className="mt-5">
            <header className="mb-3 flex items-baseline justify-between px-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Evolução SOAP — read-only
              </h3>
              <span className="text-[10px] text-slate-400">
                Edição encerrada com a assinatura
              </span>
            </header>
            <div className="space-y-2">
              {(Object.keys(SOAP_META) as Array<keyof SoapEvolucao>).map((tipo) => {
                const meta = SOAP_META[tipo]
                const Icon = meta.icon
                return (
                  <article
                    key={tipo}
                    className={`
                      rounded-xl border-l-4 ${meta.cor}
                      border border-y-slate-200/60 border-r-slate-200/60 bg-white p-4 shadow-sm
                      dark:border-y-slate-800 dark:border-r-slate-800 dark:bg-slate-900
                    `}
                  >
                    <header className="mb-2 flex items-center gap-2">
                      <Icon className="size-3.5 text-slate-400" />
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {meta.label}
                      </h4>
                      <span className="text-[10px] text-slate-400">{meta.descricao}</span>
                    </header>
                    <p className="whitespace-pre-line text-[12px] leading-relaxed text-slate-700 dark:text-slate-200">
                      {atendimento.soap[tipo]}
                    </p>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Prescrições emitidas */}
          {atendimento.prescricoesEmitidas.length > 0 && (
            <section className="mt-5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <header className="mb-3 flex items-center gap-2">
                <Pill className="size-3.5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Prescrições emitidas ({atendimento.prescricoesEmitidas.length})
                </h3>
              </header>
              <ul className="space-y-3">
                {atendimento.prescricoesEmitidas.map((rx) => (
                  <li
                    key={rx.id}
                    className="rounded-lg border border-slate-200/80 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        Receita Memed
                      </p>
                      <button
                        onClick={() => onAbrirPrescricao?.(rx.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-teal-600 transition-colors hover:underline dark:text-teal-400"
                      >
                        Ver detalhes <ExternalLink className="size-3" />
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">{rx.memedId}</p>
                    <ul className="mt-2 space-y-1">
                      {rx.medicacoes.map((m, i) => (
                        <li
                          key={i}
                          className="flex flex-wrap items-baseline gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-[11px] dark:bg-slate-800/60"
                        >
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {m.nome}
                          </span>
                          <span className="font-mono text-slate-500">{m.dose}</span>
                          <span className="text-slate-500">· {m.posologia}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Exames solicitados */}
          {atendimento.examesSolicitados.length > 0 && (
            <section className="mt-5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <header className="mb-3 flex items-center gap-2">
                <FileText className="size-3.5 text-slate-400" />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Exames solicitados
                </h3>
              </header>
              <div className="flex flex-wrap gap-1.5">
                {atendimento.examesSolicitados.map((e, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Imagens analisadas com IA durante a consulta */}
          {atendimento.imagensAnalisadas && atendimento.imagensAnalisadas.length > 0 && (
            <section className="mt-5 rounded-xl border border-emerald-200/70 bg-gradient-to-b from-emerald-50/40 to-white p-5 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-slate-900">
              <header className="mb-3 flex items-center gap-2">
                <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Imagens analisadas com IA ({atendimento.imagensAnalisadas.length})
                </h3>
              </header>
              <ul className="space-y-3">
                {atendimento.imagensAnalisadas.map((img) => {
                  const ModIcon =
                    img.modalidade === 'raio-x'
                      ? Bone
                      : img.modalidade === 'usg'
                        ? Waves
                        : img.modalidade === 'rm' || img.modalidade === 'tc'
                          ? Brain
                          : img.modalidade === 'cintilografia'
                            ? ScanSearch
                            : ImageIcon
                  return (
                    <li
                      key={img.id}
                      className="rounded-lg border border-emerald-200/60 bg-white p-3 dark:border-emerald-900/40 dark:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                            <ModIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            {img.tipo}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                            {img.laboratorio} · coletado {formatDataBR(img.dataColeta)} ·{' '}
                            {img.seriesAnalisadas} séries · {img.modeloIA}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-slate-400">
                          {new Date(img.salvoEm).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {img.comentarioMedico && (
                        <blockquote className="mt-2.5 rounded-md border-l-2 border-emerald-400 bg-emerald-50/60 px-3 py-2 text-[11px] leading-relaxed text-slate-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-slate-200">
                          <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-700/80 dark:text-emerald-400/80">
                            Comentário do médico
                          </p>
                          {img.comentarioMedico}
                        </blockquote>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {/* Pós-consulta */}
          <section className="mt-5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <header className="mb-3 flex items-center gap-2">
              <Clock className="size-3.5 text-slate-400" />
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Ações pós-consulta
              </h3>
            </header>
            {atendimento.acoesRealizadas.length === 0 ? (
              <p className="text-[11px] italic text-slate-400">
                Nenhuma ação pós-consulta registrada.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {atendimento.acoesRealizadas.map((a) => {
                  const Icon = ACAO_META[a].icon
                  return (
                    <li key={a} className="flex items-center gap-2 text-[12px]">
                      <Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-slate-700 dark:text-slate-200">{ACAO_META[a].label}</span>
                      {a === 'agendar-retorno' && atendimento.retornoSugerido && (
                        <span className="text-[10px] text-slate-400">
                          → {formatDataBR(atendimento.retornoSugerido)}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200/80 bg-white px-5 py-3 dark:border-slate-800/80 dark:bg-slate-950">
          <p className="text-[10px] text-slate-400">
            Acesso registrado no audit log do paciente (LGPD)
          </p>
          <div className="flex items-center gap-2">
            {onIniciarNovaConsulta && (
              <button
                onClick={onIniciarNovaConsulta}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Stethoscope className="size-3.5" />
                Iniciar nova consulta
              </button>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
            >
              Fechar
            </button>
          </div>
        </footer>
      </aside>
    </div>,
    document.body,
  )
}
