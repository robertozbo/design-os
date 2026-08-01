import { inicialsName } from './helpers'

interface Props {
  nome: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const SIZES = {
  sm: 'size-7 text-[10px]',
  md: 'size-9 text-xs',
  lg: 'size-12 text-sm',
  xl: 'size-16 text-lg',
} as const

export function Avatar({ nome, size = 'md' }: Props) {
  return (
    <div
      className={`
        inline-flex shrink-0 items-center justify-center rounded-full
        bg-gradient-to-br from-teal-500 to-emerald-600 font-medium text-white
        shadow-sm ring-2 ring-white dark:ring-slate-900
        ${SIZES[size]}
      `}
      aria-hidden="true"
    >
      {inicialsName(nome)}
    </div>
  )
}
