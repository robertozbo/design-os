import { useEffect, useState } from 'react'
import data from '@/../product-mobile/sections/ia/data.json'
import type { IAData, QuickActionUI } from '@/../product-mobile/sections/ia/types'
import { IA as IAComponent } from './components/IA'
import { EnviarParaIAModal } from './components/EnviarParaIAModal'
import { ChatIAFullscreen } from './components/ChatIAFullscreen'

export default function IAPreview() {
  const baseData = data as unknown as IAData
  const [activeAction, setActiveAction] = useState<QuickActionUI | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    let node: React.ReactNode = null
    if (chatOpen) {
      node = <ChatIAFullscreen onClose={() => setChatOpen(false)} />
    } else if (activeAction) {
      node = (
        <EnviarParaIAModal
          action={activeAction}
          onClose={() => setActiveAction(null)}
          onSubmit={(p) => console.log('Submit IA:', p)}
          existingExamDates={[today]}
        />
      )
    }
    window.dispatchEvent(new CustomEvent('nymos:set-overlay', { detail: { node } }))
    return () => {
      window.dispatchEvent(new CustomEvent('nymos:set-overlay', { detail: { node: null } }))
    }
  }, [activeAction, chatOpen])

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
      `}</style>
      <div data-nymos-mobile="true">
        <IAComponent
          data={baseData}
          onQuickActionClick={(a) => setActiveAction(a)}
          onHistoricoClick={() => setChatOpen(true)}
          onChatClick={() => setChatOpen(true)}
        />
      </div>
    </>
  )
}
