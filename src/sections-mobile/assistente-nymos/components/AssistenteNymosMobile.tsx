import { useMemo, useState } from 'react'
import { ChevronUp, Keyboard, VolumeX, Volume2, X } from 'lucide-react'
import type { AssistenteNymosProps } from '@/../product/sections/assistente-nymos/types'
import { Avatar3D } from '@/sections/assistente-nymos/components/Avatar3D'
import { VoiceWaveformOverlay } from '@/sections/assistente-nymos/components/VoiceWaveformOverlay'
import { HudPanel } from '@/sections/assistente-nymos/components/HudPanel'
import { HudPanelContent } from '@/sections/assistente-nymos/components/HudPanelContent'
import { MicIndicator } from '@/sections/assistente-nymos/components/MicIndicator'

type SheetState = 'collapsed' | 'expanded'

export function AssistenteNymosMobile({
  userProfile,
  hudPanels,
  currentSession,
  proactiveSuggestion,
  onClose,
  onToggleTts,
  onSwitchToText,
  onDrillDown,
  onAcceptProactive,
  onDismissProactive,
  onOpenHistory,
}: AssistenteNymosProps) {
  const [sheet, setSheet] = useState<SheetState>('collapsed')

  const hasAlertPanels = useMemo(
    () => hudPanels.some((p) => p.status === 'alert'),
    [hudPanels],
  )
  const hasActivePanels = useMemo(
    () => hudPanels.some((p) => p.status === 'active'),
    [hudPanels],
  )

  const isExpanded = sheet === 'expanded'
  const avatarScale = isExpanded ? 'scale-[0.55]' : 'scale-100'

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })

  // Show only the last 2 utterances on mobile for compactness
  const visibleUtterances = currentSession.utterances.slice(-2)

  return (
    <div className="relative isolate min-h-[100dvh] bg-black text-slate-100 overflow-hidden select-none">
      {/* Background dot grid + radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(45, 212, 191, 0.35) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          maskImage:
            'radial-gradient(ellipse 70% 50% at 50% 35%, black 30%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.16)_0%,_transparent_55%)]"
      />

      {/* Top status strip — safe area aware */}
      <div
        className="
          relative z-10 flex items-center justify-between
          px-4 pt-[max(env(safe-area-inset-top),20px)] pb-2
          font-mono text-[10px] tracking-[0.22em] uppercase text-teal-500/70
        "
      >
        <button
          type="button"
          onClick={onOpenHistory}
          className="flex items-center gap-2 hover:text-teal-300 transition-colors"
        >
          <span className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse" />
          <span>Histórico</span>
        </button>
        <span className="text-teal-300/80">Bio Diagnostic</span>
        <span className="tabular-nums text-slate-500">
          {formatTime(currentSession.startedAt)}
        </span>
      </div>

      {/* Proactive suggestion — top-floating card */}
      {proactiveSuggestion && proactiveSuggestion.status === 'pending' && (
        <div className="relative z-20 px-4 pb-2">
          <div
            className="
              border border-orange-400/60 bg-orange-500/[0.08] backdrop-blur-md
              px-3 py-2.5
              shadow-[0_0_20px_-6px_rgba(251,146,60,0.5)]
            "
            style={{
              clipPath:
                'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}
            role="status"
          >
            <div className="flex items-center gap-2 text-[9px] tracking-[0.22em] uppercase text-orange-300 mb-1">
              <span className="w-1 h-1 bg-orange-300 rounded-full animate-pulse" />
              Sugestão · {proactiveSuggestion.category}
            </div>
            <p className="text-sm text-orange-50 font-light leading-snug mb-2">
              {proactiveSuggestion.message}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onAcceptProactive?.(proactiveSuggestion.id)}
                className="flex-1 text-[10px] tracking-widest uppercase text-black bg-orange-300 hover:bg-orange-200 py-1.5 font-mono"
              >
                {proactiveSuggestion.ctaAccept}
              </button>
              <button
                type="button"
                onClick={() => onDismissProactive?.(proactiveSuggestion.id)}
                className="text-[10px] tracking-widest uppercase text-orange-200/80 border border-orange-400/40 px-3 py-1.5 font-mono"
              >
                {proactiveSuggestion.ctaDismiss}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Identity label above avatar */}
      <div className="relative z-10 flex flex-col items-center pt-2 font-mono">
        <span className="text-[9px] tracking-[0.3em] text-teal-500/60 uppercase">
          User · Anonymous
        </span>
        <span className="text-[10px] tracking-[0.28em] text-teal-300 mt-0.5">
          {userProfile.id}
        </span>
      </div>

      {/* Avatar — dominates the screen */}
      <div
        className={`
          relative z-10 mx-auto mt-4 mb-3
          transition-transform duration-500 ease-out
          ${avatarScale}
        `}
        style={{
          width: 'min(70vw, 320px)',
          height: 'min(84vw, 384px)',
        }}
      >
        <Avatar3D state={currentSession.avatarState} />
        {/* Corner brackets */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 w-4 h-4 border-t border-l border-teal-500/40"
        />
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 w-4 h-4 border-t border-r border-teal-500/40"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-teal-500/40"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-teal-500/40"
        />

        {/* Voice waveform overlay inside the bracket */}
        {currentSession.avatarState === 'listening' && <VoiceWaveformOverlay bars={36} />}
      </div>

      {/* Avatar state caption — partial transcript replaces subtitle when listening */}
      <div
        className={`
          relative z-10 flex flex-col items-center font-mono px-4 text-center
          transition-opacity duration-300
          ${isExpanded ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <span className="text-[11px] tracking-[0.28em] uppercase text-teal-300">
          {currentSession.avatarState === 'idle' && 'Standby'}
          {currentSession.avatarState === 'listening' && 'Listening'}
          {currentSession.avatarState === 'thinking' && 'Processing'}
          {currentSession.avatarState === 'speaking' && 'Speaking'}
        </span>
        {currentSession.avatarState === 'listening' ? (
          <span className="text-sm font-light text-slate-100 leading-snug mt-1 min-h-[1.4em]">
            {currentSession.utterances.filter((u) => u.author === 'user').slice(-1)[0]?.text || (
              <span className="text-slate-500 italic font-mono text-xs">escutando…</span>
            )}
            <span
              className="inline-block w-[2px] h-[1em] bg-teal-300 ml-1 align-middle"
              style={{ animation: 'nymos-blink 0.85s steps(2) infinite' }}
              aria-hidden="true"
            />
          </span>
        ) : (
          <span className="text-[9px] tracking-[0.22em] uppercase text-slate-500 mt-0.5">
            Facial recognition · Scanning
          </span>
        )}
      </div>
      <style>{`@keyframes nymos-blink {0%,50%{opacity:1}50.01%,100%{opacity:0}}`}</style>

      {/* Past-turn transcription — hidden when avatar is idle/listening or no user utterance */}
      <div
        className={`
          relative z-10 mt-4 px-4
          transition-opacity duration-300
          ${
            isExpanded ||
            currentSession.avatarState === 'listening' ||
            (currentSession.avatarState === 'idle' &&
              !currentSession.utterances.some((u) => u.author === 'user'))
              ? 'opacity-0 pointer-events-none h-0 overflow-hidden mt-0'
              : 'opacity-100'
          }
        `}
      >
        <div
          className="border border-teal-500/30 bg-black/70 backdrop-blur-md px-4 py-3"
          style={{
            clipPath:
              'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          }}
          aria-live="polite"
        >
          <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-teal-500/60 uppercase mb-2 border-b border-teal-500/20 pb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-teal-300 rounded-full animate-pulse" />
              Transcription · Live
            </span>
            <span>STT v2</span>
          </div>
          <ul className="space-y-2.5">
            {visibleUtterances.map((u, idx) => {
              const isLast = idx === visibleUtterances.length - 1
              return (
                <li key={u.id} className="flex gap-2.5">
                  <span
                    className={`text-[10px] font-mono tracking-widest pt-0.5 shrink-0 w-12 ${
                      u.author === 'assistant'
                        ? 'text-teal-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {u.author === 'assistant' ? 'NYMOS' : 'USER'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-base font-light leading-snug ${
                        u.author === 'assistant'
                          ? 'text-teal-100'
                          : 'text-slate-300'
                      } ${isLast && u.author === 'assistant' ? 'drop-shadow-[0_0_8px_rgba(94,234,212,0.4)]' : ''}`}
                    >
                      {u.text}
                    </p>
                    {u.drillTo && (
                      <button
                        type="button"
                        onClick={() => u.drillTo && onDrillDown?.(u.drillTo)}
                        className="
                          mt-2 inline-flex items-center gap-1.5
                          text-[10px] font-mono tracking-widest uppercase
                          text-teal-300
                          border border-teal-500/40
                          px-2.5 py-1
                        "
                      >
                        Ver detalhes →
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Mic + controls */}
      <div
        className={`
          relative z-10 flex items-center justify-center gap-4 mt-5
          transition-opacity duration-300
          ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        <MicIndicator state={currentSession.micState} />
        <div className="flex items-center gap-2">
          <ControlIconButton
            label={currentSession.ttsMuted ? 'Ativar voz' : 'Silenciar voz'}
            onClick={() => onToggleTts?.(currentSession.ttsMuted ? 'on' : 'off')}
            active={currentSession.ttsMuted}
          >
            {currentSession.ttsMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </ControlIconButton>
          <ControlIconButton
            label="Digitar"
            onClick={() => onSwitchToText?.()}
          >
            <Keyboard className="w-4 h-4" />
          </ControlIconButton>
          <ControlIconButton label="Fechar" onClick={() => onClose?.()} danger>
            <X className="w-4 h-4" />
          </ControlIconButton>
        </div>
      </div>

      {/* Bottom pull-up sheet with HUD panels */}
      <div
        className={`
          fixed inset-x-0 bottom-0 z-30
          bg-black/95 backdrop-blur-xl
          border-t border-teal-500/30
          transition-transform duration-500 ease-out
        `}
        style={{
          transform: isExpanded ? 'translateY(0)' : 'translateY(calc(100% - 56px))',
          paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
          maxHeight: '70vh',
        }}
        role="region"
        aria-label="Painéis de saúde"
        aria-expanded={isExpanded}
      >
        {/* Handle */}
        <button
          type="button"
          onClick={() => setSheet((s) => (s === 'collapsed' ? 'expanded' : 'collapsed'))}
          className="w-full pt-3 pb-2 flex flex-col items-center gap-2"
          aria-label={isExpanded ? 'Recolher métricas' : 'Expandir métricas'}
        >
          <span
            className={`w-9 h-1 rounded-full transition-colors ${
              hasAlertPanels
                ? 'bg-orange-400'
                : hasActivePanels
                  ? 'bg-teal-300'
                  : 'bg-slate-600'
            }`}
          />
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase">
            <ChevronUp
              className={`w-3 h-3 text-teal-400 transition-transform ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
            />
            <span className="text-teal-300">
              {isExpanded ? 'Ocultar métricas' : 'Puxe para ver métricas'}
            </span>
            {hasAlertPanels && !isExpanded && (
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            )}
          </div>
        </button>

        {/* Panel grid */}
        <div className="px-4 pt-2 pb-4 grid grid-cols-2 gap-3 overflow-y-auto max-h-[calc(70vh-72px)]">
          {hudPanels.map((panel) => (
            <HudPanel
              key={panel.id}
              label={panel.label}
              status={panel.status}
              size="sm"
              onDrillDown={
                panel.drillTo && 'drillTo' in panel
                  ? () => onDrillDown?.(panel.drillTo!)
                  : undefined
              }
            >
              <HudPanelContent panel={panel} />
            </HudPanel>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ControlIconButtonProps {
  label: string
  onClick?: () => void
  active?: boolean
  danger?: boolean
  children: React.ReactNode
}

function ControlIconButton({ label, onClick, active, danger, children }: ControlIconButtonProps) {
  const color = danger
    ? 'text-rose-300 border-rose-400/50'
    : active
      ? 'text-orange-300 border-orange-400/50'
      : 'text-teal-300 border-teal-500/40'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`
        relative font-mono
        w-12 h-12
        flex items-center justify-center
        border ${color}
        bg-black/70 backdrop-blur-sm
      `}
      style={{
        clipPath:
          'polygon(7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%, 0 7px)',
      }}
    >
      {children}
    </button>
  )
}
