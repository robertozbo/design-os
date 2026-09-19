import data from '@/../product-mobile/sections/glp1/data.json'
import type { Glp1Data } from '@/../product-mobile/sections/glp1/types'
import { Glp1 as Glp1Component } from './components/Glp1'

/**
 * Teste visual: outline só onde o preenchimento não carrega informação —
 * os quatro stats e a faixa de ritmo. Protocolo e histórico mantêm o fill,
 * porque um tem card aninhado e o outro precisa separar a lista do fundo.
 *
 * Override em CSS de escopo, como em Glp1Outline: nenhum componente muda.
 */
export default function Glp1HibridoPreview() {
  const baseData = data as unknown as Glp1Data

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-mobile] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-mobile] .no-scrollbar { scrollbar-width: none; }

        /* --- variante híbrida: só os stats e a faixa de ritmo em outline --- */
        [data-glp1-hibrido] .grid.grid-cols-2 > .bg-slate-900,
        [data-glp1-hibrido] .grid.grid-cols-2 + .bg-slate-900 {
          background-color: transparent !important;
          border-color: oklch(37.2% 0.028 258) !important;
        }
      `}</style>
      <div data-nymos-mobile="true" data-glp1-hibrido="true">
        <Glp1Component
          data={baseData}
          onSalvarConfiguracao={(p) => console.log('Configuração GLP-1:', p)}
          onSalvarAplicacao={(p) => console.log('Nova aplicação:', p)}
        />
      </div>
    </>
  )
}
