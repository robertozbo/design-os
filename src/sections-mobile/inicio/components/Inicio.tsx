import type { InicioProps } from '@/../product-mobile/sections/inicio/types'
import { Hero } from './Hero'
import { HeroSaudeCard } from './HeroSaudeCard'
import { MedicacaoHojeMini } from './MedicacaoHojeMini'
import { NovidadeBanner } from './NovidadeBanner'
import { PlanoHoje } from './PlanoHoje'
import { AnelCalorias } from './AnelCalorias'
import { MiniStatStrip } from './MiniStatStrip'
import { SemanaAtivaCard } from './SemanaAtivaCard'
import { QuickActions } from './QuickActions'

export function Inicio({
  data,
  onNovidadeClick,
  onNovidadeDismiss,
  onSaudeClick,
  onPlanoClick,
  onAnelClick,
  onMiniStatClick,
  onSemanaClick,
  onQuickActionClick,
  onStreakClick,
  onMedicacaoClick,
  onMarcarDose,
}: InicioProps) {
  const novidadesAtivas = data.novidades.filter((n) => !n.dispensada)

  return (
    <div className="min-h-full bg-slate-950 pb-6">
      <Hero usuario={data.usuario} onStreakClick={onStreakClick} />

      {data.heroSaude && <HeroSaudeCard hero={data.heroSaude} onClick={onSaudeClick} />}

      {novidadesAtivas.map((n) => (
        <NovidadeBanner
          key={n.id}
          novidade={n}
          onClick={onNovidadeClick}
          onDismiss={onNovidadeDismiss}
        />
      ))}

      {data.medicacaoHoje && (
        <MedicacaoHojeMini
          medicacao={data.medicacaoHoje}
          onClick={onMedicacaoClick}
          onMarcarDose={onMarcarDose}
        />
      )}

      {data.plano.ativo && <PlanoHoje plano={data.plano} onClick={onPlanoClick} />}

      <AnelCalorias data={data.anelCalorias} onClick={onAnelClick} />

      <MiniStatStrip stats={data.miniStats} onStatClick={onMiniStatClick} />

      <SemanaAtivaCard data={data.semanaAtiva} onClick={onSemanaClick} />

      <QuickActions actions={data.quickActions} onActionClick={onQuickActionClick} />
    </div>
  )
}
