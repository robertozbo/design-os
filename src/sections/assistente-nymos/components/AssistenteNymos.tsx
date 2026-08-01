import type {
  AssistenteNymosProps,
  HudPanel as HudPanelData,
} from '@/../product/sections/assistente-nymos/types'
import { Avatar3D } from './Avatar3D'
import { ControlBar } from './ControlBar'
import { HudPanel } from './HudPanel'
import { HudPanelContent } from './HudPanelContent'
import { MicIndicator } from './MicIndicator'
import { ProactivePill } from './ProactivePill'
import { TranscriptionHud } from './TranscriptionHud'
import { VoiceWaveformOverlay } from './VoiceWaveformOverlay'

function findPanel(panels: HudPanelData[], id: string): HudPanelData | undefined {
  return panels.find((p) => p.id === id)
}

export function AssistenteNymos({
  userProfile,
  hudPanels,
  currentSession,
  proactiveSuggestion,
  onClose,
  onToggleMic,
  onToggleTts,
  onSwitchToText,
  onDrillDown,
  onAcceptProactive,
  onDismissProactive,
}: AssistenteNymosProps) {
  const bioDiagnostic = findPanel(hudPanels, 'panel-bio-diagnostic')
  const profile = findPanel(hudPanels, 'panel-profile')
  const heartRate = findPanel(hudPanels, 'panel-heart-rate')
  const bodyTemp = findPanel(hudPanels, 'panel-body-temp')
  const oxygenation = findPanel(hudPanels, 'panel-oxygenation')
  const weight = findPanel(hudPanels, 'panel-weight')
  const sleep = findPanel(hudPanels, 'panel-sleep')
  const biomarkers = findPanel(hudPanels, 'panel-biomarkers')

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

  return (
    <div
      className="
        relative isolate
        min-h-[100dvh]
        bg-slate-950 text-slate-100
        overflow-hidden
        select-none
      "
    >
      {/* Background dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(45, 212, 191, 0.35) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,184,166,0.12)_0%,_transparent_60%)]"
      />

      {/* Top edge HUD header */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-8 pt-4 md:pt-6 font-mono text-[10px] tracking-[0.22em] uppercase text-teal-500/70">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse" />
          <span>Bio Diagnostic · Live</span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:inline text-slate-500">
            Sess. {currentSession.id.slice(-12)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline tabular-nums">
            {formatTime(currentSession.startedAt)}
          </span>
          <span className="text-slate-600">|</span>
          <span>{currentSession.device.toUpperCase()}</span>
        </div>
      </div>

      {/* Main composition */}
      <div className="relative z-10 px-3 md:px-8 pb-32 md:pb-40 pt-2 md:pt-4">
        {/* Desktop grid: 3 columns. Mobile: stacked */}
        <div
          className="
            grid gap-3 md:gap-4
            grid-cols-1
            md:grid-cols-[260px_1fr_260px]
            min-h-[calc(100dvh-220px)]
            items-center
          "
        >
          {/* Left column — panels */}
          <div className="flex md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-3 px-3 md:mx-0 md:px-0 order-2 md:order-1">
            {bioDiagnostic && (
              <div className="shrink-0 snap-start md:w-full">
                <HudPanel
                  label={bioDiagnostic.label}
                  status={bioDiagnostic.status}
                >
                  <HudPanelContent panel={bioDiagnostic} />
                </HudPanel>
              </div>
            )}
            {sleep && (
              <div className="shrink-0 snap-start md:w-full">
                <HudPanel
                  label={sleep.label}
                  status={sleep.status}
                  onDrillDown={
                    sleep.drillTo ? () => onDrillDown?.(sleep.drillTo!) : undefined
                  }
                >
                  <HudPanelContent panel={sleep} />
                </HudPanel>
              </div>
            )}
            {weight && (
              <div className="shrink-0 snap-start md:w-full">
                <HudPanel
                  label={weight.label}
                  status={weight.status}
                  onDrillDown={
                    weight.drillTo ? () => onDrillDown?.(weight.drillTo!) : undefined
                  }
                >
                  <HudPanelContent panel={weight} />
                </HudPanel>
              </div>
            )}
            {biomarkers && (
              <div className="shrink-0 snap-start md:w-full">
                <HudPanel
                  label={biomarkers.label}
                  status={biomarkers.status}
                  onDrillDown={
                    biomarkers.drillTo
                      ? () => onDrillDown?.(biomarkers.drillTo!)
                      : undefined
                  }
                >
                  <HudPanelContent panel={biomarkers} />
                </HudPanel>
              </div>
            )}
          </div>

          {/* Center column — avatar */}
          <div className="order-1 md:order-2 flex flex-col items-center justify-center gap-6 md:gap-8">
            {/* Identity label above avatar */}
            <div className="flex flex-col items-center gap-1 font-mono">
              <span className="text-[9px] tracking-[0.3em] text-teal-500/60 uppercase">
                User · Anonymous · Code.A
              </span>
              <span className="text-[10px] tracking-[0.28em] text-teal-300">
                {userProfile.id}
              </span>
            </div>

            {/* Avatar mesh */}
            <div className="relative w-[260px] h-[312px] sm:w-[320px] sm:h-[384px] md:w-[380px] md:h-[456px]">
              <Avatar3D state={currentSession.avatarState} />

              {/* Corner brackets around avatar */}
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 w-5 h-5 border-t border-l border-teal-500/40"
              />
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 w-5 h-5 border-t border-r border-teal-500/40"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-teal-500/40"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-teal-500/40"
              />

              {/* Voice waveform overlay — appears inside the bracket frame when listening */}
              {currentSession.avatarState === 'listening' && (
                <VoiceWaveformOverlay />
              )}
            </div>

            {/* Avatar state caption — replaced by live partial transcript when listening */}
            <div className="flex flex-col items-center gap-1 font-mono max-w-2xl px-4 text-center">
              <span className="text-[10px] tracking-[0.28em] uppercase text-teal-300">
                {currentSession.avatarState === 'idle' && 'Standby'}
                {currentSession.avatarState === 'listening' && 'Listening'}
                {currentSession.avatarState === 'thinking' && 'Processing'}
                {currentSession.avatarState === 'speaking' && 'Speaking'}
              </span>
              {currentSession.avatarState === 'listening' ? (
                <span className="text-sm sm:text-base font-light text-slate-100 leading-snug min-h-[1.5em]">
                  {currentSession.utterances.filter((u) => u.author === 'user').slice(-1)[0]
                    ?.text || (
                    <span className="text-slate-500 italic font-mono text-xs">escutando…</span>
                  )}
                  <span
                    className="inline-block w-[2px] h-[1em] bg-teal-300 ml-1 align-middle"
                    style={{ animation: 'nymos-blink 0.85s steps(2) infinite' }}
                    aria-hidden="true"
                  />
                </span>
              ) : (
                <span className="text-[9px] tracking-[0.22em] uppercase text-slate-500">
                  Facial recognition · Scanning
                </span>
              )}
            </div>
            <style>{`@keyframes nymos-blink {0%,50%{opacity:1}50.01%,100%{opacity:0}}`}</style>
          </div>

          {/* Right column — panels */}
          <div className="flex md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-3 px-3 md:mx-0 md:px-0 order-3">
            {profile && (
              <div className="shrink-0 snap-start md:w-full">
                <HudPanel label={profile.label} status={profile.status} align="right">
                  <HudPanelContent panel={profile} />
                </HudPanel>
              </div>
            )}
            {heartRate && (
              <div className="shrink-0 snap-start md:w-full">
                <HudPanel label={heartRate.label} status={heartRate.status} align="right">
                  <HudPanelContent panel={heartRate} />
                </HudPanel>
              </div>
            )}
            {bodyTemp && (
              <div className="shrink-0 snap-start md:w-full">
                <HudPanel label={bodyTemp.label} status={bodyTemp.status} align="right">
                  <HudPanelContent panel={bodyTemp} />
                </HudPanel>
              </div>
            )}
            {oxygenation && (
              <div className="shrink-0 snap-start md:w-full">
                <HudPanel label={oxygenation.label} status={oxygenation.status} align="right">
                  <HudPanelContent panel={oxygenation} />
                </HudPanel>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fixed: proactive + transcription + mic + controls */}
      <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
        <div className="px-3 md:px-8 pb-5 md:pb-7 space-y-3 md:space-y-4">
          {proactiveSuggestion && proactiveSuggestion.status === 'pending' && (
            <div className="pointer-events-auto">
              <ProactivePill
                suggestion={proactiveSuggestion}
                onAccept={() => onAcceptProactive?.(proactiveSuggestion.id)}
                onDismiss={() => onDismissProactive?.(proactiveSuggestion.id)}
              />
            </div>
          )}

          {/* Past-turn transcription — hidden during idle and during live capture */}
          {currentSession.avatarState !== 'idle' &&
            currentSession.avatarState !== 'listening' &&
            currentSession.utterances.some((u) => u.author === 'user') && (
              <div className="pointer-events-auto">
                <TranscriptionHud
                  utterances={currentSession.utterances}
                  onDrillDown={onDrillDown}
                />
              </div>
            )}

          <div className="pointer-events-auto flex items-end justify-center gap-4 md:gap-6">
            <MicIndicator state={currentSession.micState} />
            <ControlBar
              ttsMuted={currentSession.ttsMuted}
              micMuted={currentSession.micState === 'muted'}
              onToggleMic={() =>
                onToggleMic?.(currentSession.micState === 'muted' ? 'on' : 'off')
              }
              onToggleTts={() =>
                onToggleTts?.(currentSession.ttsMuted ? 'on' : 'off')
              }
              onSwitchToText={onSwitchToText}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
