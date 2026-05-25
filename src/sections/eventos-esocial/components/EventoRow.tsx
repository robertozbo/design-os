import { useEffect, useRef, useState } from 'react'
import type { EventoEsocial } from '@/../product/sections/eventos-esocial/types'
import {
  MoreVertical,
  Pencil,
  ShieldCheck,
  Send,
  GitBranch,
  Trash2,
  Download,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  Building2,
} from 'lucide-react'
import { TipoEventoBadge } from './TipoEventoBadge'
import { StatusBadge } from './StatusBadge'
import { AmbienteBadge } from './AmbienteBadge'
import { MotivoGatilhoChip } from './MotivoGatilhoChip'

interface Props {
  evento: EventoEsocial
  revealIndex: number
  selecionado?: boolean
  selecionavel?: boolean
  mostrarEmpregador?: boolean
  onSelecionar?: (selecionado: boolean) => void
  onQuickView?: () => void
  onIgnorar?: () => void
  onDesignorar?: () => void
  onAbrir?: () => void
  onAbrirEmpregador?: () => void
  onValidarXsd?: () => void
  onEnviarParaFila?: () => void
  onRetificar?: () => void
  onExcluir?: () => void
  onBaixarXml?: () => void
}

export function EventoRow({
  evento,
  revealIndex,
  selecionado = false,
  selecionavel = false,
  mostrarEmpregador = false,
  onSelecionar,
  onQuickView,
  onIgnorar,
  onDesignorar,
  onAbrir,
  onAbrirEmpregador,
  onValidarXsd,
  onEnviarParaFila,
  onRetificar,
  onExcluir,
  onBaixarXml,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const isSugestao = evento.origem.startsWith('sugerido')
  const isRetificacao = evento.origem === 'retificacao'
  const isIgnorado = evento.status === 'ignorado'
  const isAuto = evento.criadoPor.toLowerCase().includes('sistema') || isSugestao

  const podeEditar = evento.status === 'rascunho' || evento.status === 'rejeitado'
  const podeRetificar = evento.status === 'aceito' && !evento.retificadoPor
  const podeEnviar =
    evento.status === 'rascunho' || evento.status === 'validado' || evento.status === 'rejeitado'
  const podeSelecionar =
    selecionavel &&
    (evento.status === 'disponivel' ||
      evento.status === 'rascunho' ||
      evento.status === 'validado' ||
      evento.status === 'rejeitado')

  return (
    <article
      style={{ animationDelay: `${revealIndex * 40}ms` }}
      className={`
        nymos-reveal opacity-0 group relative
        rounded-2xl border bg-white/80 dark:bg-slate-900/40
        transition-all duration-200
        hover:border-slate-300 dark:hover:border-slate-700
        hover:shadow-[0_6px_24px_-12px_rgba(15,23,42,0.18)]
        dark:hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.55)]
        ${selecionado ? 'ring-2 ring-teal-400 dark:ring-teal-600 border-teal-300 dark:border-teal-700' : ''}
        ${isIgnorado ? 'opacity-60' : ''}
        ${
          evento.status === 'rejeitado'
            ? 'border-rose-200/70 dark:border-rose-900/50'
            : evento.status === 'aceito'
              ? 'border-slate-200 dark:border-slate-800'
              : 'border-slate-200 dark:border-slate-800'
        }
      `}
    >
      {evento.status === 'excluido' && (
        <div className="absolute inset-0 rounded-2xl bg-stone-50/50 dark:bg-stone-900/30 pointer-events-none" />
      )}

      <div className="relative w-full px-4 py-3 grid grid-cols-12 gap-3 items-center">
        {/* Checkbox de seleção */}
        {selecionavel && (
          <div className="col-span-1 sm:col-auto flex items-center">
            <label
              className={`
                relative inline-flex items-center justify-center w-5 h-5 rounded-md cursor-pointer transition
                ${
                  podeSelecionar
                    ? selecionado
                      ? 'bg-teal-600 dark:bg-teal-500 border-teal-600 dark:border-teal-500'
                      : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-600'
                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-40'
                }
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={selecionado}
                disabled={!podeSelecionar}
                onChange={(e) => onSelecionar?.(e.target.checked)}
                className="sr-only"
                aria-label="Selecionar evento para lote"
              />
              {selecionado && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </label>
          </div>
        )}

        {/* Tipo + flags origem */}
        <button
          type="button"
          onClick={onAbrir}
          className={`${selecionavel ? 'col-span-10 sm:col-span-2' : 'col-span-12 sm:col-span-2'} flex items-center gap-2 text-left min-w-0`}
        >
          <TipoEventoBadge tipo={evento.tipo} />
          {isAuto && (
            <span
              title={evento.origemLabel}
              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-300"
            >
              <Sparkles className="w-2.5 h-2.5" strokeWidth={2.25} />
              <span className="hidden xl:inline">Auto</span>
            </span>
          )}
          {isRetificacao && (
            <span
              title="Retificação"
              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-300"
            >
              <GitBranch className="w-2.5 h-2.5" strokeWidth={2.25} />
              <span className="hidden xl:inline">Retif.</span>
            </span>
          )}
        </button>

        {/* Trabalhador */}
        <button
          type="button"
          onClick={onAbrir}
          className="col-span-7 sm:col-span-3 min-w-0 text-left"
        >
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {evento.trabalhador.nome}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
            {evento.trabalhador.cpf}
          </p>
        </button>

        {/* Empregador (modo carteira global) */}
        {mostrarEmpregador && evento.empregadorFantasia && (
          <div className="hidden md:flex md:col-span-2 min-w-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onAbrirEmpregador?.()
              }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/30 ring-1 ring-teal-200 dark:ring-teal-900 hover:bg-teal-100 dark:hover:bg-teal-950/50 transition truncate max-w-full"
              title={`Abrir hub do ${evento.empregadorFantasia}`}
            >
              <Building2 className="w-2.5 h-2.5 shrink-0" strokeWidth={2.25} />
              <span className="truncate">{evento.empregadorFantasia}</span>
            </button>
          </div>
        )}

        {/* Motivo gatilho — visível desde tablet (escondido quando mostra empregador pra economizar espaço) */}
        {!mostrarEmpregador && (
          <div className="hidden lg:flex lg:col-span-2 min-w-0">
            <MotivoGatilhoChip motivo={evento.motivoGatilho} label={evento.motivoGatilhoLabel} />
          </div>
        )}

        {/* Data fato gerador + prazo */}
        <button
          type="button"
          onClick={onAbrir}
          className="hidden md:block md:col-span-1 text-left"
          title="Data do fato gerador (admissão, exame, acidente, etc) — não é a data de envio. O eSocial usa essa data pra calcular o prazo legal."
        >
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Fato
          </p>
          <p
            className={`text-[12px] tabular-nums ${
              evento.atrasado
                ? 'text-rose-700 dark:text-rose-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {formatData(evento.dataFatoGerador)}
            {evento.atrasado && (
              <span
                className="ml-1 text-[9px] uppercase tracking-wider"
                title="Prazo legal excedido — envie mesmo atrasado. Atraso pode gerar autuação; omissão é autuação certa em auditoria."
              >
                ⚠
              </span>
            )}
          </p>
        </button>

        {/* Status + recibo */}
        <div className="col-span-5 sm:col-span-3 lg:col-span-2 min-w-0">
          <StatusBadge status={evento.status} label={evento.statusLabel} />
          {evento.recibo ? (
            <p
              className="mt-1 text-[10px] font-mono text-slate-500 dark:text-slate-500 truncate"
              title={evento.recibo}
            >
              {evento.recibo}
            </p>
          ) : evento.status === 'rejeitado' && evento.transmissoes.length > 0 ? (
            <p
              className="mt-1 inline-flex items-center gap-1 text-[10px] text-rose-700 dark:text-rose-300 font-medium"
              title={evento.transmissoes[evento.transmissoes.length - 1]?.descricaoErro ?? ''}
            >
              <AlertCircle className="w-2.5 h-2.5" strokeWidth={2.25} />
              {evento.transmissoes[evento.transmissoes.length - 1]?.codigoErro ?? 'erro'}
            </p>
          ) : (
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-600">—</p>
          )}
        </div>

        {/* Ambiente + ações inline */}
        <div className="col-span-12 sm:col-span-1 lg:col-span-1 flex sm:justify-end items-center gap-1.5">
          <AmbienteBadge ambiente={evento.ambiente} />
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onQuickView()
              }}
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition"
              title="Visualização rápida"
              aria-label="Visualização rápida"
            >
              <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          )}
          {isIgnorado
            ? onDesignorar && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDesignorar()
                  }}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-stone-500 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition"
                  title="Designorar"
                  aria-label="Designorar"
                >
                  <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              )
            : onIgnorar && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onIgnorar()
                  }}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition opacity-0 group-hover:opacity-100"
                  title="Ignorar evento"
                  aria-label="Ignorar"
                >
                  <EyeOff className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              )}
        </div>
      </div>

      {/* Menu de ações flutuante */}
      <div ref={menuRef} className="absolute top-3 right-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((v) => !v)
          }}
          className="
            inline-flex items-center justify-center w-7 h-7 rounded-lg
            text-slate-400 hover:text-slate-700 dark:hover:text-slate-200
            hover:bg-slate-100 dark:hover:bg-slate-800
            opacity-0 group-hover:opacity-100 focus:opacity-100
            transition
          "
          aria-label="Ações do evento"
        >
          <MoreVertical className="w-4 h-4" strokeWidth={2} />
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="
              absolute right-0 top-full mt-1 z-20 w-52
              rounded-xl bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-800
              shadow-[0_12px_30px_-8px_rgba(15,23,42,0.18)]
              dark:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)]
              overflow-hidden py-1
              drawer-fade
            "
          >
            {podeEditar && (
              <MenuItem
                icon={<Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />}
                label="Editar"
                onClick={() => {
                  setMenuOpen(false)
                  onAbrir?.()
                }}
              />
            )}
            <MenuItem
              icon={<ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Validar XSD"
              onClick={() => {
                setMenuOpen(false)
                onValidarXsd?.()
              }}
            />
            {podeEnviar && (
              <MenuItem
                icon={<Send className="w-3.5 h-3.5" strokeWidth={1.75} />}
                label="Enviar para fila"
                onClick={() => {
                  setMenuOpen(false)
                  onEnviarParaFila?.()
                }}
                emphasis
              />
            )}
            {podeRetificar && (
              <MenuItem
                icon={<GitBranch className="w-3.5 h-3.5" strokeWidth={1.75} />}
                label="Retificar"
                onClick={() => {
                  setMenuOpen(false)
                  onRetificar?.()
                }}
              />
            )}
            <MenuItem
              icon={<Download className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Baixar XML"
              onClick={() => {
                setMenuOpen(false)
                onBaixarXml?.()
              }}
            />
            {evento.status !== 'excluido' && (
              <>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />
                <MenuItem
                  icon={<Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
                  label="Excluir (S-3000)"
                  onClick={() => {
                    setMenuOpen(false)
                    onExcluir?.()
                  }}
                  danger
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Strip de info adicional para rejeitados */}
      {evento.status === 'rejeitado' &&
        evento.transmissoes.length > 0 &&
        evento.transmissoes[evento.transmissoes.length - 1]?.descricaoErro && (
          <div className="px-4 pb-3 pt-0">
            <div className="rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 px-3 py-2">
              <p className="text-[11px] text-rose-800 dark:text-rose-200 leading-snug">
                <span className="font-mono font-semibold mr-1">
                  [{evento.transmissoes[evento.transmissoes.length - 1]?.codigoErro}]
                </span>
                {evento.transmissoes[evento.transmissoes.length - 1]?.descricaoErro}
              </p>
              {evento.transmissoes[evento.transmissoes.length - 1]?.sugestaoCorrecao && (
                <p className="mt-0.5 text-[11px] text-rose-700/80 dark:text-rose-300/70 leading-snug">
                  → {evento.transmissoes[evento.transmissoes.length - 1]?.sugestaoCorrecao}
                </p>
              )}
            </div>
          </div>
        )}

      {evento.retificadoPor && (
        <div className="px-4 pb-3">
          <p className="text-[11px] text-violet-700 dark:text-violet-300 inline-flex items-center gap-1">
            <GitBranch className="w-3 h-3" strokeWidth={2} />
            Retificado por <span className="font-mono font-medium">{evento.retificadoPor}</span>
          </p>
        </div>
      )}
    </article>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  emphasis = false,
  danger = false,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  emphasis?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`
        w-full px-3 py-1.5 flex items-center gap-2 text-left text-[12px] transition
        ${
          danger
            ? 'text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            : emphasis
              ? 'text-teal-700 dark:text-teal-300 font-medium hover:bg-teal-50 dark:hover:bg-teal-950/30'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
        }
      `}
    >
      {icon}
      {label}
    </button>
  )
}

function formatData(iso: string): string {
  try {
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
  } catch {
    return '—'
  }
}

function formatHora(iso: string): string {
  try {
    const d = new Date(iso)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  } catch {
    return '—'
  }
}
