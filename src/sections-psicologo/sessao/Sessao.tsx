import { useState } from 'react'
import data from '@/../product-psicologo/sections/sessao/data.json'
import type {
  HomeworkPrescrito,
  ModoAnotacao,
  RiscoNivel,
  SessaoData,
  SoapFields,
} from '@/../product-psicologo/sections/sessao/types'
import { Sessao as SessaoComponent } from './components/Sessao'

export default function SessaoPreview() {
  const [state, setState] = useState<SessaoData>(data as unknown as SessaoData)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        body, [data-nymos-psicologo],
        [data-nymos-psicologo] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-psicologo] .font-mono,
        [data-nymos-psicologo] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-psicologo] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-psicologo] .no-scrollbar { scrollbar-width: none; }
      `}</style>
      <div data-nymos-psicologo="true">
        <SessaoComponent
          data={state}
          onModoChange={(modo: ModoAnotacao) => setState((s) => ({ ...s, modo }))}
          onSoapChange={(campo: keyof SoapFields, valor: string) =>
            setState((s) => ({ ...s, soap: { ...s.soap, [campo]: valor } }))
          }
          onLivreChange={(valor) => setState((s) => ({ ...s, livre: valor }))}
          onTecnicaToggle={(id) =>
            setState((s) => ({
              ...s,
              tecnicasSelecionadas: s.tecnicasSelecionadas.includes(id)
                ? s.tecnicasSelecionadas.filter((x) => x !== id)
                : [...s.tecnicasSelecionadas, id],
            }))
          }
          onHomeworkChange={(campo, valor) =>
            setState((s) => ({ ...s, homework: { ...s.homework, [campo]: valor } as HomeworkPrescrito }))
          }
          onRiscoChange={(nivel: RiscoNivel) => setState((s) => ({ ...s, risco: nivel }))}
          onNotasPrivadasChange={(valor) => setState((s) => ({ ...s, notasPrivadas: valor }))}
          onPause={() => console.log('Pause/resume timer')}
          onAplicarInstrumento={() => console.log('Aplicar instrumento')}
          onFinalizar={() => console.log('Finalizar sessão', state)}
          onCancelar={() => console.log('Cancelar sessão')}
        />
      </div>
    </>
  )
}
