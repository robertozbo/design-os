import { useEffect, useState } from 'react'
import {
  Sun,
  Moon,
  Globe,
  Ruler,
  Calendar,
  Bell,
  Shield,
  Eye,
  Info,
  ChevronRight,
  ChevronDown,
  Check,
  Download,
  AlertTriangle,
  Lock,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type {
  ConfiguracoesProps,
  Tema,
  Idioma,
  NotificacoesPrefs,
  PrivacidadePrefs,
  AcessibilidadePrefs,
} from '@/../product-mobile/sections/configuracoes/types'

const TEMA_OPCOES: { id: Tema; label: string; icon: LucideIcon; descricao: string }[] = [
  { id: 'claro', label: 'Claro', icon: Sun, descricao: 'Fundo branco' },
  { id: 'escuro', label: 'Escuro', icon: Moon, descricao: 'Fundo preto' },
]

const IDIOMA_OPCOES: { id: Idioma; label: string; nativo: string; bandeira: string }[] = [
  { id: 'pt-BR', label: 'Português (Brasil)', nativo: 'Português (Brasil)', bandeira: '🇧🇷' },
  { id: 'pt-PT', label: 'Português (Portugal)', nativo: 'Português (Portugal)', bandeira: '🇵🇹' },
  { id: 'en-US', label: 'English (US)', nativo: 'English (US)', bandeira: '🇺🇸' },
  { id: 'es', label: 'Spanish', nativo: 'Español', bandeira: '🇪🇸' },
  { id: 'fr', label: 'French', nativo: 'Français', bandeira: '🇫🇷' },
  { id: 'de', label: 'German', nativo: 'Deutsch', bandeira: '🇩🇪' },
  { id: 'it', label: 'Italian', nativo: 'Italiano', bandeira: '🇮🇹' },
  { id: 'ja', label: 'Japanese', nativo: '日本語', bandeira: '🇯🇵' },
]

const NOTIF_LABELS: Record<keyof NotificacoesPrefs, { label: string; descricao: string }> = {
  push: { label: 'Notificações push', descricao: 'Alertas no celular' },
  email: { label: 'Email', descricao: 'Resumos e comunicações' },
  lembretesDiarios: { label: 'Lembretes diários', descricao: 'Pesar, registrar refeição, etc' },
  analisesIA: { label: 'Análises da IA', descricao: 'Quando IA detectar algo relevante' },
  profissionalRespondeu: { label: 'Profissional respondeu', descricao: 'Mensagens de nutri/personal' },
  alertaPlanoExpirando: { label: 'Plano expirando', descricao: 'Avisos antes da renovação' },
}

const PRIVACIDADE_LABELS: Record<keyof Omit<PrivacidadePrefs, 'permitirIAUsarDadosLocked'>, { label: string; descricao: string }> = {
  compartilharDadosAnonimos: {
    label: 'Compartilhar dados anonimizados',
    descricao: 'Ajude a pesquisa em saúde sem expor sua identidade',
  },
  permitirIAUsarDados: {
    label: 'IA pode usar meus dados',
    descricao: 'Necessário pra análises personalizadas',
  },
}

const ACESSIB_LABELS: Record<keyof AcessibilidadePrefs, { label: string; descricao: string }> = {
  reduzirMovimento: { label: 'Reduzir movimento', descricao: 'Menos animações' },
  altoContraste: { label: 'Alto contraste', descricao: 'Textos com mais contraste' },
  textoMaior: { label: 'Texto maior', descricao: 'Aumenta tipografia geral' },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tokens de tema
// ─────────────────────────────────────────────────────────────────────────────

interface TT {
  bgPage: string
  bgCard: string
  bgRowHover: string
  bgInner: string
  bgChipNeutral: string
  bgPickerNested: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textMuted: string
  border: string
  borderSubtle: string
  toggleOff: string
  ring: string
}

function tokens(tema: Tema): TT {
  if (tema === 'claro') {
    return {
      bgPage: 'bg-stone-50',
      bgCard: 'bg-white',
      bgRowHover: 'hover:bg-stone-100',
      bgInner: 'bg-stone-100',
      bgChipNeutral: 'bg-stone-200',
      bgPickerNested: 'bg-stone-100/80',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-500',
      textTertiary: 'text-stone-400',
      textMuted: 'text-stone-400',
      border: 'border-stone-200',
      borderSubtle: 'border-stone-200/70',
      toggleOff: 'bg-stone-300',
      ring: 'ring-stone-200',
    }
  }
  return {
    bgPage: 'bg-slate-950',
    bgCard: 'bg-slate-900',
    bgRowHover: 'hover:bg-slate-800/40',
    bgInner: 'bg-slate-950',
    bgChipNeutral: 'bg-slate-800',
    bgPickerNested: 'bg-slate-950/40',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-500',
    textTertiary: 'text-slate-400',
    textMuted: 'text-slate-700',
    border: 'border-slate-800',
    borderSubtle: 'border-slate-800/60',
    toggleOff: 'bg-slate-700',
    ring: 'ring-slate-800',
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function Configuracoes({
  data,
  onTemaChange,
  onIdiomaChange,
  onUnidadesChange,
  onNotificacaoToggle,
  onPrivacidadeToggle,
  onAcessibilidadeToggle,
  onExportarDados,
  onExcluirConta,
  onAbrirTermos,
  onAbrirPrivacidade,
  onAbrirLicencas,
}: ConfiguracoesProps) {
  const [aparenciaOpen, setAparenciaOpen] = useState(true)
  const [idiomaOpen, setIdiomaOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const t = tokens(data.tema)

  const handleTemaChange = (novoTema: Tema) => {
    if (novoTema === data.tema) return
    onTemaChange?.(novoTema)
    setToast(`Tema alterado para ${novoTema === 'claro' ? 'Claro' : 'Escuro'}`)
  }

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(id)
  }, [toast])

  return (
    <div
      className={`min-h-full ${t.bgPage} pb-6 transition-colors duration-500 relative`}
      data-tema={data.tema}
    >
      {/* Aparência */}
      <SectionLabel label="Aparência" t={t} />
      <div className={`${t.bgCard} border-y ${t.border} transition-colors duration-500`}>
        <button
          onClick={() => setAparenciaOpen((v) => !v)}
          className={`w-full px-4 py-3 flex items-center gap-3 text-left ${t.bgRowHover} border-b ${t.borderSubtle} transition-colors`}
        >
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-500 dark:text-violet-300 shrink-0">
            <CurrentTemaIcon tema={data.tema} />
          </div>
          <div className="min-w-0 flex-1">
            <div className={`${t.textPrimary} font-medium text-[13px]`}>Tema</div>
            <div className={`${t.textSecondary} text-[11px] mt-0.5`}>
              {TEMA_OPCOES.find((o) => o.id === data.tema)?.label}
            </div>
          </div>
          {aparenciaOpen ? (
            <ChevronDown size={14} className={`${t.textSecondary} shrink-0`} />
          ) : (
            <ChevronRight size={14} className={`${t.textSecondary} shrink-0`} />
          )}
        </button>
        {aparenciaOpen && (
          <div className="px-3 py-3 grid grid-cols-2 gap-2">
            {TEMA_OPCOES.map((opt) => {
              const active = data.tema === opt.id
              const Icon = opt.icon
              return (
                <button
                  key={opt.id}
                  onClick={() => handleTemaChange(opt.id)}
                  className={`relative p-3 rounded-xl border text-center transition-all active:scale-[0.97] ${
                    active
                      ? 'bg-violet-500/15 border-violet-500/50 ring-2 ring-violet-500/30'
                      : `${t.bgInner} ${t.border} ${t.textTertiary} hover:${t.textPrimary}`
                  }`}
                >
                  {/* Mini preview do tema dentro do chip */}
                  <ThemePreview tema={opt.id} />
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    <Icon size={13} strokeWidth={2.4} className={active ? 'text-violet-500 dark:text-violet-300' : ''} />
                    <span className={`text-[12px] font-semibold ${active ? 'text-violet-500 dark:text-violet-300' : t.textPrimary}`}>
                      {opt.label}
                    </span>
                  </div>
                  <div className={`text-[9.5px] mt-0.5 ${t.textSecondary}`}>{opt.descricao}</div>
                  {active && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center text-white">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Idioma e Região */}
      <SectionLabel label="Idioma e Região" t={t} />
      <div className={`${t.bgCard} border-y ${t.border} transition-colors duration-500`}>
        <button
          onClick={() => setIdiomaOpen((v) => !v)}
          className={`w-full px-4 py-3 flex items-center gap-3 ${t.bgRowHover} text-left border-b ${t.borderSubtle}`}
        >
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-500 dark:text-sky-300 flex items-center justify-center shrink-0">
            <Globe size={14} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className={`${t.textPrimary} font-medium text-[13px]`}>Idioma</div>
            <div className={`${t.textSecondary} text-[11px] mt-0.5`}>
              {IDIOMA_OPCOES.find((i) => i.id === data.idioma)?.bandeira}{' '}
              {IDIOMA_OPCOES.find((i) => i.id === data.idioma)?.nativo}
            </div>
          </div>
          {idiomaOpen ? (
            <ChevronDown size={14} className={`${t.textSecondary} shrink-0`} />
          ) : (
            <ChevronRight size={14} className={`${t.textSecondary} shrink-0`} />
          )}
        </button>
        {idiomaOpen && (
          <div className={`${t.bgPickerNested} border-b ${t.borderSubtle} max-h-72 overflow-y-auto no-scrollbar`}>
            {IDIOMA_OPCOES.map((opt, i) => {
              const active = data.idioma === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onIdiomaChange?.(opt.id)
                    setIdiomaOpen(false)
                  }}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 ${t.bgRowHover} text-left ${
                    i === IDIOMA_OPCOES.length - 1 ? '' : `border-b ${t.borderSubtle}`
                  }`}
                >
                  <span className="text-[18px] shrink-0">{opt.bandeira}</span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`font-medium text-[12.5px] leading-tight ${
                        active ? 'text-sky-500 dark:text-sky-300' : t.textPrimary
                      }`}
                    >
                      {opt.nativo}
                    </div>
                    {opt.label !== opt.nativo && (
                      <div className={`${t.textSecondary} text-[10.5px] mt-0.5`}>{opt.label}</div>
                    )}
                  </div>
                  {active && (
                    <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white shrink-0">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
        <PickerRow
          icon={Ruler}
          cor="emerald"
          label="Unidades"
          value={data.unidades === 'metric' ? 'Métrico (kg, cm)' : 'Imperial (lb, ft/in)'}
          onClick={() => onUnidadesChange?.(data.unidades === 'metric' ? 'imperial' : 'metric')}
          t={t}
        />
        <PickerRow icon={Calendar} cor="amber" label="Formato de data" value={data.formatoData} isLast t={t} />
      </div>

      {/* Notificações */}
      <SectionLabel label="Notificações" t={t} />
      <div className={`${t.bgCard} border-y ${t.border} transition-colors duration-500`}>
        {Object.entries(NOTIF_LABELS).map(([key, info], i, arr) => (
          <ToggleRow
            key={key}
            icon={Bell}
            cor="amber"
            label={info.label}
            descricao={info.descricao}
            valor={data.notificacoes[key as keyof NotificacoesPrefs]}
            onToggle={(v) => onNotificacaoToggle?.(key as keyof NotificacoesPrefs, v)}
            isLast={i === arr.length - 1}
            t={t}
          />
        ))}
      </div>

      {/* Privacidade */}
      <SectionLabel label="Privacidade e Dados" t={t} />
      <div className={`${t.bgCard} border-y ${t.border} transition-colors duration-500`}>
        {Object.entries(PRIVACIDADE_LABELS).map(([key, info]) => {
          const isPermitirIA = key === 'permitirIAUsarDados'
          const locked = isPermitirIA && data.privacidade.permitirIAUsarDadosLocked
          return (
            <ToggleRow
              key={key}
              icon={Shield}
              cor="violet"
              label={info.label}
              descricao={locked ? `${info.descricao} (Pro)` : info.descricao}
              valor={data.privacidade[key as keyof PrivacidadePrefs] as boolean}
              onToggle={(v) =>
                !locked && onPrivacidadeToggle?.(key as keyof PrivacidadePrefs, v)
              }
              locked={locked}
              t={t}
            />
          )
        })}
        <ActionRow
          icon={Download}
          cor="sky"
          label="Exportar meus dados"
          descricao="Receba todos seus dados em JSON (LGPD)"
          onClick={onExportarDados}
          t={t}
        />
        <ActionRow
          icon={AlertTriangle}
          cor="rose"
          label="Excluir conta"
          descricao="Permanente · não pode ser desfeito"
          onClick={onExcluirConta}
          danger
          isLast
          t={t}
        />
      </div>

      {/* Acessibilidade */}
      <SectionLabel label="Acessibilidade" t={t} />
      <div className={`${t.bgCard} border-y ${t.border} transition-colors duration-500`}>
        {Object.entries(ACESSIB_LABELS).map(([key, info], i, arr) => (
          <ToggleRow
            key={key}
            icon={Eye}
            cor="teal"
            label={info.label}
            descricao={info.descricao}
            valor={data.acessibilidade[key as keyof AcessibilidadePrefs]}
            onToggle={(v) => onAcessibilidadeToggle?.(key as keyof AcessibilidadePrefs, v)}
            isLast={i === arr.length - 1}
            t={t}
          />
        ))}
      </div>

      {/* Sobre */}
      <SectionLabel label="Sobre" t={t} />
      <div className={`${t.bgCard} border-y ${t.border} transition-colors duration-500`}>
        <ActionRow icon={Info} cor="sky" label="Termos de Uso" onClick={onAbrirTermos} t={t} />
        <ActionRow icon={Shield} cor="violet" label="Política de Privacidade" onClick={onAbrirPrivacidade} t={t} />
        <ActionRow icon={Info} cor="teal" label="Licenças open source" onClick={onAbrirLicencas} isLast t={t} />
      </div>

      <div className={`px-5 mt-4 text-center ${t.textMuted} text-[10px] font-mono`}>
        Nymos v{data.appInfo.versao} · build {data.appInfo.build} · {data.appInfo.ambiente}
      </div>

      {/* Toast de feedback */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-4 py-2.5 rounded-full bg-violet-500 text-white text-[12px] font-semibold shadow-lg flex items-center gap-2">
            <Sparkles size={13} strokeWidth={2.4} />
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function CurrentTemaIcon({ tema }: { tema: Tema }) {
  const Icon = tema === 'claro' ? Sun : Moon
  return <Icon size={15} strokeWidth={2.2} />
}

function ThemePreview({ tema }: { tema: Tema }) {
  // Mini mockup mostrando como o tema fica
  if (tema === 'claro') {
    return (
      <div className="mx-auto w-12 h-9 rounded-md bg-stone-50 border border-stone-300 overflow-hidden flex flex-col gap-0.5 p-1">
        <div className="h-1 rounded-full bg-stone-300 w-2/3" />
        <div className="h-1 rounded-full bg-stone-200 w-full" />
        <div className="h-1 rounded-full bg-teal-500 w-1/2 mt-auto" />
      </div>
    )
  }
  return (
    <div className="mx-auto w-12 h-9 rounded-md bg-slate-950 border border-slate-700 overflow-hidden flex flex-col gap-0.5 p-1">
      <div className="h-1 rounded-full bg-slate-600 w-2/3" />
      <div className="h-1 rounded-full bg-slate-800 w-full" />
      <div className="h-1 rounded-full bg-teal-400 w-1/2 mt-auto" />
    </div>
  )
}

interface SectionLabelProps {
  label: string
  t: TT
}

function SectionLabel({ label, t }: SectionLabelProps) {
  return (
    <div className={`px-5 mt-5 mb-1.5 ${t.textSecondary} text-[10px] font-semibold uppercase tracking-wider transition-colors duration-500`}>
      {label}
    </div>
  )
}

const COR_BG: Record<string, string> = {
  teal: 'bg-teal-500/15 text-teal-500 dark:text-teal-300',
  sky: 'bg-sky-500/15 text-sky-500 dark:text-sky-300',
  emerald: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-500 dark:text-amber-300',
  rose: 'bg-rose-500/15 text-rose-500 dark:text-rose-300',
  violet: 'bg-violet-500/15 text-violet-500 dark:text-violet-300',
}

interface PickerRowProps {
  icon: LucideIcon
  cor: string
  label: string
  value: string
  isLast?: boolean
  onClick?: () => void
  t: TT
}

function PickerRow({ icon: Icon, cor, label, value, isLast, onClick, t }: PickerRowProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-center gap-3 ${t.bgRowHover} text-left ${
        isLast ? '' : `border-b ${t.borderSubtle}`
      }`}
    >
      <div className={`w-9 h-9 rounded-xl ${COR_BG[cor]} flex items-center justify-center shrink-0`}>
        <Icon size={14} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className={`${t.textPrimary} font-medium text-[13px]`}>{label}</div>
      </div>
      <span className={`${t.textTertiary} text-[12px] truncate max-w-[150px] text-right`}>{value}</span>
      <ChevronRight size={13} className={`${t.textSecondary} shrink-0`} />
    </button>
  )
}

interface ToggleRowProps {
  icon: LucideIcon
  cor: string
  label: string
  descricao?: string
  valor: boolean
  onToggle: (v: boolean) => void
  locked?: boolean
  isLast?: boolean
  t: TT
}

function ToggleRow({ icon: Icon, cor, label, descricao, valor, onToggle, locked, isLast, t }: ToggleRowProps) {
  return (
    <div
      className={`w-full px-4 py-3 flex items-center gap-3 ${
        isLast ? '' : `border-b ${t.borderSubtle}`
      }`}
    >
      <div className={`w-9 h-9 rounded-xl ${COR_BG[cor]} flex items-center justify-center shrink-0 relative`}>
        <Icon size={14} strokeWidth={2.2} />
        {locked && (
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${t.bgCard} border ${t.border} flex items-center justify-center`}>
            <Lock size={8} className="text-amber-500 dark:text-amber-300" strokeWidth={2.6} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className={`${t.textPrimary} font-medium text-[13px]`}>{label}</div>
        {descricao && <div className={`${t.textSecondary} text-[11px] mt-0.5 leading-snug`}>{descricao}</div>}
      </div>
      <Toggle valor={valor} onChange={onToggle} disabled={locked} t={t} />
    </div>
  )
}

interface ToggleProps {
  valor: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  t: TT
}

function Toggle({ valor, onChange, disabled, t }: ToggleProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!valor)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        valor ? 'bg-teal-500' : t.toggleOff
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      role="switch"
      aria-checked={valor}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
          valor ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

interface ActionRowProps {
  icon: LucideIcon
  cor: string
  label: string
  descricao?: string
  onClick?: () => void
  danger?: boolean
  isLast?: boolean
  t: TT
}

function ActionRow({ icon: Icon, cor, label, descricao, onClick, danger, isLast, t }: ActionRowProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-center gap-3 ${
        danger ? 'hover:bg-rose-500/5' : t.bgRowHover
      } text-left ${isLast ? '' : `border-b ${t.borderSubtle}`}`}
    >
      <div className={`w-9 h-9 rounded-xl ${COR_BG[cor]} flex items-center justify-center shrink-0`}>
        <Icon size={14} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className={`font-medium text-[13px] ${danger ? 'text-rose-500 dark:text-rose-300' : t.textPrimary}`}>
          {label}
        </div>
        {descricao && <div className={`${t.textSecondary} text-[11px] mt-0.5`}>{descricao}</div>}
      </div>
      <ChevronRight size={13} className={`shrink-0 ${danger ? 'text-rose-400/60' : t.textSecondary}`} />
    </button>
  )
}
