import { Mail, Check, X } from 'lucide-react'
import type { PendingInvite } from '@/../product/sections/my-professionals/types'
import { ProfessionalAvatar } from './ProfessionalAvatar'

export interface PendingInvitesBannerProps {
  invites: PendingInvite[]
  revealIndex?: number
  onAccept?: (invite: PendingInvite) => void
  onDismiss?: (inviteId: string) => void
}

function formatInvitedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  } catch {
    return iso
  }
}

export function PendingInvitesBanner({
  invites,
  revealIndex = 1,
  onAccept,
  onDismiss,
}: PendingInvitesBannerProps) {
  if (invites.length === 0) return null

  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        rounded-2xl overflow-hidden
        bg-gradient-to-br from-teal-50 via-white to-emerald-50
        dark:from-teal-500/10 dark:via-slate-900/80 dark:to-emerald-500/10
        border border-teal-500/20 dark:border-teal-400/20
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
    >
      <header className="flex items-center gap-3 px-5 py-4 border-b border-teal-500/10 dark:border-teal-400/10">
        <div className="grid place-items-center w-9 h-9 rounded-xl bg-teal-500/15 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300">
          <Mail className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Convites pendentes
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {invites.length} profissional{invites.length > 1 ? 'is' : ''}{' '}
            convidou{invites.length > 1 ? 'aram' : ''} você. Aceite pra liberar acesso aos dados.
          </p>
        </div>
      </header>

      <ul className="divide-y divide-teal-500/10 dark:divide-teal-400/10">
        {invites.map((invite) => (
          <li key={invite.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start">
            <ProfessionalAvatar
              type={invite.professional.professionalType}
              fullName={invite.professional.fullName}
              avatarUrl={invite.professional.avatarUrl}
              size="md"
            />

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {invite.professional.fullName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400">
                  {invite.professional.typeLabel}
                  {invite.professional.specialty && (
                    <> · {invite.professional.specialty}</>
                  )}
                </span>
              </div>
              {invite.message && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  “{invite.message}”
                </p>
              )}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <span>Convidado em {formatInvitedAt(invite.invitedAt)}</span>
                {invite.validatedByEmail && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3 h-3" />
                    Email validado
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 sm:flex-col sm:items-stretch sm:min-w-[140px]">
              <button
                type="button"
                onClick={() => onAccept?.(invite)}
                className="
                  inline-flex items-center justify-center gap-1.5
                  px-3 py-2 rounded-full
                  bg-teal-600 hover:bg-teal-700 text-white
                  dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
                  text-xs font-medium
                  transition-colors
                "
              >
                <Check className="w-3.5 h-3.5" />
                Aceitar
              </button>
              <button
                type="button"
                onClick={() => onDismiss?.(invite.id)}
                className="
                  inline-flex items-center justify-center gap-1.5
                  px-3 py-2 rounded-full
                  border border-slate-200 dark:border-slate-700
                  text-slate-700 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  text-xs font-medium
                  transition-colors
                "
              >
                <X className="w-3.5 h-3.5" />
                Recusar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
