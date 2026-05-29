import { useMemo, useState } from 'react'
import {
  Eye,
  EyeOff,
  Check,
  Circle,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  type LucideIcon,
} from 'lucide-react'
import type {
  TrocarSenhaProps,
  ForcaSenha,
  Tema,
} from '@/../product-mobile/sections/trocar-senha/types'

// ─── Tokens ──────────────────────────────────────────────────────────────

interface TT {
  bgPage: string
  bgCard: string
  bgInner: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textMuted: string
  border: string
  borderSubtle: string
  inputBg: string
  inputBorder: string
}

function tokens(tema: Tema): TT {
  if (tema === 'claro') {
    return {
      bgPage: 'bg-stone-50',
      bgCard: 'bg-white',
      bgInner: 'bg-stone-100',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-500',
      textTertiary: 'text-stone-400',
      textMuted: 'text-stone-400',
      border: 'border-stone-200',
      borderSubtle: 'border-stone-200/70',
      inputBg: 'bg-stone-50',
      inputBorder: 'border-stone-300',
    }
  }
  return {
    bgPage: 'bg-slate-950',
    bgCard: 'bg-slate-900',
    bgInner: 'bg-slate-950',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-500',
    textTertiary: 'text-slate-400',
    textMuted: 'text-slate-600',
    border: 'border-slate-800',
    borderSubtle: 'border-slate-800/60',
    inputBg: 'bg-slate-950',
    inputBorder: 'border-slate-700',
  }
}

// ─── Regras / força ──────────────────────────────────────────────────────

interface Regras {
  comprimento: boolean
  maiuscula: boolean
  numero: boolean
  diferenteAtual: boolean
}

function avaliarRegras(atual: string, nova: string): Regras {
  return {
    comprimento: nova.length >= 8,
    maiuscula: /[A-Z]/.test(nova),
    numero: /[0-9]/.test(nova),
    diferenteAtual: nova.length > 0 && nova !== atual,
  }
}

function calcularForca(nova: string): { nivel: ForcaSenha; score: number } {
  if (!nova) return { nivel: 'fraca', score: 0 }
  let score = 0
  if (nova.length >= 8) score++
  if (nova.length >= 12) score++
  if (/[A-Z]/.test(nova)) score++
  if (/[a-z]/.test(nova)) score++
  if (/[0-9]/.test(nova)) score++
  if (/[^A-Za-z0-9]/.test(nova)) score++
  const nivel: ForcaSenha =
    score <= 2 ? 'fraca' : score <= 3 ? 'media' : score <= 4 ? 'forte' : 'excelente'
  return { nivel, score: Math.min(score, 4) }
}

const FORCA_META: Record<ForcaSenha, { label: string; corBar: string; corText: string }> = {
  fraca: { label: 'Fraca', corBar: 'bg-slate-400', corText: 'text-slate-400' },
  media: { label: 'Média', corBar: 'bg-amber-500', corText: 'text-amber-500 dark:text-amber-300' },
  forte: { label: 'Forte', corBar: 'bg-emerald-500', corText: 'text-emerald-500 dark:text-emerald-300' },
  excelente: { label: 'Excelente', corBar: 'bg-violet-500', corText: 'text-violet-500 dark:text-violet-300' },
}

const REGRAS_LABELS: { key: keyof Regras; label: string }[] = [
  { key: 'comprimento', label: 'Mínimo 8 caracteres' },
  { key: 'maiuscula', label: '1 letra maiúscula' },
  { key: 'numero', label: '1 número' },
  { key: 'diferenteAtual', label: 'Diferente da senha atual' },
]

// ─────────────────────────────────────────────────────────────────────────

export function TrocarSenha({ data, onSubmit, onConcluido }: TrocarSenhaProps) {
  const t = tokens(data.tema)
  const [atual, setAtual] = useState('')
  const [nova, setNova] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [verAtual, setVerAtual] = useState(false)
  const [verNova, setVerNova] = useState(false)
  const [verConfirmar, setVerConfirmar] = useState(false)
  const [erroAtual, setErroAtual] = useState<string | null>(null)
  const [erroNova, setErroNova] = useState<string | null>(null)
  const [erroGeral, setErroGeral] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [concluido, setConcluido] = useState(false)

  const regras = useMemo(() => avaliarRegras(atual, nova), [atual, nova])
  const forca = useMemo(() => calcularForca(nova), [nova])
  const matchConfirmar = confirmar.length > 0 && confirmar === nova
  const errorConfirmar = confirmar.length > 0 && confirmar !== nova

  const podeEnviar =
    atual.length > 0 &&
    regras.comprimento &&
    regras.maiuscula &&
    regras.numero &&
    regras.diferenteAtual &&
    matchConfirmar &&
    !enviando

  // ── Social login: read-only ──
  if (data.isSocialLogin) {
    return (
      <div className={`min-h-full ${t.bgPage} px-4 py-6`}>
        <div className={`${t.bgCard} border ${t.border} rounded-2xl p-5 flex items-center gap-3`}>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400">
            <AlertCircle size={20} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h2 className={`text-base font-semibold ${t.textPrimary}`}>
              Conta usa login social
            </h2>
            <p className={`text-[12.5px] ${t.textSecondary} mt-1 leading-snug`}>
              Sua conta não tem senha local — você entra via Google ou Apple. Gerencie
              suas credenciais diretamente no provedor.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const submeter = async () => {
    if (!podeEnviar) return
    setEnviando(true)
    setErroAtual(null)
    setErroNova(null)
    setErroGeral(null)
    try {
      await onSubmit?.(atual, nova)
      setConcluido(true)
    } catch (e) {
      const msg = e instanceof Error ? e.message.toLowerCase() : ''
      if (msg.includes('current password') || msg.includes('senha atual')) {
        setErroAtual('Senha atual incorreta — verifique e tente novamente')
      } else if (msg.includes('different') || msg.includes('diferente')) {
        setErroNova('A nova senha precisa ser diferente da atual')
      } else if (msg.includes('social')) {
        setErroGeral('Esta conta usa login social. Use o provedor.')
      } else {
        setErroGeral(e instanceof Error ? e.message : 'Não foi possível atualizar a senha')
      }
    } finally {
      setEnviando(false)
    }
  }

  // ── Modal de sucesso ──
  if (concluido) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
        <div className={`w-full max-w-[320px] ${t.bgCard} rounded-3xl p-6 flex flex-col items-center text-center`}>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Check size={28} strokeWidth={2.6} />
          </div>
          <h2 className={`text-base font-semibold ${t.textPrimary}`}>Senha atualizada</h2>
          <p className={`text-[12.5px] ${t.textSecondary} mt-2 leading-snug`}>
            Sua senha foi alterada com sucesso. Use a nova senha no próximo login.
          </p>
          <button
            onClick={onConcluido}
            className="mt-5 w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-[13px] transition"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-full ${t.bgPage} px-4 py-5 flex flex-col gap-5`}>
      {/* Hero compacto */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400">
          <KeyRound size={16} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <p className={`text-[12.5px] ${t.textSecondary} leading-snug`}>
            Sua senha protege todos os seus dados de saúde. Escolha algo que só você saiba.
          </p>
        </div>
      </div>

      {/* Campo: Senha atual */}
      <PasswordField
        t={t}
        label="Senha atual"
        value={atual}
        onChange={(v) => {
          setAtual(v)
          if (erroAtual) setErroAtual(null)
        }}
        visible={verAtual}
        onToggleVisible={() => setVerAtual((v) => !v)}
        error={erroAtual}
        autoComplete="current-password"
      />

      {/* Campo: Nova senha */}
      <div className="flex flex-col gap-2">
        <PasswordField
          t={t}
          label="Nova senha"
          value={nova}
          onChange={(v) => {
            setNova(v)
            if (erroNova) setErroNova(null)
          }}
          visible={verNova}
          onToggleVisible={() => setVerNova((v) => !v)}
          error={erroNova}
          autoComplete="new-password"
        />

        {/* Medidor de força */}
        {nova.length > 0 && (
          <div className="px-1 flex items-center gap-3">
            <div className="flex gap-1 flex-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < forca.score ? FORCA_META[forca.nivel].corBar : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
            <span className={`text-[11px] font-semibold ${FORCA_META[forca.nivel].corText}`}>
              {FORCA_META[forca.nivel].label}
            </span>
          </div>
        )}

        {/* Checklist de regras */}
        {nova.length > 0 && (
          <div className={`${t.bgInner} rounded-xl px-3 py-2.5 flex flex-col gap-1.5`}>
            {REGRAS_LABELS.map((r) => (
              <RegraRow
                key={r.key}
                label={r.label}
                ok={regras[r.key]}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      {/* Campo: Confirmar */}
      <PasswordField
        t={t}
        label="Confirmar nova senha"
        value={confirmar}
        onChange={setConfirmar}
        visible={verConfirmar}
        onToggleVisible={() => setVerConfirmar((v) => !v)}
        error={errorConfirmar ? 'As senhas não coincidem' : null}
        success={matchConfirmar ? 'Senhas coincidem' : null}
        autoComplete="new-password"
      />

      {/* Erro geral */}
      {erroGeral && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2.5 flex items-start gap-2">
          <AlertCircle size={14} strokeWidth={2.2} className="text-rose-400 shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-rose-300 leading-snug">{erroGeral}</p>
        </div>
      )}

      {/* Botão submit */}
      <button
        type="button"
        onClick={submeter}
        disabled={!podeEnviar}
        className={`w-full py-3.5 rounded-xl font-semibold text-[14px] text-white transition mt-2 ${
          podeEnviar
            ? 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800'
            : 'bg-teal-600/30 cursor-not-allowed'
        }`}
      >
        {enviando ? 'Atualizando…' : 'Atualizar senha'}
      </button>
    </div>
  )
}

// ─── Subcomponentes ──────────────────────────────────────────────────────

function PasswordField({
  t,
  label,
  value,
  onChange,
  visible,
  onToggleVisible,
  error,
  success,
  autoComplete,
}: {
  t: TT
  label: string
  value: string
  onChange: (v: string) => void
  visible: boolean
  onToggleVisible: () => void
  error?: string | null
  success?: string | null
  autoComplete?: string
}) {
  const border = error
    ? 'border-rose-500/60 focus-within:border-rose-500 focus-within:ring-rose-500/20'
    : success
      ? 'border-emerald-500/40 focus-within:border-emerald-500 focus-within:ring-emerald-500/20'
      : `${t.inputBorder} focus-within:border-teal-500 focus-within:ring-teal-500/20`
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-[12px] font-semibold ${t.textSecondary} px-1`}>{label}</label>
      <div
        className={`relative rounded-xl ${t.inputBg} border ${border} focus-within:ring-2 transition`}
      >
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={`w-full pl-3.5 pr-11 py-3 bg-transparent ${t.textPrimary} text-[14px] focus:outline-none`}
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.textTertiary} hover:${t.textPrimary} transition`}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {visible ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
        </button>
      </div>
      {error && (
        <p className="text-[11px] text-rose-400 px-1 flex items-center gap-1">
          <AlertCircle size={10} strokeWidth={2.5} />
          {error}
        </p>
      )}
      {success && !error && (
        <p className="text-[11px] text-emerald-400 px-1 flex items-center gap-1">
          <Check size={10} strokeWidth={2.6} />
          {success}
        </p>
      )}
    </div>
  )
}

function RegraRow({ label, ok, t }: { label: string; ok: boolean; t: TT }) {
  const Icon: LucideIcon = ok ? CheckCircle2 : Circle
  return (
    <div className="flex items-center gap-2">
      <Icon
        size={12}
        strokeWidth={2.4}
        className={ok ? 'text-emerald-500 dark:text-emerald-400' : t.textTertiary}
      />
      <span
        className={`text-[11.5px] ${
          ok ? `${t.textPrimary} font-medium` : t.textSecondary
        }`}
      >
        {label}
      </span>
    </div>
  )
}
