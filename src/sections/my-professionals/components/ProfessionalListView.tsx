import { Star, MoreHorizontal, CheckCircle2 } from 'lucide-react'
import type { UserReferral } from '@/../product/sections/my-professionals/types'
import { ProfessionalAvatar } from './ProfessionalAvatar'

export interface ProfessionalListViewProps {
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

export function ProfessionalListView({ referrals, onSelect }: ProfessionalListViewProps) {
  return (
    <div
      className="
        rounded-2xl overflow-hidden
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        backdrop-blur-[2px]
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
    >
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/40">
          <tr className="text-left">
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Profissional
            </th>
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell whitespace-nowrap">
              Código
            </th>
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 hidden lg:table-cell whitespace-nowrap">
              Status
            </th>
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell whitespace-nowrap">
              Vinculado em
            </th>
            <th className="px-2 py-2.5" aria-label="Ações" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {referrals.map((r) => (
            <tr
              key={r.id}
              className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              onClick={() => onSelect?.(r.id)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ProfessionalAvatar
                    type={r.professional.professionalType}
                    fullName={r.professional.fullName}
                    avatarUrl={r.professional.avatarUrl}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {r.professional.fullName}
                      </span>
                      {r.isPrimary && (
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {r.professional.typeLabel}
                      {r.professional.specialty && (
                        <> · {r.professional.specialty}</>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 font-mono tabular-nums hidden md:table-cell">
                {r.professional.referralCode || (
                  <span className="text-slate-400 dark:text-slate-600">—</span>
                )}
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
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
              </td>
              <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap font-mono tabular-nums hidden sm:table-cell">
                {formatLinkedAt(r.linkedAt)}
              </td>
              <td className="px-2 py-3 w-10 text-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect?.(r.id)
                  }}
                  aria-label="Ver perfil"
                  className="
                    grid place-items-center w-8 h-8 rounded-lg ml-auto
                    text-slate-400 dark:text-slate-500
                    hover:bg-slate-100 dark:hover:bg-slate-800
                    hover:text-slate-700 dark:hover:text-slate-200
                    transition-colors
                  "
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
