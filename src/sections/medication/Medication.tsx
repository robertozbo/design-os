import data from '@/../product/sections/medication/data.json'
import type { MedicacaoData } from '@/../product/sections/medication/types'
import { MedicationView } from './components/MedicationView'

export default function MedicationPreview() {
  const baseData = data as unknown as MedicacaoData

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-medication],
        [data-nymos-medication] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-medication] .font-serif {
          font-family: 'DM Serif Display', ui-serif, Georgia, serif;
        }
        [data-nymos-medication] .font-mono,
        [data-nymos-medication] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-medication] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-medication] .no-scrollbar { scrollbar-width: none; }
      `}</style>
      <div data-nymos-medication="true" className="min-h-screen bg-stone-50 dark:bg-slate-950">
        <MedicationView
          data={baseData}
          onMarcarDose={(id) => console.log('[Medication] marcar dose:', id)}
          onAdiarDose={(id, min) => console.log('[Medication] adiar dose:', id, min)}
          onAbrirReceitaMemed={(id) => console.log('[Medication] memed:', id)}
          onAbrirDetalheReceita={(id) => console.log('[Medication] detalhe receita:', id)}
          onVerHistoricoCompleto={() => console.log('[Medication] ver todas receitas')}
          onFalarComMedico={(ctx) => console.log('[Medication] falar com médico:', ctx)}
          onDispensarRenovada={() => console.log('[Medication] dispensar renovada')}
          onAplicarDose={(id) => console.log('[Medication] aplicar dose:', id)}
          onMarcarComprimido={(id) => console.log('[Medication] comprimido:', id)}
          onRegistrarSintomas={(injId) => console.log('[Medication] sintomas:', injId)}
          onVerHistoricoInjecoes={(id) => console.log('[Medication] histórico injeções:', id)}
        />
      </div>
    </>
  )
}
