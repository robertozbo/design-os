import { useState } from 'react'
import data from '@/../product/sections/planos-alimentares/data.json'
import type {
  AlimentoLite,
  Nutri,
  ObjetivoOption,
  PatientLite,
  PlanoFull,
} from '@/../product/sections/planos-alimentares/types'
import { PlanoBuilder as PlanoBuilderView } from './components/PlanoBuilder'

interface BuilderData {
  nutri: Nutri
  patients: PatientLite[]
  alimentos: AlimentoLite[]
  planoFull: PlanoFull
  defaultMealNames: string[]
  objetivoOptions: ObjetivoOption[]
}

export default function PlanoBuilderPreview() {
  const baseProps = data as unknown as BuilderData
  const [plano, setPlano] = useState<PlanoFull>(baseProps.planoFull)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-builder],
        [data-nymos-builder] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-builder] .font-mono,
        [data-nymos-builder] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>

      <PlanoBuilderView
        nutri={baseProps.nutri}
        plano={plano}
        patients={baseProps.patients}
        alimentos={baseProps.alimentos}
        defaultMealNames={baseProps.defaultMealNames}
        objetivoOptions={baseProps.objetivoOptions}
        onPlanoChange={setPlano}
        onBack={() => console.log('back to list')}
        onSaveDraft={() => console.log('save draft', plano)}
        onPublish={() => console.log('publish', plano)}
        onDuplicate={() => console.log('duplicate to other patient')}
        onArchive={() => console.log('archive')}
        onDelete={() => console.log('delete')}
        onToggleFavorite={() => setPlano((p) => ({ ...p, isFavorite: !p.isFavorite }))}
      />
    </>
  )
}
