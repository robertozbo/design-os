import data from '@/../product/sections/notifica-es-sst/data.json'
import type {
  Employer,
  Notification,
  NotificationSummary,
} from '@/../product/sections/notifica-es-sst/types'
import { NotificacoesSst } from './components/NotificacoesSst'

export default function NotificacoesSstPreview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-notificacoes-sst],
        [data-nymos-notificacoes-sst] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-notificacoes-sst] .font-mono,
        [data-nymos-notificacoes-sst] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
      `}</style>
      <div data-nymos-notificacoes-sst>
        <NotificacoesSst
          notifications={data.notifications as Notification[]}
          employers={data.employers as Employer[]}
          summary={data.summary as NotificationSummary}
          onMarkRead={(id) => console.log('Marcar lida', id)}
          onMarkUnread={(id) => console.log('Marcar não-lida', id)}
          onMarkAllRead={() => console.log('Marcar todas como lidas')}
          onArchive={(id) => console.log('Arquivar', id)}
          onUnarchive={(id) => console.log('Restaurar', id)}
          onSnooze={(id, duration) => console.log('Snooze', id, duration)}
          onUnsnooze={(id) => console.log('Cancelar snooze', id)}
          onBulkMarkRead={(ids) => console.log('Bulk lidas', ids)}
          onBulkArchive={(ids) => console.log('Bulk arquivar', ids)}
          onOpenSource={(n) => console.log('Abrir origem', n.source)}
          onUndoLastAction={() => console.log('Desfazer última ação')}
        />
      </div>
    </>
  )
}
