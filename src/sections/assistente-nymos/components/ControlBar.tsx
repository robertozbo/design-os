import { Keyboard, Volume2, VolumeX, X } from 'lucide-react'

interface ControlBarProps {
  ttsMuted: boolean
  micMuted: boolean
  onToggleMic?: () => void
  onToggleTts?: () => void
  onSwitchToText?: () => void
  onClose?: () => void
}

interface ControlButtonProps {
  onClick?: () => void
  label: string
  active?: boolean
  danger?: boolean
  children: React.ReactNode
}

function ControlButton({ onClick, label, active, danger, children }: ControlButtonProps) {
  const color = danger
    ? 'text-rose-300 border-rose-400/40 hover:border-rose-400 hover:bg-rose-500/10'
    : active
      ? 'text-orange-300 border-orange-400/50 hover:border-orange-400 hover:bg-orange-500/10'
      : 'text-teal-300 border-teal-500/40 hover:border-teal-400 hover:bg-teal-500/10'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`
        relative font-mono
        w-10 h-10
        flex items-center justify-center
        border ${color}
        bg-slate-950/70 backdrop-blur-sm
        transition-colors duration-200
      `}
      style={{
        clipPath:
          'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
      }}
    >
      {children}
    </button>
  )
}

export function ControlBar({
  ttsMuted,
  micMuted,
  onToggleMic,
  onToggleTts,
  onSwitchToText,
  onClose,
}: ControlBarProps) {
  return (
    <div
      className="flex items-center gap-2"
      role="toolbar"
      aria-label="Controles da sessão"
    >
      <ControlButton
        onClick={onToggleTts}
        label={ttsMuted ? 'Ativar voz do Nymos' : 'Silenciar voz do Nymos'}
        active={ttsMuted}
      >
        {ttsMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </ControlButton>

      <ControlButton onClick={onSwitchToText} label="Digitar em vez de falar">
        <Keyboard className="w-4 h-4" />
      </ControlButton>

      <div className="w-px h-6 bg-teal-500/20 mx-1" />

      <ControlButton onClick={onClose} label="Fechar sessão" danger>
        <X className="w-4 h-4" />
      </ControlButton>

      {/* The mic toggle lives separately via MicIndicator click area, but we still expose a hidden control for muting via keyboard */}
      <button
        type="button"
        onClick={onToggleMic}
        className="sr-only"
        aria-label={micMuted ? 'Ativar microfone' : 'Silenciar microfone'}
      >
        toggle mic
      </button>
    </div>
  )
}
