import { type ReactNode } from 'react'
import { Wifi, Signal, BatteryFull, Bell, Settings, Watch, Activity, Target, Home, Camera, LayoutGrid, ChevronLeft } from 'lucide-react'

interface MobileFrameProps {
  children: ReactNode
  /** Show fake status bar with time/wifi/battery */
  showStatusBar?: boolean
  /** Show app header (Nymos shell header) */
  showHeader?: boolean
  /** Show bottom tab bar */
  showTabBar?: boolean
  /** Active tab id */
  activeTab?: 'metricas' | 'objetivos' | 'inicio' | 'ia' | 'mais'
  /** First name shown in greeting */
  primeiroNome?: string
  /** Avatar initial (typically first letter of name) */
  avatarInicial?: string
  /** Profile photo URL (falls back to initial) */
  fotoUrl?: string | null
  /** Unread notifications count (badge) */
  notificacoesNaoLidas?: number
  /** Wearable connected indicator */
  wearableConectado?: boolean
  /** When set, header shows back arrow + this title (sub-page mode) instead of avatar/greeting */
  subPageTitle?: string
  /** Optional subtitle shown under sub-page title */
  subPageSubtitle?: string
  /** Optional right action node in sub-page header */
  subPageRightAction?: ReactNode
  /** When true, hides the back arrow in sub-page mode (used for tab pages with simple titles) */
  hideBackButton?: boolean
  /** Full-frame overlay (modals, sheets) rendered on top of header/content/tab bar */
  overlay?: ReactNode
}

const TABS: Array<{
  id: NonNullable<MobileFrameProps['activeTab']>
  label: string
  Icon: typeof Activity
}> = [
  { id: 'metricas', label: 'Métricas', Icon: Activity },
  { id: 'objetivos', label: 'Objetivos', Icon: Target },
  { id: 'inicio', label: 'Início', Icon: Home },
  { id: 'ia', label: 'IA', Icon: Camera },
  { id: 'mais', label: 'Mais', Icon: LayoutGrid },
]

export function MobileFrame({
  children,
  showStatusBar = true,
  showHeader = true,
  showTabBar = true,
  activeTab = 'inicio',
  primeiroNome = 'Roberto',
  avatarInicial = 'R',
  fotoUrl = null,
  notificacoesNaoLidas = 0,
  wearableConectado = true,
  subPageTitle,
  subPageSubtitle,
  subPageRightAction,
  hideBackButton = false,
  overlay,
}: MobileFrameProps) {
  const isSubPage = !!subPageTitle
  const scale = 0.75
  return (
    <div className="flex justify-center bg-stone-100 dark:bg-stone-900 py-6">
      <div style={{ width: 390 * scale, height: 844 * scale }}>
        <div
          className="relative bg-slate-950 rounded-[44px] shadow-2xl overflow-hidden border-[10px] border-slate-900"
          style={{
            width: 390,
            height: 844,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
        {/* Status bar */}
        {showStatusBar && (
          <div className="absolute top-0 inset-x-0 h-12 z-30 flex items-center justify-between px-7 pt-3 text-white text-[14px] font-semibold tabular-nums pointer-events-none">
            <span>14:17</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <Signal size={14} />
              <Wifi size={14} />
              <BatteryFull size={18} />
            </div>
          </div>
        )}

        {/* Header (shell) */}
        {showHeader && !isSubPage && (
          <div className="absolute top-12 inset-x-0 h-[68px] z-20 flex items-center justify-between px-4">
            <div className="flex items-center gap-3 min-w-0">
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt={primeiroNome}
                  className="w-10 h-10 rounded-2xl object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-semibold text-base shrink-0">
                  {avatarInicial}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-white font-semibold text-[17px] leading-tight truncate">
                  Olá, {primeiroNome}
                </div>
                <div className="text-slate-400 text-[12px] leading-tight">Bom dia</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {wearableConectado && (
                <button className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white">
                  <Watch size={16} />
                </button>
              )}
              <button className="relative w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white">
                <Bell size={16} />
                {notificacoesNaoLidas > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
              <button className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white">
                <Settings size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Sub-page header */}
        {showHeader && isSubPage && (
          <div className="absolute top-12 inset-x-0 h-[68px] z-20 flex items-center justify-between gap-2 px-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {!hideBackButton && (
                <button className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-200 hover:text-white shrink-0">
                  <ChevronLeft size={20} strokeWidth={2.2} />
                </button>
              )}
              <div className="min-w-0">
                <div className="text-white font-semibold text-[19px] leading-tight truncate">
                  {subPageTitle}
                </div>
                {subPageSubtitle && (
                  <div className="text-slate-400 text-[12px] leading-tight truncate">
                    {subPageSubtitle}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {subPageRightAction}
            </div>
          </div>
        )}

        {/* Scrollable content area */}
        <div
          className="absolute inset-x-0 overflow-y-auto"
          style={{
            top: showStatusBar ? (showHeader ? 48 + 68 : 48) : showHeader ? 68 : 0,
            bottom: showTabBar ? 84 : 0,
          }}
        >
          {children}
        </div>

        {/* Full-frame overlay (highest z) */}
        {overlay && (
          <div className="absolute inset-0 z-50">{overlay}</div>
        )}

        {/* Bottom tab bar */}
        {showTabBar && (
          <div className="absolute bottom-0 inset-x-0 h-[84px] z-20 bg-slate-900 border-t border-slate-800 flex items-end pb-5">
            <div className="grid grid-cols-5 w-full">
              {TABS.map(({ id, label, Icon }) => {
                const active = activeTab === id
                const isAI = id === 'ia'
                const color = active
                  ? isAI
                    ? 'text-sky-400'
                    : 'text-teal-400'
                  : isAI
                    ? 'text-sky-500/70'
                    : 'text-slate-500'
                return (
                  <button
                    key={id}
                    className={`flex flex-col items-center justify-center gap-1 ${color}`}
                  >
                    <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                    <span className={`text-[10.5px] ${active ? 'font-semibold' : 'font-medium'}`}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
