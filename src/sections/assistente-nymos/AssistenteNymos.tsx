import data from '@/../product/sections/assistente-nymos/data.json'
import type { AssistenteNymosProps } from '@/../product/sections/assistente-nymos/types'
import { AssistenteNymos as AssistenteNymosView } from './components/AssistenteNymos'

export default function AssistenteNymosPreview() {
  const props = data as unknown as AssistenteNymosProps

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-assistente],
        [data-nymos-assistente] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-assistente] .font-mono,
        [data-nymos-assistente] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-assistente>
        <AssistenteNymosView
          userProfile={props.userProfile}
          vitalsSnapshot={props.vitalsSnapshot}
          hudPanels={props.hudPanels}
          currentSession={props.currentSession}
          recentSessions={props.recentSessions}
          memories={props.memories}
          proactiveSuggestion={props.proactiveSuggestion}
          onInvoke={(mode) =>
            console.log('[AssistenteNymos] invoke:', mode)
          }
          onClose={() => console.log('[AssistenteNymos] close')}
          onToggleMic={(next) =>
            console.log('[AssistenteNymos] toggle mic:', next)
          }
          onToggleTts={(next) =>
            console.log('[AssistenteNymos] toggle tts:', next)
          }
          onSwitchToText={() =>
            console.log('[AssistenteNymos] switch to text')
          }
          onSendText={(text) =>
            console.log('[AssistenteNymos] send text:', text)
          }
          onDrillDown={(path) =>
            console.log('[AssistenteNymos] drill down:', path)
          }
          onForgetMemory={(id) =>
            console.log('[AssistenteNymos] forget memory:', id)
          }
          onOpenMemories={() =>
            console.log('[AssistenteNymos] open memories')
          }
          onAcceptProactive={(id) =>
            console.log('[AssistenteNymos] accept proactive:', id)
          }
          onDismissProactive={(id) =>
            console.log('[AssistenteNymos] dismiss proactive:', id)
          }
          onOpenHistory={() =>
            console.log('[AssistenteNymos] open history')
          }
          onSelectSession={(id) =>
            console.log('[AssistenteNymos] select session:', id)
          }
          onExportSession={(id) =>
            console.log('[AssistenteNymos] export session:', id)
          }
        />
      </div>
    </>
  )
}
