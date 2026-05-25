import data from '@/../product/sections/avalia-es-de-risco/data.json'
import type {
  Avaliacao,
  Empregador,
  MatrizPublicada,
} from '@/../product/sections/avalia-es-de-risco/types'
import { MatrizPsicossocial } from './components/MatrizPsicossocial'

export default function MatrizPsicossocialPreview() {
  const targetId = data.matriz.avaliacaoId
  const avaliacoes = data.avaliacoes as Avaliacao[]
  const avaliacao = avaliacoes.find((a) => a.id === targetId) ?? avaliacoes[0]
  const matriz = data.matriz as MatrizPublicada

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-matriz],
        [data-nymos-matriz] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-matriz] .font-mono,
        [data-nymos-matriz] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-matriz>
        <MatrizPsicossocial
          empregador={data.empregador as Empregador}
          avaliacao={avaliacao}
          matriz={matriz}
          onBack={() => console.log('Voltar')}
          onExportarPgr={(id) => console.log('Exportar PGR', id)}
          onBaixarRelatorio={(id) => console.log('Baixar PDF', id)}
          onSelecionarCelula={(setor, fator) => console.log('Selecionar célula', setor, fator)}
        />
      </div>
    </>
  )
}
