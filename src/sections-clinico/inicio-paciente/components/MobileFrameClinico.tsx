import { type ReactNode } from 'react'
import {
  Wifi,
  Signal,
  BatteryFull,
  Home,
  Calendar,
  ClipboardList,
  MessageCircle,
  User,
} from 'lucide-react'

interface MobileFrameClinicoProps {
  children: ReactNode
  activeTab?: 'inicio' | 'agenda' | 'diario' | 'mensagens' | 'perfil'
  notificacoesNaoLidas?: number
}

const TABS: Array<{
  id: NonNullable<MobileFrameClinicoProps['activeTab']>
  label: string
  Icon: typeof Home
}> = [
  { id: 'inicio', label: 'Início', Icon: Home },
  { id: 'agenda', label: 'Agenda', Icon: Calendar },
  { id: 'diario', label: 'Diário', Icon: ClipboardList },
  { id: 'mensagens', label: 'Mensagens', Icon: MessageCircle },
  { id: 'perfil', label: 'Perfil', Icon: User },
]

export function MobileFrameClinico({
  children,
  activeTab = 'inicio',
  notificacoesNaoLidas = 0,
}: MobileFrameClinicoProps) {
  const scale = 0.85
  return (
    <div className="flex justify-center bg-slate-100 py-8 dark:bg-slate-900 min-h-screen">
      <div style={{ width: 390 * scale, height: 844 * scale }}>
        <div
          className="relative overflow-hidden rounded-[44px] border-[10px] border-slate-900 bg-white shadow-2xl dark:bg-slate-950"
          style={{
            width: 390,
            height: 844,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Status bar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-12 items-center justify-between px-7 pt-3 text-[14px] font-semibold tabular-nums text-slate-900 dark:text-white">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <Signal size={14} />
              <Wifi size={14} />
              <BatteryFull size={18} />
            </div>
          </div>

          {/* Notch */}
          <div className="pointer-events-none absolute left-1/2 top-1.5 z-40 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-950 dark:bg-black" />

          {/* Scrollable content area */}
          <div
            className="absolute inset-x-0 overflow-y-auto bg-gradient-to-b from-slate-50 via-white to-slate-100/40 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"
            style={{ top: 48, bottom: 84 }}
          >
            {children}
            {notificacoesNaoLidas > 0 && (
              <div className="hidden" aria-hidden="true" data-badge={notificacoesNaoLidas} />
            )}
          </div>

          {/* Bottom tab bar */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex h-[84px] items-end border-t border-slate-200 bg-white/95 pb-5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
            <div className="grid w-full grid-cols-5">
              {TABS.map(({ id, label, Icon }) => {
                const active = activeTab === id
                return (
                  <button
                    key={id}
                    className={`
                      flex flex-col items-center justify-center gap-1
                      ${
                        active
                          ? 'text-teal-600 dark:text-teal-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }
                    `}
                  >
                    <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                    <span
                      className={`text-[10.5px] ${
                        active ? 'font-semibold' : 'font-medium'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Home indicator */}
          <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-40 h-[5px] w-32 -translate-x-1/2 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  )
}
