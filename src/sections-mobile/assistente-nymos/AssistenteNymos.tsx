import data from '@/../product-mobile/sections/assistente-nymos/data.json'
import type { AssistenteNymosProps } from '@/../product/sections/assistente-nymos/types'
import { AssistenteNymosMobile } from './components/AssistenteNymosMobile'

export default function AssistenteNymosMobilePreview() {
  const props = data as unknown as AssistenteNymosProps

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
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
      <div data-nymos-mobile className="min-h-full relative">
        <AssistenteNymosMobile
          userProfile={props.userProfile}
          vitalsSnapshot={props.vitalsSnapshot}
          hudPanels={props.hudPanels}
          currentSession={props.currentSession}
          recentSessions={props.recentSessions}
          memories={props.memories}
          proactiveSuggestion={props.proactiveSuggestion}
          onInvoke={(mode) => console.log('[mobile] invoke:', mode)}
          onClose={() => console.log('[mobile] close')}
          onToggleMic={(next) => console.log('[mobile] toggle mic:', next)}
          onToggleTts={(next) => console.log('[mobile] toggle tts:', next)}
          onSwitchToText={() => console.log('[mobile] switch to text')}
          onSendText={(t) => console.log('[mobile] send text:', t)}
          onDrillDown={(p) => console.log('[mobile] drill down:', p)}
          onForgetMemory={(id) => console.log('[mobile] forget memory:', id)}
          onOpenMemories={() => console.log('[mobile] open memories')}
          onAcceptProactive={(id) => console.log('[mobile] accept proactive:', id)}
          onDismissProactive={(id) => console.log('[mobile] dismiss proactive:', id)}
          onOpenHistory={() => console.log('[mobile] open history')}
          onSelectSession={(id) => console.log('[mobile] select session:', id)}
          onExportSession={(id) => console.log('[mobile] export session:', id)}
        />
      </div>
    </>
  )
}
