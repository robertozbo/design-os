import { useEffect, useRef, useState } from 'react'
import type { EventoDetailProps } from '@/../product/sections/eventos-esocial/types'
import {
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Send,
  GitBranch,
  Trash2,
  Download,
  MoreHorizontal,
  Pencil,
  User2,
  AlertCircle,
} from 'lucide-react'
import { TipoEventoBadge } from './TipoEventoBadge'
import { StatusBadge } from './StatusBadge'
import { AmbienteBadge } from './AmbienteBadge'
import { StatusGovernoPanel } from './StatusGovernoPanel'
import { ValidacaoXsdPanel } from './ValidacaoXsdPanel'
import { DadosEventoPanel } from './DadosEventoPanel'
import { AnexosPanel } from './AnexosPanel'
import { AuditoriaPanel } from './AuditoriaPanel'

export function EventoDetail({
  evento,
  empregadorContexto,
  onVoltar,
  onAbrirEvento,
  onAbrirTrabalhador,
  onAbrirOrigem,
  onEditar,
  onValidarXsd,
  onEnviarParaFila,
  onRetificar,
  onExcluir,
  onBaixarXml,
  onUploadAnexo,
  onRemoverAnexo,
  onAbrirAnexo,
  onRetentarTransmissao,
}: EventoDetailProps) {
  const [overflowOpen, setOverflowOpen] = useState(false)
  const [excluirModalOpen, setExcluirModalOpen] = useState(false)
  const overflowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!overflowOpen) return
    function handleClick(e: MouseEvent) {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setOverflowOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [overflowOpen])

  const podeEditar = evento.status === 'rascunho' || evento.status === 'rejeitado'
  const podeRetificar = evento.status === 'aceito' && !evento.retificadoPor
  const podeEnviar =
    evento.status === 'rascunho' || evento.status === 'validado' || evento.status === 'rejeitado'
  const podeExcluir = evento.status !== 'excluido'

  const labelId = `${evento.tipo}-${String(evento.numeroSequencial).padStart(4, '0')}`

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Breadcrumb */}
        <div
          className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap"
          aria-label="Trilha"
        >
          <button
            type="button"
            onClick={onVoltar}
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
          >
            Empregadores
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">
            {empregadorContexto.nomeFantasia}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <button
            type="button"
            onClick={onVoltar}
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
          >
            Eventos eSocial
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400 font-mono">{labelId}</span>
        </div>

        {/* Back button mobile */}
        <button
          type="button"
          onClick={onVoltar}
          className="nymos-reveal opacity-0 inline-flex items-center gap-1 mb-3 text-[12px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition lg:hidden"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Voltar para Eventos eSocial
        </button>

        {/* Header */}
        <header
          style={{ animationDelay: '60ms' }}
          className="nymos-reveal opacity-0 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950"
        >
          <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <TipoEventoBadge tipo={evento.tipo} />
                <StatusBadge status={evento.status} label={evento.statusLabel} />
                <AmbienteBadge ambiente={evento.ambiente} size="md" />
                {evento.origem === 'retificacao' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 ring-1 ring-violet-200 dark:ring-violet-900">
                    <GitBranch className="w-2.5 h-2.5" strokeWidth={2.25} />
                    Retificação
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {evento.tipoLabel}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 inline-flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[12px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {labelId}
                </span>
                <span aria-hidden="true">·</span>
                <span>Fato gerador em {formatData(evento.dataFatoGerador)}</span>
              </p>

              <button
                type="button"
                onClick={() => onAbrirTrabalhador?.(evento.trabalhador.id)}
                className="mt-3 inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800 transition group"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-950 dark:to-teal-900/40 text-teal-700 dark:text-teal-300">
                  <User2 className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <span className="text-left">
                  <span className="block text-[13px] font-medium text-slate-900 dark:text-slate-100">
                    {evento.trabalhador.nome}
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {evento.trabalhador.cpf}
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline-block pl-2 border-l border-slate-200 dark:border-slate-800 ml-1">
                  {evento.trabalhador.setor} · {evento.trabalhador.estabelecimento}
                </span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              {podeEditar && (
                <ActionBtn
                  icon={<Pencil className="w-3.5 h-3.5" strokeWidth={2} />}
                  label="Editar"
                  onClick={() => onEditar?.(evento.id)}
                />
              )}
              <ActionBtn
                icon={<ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />}
                label="Validar XSD"
                onClick={() => onValidarXsd?.(evento.id)}
              />
              {podeEnviar && (
                <ActionBtn
                  icon={<Send className="w-3.5 h-3.5" strokeWidth={2} />}
                  label="Enviar para fila"
                  primary
                  onClick={() => onEnviarParaFila?.(evento.id)}
                />
              )}
              {podeRetificar && (
                <ActionBtn
                  icon={<GitBranch className="w-3.5 h-3.5" strokeWidth={2} />}
                  label="Retificar"
                  onClick={() => onRetificar?.(evento.id)}
                />
              )}
              <div ref={overflowRef} className="relative">
                <ActionBtn
                  icon={<MoreHorizontal className="w-3.5 h-3.5" strokeWidth={2} />}
                  label=""
                  onClick={() => setOverflowOpen((v) => !v)}
                  iconOnly
                />
                {overflowOpen && (
                  <div className="absolute right-0 top-full mt-1.5 z-20 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_12px_30px_-8px_rgba(15,23,42,0.18)] dark:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)] overflow-hidden py-1 drawer-fade">
                    <MenuItem
                      icon={<Download className="w-3.5 h-3.5" strokeWidth={1.75} />}
                      label="Baixar XML"
                      onClick={() => {
                        setOverflowOpen(false)
                        onBaixarXml?.(evento.id)
                      }}
                    />
                    {podeExcluir && (
                      <>
                        <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />
                        <MenuItem
                          icon={<Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
                          label="Excluir (S-3000)"
                          danger
                          onClick={() => {
                            setOverflowOpen(false)
                            setExcluirModalOpen(true)
                          }}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Strip de alerta inline pra rejeitado */}
          {evento.status === 'rejeitado' && (
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-rose-50/50 dark:bg-rose-950/20">
              <p className="text-[12px] text-rose-800 dark:text-rose-200 inline-flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
                Esse evento foi rejeitado pelo governo. Edite os dados e reenvie ou descarte.
              </p>
            </div>
          )}
        </header>

        {/* Two-col layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5 min-w-0">
            <StatusGovernoPanel
              evento={evento}
              onAbrirEvento={onAbrirEvento}
              onRetentarTransmissao={() => onRetentarTransmissao?.(evento.id)}
            />
            <ValidacaoXsdPanel
              validacao={evento.validacaoXsd}
              onRevalidar={() => onValidarXsd?.(evento.id)}
            />
            <DadosEventoPanel evento={evento} onEditar={() => onEditar?.(evento.id)} />
          </div>

          <aside className="lg:col-span-4 space-y-5 min-w-0">
            <AnexosPanel
              anexos={evento.anexos}
              onUpload={() => onUploadAnexo?.(evento.id)}
              onRemover={(anexoId) => onRemoverAnexo?.(evento.id, anexoId)}
              onAbrir={(anexoId) => onAbrirAnexo?.(evento.id, anexoId)}
            />
            <AuditoriaPanel evento={evento} onAbrirOrigem={onAbrirOrigem} />
          </aside>
        </div>
      </div>

      {excluirModalOpen && (
        <ExcluirModal
          eventoId={evento.id}
          tipo={evento.tipo}
          onClose={() => setExcluirModalOpen(false)}
          onConfirmar={(justificativa) => {
            onExcluir?.(evento.id, justificativa)
            setExcluirModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

function ActionBtn({
  icon,
  label,
  onClick,
  primary = false,
  iconOnly = false,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  primary?: boolean
  iconOnly?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-1.5
        ${iconOnly ? 'w-9 h-9' : 'px-3 py-2'} rounded-xl text-[12px] font-medium transition
        ${
          primary
            ? 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]'
            : 'bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
        }
      `}
      aria-label={iconOnly ? 'Mais ações' : label}
    >
      {icon}
      {!iconOnly && label}
    </button>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full px-3 py-1.5 flex items-center gap-2 text-left text-[12px] transition
        ${
          danger
            ? 'text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
        }
      `}
    >
      {icon}
      {label}
    </button>
  )
}

function ExcluirModal({
  eventoId,
  tipo,
  onClose,
  onConfirmar,
}: {
  eventoId: string
  tipo: string
  onClose: () => void
  onConfirmar: (justificativa: string) => void
}) {
  const [justificativa, setJustificativa] = useState('')
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const valido = justificativa.trim().length >= 20 && aceitouTermos

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm drawer-fade"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              <Trash2 className="w-4 h-4" strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                Excluir evento {tipo}
              </h3>
              <p className="mt-1 text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">
                A exclusão gera um evento <span className="font-mono">S-3000</span> no eSocial
                referenciando <span className="font-mono">{eventoId}</span>. Essa operação não pode
                ser desfeita.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-3">
          <label className="block">
            <span className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
              Justificativa{' '}
              <span className="text-slate-400 dark:text-slate-500">
                (mín. 20 caracteres · {justificativa.trim().length}/20)
              </span>
            </span>
            <textarea
              rows={3}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Ex: CAT criado por engano. O trabalhador identificado não estava em serviço no momento do incidente."
              className="
                w-full px-3 py-2 rounded-lg
                bg-white dark:bg-slate-950/40
                border border-slate-300 dark:border-slate-700
                placeholder:text-slate-400 dark:placeholder:text-slate-600
                text-[13px] text-slate-900 dark:text-slate-100
                focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-950/60
                transition resize-none
              "
            />
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
              className="mt-0.5 accent-rose-600 dark:accent-rose-400"
            />
            <span className="text-[12px] text-slate-700 dark:text-slate-300 leading-snug">
              Entendo que essa ação gera evento S-3000 no governo e{' '}
              <span className="font-medium">não pode ser desfeita</span>.
            </span>
          </label>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!valido}
            onClick={() => onConfirmar(justificativa.trim())}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition ${
              valido
                ? 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400 text-white shadow-[0_4px_14px_-4px_rgba(225,29,72,0.5)]'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3 h-3" strokeWidth={2.25} />
            Excluir e enviar S-3000
          </button>
        </div>
      </div>
    </div>
  )
}

function formatData(iso: string): string {
  try {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yy = d.getFullYear()
    return `${dd}/${mm}/${yy}`
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
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes drawer-fade-in {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .drawer-fade {
        animation: drawer-fade-in 0.18s ease-out forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal, .drawer-fade {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
