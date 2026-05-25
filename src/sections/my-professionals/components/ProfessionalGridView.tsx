import { Star, Mail, Phone, CheckCircle2, Link2 } from 'lucide-react'
import type { UserReferral } from '@/../product/sections/my-professionals/types'
import { ProfessionalAvatar } from './ProfessionalAvatar'

export interface ProfessionalGridViewProps {
  referrals: UserReferral[]
  onSelect?: (referralId: string) => void
}

function formatLinkedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function ProfessionalGridView({ referrals, onSelect }: ProfessionalGridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {referrals.map((r) => (
        <article
          key={r.id}
          className="
            relative flex flex-col
            rounded-2xl
            bg-white/90 dark:bg-slate-900/80
            border border-slate-200/80 dark:border-slate-800
            backdrop-blur-[2px]
            shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
            dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
            transition-[transform,box-shadow] duration-300 ease-out
            hover:-translate-y-0.5
            cursor-pointer
          "
          onClick={() => onSelect?.(r.id)}
        >
          <header className="px-5 pt-5 pb-3 flex items-start gap-3">
            <ProfessionalAvatar
              type={r.professional.professionalType}
              fullName={r.professional.fullName}
              avatarUrl={r.professional.avatarUrl}
              size="lg"
              showRing={r.isPrimary}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-1.5">
                <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                  {r.professional.fullName}
                </h3>
                {r.isPrimary && (
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0 mt-0.5" />
                )}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400">
                {r.professional.typeLabel}
              </div>
              {r.professional.specialty && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                  {r.professional.specialty}
                </p>
              )}
            </div>
          </header>

          <div className="px-5 pb-3 flex-1 flex flex-col gap-2">
            {r.professional.email && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate font-mono tabular-nums">{r.professional.email}</span>
              </div>
            )}
            {r.professional.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                <Phone className="w-3 h-3 shrink-0" />
                <span className="truncate font-mono tabular-nums">{r.professional.phone}</span>
              </div>
            )}
            {r.professional.referralCode && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                <Link2 className="w-3 h-3 shrink-0" />
                <span className="truncate font-mono tabular-nums">{r.professional.referralCode}</span>
              </div>
            )}
          </div>

          <footer className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <span
              className="
                inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                text-[10px] font-medium
                bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300
              "
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              Vínculo ativo
            </span>
            <span className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {formatLinkedAt(r.linkedAt)}
            </span>
          </footer>
        </article>
      ))}
    </div>
  )
}
