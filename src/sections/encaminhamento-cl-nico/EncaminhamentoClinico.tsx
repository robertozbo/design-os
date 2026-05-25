import data from '@/../product/sections/encaminhamento-cl-nico/data.json'
import type {
  PartnerProfessional,
  Referral,
  ReferralFilters,
  ReferralSummary,
} from '@/../product/sections/encaminhamento-cl-nico/types'
import { EncaminhamentoClinico } from './components/EncaminhamentoClinico'

export default function EncaminhamentoClinicoPreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-encaminhamento],
        [data-nymos-encaminhamento] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-encaminhamento] .font-mono,
        [data-nymos-encaminhamento] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-encaminhamento>
        <EncaminhamentoClinico
          referrals={data.referrals as Referral[]}
          partnerProfessionals={data.partnerProfessionals as PartnerProfessional[]}
          summary={data.summary as ReferralSummary}
          filters={data.filters as ReferralFilters}
          onSendInvite={(id, payload) => console.log('Enviar convite', id, payload)}
          onResendInvite={(id) => console.log('Reenviar convite', id)}
          onCancelInvite={(id, reason) => console.log('Cancelar convite', id, reason)}
          onDiscardSuggestion={(id, reason) => console.log('Descartar sugestão', id, reason)}
          onAssignProfessional={(id, profId) => console.log('Atribuir profissional', id, profId)}
          onMarkCompleted={(id) => console.log('Marcar como concluído', id)}
          onReopen={(id) => console.log('Reabrir caso', id)}
          onArchive={(id) => console.log('Arquivar caso', id)}
        />
      </div>
    </>
  )
}
