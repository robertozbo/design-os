import type { IdiomaPreferido } from '@/../product/sections/trabalhadores/types'

interface IdiomaBadgeProps {
  idioma: IdiomaPreferido
  size?: 'sm' | 'md'
}

const TONES: Record<IdiomaPreferido, { code: string; label: string; pill: string }> = {
  pt: {
    code: 'PT',
    label: 'Português · Brasil',
    pill:
      'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/60',
  },
  en: {
    code: 'EN',
    label: 'English',
    pill:
      'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/60',
  },
  es: {
    code: 'ES',
    label: 'Español',
    pill:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/60',
  },
}

export function IdiomaBadge({ idioma, size = 'sm' }: IdiomaBadgeProps) {
  const t = TONES[idioma]
  return (
    <span
      title={t.label}
      className={`
        inline-flex items-center justify-center
        ${size === 'sm' ? 'w-7 h-5 text-[10px]' : 'w-8 h-6 text-[11px]'}
        rounded-md ring-1 font-mono font-semibold tracking-wider
        ${t.pill}
      `}
    >
      {t.code}
    </span>
  )
}
