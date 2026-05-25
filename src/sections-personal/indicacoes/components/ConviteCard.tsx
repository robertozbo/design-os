import {
  ArchiveRestore,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  RotateCw,
  Trash2,
  X,
} from 'lucide-react'
import type { Convite } from '@/../product-personal/sections/indicacoes/types'
import {
  CANAL_STYLE,
  formatExpiraEm,
  formatHaDias,
  progressoPendente,
} from './helpers'

interface ConviteCardProps {
  convite: Convite
  onReenviar?: () => void
  onCopiarLink?: () => void
  onMostrarQR?: () => void
  onCancelar?: () => void
  onExcluir?: () => void
  onRestaurar?: () => void
  onOpenFichaAluno?: () => void
}

export function ConviteCard(props: ConviteCardProps) {
  const { convite } = props
  if (convite.status === 'pendente') return <PendenteCard {...props} />
  if (convite.status === 'aceito') return <AceitoCard {...props} />
  if (convite.status === 'expirado') return <ExpiradoCard {...props} />
  return <CanceladoCard {...props} />
}

function PendenteCard({
  convite,
  onReenviar,
  onCopiarLink,
  onMostrarQR,
  onCancelar,
}: ConviteCardProps) {
  const canalStyle = CANAL_STYLE[convite.canal]
  const CanalIcon = canalStyle.icon
  const expira = formatExpiraEm(convite.expiraEm)
  const progresso = progressoPendente(convite.enviadoEm, convite.expiraEm)

  const expiraTone =
    expira.tone === 'rose'
      ? 'text-rose-600 dark:text-rose-400'
      : expira.tone === 'amber'
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-slate-500 dark:text-slate-400'

  const barTone =
    expira.tone === 'rose'
      ? 'bg-rose-500'
      : expira.tone === 'amber'
        ? 'bg-amber-500'
        : 'bg-teal-500'

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700">
      <div className="p-5">
        {/* Header */}
        <header className="flex items-start gap-3">
          {convite.alunoAvatarUrl ? (
            <img
              src={convite.alunoAvatarUrl}
              alt={convite.nome}
              className="h-10 w-10 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              {convite.nome.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
              {convite.nome}
            </p>
            <p className="truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {convite.contato}
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${canalStyle.badge}`}
          >
            <CanalIcon size={10} />
            {canalStyle.shortLabel}
          </span>
        </header>

        {/* Mensagem */}
        {convite.mensagem && (
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[12px] italic leading-snug text-slate-600 dark:bg-slate-900/60 dark:text-slate-400 ring-1 ring-inset ring-slate-100 dark:ring-slate-800">
            “{convite.mensagem}”
          </p>
        )}

        {/* Timeline status */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Clock size={10} className="mb-0.5 mr-0.5 inline-block" />
              Enviado {formatHaDias(convite.enviadoEm)}
            </span>
            <span className={`font-mono uppercase tracking-wider ${expiraTone}`}>
              {expira.texto}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full ${barTone}`}
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
        <button
          type="button"
          onClick={onReenviar}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RotateCw size={12} />
          Reenviar
        </button>
        {convite.canal === 'link' && (
          <button
            type="button"
            onClick={onCopiarLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Copy size={12} />
            Copiar link
          </button>
        )}
        {convite.canal === 'qr' && (
          <button
            type="button"
            onClick={onMostrarQR}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Mostrar QR
          </button>
        )}
        <span className="flex-1" />
        <button
          type="button"
          onClick={onCancelar}
          aria-label="Cancelar convite"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-slate-400 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
        >
          <X size={12} />
          Cancelar
        </button>
      </div>
    </article>
  )
}

function AceitoCard({ convite, onOpenFichaAluno }: ConviteCardProps) {
  const canalStyle = CANAL_STYLE[convite.canal]
  const CanalIcon = canalStyle.icon

  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/30 transition-all hover:border-emerald-300 hover:shadow-sm dark:border-emerald-900/50 dark:bg-emerald-900/10 dark:hover:border-emerald-700/60">
      <div className="p-5">
        <header className="flex items-start gap-3">
          {convite.alunoAvatarUrl ? (
            <div className="relative shrink-0">
              <img
                src={convite.alunoAvatarUrl}
                alt={convite.nome}
                className="h-10 w-10 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-slate-900">
                <Check size={9} strokeWidth={4} />
              </span>
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {convite.nome.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
              {convite.nome}
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={10} />
              Vinculado ao app
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${canalStyle.badge}`}
          >
            <CanalIcon size={10} />
            {canalStyle.shortLabel}
          </span>
        </header>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-[11px]">
          <div>
            <p className="font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Aceitou em
            </p>
            <p className="mt-0.5 font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
              {convite.diasAteAceitar === 0
                ? 'no mesmo dia'
                : convite.diasAteAceitar === 1
                  ? '1 dia'
                  : `${convite.diasAteAceitar} dias`}
            </p>
          </div>
          {convite.aceitoEm && (
            <div>
              <p className="font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Vinculado em
              </p>
              <p className="mt-0.5 font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                {new Date(convite.aceitoEm).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>

      {convite.alunoId && (
        <button
          type="button"
          onClick={onOpenFichaAluno}
          className="flex w-full items-center justify-between border-t border-emerald-200/60 px-4 py-2.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100/30 dark:border-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
        >
          Ver ficha do aluno
          <ArrowRight size={12} />
        </button>
      )}
    </article>
  )
}

function ExpiradoCard({ convite, onReenviar, onExcluir }: ConviteCardProps) {
  const canalStyle = CANAL_STYLE[convite.canal]
  const CanalIcon = canalStyle.icon

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 opacity-75 transition-opacity hover:opacity-100 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-center gap-3">
        {convite.alunoAvatarUrl ? (
          <img
            src={convite.alunoAvatarUrl}
            alt={convite.nome}
            className="h-9 w-9 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {convite.nome.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            {convite.nome}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <CanalIcon size={9} className="mb-0.5 mr-0.5 inline-block" />
            {canalStyle.shortLabel} · expirou em{' '}
            {new Date(convite.expiraEm).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onReenviar}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-teal-700 transition-colors hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/20"
          >
            <RotateCw size={11} />
            Reenviar
          </button>
          <button
            type="button"
            onClick={onExcluir}
            aria-label="Excluir"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </article>
  )
}

function CanceladoCard({ convite, onRestaurar, onExcluir }: ConviteCardProps) {
  const canalStyle = CANAL_STYLE[convite.canal]
  const CanalIcon = canalStyle.icon

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 opacity-65 transition-opacity hover:opacity-100 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-start gap-3">
        {convite.alunoAvatarUrl ? (
          <img
            src={convite.alunoAvatarUrl}
            alt={convite.nome}
            className="h-9 w-9 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {convite.nome.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            {convite.nome}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <CanalIcon size={9} className="mb-0.5 mr-0.5 inline-block" />
            {canalStyle.shortLabel} · cancelado{' '}
            {convite.canceladoEm &&
              `em ${new Date(convite.canceladoEm).toLocaleDateString('pt-BR')}`}
          </p>
          {convite.motivoCancelamento && (
            <p className="mt-1 text-[11px] italic leading-snug text-slate-500 dark:text-slate-400">
              {convite.motivoCancelamento}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onRestaurar}
            aria-label="Restaurar"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-teal-700 transition-colors hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/20"
          >
            <ArchiveRestore size={11} />
            Restaurar
          </button>
          <button
            type="button"
            onClick={onExcluir}
            aria-label="Excluir"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </article>
  )
}
