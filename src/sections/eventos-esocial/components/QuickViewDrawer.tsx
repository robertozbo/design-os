import { useEffect } from 'react'
import type { EventoEsocial } from '@/../product/sections/eventos-esocial/types'
import {
  X,
  ExternalLink,
  EyeOff,
  Eye,
  User2,
  Stethoscope,
  Paperclip,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { TipoEventoBadge } from './TipoEventoBadge'
import { StatusBadge } from './StatusBadge'
import { AmbienteBadge } from './AmbienteBadge'
import { MotivoGatilhoChip } from './MotivoGatilhoChip'

interface Props {
  evento: EventoEsocial | null
  open: boolean
  onClose: () => void
  onAbrirDetalhe?: () => void
  onIgnorar?: () => void
  onDesignorar?: () => void
}

export function QuickViewDrawer({
  evento,
  open,
  onClose,
  onAbrirDetalhe,
  onIgnorar,
  onDesignorar,
}: Props) {
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open || !evento) return null

  const isIgnorado = evento.status === 'ignorado'
  const grupos = evento.dadosEspecificos ?? []
  const labelId = `${evento.tipo}-${String(evento.numeroSequencial).padStart(4, '0')}`

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/30 dark:bg-slate-950/60 backdrop-blur-sm drawer-fade"
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Quick view do evento"
        className="
          fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px]
          bg-white dark:bg-slate-950
          border-l border-slate-200 dark:border-slate-800
          shadow-[-12px_0_30px_-12px_rgba(15,23,42,0.18)]
          dark:shadow-[-12px_0_30px_-12px_rgba(0,0,0,0.6)]
          flex flex-col
          drawer-slide
        "
      >
        {/* Header */}
        <header className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <TipoEventoBadge tipo={evento.tipo} />
              <StatusBadge status={evento.status} label={evento.statusLabel} />
              <AmbienteBadge ambiente={evento.ambiente} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{labelId}</p>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 leading-tight mt-1">
            {evento.tipoLabel}
          </h2>
          <div className="mt-2">
            <MotivoGatilhoChip motivo={evento.motivoGatilho} label={evento.motivoGatilhoLabel} />
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Trabalhador */}
          <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 px-3 py-2.5 flex items-center gap-3">
            <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-950 dark:to-teal-900/40 text-teal-700 dark:text-teal-300">
              <User2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-slate-900 dark:text-slate-100 truncate">
                {evento.trabalhador.nome}
              </p>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {evento.trabalhador.cpf}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {evento.trabalhador.setor} · {evento.trabalhador.estabelecimento}
              </p>
            </div>
          </div>

          {/* Fato gerador + prazo */}
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <p className="uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                Fato gerador
              </p>
              <p className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                {formatDate(evento.dataFatoGerador)}
              </p>
            </div>
            <div>
              <p className="uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                Prazo legal
              </p>
              <p
                className={`font-mono tabular-nums ${
                  evento.atrasado
                    ? 'text-rose-700 dark:text-rose-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {evento.prazoLegal ? formatDate(evento.prazoLegal) : '—'}
                {evento.atrasado && (
                  <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-900">
                    <AlertCircle className="w-2.5 h-2.5" strokeWidth={2} />
                    Atrasado
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Dados específicos */}
          {grupos.length > 0 && (
            <div className="space-y-3">
              {grupos.map((grupo, gIdx) => (
                <div key={gIdx}>
                  <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    {grupo.titulo}
                  </p>
                  <dl className="space-y-1">
                    {grupo.campos.map((campo, cIdx) => (
                      <div key={cIdx} className="grid grid-cols-[110px_1fr] gap-2 text-[11px]">
                        <dt className="text-slate-500 dark:text-slate-400 truncate">
                          {campo.label}
                        </dt>
                        <dd
                          className={`${
                            campo.mono ? 'font-mono tabular-nums' : ''
                          } ${
                            campo.highlight === 'danger'
                              ? 'text-rose-700 dark:text-rose-300 font-medium'
                              : campo.highlight === 'warning'
                                ? 'text-amber-800 dark:text-amber-300 font-medium'
                                : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {campo.valor}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}

          {grupos.length === 0 && (
            <div className="rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-700 px-4 py-6 text-center">
              <Stethoscope
                className="w-5 h-5 mx-auto mb-1.5 text-slate-400"
                strokeWidth={1.5}
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Dados específicos do {evento.tipo} ainda não preenchidos.
              </p>
            </div>
          )}

          {/* Anexos resumo */}
          {evento.anexos.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 inline-flex items-center gap-1">
                <Paperclip className="w-3 h-3" strokeWidth={1.75} />
                Anexos · {evento.anexos.length}
              </p>
              <ul className="space-y-1">
                {evento.anexos.map((a) => (
                  <li
                    key={a.id}
                    className="text-[11px] text-slate-700 dark:text-slate-300 truncate"
                  >
                    {a.nome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Validação XSD */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center gap-2">
            <ShieldCheck
              className={`w-3.5 h-3.5 ${
                evento.validacaoXsd.valido
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
              strokeWidth={2}
            />
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              {evento.validacaoXsd.valido
                ? 'XSD válido'
                : `${evento.validacaoXsd.erros.length} erro${evento.validacaoXsd.erros.length > 1 ? 's' : ''} XSD`}
            </p>
          </div>

          {isIgnorado && evento.justificativaExclusao && (
            <div className="rounded-lg bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200/70 dark:border-stone-800 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                Por que foi ignorado
              </p>
              <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
                {evento.justificativaExclusao}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          {isIgnorado ? (
            <button
              type="button"
              onClick={onDesignorar}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition"
            >
              <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
              Designorar
            </button>
          ) : (
            <button
              type="button"
              onClick={onIgnorar}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <EyeOff className="w-3.5 h-3.5" strokeWidth={1.75} />
              Ignorar
            </button>
          )}
          <button
            type="button"
            onClick={onAbrirDetalhe}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white transition"
          >
            Abrir detalhe
            <ExternalLink className="w-3 h-3" strokeWidth={2} />
          </button>
        </footer>
      </aside>
    </>
  )
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
  } catch {
    return '—'
  }
}
