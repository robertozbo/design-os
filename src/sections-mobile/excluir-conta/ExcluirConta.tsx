import data from '@/../product-mobile/sections/excluir-conta/data.json'
import type { ExcluirContaData } from '@/../product-mobile/sections/excluir-conta/types'
import { ExcluirConta as ExcluirContaComponent } from './components/ExcluirConta'

export default function ExcluirContaPreview() {
  const baseData = data as unknown as ExcluirContaData

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'Geist Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-mobile="true">
        <ExcluirContaComponent
          data={baseData}
          onConfirmar={(senha) => console.log('Confirmar exclusão com senha:', senha)}
          onConfirmarBiometria={() => console.log('Confirmar exclusão via biometria')}
          onCancelar={() => {
            window.location.href = '/mobile/sections/privacidade-seguranca'
          }}
          onConcluido={() => console.log('Exclusão concluída — logout')}
          onReverterExclusao={() => console.log('Reverter exclusão pendente')}
        />
      </div>
    </>
  )
}
