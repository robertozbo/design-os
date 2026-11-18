import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wifi, Signal, BatteryFull, Bell, Settings, Watch, Activity, Target, Home, Camera, LayoutGrid, ChevronLeft, Users, CalendarDays, Dumbbell, HeartPulse, Check } from 'lucide-react'
import { ShellInvocationIcon } from '@/sections/assistente-nymos/components/ShellInvocationIcon'

interface MobileFrameProps {
  children: ReactNode
  /** Show fake status bar with time/wifi/battery */
  showStatusBar?: boolean
  /** Show app header (Nymos shell header) */
  showHeader?: boolean
  /** Show bottom tab bar */
  showTabBar?: boolean
  /** Active tab id */
  activeTab?: 'metricas' | 'objetivos' | 'inicio' | 'ia' | 'mais' | 'alunos' | 'agenda' | 'treinos'
  /** Which app's tab bar to render: patient (default) or personal trainer */
  tabSet?: 'aluno' | 'personal'
  /** Account has both profiles (professional + patient): header avatar becomes a profile switcher */
  dualProfile?: boolean
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
  /** When true, renders the Nymos voice assistant FAB above the tab bar (bottom-right) */
  showNymosFab?: boolean
  /** When true, the FAB shows a pending proactive suggestion (amber scanner + badge) */
  nymosHasProactive?: boolean
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

const PERSONAL_TABS: typeof TABS = [
  { id: 'inicio', label: 'Início', Icon: Home },
  { id: 'alunos', label: 'Alunos', Icon: Users },
  { id: 'agenda', label: 'Agenda', Icon: CalendarDays },
  { id: 'treinos', label: 'Treinos', Icon: Dumbbell },
  { id: 'mais', label: 'Mais', Icon: LayoutGrid },
]

export function MobileFrame({
  children,
  showStatusBar = true,
  showHeader = true,
  showTabBar = true,
  activeTab = 'inicio',
  tabSet = 'aluno',
  dualProfile = false,
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
  showNymosFab = true,
  nymosHasProactive = false,
}: MobileFrameProps) {
  const isSubPage = !!subPageTitle
  const scale = 0.75
  const navigate = useNavigate()
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const isPersonal = tabSet === 'personal'
  return (
    <div className="flex justify-center bg-stone-100 dark:bg-stone-900 py-6">
      <div style={{ width: 390 * scale, height: 844 * scale }}>
        <div
          className={`relative ${isPersonal ? 'bg-[#0A0E0D]' : 'bg-slate-950'} rounded-[44px] shadow-2xl overflow-hidden border-[10px] border-slate-900`}
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
              {dualProfile ? (
                <button
                  onClick={() => setSwitcherOpen(true)}
                  aria-label="Trocar perfil"
                  className="relative w-12 h-11 shrink-0 text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-semibold text-base ${
                      isPersonal ? 'bg-emerald-500 text-[#0E1A17]' : 'bg-teal-600 text-white'
                    }`}
                  >
                    {avatarInicial}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 right-0 w-6 h-6 rounded-lg border-2 border-[#0A0E0D] flex items-center justify-center ${
                      isPersonal ? 'bg-teal-600 text-white' : 'bg-emerald-500 text-[#0E1A17]'
                    }`}
                  >
                    {isPersonal ? <HeartPulse size={12} /> : <Dumbbell size={12} />}
                  </div>
                </button>
              ) : fotoUrl ? (
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
                <div className="text-slate-400 text-[12px] leading-tight">
                  {dualProfile ? (isPersonal ? 'Perfil Personal' : 'Perfil Aluna') : 'Bom dia'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {wearableConectado && !isPersonal && (
                <button className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white">
                  <Watch size={16} />
                </button>
              )}
              <button
                onClick={isPersonal ? () => navigate('/mobile/sections/personal-notificacoes') : undefined}
                className={`relative w-9 h-9 rounded-full ${isPersonal ? 'bg-[#1B2120]' : 'bg-slate-800/60'} flex items-center justify-center text-slate-300 hover:text-white`}>
                <Bell size={16} />
                {notificacoesNaoLidas > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
              <button
                onClick={isPersonal ? () => navigate('/mobile/sections/personal-configuracoes') : undefined}
                className={`w-9 h-9 rounded-full ${isPersonal ? 'bg-[#1B2120]' : 'bg-slate-800/60'} flex items-center justify-center text-slate-300 hover:text-white`}>
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
                <button
                  onClick={() => navigate(-1)}
                  aria-label="Voltar"
                  className={`w-10 h-10 rounded-xl ${isPersonal ? 'bg-[#1B2120]' : 'bg-slate-800/60'} flex items-center justify-center text-slate-200 hover:text-white active:scale-95 transition shrink-0`}
                >
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

        {/* Nymos voice assistant FAB — floats above the tab bar (skipped when the assistant itself is in fullscreen mode) */}
        {showNymosFab && showTabBar && tabSet === 'aluno' && (
          <div className="absolute right-3 z-30" style={{ bottom: 96 }}>
            <ShellInvocationIcon
              hasProactiveSuggestion={nymosHasProactive}
              size={50}
            />
          </div>
        )}

        {/* Profile switcher sheet (dual-profile accounts) */}
        {switcherOpen && (
          <div className="absolute inset-0 z-50 flex items-end bg-black/60" onClick={() => setSwitcherOpen(false)}>
            <div className="w-full rounded-t-3xl bg-[#111615] border-t border-[#2A3130] px-4 pt-3 pb-8" onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto w-10 h-1 rounded-full bg-[#2A3130]" />
              <div className="mt-4 mb-3 text-white font-semibold text-[17px]">Escolha o perfil</div>
              {([
                { id: 'personal', titulo: 'Personal', sub: 'Alunos, agenda e treinos', Icon: Dumbbell, cor: 'bg-emerald-500 text-[#0E1A17]', rota: '/mobile/sections/personal-inicio' },
                { id: 'aluno', titulo: 'Aluna', sub: 'Seu treino e suas métricas', Icon: HeartPulse, cor: 'bg-teal-600 text-white', rota: '/mobile/sections/inicio' },
              ] as const).map((p) => {
                const ativo = (p.id === 'personal') === isPersonal
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSwitcherOpen(false)
                      if (!ativo) navigate(p.rota)
                    }}
                    className={`w-full flex items-center gap-3 rounded-2xl px-3 py-3 mb-2 text-left ${
                      ativo ? 'bg-[#1B2120]' : 'hover:bg-[#1B2120]/60'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${p.cor}`}>
                      <p.Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[15px] font-medium">
                        {primeiroNome} · {p.titulo}
                      </div>
                      <div className="text-slate-400 text-[12.5px]">{p.sub}</div>
                    </div>
                    {ativo && <Check size={18} className="text-emerald-400" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Full-frame overlay (highest z) */}
        {overlay && (
          <div className="absolute inset-0 z-50">{overlay}</div>
        )}

        {/* Bottom tab bar */}
        {showTabBar && (
          <div className={`absolute bottom-0 inset-x-0 h-[84px] z-20 flex items-end pb-5 border-t ${isPersonal ? 'bg-[#0A0E0D] border-[#2A3130]' : 'bg-slate-900 border-slate-800'}`}>
            <div className="grid grid-cols-5 w-full">
              {(tabSet === 'personal' ? PERSONAL_TABS : TABS).map(({ id, label, Icon }) => {
                const active = activeTab === id
                const isAI = id === 'ia'
                const color = isPersonal
                  ? active
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                  : active
                  ? isAI
                    ? 'text-sky-400'
                    : 'text-teal-400'
                  : isAI
                    ? 'text-sky-500/70'
                    : 'text-slate-500'
                return (
                  <button
                    key={id}
                    onClick={isPersonal ? () => navigate(`/mobile/sections/personal-${id}`) : undefined}
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
