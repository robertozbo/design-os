import data from '@/../product/sections/profissionais/data.json'
import type { ProfessionalDetailPageContent, ProfessionalDetail as ProfessionalDetailType } from '@/../product/sections/profissionais/types'
import { ProfessionalDetail as ProfessionalDetailView } from './components/ProfessionalDetail'

// Detail preview: pick the first professional and synthesize a Detail
// from the listing data plus mock specializations/education/languages.
const SAMPLE_DETAIL: ProfessionalDetailType = {
  ...((data as unknown as { professionals: ProfessionalDetailType[] }).professionals[0]),
  fullBio:
    'Nutricionista clínica formada pela USP com 12 anos de prática, especializada em emagrecimento sustentável, nutrição esportiva e abordagem comportamental.\n\nAcredito que cada paciente precisa de um plano que caiba na sua rotina — sem dietas extremas, sem culpa, com foco em hábitos que duram. Trabalho em parceria com personal trainers e endocrinologistas quando o caso pede uma abordagem integrada.',
  specializations: [
    'Emagrecimento sustentável',
    'Nutrição esportiva',
    'Composição corporal',
    'Comportamento alimentar',
    'Vegetarianismo / Veganismo',
  ],
  education: [
    {
      institution: 'Universidade de São Paulo (USP)',
      course: 'Bacharelado em Nutrição',
      level: 'Graduação',
      year: 2014,
    },
    {
      institution: 'Instituto Brasileiro de Nutrição Funcional',
      course: 'Nutrição Esportiva Funcional',
      level: 'Pós-graduação',
      year: 2017,
    },
    {
      institution: 'ASBRAN',
      course: 'Especialização em Nutrição Clínica',
      level: 'Especialização',
      year: 2020,
    },
  ],
  languages: ['pt-BR', 'en-US'],
  servesCities: ['São Paulo', 'Santo André', 'São Caetano'],
  servesOnline: true,
}

const PAGE_CONTENT: ProfessionalDetailPageContent = {
  professional: SAMPLE_DETAIL,
  actionCard: (data as unknown as { detailActionCard: ProfessionalDetailPageContent['actionCard'] }).detailActionCard,
  linkRequestModal: (data as unknown as { linkRequestModal: ProfessionalDetailPageContent['linkRequestModal'] }).linkRequestModal,
}

export default function ProfessionalDetailPreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-profissional-detail],
        [data-nymos-profissional-detail] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-profissional-detail] .font-mono,
        [data-nymos-profissional-detail] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-profissional-detail>
        <ProfessionalDetailView
          {...PAGE_CONTENT}
          onBack={() => console.log('[Profissional Detail] → /profissionais')}
          onRequestLink={() => console.log('[Profissional Detail] open link request modal')}
          onValidateCode={(code) => console.log('[Profissional Detail] validate code:', code)}
        />
      </div>
    </>
  )
}
