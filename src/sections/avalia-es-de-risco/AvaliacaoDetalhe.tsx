import data from '@/../product/sections/avalia-es-de-risco/data.json'
import type {
  Avaliacao,
  DetalheAvaliacao,
  Empregador,
} from '@/../product/sections/avalia-es-de-risco/types'
import { AvaliacaoDetalhe } from './components/AvaliacaoDetalhe'

export default function AvaliacaoDetalhePreview() {
  const targetId = data.detalheAvaliacao.avaliacaoId
  const avaliacoes = data.avaliacoes as Avaliacao[]
  const avaliacao = avaliacoes.find((a) => a.id === targetId) ?? avaliacoes[0]
  const detalhe = data.detalheAvaliacao as DetalheAvaliacao

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-avaliacao-detalhe],
        [data-nymos-avaliacao-detalhe] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-avaliacao-detalhe] .font-mono,
        [data-nymos-avaliacao-detalhe] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-avaliacao-detalhe>
        <AvaliacaoDetalhe
          empregador={data.empregador as Empregador}
          avaliacao={avaliacao}
          detalhe={detalhe}
          onBack={() => console.log('Voltar')}
          onReenviarLembrete={(id, setorIds) => console.log('Reenviar lembrete', id, setorIds)}
          onEstenderPrazo={(id, novaData) => console.log('Estender prazo', id, novaData)}
          onPublicar={(id) => console.log('Publicar avaliação', id)}
          onAbrirSetor={(setorId) => console.log('Abrir setor', setorId)}
        />
      </div>
    </>
  )
}
