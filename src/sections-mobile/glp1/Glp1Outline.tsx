import data from '@/../product-mobile/sections/glp1/data.json'
import type { Glp1Data } from '@/../product-mobile/sections/glp1/types'
import { Glp1 as Glp1Component } from './components/Glp1'

/**
 * Teste visual: os mesmos componentes, sem preenchimento nos cards — só o
 * contorno. O override vive aqui em CSS de escopo; nenhum componente muda,
 * então a variante some tirando este arquivo.
 *
 * A borda sobe de slate-800 pra slate-700: sem o preenchimento, slate-800
 * contra o fundo slate-950 quase não desenha.
 */
export default function Glp1OutlinePreview() {
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

        /* --- variante outline --- */
        [data-glp1-outline] .bg-slate-900 { background-color: transparent !important; }
        [data-glp1-outline] .border-slate-800 { border-color: oklch(37.2% 0.028 258) !important; }
      `}</style>
      <div data-nymos-mobile="true" data-glp1-outline="true">
        <Glp1Component
          data={baseData}
          onSalvarConfiguracao={(p) => console.log('Configuração GLP-1:', p)}
          onSalvarAplicacao={(p) => console.log('Nova aplicação:', p)}
        />
      </div>
    </>
  )
}
