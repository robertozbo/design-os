import { useEffect, useMemo, useState } from 'react'
import type {
  GerarLoteResultado,
  GerarLoteStep,
  GerarLoteValidacao,
  GerarLoteWizardProps,
  ValidacaoLoteCheck,
} from '@/../product/sections/eventos-esocial/types'
import {
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  ShieldCheck,
  ShieldAlert,
  Package,
  Users,
  Hash,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
  Inbox,
  Copy,
} from 'lucide-react'
import { TipoEventoBadge } from './TipoEventoBadge'
import { AmbienteBadge } from './AmbienteBadge'
import { MotivoGatilhoChip } from './MotivoGatilhoChip'

const STEPS: { value: GerarLoteStep; label: string; sub: string }[] = [
  { value: 'confirmacao', label: 'Confirmação', sub: 'Revisar' },
  { value: 'validacao', label: 'Validação', sub: 'XSD + duplicidades' },
  { value: 'conclusao', label: 'Conclusão', sub: 'Lote gerado' },
]

const LIMITE_LOTE = 50

export function GerarLoteWizard({
  empregadorContexto,
  certificadoStatus,
  eventosSelecionados,
  ambiente,
  validacao: validacaoProp,
  resultado: resultadoProp,
  stepInicial = 'confirmacao',
  onCancelar,
  onRemoverEvento,
  onValidar,
  onConfirmarEnvio,
  onIrParaLote,
  onVoltarParaEventos,
}: GerarLoteWizardProps) {
  const [step, setStep] = useState<GerarLoteStep>(stepInicial)
  const [validando, setValidando] = useState(false)
  const [transmitindo, setTransmitindo] = useState(false)

  const eventosIds = useMemo(() => eventosSelecionados.map((e) => e.id), [eventosSelecionados])

  // Validação derivada — usa a prop se vier, senão calcula no componente
  const validacao = useMemo<GerarLoteValidacao | null>(() => {
    if (validacaoProp) return validacaoProp
    if (step !== 'validacao' || validando) return null
    return computeValidacao(eventosSelecionados, certificadoStatus.configurado && certificadoStatus.status === 'valido')
  }, [validacaoProp, step, validando, eventosSelecionados, certificadoStatus])

  const resultado = useMemo<GerarLoteResultado | null>(() => {
    if (resultadoProp) return resultadoProp
    if (step !== 'conclusao') return null
    return {
      loteId: 'lot-1842',
      numeroSequencial: 1842,
      ambiente,
      geradoEm: new Date().toISOString(),
      quantidadeEventos: eventosSelecionados.length,
    }
  }, [resultadoProp, step, eventosSelecionados, ambiente])

  // Simula validação automática quando entra no passo 2
  useEffect(() => {
    if (step !== 'validacao' || validacaoProp || validacao) return
    setValidando(true)
    const t = window.setTimeout(() => setValidando(false), 1100)
    return () => window.clearTimeout(t)
  }, [step, validacaoProp, validacao])

  const excedeLimite = eventosSelecionados.length > LIMITE_LOTE
  const podeAvancarConfirmacao = eventosSelecionados.length > 0 && !excedeLimite

  const handleAvancarConfirmacao = () => {
    if (!podeAvancarConfirmacao) return
    onValidar?.(eventosIds)
    setStep('validacao')
  }

  const handleTransmitir = () => {
    if (!validacao?.passou) return
    setTransmitindo(true)
    onConfirmarEnvio?.(eventosIds)
    window.setTimeout(() => {
      setTransmitindo(false)
      setStep('conclusao')
    }, 900)
  }

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />

      {/* Backdrop simulado pra dar contexto de modal — em produção ficaria translucido */}
      <div className="absolute inset-0 bg-slate-900/5 dark:bg-slate-950/40 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[760px] px-4 sm:px-6 pt-10 pb-16">
        {/* Modal card */}
        <div className="nymos-reveal opacity-0 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.18)] dark:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Header */}
          <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5 mb-1">
                <Package className="w-3 h-3 text-teal-600 dark:text-teal-400" strokeWidth={2} />
                Gerar lote para eSocial
              </p>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {step === 'confirmacao' && 'Revise os eventos do lote'}
                {step === 'validacao' && (validando ? 'Validando lote…' : validacao?.passou ? 'Tudo pronto pra transmitir' : 'Pendências bloqueando o envio')}
                {step === 'conclusao' && 'Lote gerado com sucesso'}
              </h2>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                {empregadorContexto.nomeFantasia} · CNPJ{' '}
                <span className="font-mono">{empregadorContexto.cnpj}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AmbienteBadge ambiente={ambiente} size="md" />
              <button
                type="button"
                onClick={onCancelar}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </header>

          {/* Stepper */}
          <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
            <ol className="flex items-center gap-1">
              {STEPS.map((s, idx) => {
                const isCurrent = step === s.value
                const idxCurrent = STEPS.findIndex((x) => x.value === step)
                const isDone = idx < idxCurrent
                return (
                  <li key={s.value} className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`
                          shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-semibold transition
                          ${
                            isCurrent
                              ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-[0_3px_10px_-2px_rgba(13,148,136,0.45)]'
                              : isDone
                                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-900'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }
                        `}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : idx + 1}
                      </span>
                      <div className="min-w-0 hidden sm:block">
                        <p
                          className={`text-[12px] font-medium leading-tight ${
                            isCurrent
                              ? 'text-slate-900 dark:text-slate-50'
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {s.label}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-500">{s.sub}</p>
                      </div>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <span
                        className={`flex-1 h-px rounded ${
                          isDone || (isCurrent && idx === idxCurrent - 1)
                            ? 'bg-teal-300 dark:bg-teal-800'
                            : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Body */}
          <div key={step} className="nymos-reveal opacity-0 px-6 py-5 min-h-[320px]">
            {step === 'confirmacao' && (
              <StepConfirmacao
                eventos={eventosSelecionados}
                excedeLimite={excedeLimite}
                onRemover={(id) => onRemoverEvento?.(id)}
              />
            )}
            {step === 'validacao' && (
              <StepValidacao validando={validando} validacao={validacao} eventos={eventosSelecionados} />
            )}
            {step === 'conclusao' && resultado && (
              <StepConclusao resultado={resultado} />
            )}
          </div>

          {/* Footer com ações */}
          <footer className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              {step === 'confirmacao' && (
                <>
                  <Users className="w-3 h-3" strokeWidth={1.75} />
                  <span className="tabular-nums">
                    {eventosSelecionados.length} de {LIMITE_LOTE} eventos
                  </span>
                  {excedeLimite && (
                    <span className="text-rose-700 dark:text-rose-300 font-medium">
                      · Limite excedido em {eventosSelecionados.length - LIMITE_LOTE}
                    </span>
                  )}
                </>
              )}
              {step === 'validacao' && validacao && (
                <>
                  <ShieldCheck
                    className={`w-3 h-3 ${validacao.passou ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                    strokeWidth={2}
                  />
                  {validacao.passou
                    ? 'Lote válido — pronto pra transmissão ao governo'
                    : `${validacao.checks.filter((c) => !c.passou).length} pendência${validacao.checks.filter((c) => !c.passou).length > 1 ? 's' : ''} pra corrigir`}
                </>
              )}
              {step === 'conclusao' && resultado && (
                <>
                  <Inbox className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                  Aguardando processamento do governo
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {step === 'confirmacao' && (
                <>
                  <button
                    type="button"
                    onClick={onCancelar}
                    className="px-3.5 py-2 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAvancarConfirmacao}
                    disabled={!podeAvancarConfirmacao}
                    className={`
                      inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition
                      ${
                        podeAvancarConfirmacao
                          ? 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      }
                    `}
                  >
                    Avançar
                    <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </button>
                </>
              )}

              {step === 'validacao' && (
                <>
                  <button
                    type="button"
                    onClick={() => setStep('confirmacao')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
                    Voltar
                  </button>
                  {validacao && !validacao.passou ? (
                    <button
                      type="button"
                      onClick={() => setStep('confirmacao')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white transition"
                    >
                      Corrigir e revalidar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleTransmitir}
                      disabled={!validacao?.passou || transmitindo}
                      className={`
                        inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition
                        ${
                          validacao?.passou && !transmitindo
                            ? 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        }
                      `}
                    >
                      {transmitindo ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2.25} />
                          Transmitindo…
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" strokeWidth={2.25} />
                          Transmitir agora
                        </>
                      )}
                    </button>
                  )}
                </>
              )}

              {step === 'conclusao' && resultado && (
                <>
                  <button
                    type="button"
                    onClick={onVoltarParaEventos}
                    className="px-3.5 py-2 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Voltar para eventos
                  </button>
                  <button
                    type="button"
                    onClick={() => onIrParaLote?.(resultado.loteId)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)] transition"
                  >
                    Ver no histórico
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </button>
                </>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

function StepConfirmacao({
  eventos,
  excedeLimite,
  onRemover,
}: {
  eventos: GerarLoteWizardProps['eventosSelecionados']
  excedeLimite: boolean
  onRemover: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      {excedeLimite && (
        <div className="rounded-xl border border-rose-200/70 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 px-4 py-3 flex items-start gap-2.5">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 text-rose-600 dark:text-rose-400 shrink-0" strokeWidth={2} />
          <div>
            <p className="text-[13px] font-medium text-rose-900 dark:text-rose-200">
              Limite do eSocial excedido
            </p>
            <p className="text-[11px] text-rose-800/90 dark:text-rose-300/90 mt-0.5 leading-snug">
              O eSocial aceita no máximo {LIMITE_LOTE} eventos por lote. Remova {eventos.length - LIMITE_LOTE} eventos
              ou divida em múltiplos lotes.
            </p>
          </div>
        </div>
      )}

      <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
        Eventos no envelope · {eventos.length}
      </p>

      {eventos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 px-4 py-10 text-center">
          <Inbox className="w-5 h-5 mx-auto mb-1.5 text-slate-400" strokeWidth={1.5} />
          <p className="text-[12px] text-slate-500 dark:text-slate-400">
            Nenhum evento selecionado. Cancele e volte pra lista pra escolher.
          </p>
        </div>
      ) : (
        <ul className="max-h-[300px] overflow-y-auto space-y-1.5 -mx-1 px-1">
          {eventos.map((evento) => (
            <li
              key={evento.id}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <TipoEventoBadge tipo={evento.tipo} compact />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-slate-900 dark:text-slate-100 truncate">
                  {evento.trabalhador.nome}
                </p>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {evento.trabalhador.cpf}
                </p>
              </div>
              <div className="hidden sm:block">
                <MotivoGatilhoChip
                  motivo={evento.motivoGatilho}
                  label={evento.motivoGatilhoLabel}
                  compact
                />
              </div>
              <button
                type="button"
                onClick={() => onRemover(evento.id)}
                className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center w-7 h-7 rounded text-slate-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                aria-label="Remover do lote"
                title="Remover do lote"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StepValidacao({
  validando,
  validacao,
  eventos,
}: {
  validando: boolean
  validacao: GerarLoteValidacao | null
  eventos: GerarLoteWizardProps['eventosSelecionados']
}) {
  if (validando) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300">
          <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
        </span>
        <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100">
          Validando {eventos.length} evento{eventos.length > 1 ? 's' : ''}…
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center max-w-sm">
          XSD oficial · duplicidades por colaborador · integridade dos dados · certificado digital
        </p>
      </div>
    )
  }

  if (!validacao) return null

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
        Validações executadas · {validacao.checks.length}
      </p>
      {validacao.checks.map((check) => (
        <ValidacaoCheckCard key={check.id} check={check} />
      ))}
    </div>
  )
}

function ValidacaoCheckCard({ check }: { check: ValidacaoLoteCheck }) {
  return (
    <article
      className={`
        rounded-xl border px-4 py-3
        ${
          check.passou
            ? 'border-emerald-200/70 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
            : 'border-rose-200/70 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30'
        }
      `}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg ${
            check.passou
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
          }`}
        >
          {check.passou ? (
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          ) : (
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-[13px] font-semibold ${
              check.passou
                ? 'text-emerald-900 dark:text-emerald-100'
                : 'text-rose-900 dark:text-rose-100'
            }`}
          >
            {check.titulo}
          </p>
          <p
            className={`text-[11px] mt-0.5 leading-snug ${
              check.passou
                ? 'text-emerald-700 dark:text-emerald-300/90'
                : 'text-rose-700 dark:text-rose-300/90'
            }`}
          >
            {check.descricao}
          </p>
          {check.itens && check.itens.length > 0 && (
            <ul className="mt-2 space-y-0.5 border-l-2 border-rose-300 dark:border-rose-800 pl-2.5">
              {check.itens.map((item, idx) => (
                <li
                  key={idx}
                  className="text-[11px] text-rose-700/90 dark:text-rose-300/80 font-mono"
                >
                  → {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  )
}

function StepConclusao({ resultado }: { resultado: GerarLoteResultado }) {
  return (
    <div className="flex flex-col items-center text-center py-2">
      <span className="relative inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 mb-3">
        <span className="absolute inset-0 rounded-3xl bg-emerald-400/30 dark:bg-emerald-500/20 animate-ping" />
        <CheckCircle2 className="relative w-7 h-7" strokeWidth={2} />
      </span>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        Lote #{resultado.numeroSequencial} gerado
      </h3>
      <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-1 max-w-[420px]">
        {resultado.quantidadeEventos} evento{resultado.quantidadeEventos > 1 ? 's' : ''} enfileirado
        {resultado.quantidadeEventos > 1 ? 's' : ''} pra transmissão. Você receberá notificação
        quando o governo processar.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 w-full max-w-[500px]">
        <Stat label="ID do lote" value={resultado.loteId} mono />
        <Stat label="Ambiente" value={resultado.ambiente === 'producao' ? 'Produção' : 'Homologação'} />
        <Stat label="Eventos" value={`${resultado.quantidadeEventos} / ${LIMITE_LOTE}`} mono />
        <Stat label="Gerado em" value={formatDateTime(resultado.geradoEm)} mono />
      </div>

      <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <Hash className="w-3 h-3 text-slate-400" strokeWidth={1.75} />
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
          Aguardando protocolo
        </span>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(resultado.loteId)}
          className="inline-flex items-center justify-center w-5 h-5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
          aria-label="Copiar ID do lote"
        >
          <Copy className="w-3 h-3" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="text-left rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p
        className={`text-[13px] font-semibold text-slate-900 dark:text-slate-50 mt-0.5 ${
          mono ? 'font-mono tabular-nums' : ''
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function computeValidacao(
  eventos: GerarLoteWizardProps['eventosSelecionados'],
  certValido: boolean,
): GerarLoteValidacao {
  const checks: ValidacaoLoteCheck[] = []

  // Limite
  checks.push({
    id: 'limite',
    titulo: 'Limite do lote',
    descricao: `${eventos.length} de ${LIMITE_LOTE} eventos · dentro do limite oficial.`,
    passou: eventos.length > 0 && eventos.length <= LIMITE_LOTE,
  })

  // XSD
  const erros = eventos.filter((e) => !e.validacaoXsd.valido)
  checks.push({
    id: 'xsd',
    titulo: 'Validação XSD por evento',
    descricao:
      erros.length === 0
        ? `${eventos.length} evento${eventos.length > 1 ? 's' : ''} em conformidade com o schema oficial.`
        : `${erros.length} evento${erros.length > 1 ? 's' : ''} com erro XSD.`,
    passou: erros.length === 0,
    itens: erros.map((e) => `${e.tipo} · ${e.trabalhador.nome} · ${e.validacaoXsd.erros[0]?.mensagem ?? 'erro'}`),
  })

  // Duplicidades por colaborador
  const porColaborador = new Map<string, number>()
  for (const e of eventos) {
    const chave = `${e.tipo}::${e.trabalhador.id}`
    porColaborador.set(chave, (porColaborador.get(chave) ?? 0) + 1)
  }
  const duplicados = Array.from(porColaborador.entries()).filter(([, n]) => n > 1)
  checks.push({
    id: 'duplicidade',
    titulo: 'Duplicidades no mesmo lote',
    descricao:
      duplicados.length === 0
        ? 'Nenhum colaborador com mesmo tipo de evento repetido neste lote.'
        : `${duplicados.length} colaborador(es) com tipo de evento repetido.`,
    passou: duplicados.length === 0,
    itens: duplicados.map(([chave, n]) => `${chave.replace('::', ' · ')} (${n}×)`),
  })

  // Certificado
  checks.push({
    id: 'certificado',
    titulo: 'Certificado digital',
    descricao: certValido
      ? 'Certificado A1 vigente, pronto pra assinatura do lote.'
      : 'Certificado não configurado, expirado ou inválido — bloqueia transmissão.',
    passou: certValido,
  })

  return {
    passou: checks.every((c) => c.passou),
    checks,
  }
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yy = d.getFullYear()
    const hh = String(d.getHours()).padStart(2, '0')
    const mn = String(d.getMinutes()).padStart(2, '0')
    return `${dd}/${mm}/${yy} ${hh}:${mn}`
  } catch {
    return '—'
  }
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
