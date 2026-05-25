import type { MotivoGatilho } from '@/../product/sections/eventos-esocial/types'
import {
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  Layers,
  Stethoscope,
  TestTube2,
  Siren,
  GraduationCap,
  PenLine,
  GitBranch,
} from 'lucide-react'

interface Props {
  motivo: MotivoGatilho
  label: string
  compact?: boolean
}

const ICON: Record<MotivoGatilho, typeof UserPlus> = {
  cadastro_trabalhador: UserPlus,
  admissao: UserPlus,
  vinculo_risco: ShieldAlert,
  atualizacao_riscos: ShieldAlert,
  alteracao_responsavel: UserCog,
  inicio_ghe: Layers,
  novo_aso: Stethoscope,
  novo_toxicologico: TestTube2,
  cat_lancada: Siren,
  treinamento_concluido: GraduationCap,
  manual: PenLine,
  retificacao: GitBranch,
}

export function MotivoGatilhoChip({ motivo, label, compact = false }: Props) {
  const Icon = ICON[motivo]
  return (
    <span
      className={`
        inline-flex items-center gap-1
        ${compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]'}
        rounded text-slate-600 dark:text-slate-400
        bg-slate-100/70 dark:bg-slate-800/60
      `}
      title={`Motivo: ${label}`}
    >
      <Icon className="w-2.5 h-2.5 opacity-70" strokeWidth={2} />
      <span className="truncate max-w-[140px]">{label}</span>
    </span>
  )
}
