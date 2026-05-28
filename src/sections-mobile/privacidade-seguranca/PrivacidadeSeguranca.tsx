import {
  Shield,
  Fingerprint,
  Lock,
  Smartphone,
  Key,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Eye,
  Download,
  History,
  Trash2,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import type {
  PrivacidadeSegurancaProps,
  Tema,
  VisibilidadePerfil,
} from '@/../product-mobile/sections/privacidade-seguranca/types'

// ─── Tokens (espelha Configuracoes para coerência visual) ────────────────

interface TT {
  bgPage: string
  bgCard: string
  bgRowHover: string
  bgInner: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textMuted: string
  border: string
  borderSubtle: string
  toggleOff: string
}

function tokens(tema: Tema): TT {
  if (tema === 'claro') {
    return {
      bgPage: 'bg-stone-50',
      bgCard: 'bg-white',
      bgRowHover: 'hover:bg-stone-100',
      bgInner: 'bg-stone-100',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-500',
      textTertiary: 'text-stone-400',
      textMuted: 'text-stone-400',
      border: 'border-stone-200',
      borderSubtle: 'border-stone-200/70',
      toggleOff: 'bg-stone-300',
    }
  }
  return {
    bgPage: 'bg-slate-950',
    bgCard: 'bg-slate-900',
    bgRowHover: 'hover:bg-slate-800/40',
    bgInner: 'bg-slate-950',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-500',
    textTertiary: 'text-slate-400',
    textMuted: 'text-slate-700',
    border: 'border-slate-800',
    borderSubtle: 'border-slate-800/60',
    toggleOff: 'bg-slate-700',
  }
}

const COR_BG: Record<string, string> = {
  violet: 'bg-violet-500/15 text-violet-500 dark:text-violet-300',
  sky: 'bg-sky-500/15 text-sky-500 dark:text-sky-300',
  amber: 'bg-amber-500/15 text-amber-500 dark:text-amber-300',
  rose: 'bg-rose-500/15 text-rose-500 dark:text-rose-300',
  emerald: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-300',
}

const VISIBILIDADE_LABEL: Record<VisibilidadePerfil, string> = {
  publico: 'Público',
  profissionais: 'Profissionais conectados',
  privado: 'Privado',
}

function biometriaIcon(tipo: 'face_id' | 'touch_id' | 'fingerprint' | 'none'): LucideIcon {
  if (tipo === 'face_id') return Shield
  return Fingerprint
}

function biometriaLabel(tipo: 'face_id' | 'touch_id' | 'fingerprint' | 'none'): string {
  if (tipo === 'face_id') return 'Face ID'
  if (tipo === 'touch_id') return 'Touch ID'
  if (tipo === 'fingerprint') return 'Impressão digital'
  return 'Biometria'
}

// ─────────────────────────────────────────────────────────────────────────

export function PrivacidadeSeguranca({
  data,
  onToggleBiometria,
  onAbrirPinSetup,
  onAbrirSessoes,
  onAbrirTrocarSenha,
  onAbrirDuasEtapas,
  onTogglePrivacidade,
  onAbrirVisibilidadePerfil,
  onExportarDados,
  onAbrirConsentimentos,
  onExcluirConta,
}: PrivacidadeSegurancaProps) {
  const t = tokens(data.tema)
  const BioIcon = biometriaIcon(data.seguranca.biometriaTipoDispositivo)
  const bioName = biometriaLabel(data.seguranca.biometriaTipoDispositivo)
  const sessoesOutras = data.sessoesAtivas.filter((s) => !s.atual).length
  const consentimentosAtivos = data.consentimentos.filter((c) => !c.revogadoEm).length

  return (
    <div
      className={`min-h-full ${t.bgPage} pb-6 transition-colors duration-500`}
      data-tema={data.tema}
    >
      {/* ─── Segurança ─────────────────────────────────────────────────── */}
      <SectionLabel label="Segurança" t={t} />
      <div className={`${t.bgCard} border-y ${t.border}`}>
        <ToggleRow
          icon={BioIcon}
          cor="violet"
          label={bioName}
          descricao={
            data.seguranca.biometriaTipoDispositivo === 'none'
              ? 'Não disponível neste dispositivo'
              : data.seguranca.biometria
                ? 'Exigir biometria ao abrir após 5min de inatividade'
                : 'Toque para ativar — acesso mais rápido e seguro'
          }
          valor={data.seguranca.biometria}
          onToggle={(v) => onToggleBiometria?.(v)}
          locked={data.seguranca.biometriaTipoDispositivo === 'none'}
          t={t}
        />
        <NavRow
          icon={Lock}
          cor="violet"
          label="PIN de bloqueio"
          descricao={data.seguranca.pinAtivo ? '4 dígitos · configurado' : 'Toque para configurar'}
          chip={data.seguranca.pinAtivo ? { label: 'Ativo', cor: 'emerald' } : null}
          onClick={onAbrirPinSetup}
          t={t}
        />
        <NavRow
          icon={Smartphone}
          cor="violet"
          label="Sessões ativas"
          descricao={
            sessoesOutras === 0
              ? 'Apenas este dispositivo'
              : `${sessoesOutras} outro${sessoesOutras > 1 ? 's' : ''} dispositivo${sessoesOutras > 1 ? 's' : ''} conectado${sessoesOutras > 1 ? 's' : ''}`
          }
          onClick={onAbrirSessoes}
          t={t}
        />
        <NavRow
          icon={Key}
          cor="violet"
          label="Trocar senha"
          descricao="Mínimo 8 caracteres, 1 número e 1 maiúscula"
          onClick={onAbrirTrocarSenha}
          t={t}
        />
        <NavRow
          icon={ShieldCheck}
          cor="violet"
          label="Verificação em duas etapas"
          descricao={
            data.seguranca.duasEtapas
              ? `${data.seguranca.duasEtapasMetodo === 'totp' ? 'App autenticador' : 'SMS'} · configurado`
              : 'Camada extra ao fazer login'
          }
          chip={
            data.seguranca.duasEtapas
              ? { label: 'Ativo', cor: 'emerald' }
              : null
          }
          isLast
          onClick={onAbrirDuasEtapas}
          t={t}
        />
      </div>

      {/* ─── Privacidade ───────────────────────────────────────────────── */}
      <SectionLabel label="Privacidade" t={t} />
      <div className={`${t.bgCard} border-y ${t.border}`}>
        <ToggleRow
          icon={UserCheck}
          cor="sky"
          label="Compartilhar dados anônimos para pesquisa"
          descricao="Métricas agregadas, sem identificação pessoal"
          valor={data.privacidade.compartilharDadosAnonimos}
          onToggle={(v) => onTogglePrivacidade?.('compartilharDadosAnonimos', v)}
          t={t}
        />
        <ToggleRow
          icon={Sparkles}
          cor="sky"
          label="IA pode usar meus dados"
          descricao={
            data.privacidade.permitirIAUsarDadosLocked
              ? 'Necessário para análises personalizadas (Pro)'
              : 'Necessário para análises personalizadas'
          }
          valor={data.privacidade.permitirIAUsarDados}
          onToggle={(v) =>
            !data.privacidade.permitirIAUsarDadosLocked &&
            onTogglePrivacidade?.('permitirIAUsarDados', v)
          }
          locked={data.privacidade.permitirIAUsarDadosLocked}
          t={t}
        />
        <NavRow
          icon={Eye}
          cor="sky"
          label="Visibilidade do perfil"
          descricao="Quem pode encontrar e ver seu perfil"
          value={VISIBILIDADE_LABEL[data.privacidade.visibilidadePerfil]}
          isLast
          onClick={onAbrirVisibilidadePerfil}
          t={t}
        />
      </div>

      {/* ─── Direitos LGPD ─────────────────────────────────────────────── */}
      <SectionLabel label="Direitos LGPD" t={t} />
      <div className={`${t.bgCard} border-y ${t.border}`}>
        <NavRow
          icon={Download}
          cor="amber"
          label="Exportar meus dados"
          descricao={
            data.ultimoExportLGPDEm
              ? `Último export: ${formatRelative(data.ultimoExportLGPDEm)} · receba ZIP em até 48h`
              : 'Receba um ZIP com perfil, métricas, exames e mensagens em até 48h'
          }
          onClick={onExportarDados}
          t={t}
        />
        <NavRow
          icon={History}
          cor="amber"
          label="Histórico de consentimentos"
          descricao="Termos aceitos, versões e datas"
          chip={{ label: `${consentimentosAtivos}`, cor: 'sky' }}
          onClick={onAbrirConsentimentos}
          t={t}
        />
        <NavRow
          icon={Trash2}
          cor="rose"
          label="Excluir conta"
          descricao="Solicitação processada em 30 dias · ação irreversível"
          danger
          isLast
          onClick={onExcluirConta}
          t={t}
        />
      </div>

      <div className={`px-5 mt-5 text-center ${t.textMuted} text-[10px] font-mono leading-relaxed`}>
        Dados protegidos por criptografia AES-256
        <br />
        LGPD compliance · Auditoria contínua
      </div>
    </div>
  )
}

// ─── Subcomponentes ──────────────────────────────────────────────────────

function SectionLabel({ label, t }: { label: string; t: TT }) {
  return (
    <div
      className={`px-5 mt-5 mb-1.5 ${t.textSecondary} text-[10px] font-semibold uppercase tracking-wider`}
    >
      {label}
    </div>
  )
}

interface NavRowProps {
  icon: LucideIcon
  cor: string
  label: string
  descricao?: string
  value?: string
  chip?: { label: string; cor: string } | null
  isLast?: boolean
  danger?: boolean
  onClick?: () => void
  t: TT
}

function NavRow({ icon: Icon, cor, label, descricao, value, chip, isLast, danger, onClick, t }: NavRowProps) {
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
        <div
          className={`font-medium text-[13px] ${danger ? 'text-rose-500 dark:text-rose-300' : t.textPrimary}`}
        >
          {label}
        </div>
        {descricao && <div className={`${t.textSecondary} text-[11px] mt-0.5 leading-snug`}>{descricao}</div>}
      </div>
      {chip && (
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${COR_BG[chip.cor]}`}
        >
          {chip.label}
        </span>
      )}
      {value && (
        <span className={`${t.textTertiary} text-[12px] truncate max-w-[120px] text-right`}>{value}</span>
      )}
      <ChevronRight size={13} className={`shrink-0 ${danger ? 'text-rose-400/60' : t.textSecondary}`} />
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

function Toggle({ valor, onChange, disabled, t }: { valor: boolean; onChange: (v: boolean) => void; disabled?: boolean; t: TT }) {
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

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const dias = Math.floor((now - then) / 86400000)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'ontem'
  if (dias < 30) return `há ${dias}d`
  const meses = Math.floor(dias / 30)
  return `há ${meses}mes${meses > 1 ? 'es' : ''}`
}
