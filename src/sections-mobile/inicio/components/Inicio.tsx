import type { InicioProps } from '@/../product-mobile/sections/inicio/types'
import { Hero } from './Hero'
import { HeroSaudeCard } from './HeroSaudeCard'
import { MedicacaoHojeMini } from './MedicacaoHojeMini'
import { NovidadeBanner } from './NovidadeBanner'
import { NutricaoCard } from './NutricaoCard'
import { MiniStatStrip } from './MiniStatStrip'
import { SemanaAtivaCard } from './SemanaAtivaCard'
import { QuickActions } from './QuickActions'
import { Glp1Mini } from './Glp1Mini'

export function Inicio({
  data,
  onNovidadeClick,
  onNovidadeDismiss,
  onSaudeClick,
  onNutricaoClick,
  onRegistrarRefeicao,
  onVerPlanoAlimentar,
  onMiniStatClick,
  onSemanaClick,
  onQuickActionClick,
  onStreakClick,
  onMedicacaoClick,
  onMarcarDose,
  onGlp1Click,
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

      <NutricaoCard
        nutricao={data.nutricao}
        plano={data.plano}
        onClick={onNutricaoClick}
        onRegistrar={onRegistrarRefeicao}
        onVerPlanoAlimentar={onVerPlanoAlimentar}
      />

      <MiniStatStrip stats={data.miniStats} onStatClick={onMiniStatClick} />

      <SemanaAtivaCard data={data.semanaAtiva} onClick={onSemanaClick} />

      <QuickActions actions={data.quickActions} onActionClick={onQuickActionClick} />

      {data.glp1 && (
        <Glp1Mini glp1={data.glp1} onClick={onGlp1Click} />
      )}
    </div>
  )
}
