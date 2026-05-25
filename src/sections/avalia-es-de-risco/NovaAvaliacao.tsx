import data from '@/../product/sections/avalia-es-de-risco/data.json'
import type {
  Empregador,
  EscopoUnit,
  Instrumento,
} from '@/../product/sections/avalia-es-de-risco/types'
import { NovaAvaliacaoWizard } from './components/NovaAvaliacaoWizard'

const RESPONSAVEL_TECNICO = 'Roberto Zboralski (CRP 99/12345)'

export default function NovaAvaliacaoPreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-nova-avaliacao],
        [data-nymos-nova-avaliacao] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-nova-avaliacao] .font-mono,
        [data-nymos-nova-avaliacao] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-nova-avaliacao>
        <NovaAvaliacaoWizard
          empregador={data.empregador as Empregador}
          instrumentos={data.instrumentos as Instrumento[]}
          escopoDisponivel={data.escopoDisponivel as EscopoUnit[]}
          responsavelTecnico={RESPONSAVEL_TECNICO}
          onSubmit={(draft) => console.log('Publicar avaliação', draft)}
          onCancel={() => console.log('Cancelar')}
        />
      </div>
    </>
  )
}
